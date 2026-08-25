import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GITHUB_REPOSITORY,
  readCanonicalMain,
} from "./github-release-state.mjs";

function git(cwd, ...args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function githubRepositoryPath(remoteUrl) {
  return remoteUrl
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/^ssh:\/\/git@github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "");
}

export async function checkSitesRelease({
  cwd = process.cwd(),
  remoteMainReader = readCanonicalMain,
} = {}) {
  let branch;
  let head;

  try {
    branch = git(cwd, "branch", "--show-current");
    head = git(cwd, "rev-parse", "HEAD");
  } catch {
    throw new Error("Git branch information is unavailable.");
  }

  if (branch !== "main") {
    throw new Error(
      `Sites releases are allowed only from main; current branch is ${branch || "detached HEAD"}.`,
    );
  }

  if (git(cwd, "status", "--porcelain")) {
    throw new Error("the working tree has uncommitted changes.");
  }

  let originUrl;

  try {
    originUrl = git(cwd, "config", "--get", "remote.origin.url");
  } catch {
    throw new Error("the origin remote is unavailable.");
  }

  if (githubRepositoryPath(originUrl) !== GITHUB_REPOSITORY) {
    throw new Error(
      `origin must point to the canonical ${GITHUB_REPOSITORY} repository.`,
    );
  }

  let remoteMain;

  try {
    remoteMain = await remoteMainReader();
  } catch {
    throw new Error("the current canonical GitHub main commit could not be read.");
  }

  if (!remoteMain || head !== remoteMain) {
    throw new Error(
      "local main does not exactly match the current remote main. Fast-forward and try again.",
    );
  }

  return head;
}

const isDirectRun =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  try {
    const head = await checkSitesRelease();
    console.log(
      `Release check passed: main at ${head.slice(0, 12)} matches the current remote main.`,
    );
  } catch (error) {
    console.error(`Release check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
