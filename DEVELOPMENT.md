# Development and release workflow

This repository separates work in progress from the public Sites deployment. Development stays local or on GitHub until it is intentionally merged into `main`.

## Branch roles

| Branch | Purpose | Sites publishing |
| --- | --- | --- |
| `feature/*` or `codex/*` | Isolated work based on `dev` | Never |
| `dev` | Integrated review branch and local preview source | Never |
| `main` | Approved production source | Eligible after validation |

There is no second hosted review site. Preview work locally with `npm run dev`; GitHub validates pull requests and pushes to `dev` and `main` with `npm run lint` and `npm run build`.

## Daily development

```bash
git switch dev
git pull --ff-only origin dev
git switch -c codex/short-description
npm run dev
```

When the work is ready, push the feature branch and merge it into `dev`. Review it locally from `dev`, then open a release pull request from `dev` to `main`.

## Production release

Merging the release pull request to `main` is the approval signal for that exact commit. The GitHub workflow validates the commit and marks it as a production release candidate, but it does not deploy to Sites.

A Sites-capable Codex session then:

1. Switches to `main` and fast-forwards from `origin/main`.
2. Runs `npm run release:check`, `npm run lint`, `npm run test:release`, and `npm run build`.
3. Runs `npm run release:check` again, then `npm run release:ci-check` to require a successful GitHub `push` validation for that exact commit.
4. Pushes that exact source commit to the Sites source remote.
5. Saves and deploys one Sites version from that commit.
6. Polls the deployment and verifies the public URL.

`npm run release:check` fails unless the working tree is clean, the current branch is `main`, `origin` points to the canonical GitHub repository, and local `HEAD` exactly matches the current remote `main`. It fails closed when the remote cannot be reached. `npm run release:ci-check` separately requires the exact commit's GitHub validation run to have completed successfully.

## Security boundary

Sites publishing uses short-lived credentials supplied at release time. Do not add Sites credentials to GitHub Actions, GitHub repository secrets, committed files, or documentation. This keeps ordinary pushes to `dev` and feature branches incapable of publishing the public site.
