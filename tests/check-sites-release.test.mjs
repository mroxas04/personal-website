import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { checkGithubValidation } from "../scripts/check-github-validation.mjs";
import { checkSitesRelease } from "../scripts/check-sites-release.mjs";
import {
  readCanonicalMain,
  readValidationRuns,
} from "../scripts/github-release-state.mjs";

const releaseScript = fileURLToPath(
  new URL("../scripts/check-sites-release.mjs", import.meta.url),
);
const validationScript = fileURLToPath(
  new URL("../scripts/check-github-validation.mjs", import.meta.url),
);

function git(cwd, ...args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function createRepository(t) {
  const root = mkdtempSync(join(tmpdir(), "sites-release-check-"));
  const worktree = join(root, "worktree");

  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(worktree);
  git(worktree, "init", "-b", "main");
  git(worktree, "config", "user.email", "release-check@example.com");
  git(worktree, "config", "user.name", "Release Check");
  writeFileSync(join(worktree, "README.md"), "initial\n");
  git(worktree, "add", "README.md");
  git(worktree, "commit", "-m", "Initial commit");
  git(
    worktree,
    "remote",
    "add",
    "origin",
    "https://github.com/mroxas04/personal-website.git",
  );

  return { worktree };
}

test("passes for a clean main that matches canonical GitHub", async (t) => {
  const { worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  const result = await checkSitesRelease({
    cwd: worktree,
    remoteMainReader: async () => head,
  });

  assert.equal(result, head);
});

test("rejects a non-main branch", async (t) => {
  const { worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  git(worktree, "switch", "-c", "dev");

  await assert.rejects(
    checkSitesRelease({
      cwd: worktree,
      remoteMainReader: async () => head,
    }),
    /allowed only from main/,
  );
});

test("rejects a dirty main worktree", async (t) => {
  const { worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  writeFileSync(join(worktree, "README.md"), "changed\n");

  await assert.rejects(
    checkSitesRelease({
      cwd: worktree,
      remoteMainReader: async () => head,
    }),
    /uncommitted changes/,
  );
});

test("rejects a stale main after canonical GitHub advances", async (t) => {
  const { worktree } = createRepository(t);

  await assert.rejects(
    checkSitesRelease({
      cwd: worktree,
      remoteMainReader: async () => "f".repeat(40),
    }),
    /does not exactly match the current remote main/,
  );
});

test("rejects a missing or noncanonical origin", async (t) => {
  const missing = createRepository(t);
  git(missing.worktree, "remote", "remove", "origin");

  await assert.rejects(
    checkSitesRelease({
      cwd: missing.worktree,
      remoteMainReader: async () => git(missing.worktree, "rev-parse", "HEAD"),
    }),
    /origin remote is unavailable/,
  );

  const fork = createRepository(t);
  git(
    fork.worktree,
    "remote",
    "set-url",
    "origin",
    "https://github.com/example/fork.git",
  );

  await assert.rejects(
    checkSitesRelease({
      cwd: fork.worktree,
      remoteMainReader: async () => git(fork.worktree, "rev-parse", "HEAD"),
    }),
    /origin must point to the canonical/,
  );
});

test("fails closed when canonical GitHub main is unavailable", async (t) => {
  const { worktree } = createRepository(t);

  await assert.rejects(
    checkSitesRelease({
      cwd: worktree,
      remoteMainReader: async () => {
        throw new Error("unavailable");
      },
    }),
    /canonical GitHub main commit could not be read/,
  );
});

test("pins canonical GitHub API requests for main and validation", async () => {
  const head = "a".repeat(40);
  const requestedUrls = [];
  const request = async (url) => {
    requestedUrls.push(url);
    const body = url.pathname.endsWith("/commits/main")
      ? { sha: head }
      : { workflow_runs: [] };
    return new Response(JSON.stringify(body), { status: 200 });
  };

  assert.equal(await readCanonicalMain(request), head);
  assert.deepEqual(await readValidationRuns(head, request), []);
  assert.equal(requestedUrls[0].hostname, "api.github.com");
  assert.equal(
    requestedUrls[0].pathname,
    "/repos/mroxas04/personal-website/commits/main",
  );
  assert.equal(
    requestedUrls[1].pathname,
    "/repos/mroxas04/personal-website/actions/workflows/validate.yml/runs",
  );
  assert.equal(requestedUrls[1].searchParams.get("head_sha"), head);
  assert.equal(requestedUrls[1].searchParams.get("branch"), "main");
  assert.equal(requestedUrls[1].searchParams.get("event"), "push");
});

test("accepts successful validation for the exact commit", async (t) => {
  const { worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  const result = await checkGithubValidation({
    cwd: worktree,
    validationReader: async () => [
      {
        head_sha: head,
        status: "completed",
        conclusion: "success",
        html_url: "https://github.com/example/actions/runs/1",
      },
    ],
  });

  assert.equal(result.head, head);
});

test("rejects missing or unsuccessful GitHub validation", async (t) => {
  const { worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");

  await assert.rejects(
    checkGithubValidation({
      cwd: worktree,
      validationReader: async () => [],
    }),
    /no push validation run exists/,
  );

  await assert.rejects(
    checkGithubValidation({
      cwd: worktree,
      validationReader: async () => [
        {
          head_sha: head,
          status: "completed",
          conclusion: "failure",
          html_url: "https://github.com/example/actions/runs/2",
        },
      ],
    }),
    /completed\/failure/,
  );
});

test("direct release entrypoint fails with its diagnostic prefix", (t) => {
  const { worktree } = createRepository(t);
  git(worktree, "switch", "-c", "dev");
  const result = spawnSync(process.execPath, [releaseScript], {
    cwd: worktree,
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /^Release check failed:/);
  assert.match(result.stderr, /allowed only from main/);
});

test("direct validation entrypoint fails closed outside Git", (t) => {
  const root = mkdtempSync(join(tmpdir(), "sites-validation-check-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [validationScript], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /^GitHub validation check failed:/);
  assert.match(result.stderr, /could not be read/);
});
