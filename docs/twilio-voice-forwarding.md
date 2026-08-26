# Twilio inbound voice forwarding activation

The site endpoint is `POST /api/voice/inbound`. It accepts only Twilio's form-encoded webhook, validates `X-Twilio-Signature` against the exact configured public URL, and returns TwiML containing a single `<Dial>` instruction. It does not add AI, recording, a greeting, or Twilio-managed voicemail.

Do not activate this flow until the reviewed endpoint change has been merged to `main`, passed the production release checks, and been deployed as that exact commit.

## Private runtime setup

Configure these values in the production Sites runtime. Never commit them or paste their values into a task, pull request, issue, test, screenshot, or documentation.

- `TWILIO_AUTH_TOKEN`: retain the existing protected Twilio auth token.
- `TWILIO_VOICE_FORWARDING_NUMBER`: privately enter the destination in E.164 format (`+` followed by country code and subscriber number). Store it as a protected secret.
- `TWILIO_VOICE_WEBHOOK_URL`: set this to the exact HTTPS URL that will be entered in Twilio: `https://portfolio.mroxas.chatgpt.site/api/voice/inbound`.

The endpoint returns `503` and no TwiML if any required setting is absent or invalid. It never accepts a destination from the request.

## Twilio Console activation after the endpoint release

1. Privately note the business number's current Voice configuration so it can be restored if needed. Do not copy the number or auth token into project materials.
2. In Twilio Console, open **Phone Numbers > Manage > Active numbers**, then select the existing business number.
3. Under **Voice configuration**, set **A call comes in** to **Webhook**.
4. Enter `https://portfolio.mroxas.chatgpt.site/api/voice/inbound` and choose **HTTP POST**.
5. Leave the existing **Messaging / A message comes in** configuration unchanged. Do not add recording, a TwiML Bin, AI, an `action` callback, a voice fallback, or a Twilio voicemail handler for this flow.
6. Save only after the runtime settings and deployed endpoint are ready.

## Verification and rollback

1. Call the business number from a different phone.
2. Confirm the destination rings and that the caller is not shown the private destination number.
3. Decline or miss one test call to confirm no Twilio greeting or recording is introduced. The destination phone's carrier voicemail may still answer according to that phone's existing settings; this flow does not configure it.
4. Confirm SMS still reaches the existing SMS webhook and keyword behavior is unchanged.
5. If voice forwarding fails or behaves unexpectedly, restore the previously noted Voice configuration. Do not change the Messaging configuration while troubleshooting voice.
