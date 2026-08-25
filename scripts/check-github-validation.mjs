import { execFileSync } from "node:child_process";

const canonicalRepository = "github.com/mroxas04/personal-website";

function command(name, args) {
  return execFileSync(name, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function fail(message) {
  console.error(`GitHub validation check failed: ${message}`);
  process.exit(1);
}

let head;
let runs;

try {
  head = command("git", ["rev-parse", "HEAD"]);
  const output = command("gh", [
    "run",
    "list",
    "--repo",
    canonicalRepository,
    "--workflow",
    "validate.yml",
    "--branch",
    "main",
    "--event",
    "push",
    "--commit",
    head,
    "--limit",
    "1",
    "--json",
    "headSha,status,conclusion,url",
  ]);
  runs = JSON.parse(output);
} catch {
  fail("the GitHub validation result for this commit could not be read.");
}

const run = runs.find((candidate) => candidate.headSha === head);

if (!run) {
  fail("no push validation run exists for this exact main commit.");
}

if (run.status !== "completed" || run.conclusion !== "success") {
  fail(`validation for this commit is ${run.status}/${run.conclusion || "pending"}.`);
}

console.log(`GitHub validation passed for ${head.slice(0, 12)}: ${run.url}`);
