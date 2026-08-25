import { execFileSync } from "node:child_process";

const canonicalRepository = "mroxas04/personal-website";

function git(...args) {
  return execFileSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function gh(...args) {
  return execFileSync("gh", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function fail(message) {
  console.error(`Release check failed: ${message}`);
  process.exit(1);
}

function githubRepositoryPath(remoteUrl) {
  return remoteUrl
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/^ssh:\/\/git@github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "");
}

let branch;
let head;
let remoteMain;

try {
  branch = git("branch", "--show-current");
  head = git("rev-parse", "HEAD");
} catch {
  fail("Git branch information is unavailable.");
}

if (branch !== "main") {
  fail(`Sites releases are allowed only from main; current branch is ${branch || "detached HEAD"}.`);
}

if (git("status", "--porcelain")) {
  fail("the working tree has uncommitted changes.");
}

try {
  const originUrl = git("config", "--get", "remote.origin.url");

  if (githubRepositoryPath(originUrl) !== canonicalRepository) {
    fail(`origin must point to the canonical ${canonicalRepository} repository.`);
  }

  remoteMain = gh(
    "api",
    "--hostname",
    "github.com",
    `repos/${canonicalRepository}/commits/main`,
    "--jq",
    ".sha",
  );
} catch {
  fail("the current canonical GitHub main commit could not be read.");
}

if (!remoteMain || head !== remoteMain) {
  fail("local main does not exactly match the current remote main. Fast-forward and try again.");
}

console.log(`Release check passed: main at ${head.slice(0, 12)} matches the current remote main.`);
