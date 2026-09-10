# Incident response

## Goal

Protect people and restore safe service when the public site, private dashboard, database, authentication, contact flow, or Twilio integration behaves unexpectedly.

## Severity

- **Critical:** suspected credential exposure, unauthorized access, private-data disclosure, or actively harmful behavior.
- **High:** contact, authentication, payment/booking link, SMS, voice, or dashboard workflow is unavailable or materially wrong.
- **Normal:** degraded presentation or a noncritical feature with a safe workaround.

## First response

1. Stop the unsafe action or disable the affected path when practical.
2. Preserve enough timestamps, request identifiers, and error context to investigate without copying private content.
3. For suspected secret exposure, rotate or revoke the credential first.
4. Identify the latest known-good production version and recent changes.
5. Decide whether to fix forward or restore the previous safe configuration.

## System-specific checks

### Site or dashboard

- Confirm whether the failure affects public pages, owner-only routes, or both.
- Verify authentication and owner authorization independently from `noindex` behavior.
- Check the production version, environment configuration, and recent worker errors.

### Database

- Avoid destructive schema or data changes during diagnosis.
- Confirm the D1 binding and migration state.
- Take a recoverable path before changing production records.

### SMS or voice

- Verify the exact configured webhook URL and signature validation.
- Keep SMS and voice configuration changes isolated.
- Do not log message content, reveal the forwarding destination, or add recording while troubleshooting.
- Use `docs/twilio-voice-forwarding.md` for voice rollback.

## Communication

- Keep private details out of public GitHub Issues and pull requests.
- State what is affected, what users should do, and when the next update is expected.
- Do not speculate about cause before evidence supports it.

## Resolution

An incident is resolved when safe service is restored, the affected path is verified, exposed credentials are rotated, and follow-up work has an owner.

For Critical and High incidents, record a short private retrospective covering impact, timeline, cause, recovery, and one preventive action. Publish only a sanitized summary if there is a clear user benefit.
