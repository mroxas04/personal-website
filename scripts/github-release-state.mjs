export const GITHUB_REPOSITORY = "mroxas04/personal-website";

const apiRoot = "https://api.github.com";
const requestHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "matthew-roxas-site-release-check",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function githubJson(path, searchParams, request) {
  const url = new URL(path, apiRoot);

  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  const response = await request(url, { headers: requestHeaders });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}.`);
  }

  return response.json();
}

export async function readCanonicalMain(request = fetch) {
  const commit = await githubJson(
    `/repos/${GITHUB_REPOSITORY}/commits/main`,
    {},
    request,
  );

  if (typeof commit.sha !== "string" || !commit.sha) {
    throw new Error("GitHub did not return a main commit SHA.");
  }

  return commit.sha;
}

export async function readValidationRuns(head, request = fetch) {
  const result = await githubJson(
    `/repos/${GITHUB_REPOSITORY}/actions/workflows/validate.yml/runs`,
    {
      branch: "main",
      event: "push",
      head_sha: head,
      per_page: "10",
    },
    request,
  );

  if (!Array.isArray(result.workflow_runs)) {
    throw new Error("GitHub did not return workflow runs.");
  }

  return result.workflow_runs;
}
