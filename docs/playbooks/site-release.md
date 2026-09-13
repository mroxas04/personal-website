# Site release record

## Goal

Create a public, commit-linked history of verified production deployments without treating every merge as a release.

GitHub Releases are the canonical deployment ledger. A release records what actually reached the live site; it is not a deployment mechanism and does not replace Sites deployment verification.

## When to record a release

Record one release after all of the following are true:

1. The deployed source is the current `main` commit.
2. The exact commit passed **Lint and build** and **Mark production release candidate**.
3. The Sites deployment reached a successful terminal state.
4. The affected public routes and critical workflow were checked.

Do not record previews, failed deployments, saved-but-undeployed versions, or merges waiting for production.

## Record the deployment

From the repository's **Actions** tab:

1. Open **Record site release**.
2. Choose **Run workflow** and keep the branch set to `main`.
3. Enter a version in `YYYY.MM.DD.N` format, such as `2026.09.13.1`. Increment `N` when more than one verified deployment occurs on the same date.
4. Enter a plain-language title and a short public summary.
5. Confirm the production URL and check the deployment-verification box.
6. Run the workflow and open the resulting GitHub Release from the job summary.

The workflow fails closed unless it runs against the current `main` commit, the required GitHub checks passed, the version is valid and unused, the URL uses HTTPS, and production verification was explicitly confirmed.

## Release-note standard

Write for a visitor or collaborator who wants to know what changed. Prefer outcomes over implementation detail.

Include:

- the most meaningful visitor-facing changes;
- material reliability, accessibility, privacy, or performance improvements;
- a known limitation when it changes how someone should use the site; and
- an explicit rollback note when the release exists primarily to undo another release.

Exclude:

- secrets, runtime values, private URLs, or infrastructure credentials;
- customer, conversation, payment, or dashboard data;
- security details that would make abuse easier; and
- claims that were not verified on the live site.

The workflow appends the production URL, exact source revision, and GitHub-generated change list.

## Example

**Version:** `2026.09.13.1`

**Title:** `Site release — focused AI conversations`

**Summary:**

> Added a clearer path for bringing an AI question to Matthew, connected featured work to measurable outreach, refreshed public project destinations, and strengthened release safeguards.

## Corrections and rollbacks

- Correct a wording error in an existing release note when the deployed source did not change.
- Record a new release when a new commit is deployed, including a rollback commit.
- Never move an existing release tag to a different commit; the historical source link must remain stable.
