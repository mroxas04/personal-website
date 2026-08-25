import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const releaseScript = fileURLToPath(
  new URL("../scripts/check-sites-release.mjs", import.meta.url),
);
const ciCheckScript = fileURLToPath(
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
  const remote = join(root, "remote.git");
  const worktree = join(root, "worktree");

  t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, "init", "--bare", remote);
  mkdirSync(worktree);
  git(worktree, "init", "-b", "main");
  git(worktree, "config", "user.email", "release-check@example.com");
  git(worktree, "config", "user.name", "Release Check");
  writeFileSync(join(worktree, "README.md"), "initial\n");
  git(worktree, "add", "README.md");
  git(worktree, "commit", "-m", "Initial commit");
  git(worktree, "remote", "add", "origin", remote);
  git(worktree, "push", "-u", "origin", "main");
  git(
    worktree,
    "remote",
    "set-url",
    "origin",
    "https://github.com/mroxas04/personal-website.git",
  );

  return { root, worktree };
}

function installMockGh(root) {
  const bin = join(root, "bin");
  const mockGh = join(bin, "gh");

  mkdirSync(bin, { recursive: true });
  writeFileSync(
    mockGh,
    [
      "#!/usr/bin/env node",
      "const args = process.argv.slice(2);",
      "const canonical = 'mroxas04/personal-website';",
      "const canonicalWithHost = `github.com/${canonical}`;",
      "if (process.env.MOCK_GH_MODE === 'api') {",
      "  const valid = args.includes('--hostname') && args.includes('github.com') && args.includes(`repos/${canonical}/commits/main`);",
      "  if (!valid) process.exit(2);",
      "}",
      "if (process.env.MOCK_GH_MODE === 'runs') {",
      "  const repoIndex = args.indexOf('--repo');",
      "  if (repoIndex < 0 || args[repoIndex + 1] !== canonicalWithHost) process.exit(2);",
      "}",
      "if (process.env.MOCK_GH_EXIT === '1') process.exit(1);",
      "process.stdout.write(process.env.MOCK_GH_RESPONSE || '');",
      "",
    ].join("\n"),
  );
  chmodSync(mockGh, 0o755);

  return bin;
}

function runReleaseCheck(root, worktree, remoteSha, options = {}) {
  const bin = installMockGh(root);

  return spawnSync(process.execPath, [releaseScript], {
    cwd: worktree,
    encoding: "utf8",
    env: {
      ...process.env,
      MOCK_GH_EXIT: options.unavailable ? "1" : "0",
      MOCK_GH_MODE: "api",
      MOCK_GH_RESPONSE: remoteSha,
      PATH: `${bin}:${process.env.PATH}`,
    },
  });
}

function runCiCheck(root, worktree, response) {
  const bin = installMockGh(root);

  return spawnSync(process.execPath, [ciCheckScript], {
    cwd: worktree,
    encoding: "utf8",
    env: {
      ...process.env,
      GH_HOST: "git.example.com",
      GH_REPO: "example/fork",
      MOCK_GH_MODE: "runs",
      MOCK_GH_RESPONSE: JSON.stringify(response),
      PATH: `${bin}:${process.env.PATH}`,
    },
  });
}

test("passes for a clean main that matches the remote", (t) => {
  const { root, worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  const result = runReleaseCheck(root, worktree, head);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /matches the current remote main/);
});

test("rejects a non-main branch", (t) => {
  const { root, worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  git(worktree, "switch", "-c", "dev");

  const result = runReleaseCheck(root, worktree, head);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /allowed only from main/);
});

test("rejects a dirty main worktree", (t) => {
  const { root, worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  writeFileSync(join(worktree, "README.md"), "changed\n");

  const result = runReleaseCheck(root, worktree, head);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /uncommitted changes/);
});

test("rejects a stale main after the remote advances", (t) => {
  const { root, worktree } = createRepository(t);
  const result = runReleaseCheck(root, worktree, "f".repeat(40));

  assert.equal(result.status, 1);
  assert.match(result.stderr, /does not exactly match the current remote main/);
});

test("rejects an unavailable origin", (t) => {
  const { root, worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  git(worktree, "remote", "remove", "origin");

  const result = runReleaseCheck(root, worktree, head);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /canonical GitHub main commit could not be read/);
});

test("rejects an origin that is not the canonical repository", (t) => {
  const { root, worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  git(
    worktree,
    "remote",
    "set-url",
    "origin",
    "https://github.com/example/fork.git",
  );

  const result = runReleaseCheck(root, worktree, head);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /origin must point to the canonical/);
});

test("rejects an unavailable canonical GitHub main", (t) => {
  const { root, worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  const result = runReleaseCheck(root, worktree, head, { unavailable: true });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /canonical GitHub main commit could not be read/);
});

test("accepts successful GitHub validation for the exact commit", (t) => {
  const { root, worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  const result = runCiCheck(root, worktree, [
    {
      headSha: head,
      status: "completed",
      conclusion: "success",
      url: "https://github.com/example/actions/runs/1",
    },
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /GitHub validation passed/);
});

test("rejects missing or unsuccessful GitHub validation", (t) => {
  const { root, worktree } = createRepository(t);
  const head = git(worktree, "rev-parse", "HEAD");
  const missing = runCiCheck(root, worktree, []);
  const failed = runCiCheck(root, worktree, [
    {
      headSha: head,
      status: "completed",
      conclusion: "failure",
      url: "https://github.com/example/actions/runs/2",
    },
  ]);

  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /no push validation run exists/);
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /completed\/failure/);
});
