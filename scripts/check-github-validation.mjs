import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readValidationRuns } from "./github-release-state.mjs";

function git(cwd, ...args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

export async function checkGithubValidation({
  cwd = process.cwd(),
  validationReader = readValidationRuns,
} = {}) {
  let head;
  let runs;

  try {
    head = git(cwd, "rev-parse", "HEAD");
    runs = await validationReader(head);
  } catch {
    throw new Error(
      "the GitHub validation result for this commit could not be read.",
    );
  }

  const run = runs.find((candidate) => candidate.head_sha === head);

  if (!run) {
    throw new Error("no push validation run exists for this exact main commit.");
  }

  if (run.status !== "completed" || run.conclusion !== "success") {
    throw new Error(
      `validation for this commit is ${run.status}/${run.conclusion || "pending"}.`,
    );
  }

  return { head, url: run.html_url };
}

const isDirectRun =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  try {
    const result = await checkGithubValidation();
    console.log(
      `GitHub validation passed for ${result.head.slice(0, 12)}: ${result.url}`,
    );
  } catch (error) {
    console.error(`GitHub validation check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
