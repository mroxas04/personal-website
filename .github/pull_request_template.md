## Summary

<!-- What changed and why? -->

## Release target

- [ ] This targets `dev` for review and integration.
- [ ] This targets `main` as an approved production release.

## Validation

- [ ] `npm run lint`
- [ ] `npm run build`

## Production note

Merging to `main` makes that exact commit eligible for a Sites release. GitHub Actions validates it but does not hold Sites credentials or deploy it; a Sites-capable Codex session performs and verifies the publish.
