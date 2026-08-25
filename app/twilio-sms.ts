export const SMS_OPT_IN_KEYWORDS = ['START', 'YES', 'UNSTOP'] as const;

export const SMS_OPT_IN_MESSAGE =
  'Matthew Roxas SMS: You are enrolled for one-to-one follow-up about website inquiries. Message frequency varies; message and data rates may apply. Reply HELP for help or STOP to opt out.';

export const SMS_HELP_MESSAGE =
  'Matthew Roxas SMS help: one-to-one follow-up about website inquiries. Message frequency varies; message and data rates may apply. Email matthewgroxas@gmail.com. Reply STOP to opt out.';

type TwilioSmsSettings = {
  authToken: string;
  webhookUrl: string;
};

const XML_HEADERS = {
  'cache-control': 'no-store',
  'content-type': 'text/xml; charset=utf-8',
};

const MAX_TWILIO_FORM_BYTES = 64 * 1024;

function textResponse(body: string, status: number) {
  return new Response(body, {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}

function twiml(message?: string) {
  const body = message
    ? `<Response><Message>${message}</Message></Response>`
    : '<Response></Response>';

  return new Response(body, { status: 200, headers: XML_HEADERS });
}

function buildSignaturePayload(webhookUrl: string, parameters: URLSearchParams) {
  return [...parameters.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .reduce((value, [name, parameter]) => `${value}${name}${parameter}`, webhookUrl);
}

function decodeBase64(value: string) {
  const decoded = atob(value);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

async function readFormBody(request: Request) {
  const declaredLength = Number.parseInt(request.headers.get('content-length') ?? '', 10);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_TWILIO_FORM_BYTES) {
    return null;
  }

  if (!request.body) return '';

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = '';
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.byteLength;
      if (bytesRead > MAX_TWILIO_FORM_BYTES) {
        await reader.cancel();
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }

    return body + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

async function hasValidTwilioSignature(
  signature: string,
  authToken: string,
  webhookUrl: string,
  parameters: URLSearchParams,
) {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(authToken),
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['verify'],
    );

    return crypto.subtle.verify(
      'HMAC',
      key,
      decodeBase64(signature),
      new TextEncoder().encode(buildSignaturePayload(webhookUrl, parameters)),
    );
  } catch {
    return false;
  }
}

function hasUsableSettings(settings: TwilioSmsSettings) {
  if (!settings.authToken.trim() || !settings.webhookUrl.trim()) return false;

  try {
    const url = new URL(settings.webhookUrl);
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

export async function handleTwilioSmsWebhook(
  request: Request,
  settings: TwilioSmsSettings,
) {
  if (!hasUsableSettings(settings)) {
    return textResponse('SMS webhook unavailable', 503);
  }

  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/x-www-form-urlencoded') {
    return textResponse('Unsupported Media Type', 415);
  }

  const signature = request.headers.get('x-twilio-signature')?.trim();
  if (!signature) return textResponse('Forbidden', 403);

  const formBody = await readFormBody(request);
  if (formBody === null) return textResponse('Payload Too Large', 413);

  const parameters = new URLSearchParams(formBody);
  const isValid = await hasValidTwilioSignature(
    signature,
    settings.authToken,
    settings.webhookUrl,
    parameters,
  );

  if (!isValid) return textResponse('Forbidden', 403);

  // Advanced Opt-Out already applied the preference change and sent its own
  // confirmation when this field is present. Returning empty TwiML avoids a
  // duplicate message while leaving Twilio's block list authoritative.
  if (parameters.has('OptOutType')) return twiml();

  const keyword = parameters.get('Body')?.trim().toUpperCase() ?? '';
  if (keyword === 'HELP') return twiml(SMS_HELP_MESSAGE);
  if (SMS_OPT_IN_KEYWORDS.some((candidate) => candidate === keyword)) {
    return twiml(SMS_OPT_IN_MESSAGE);
  }

  // STOP and ordinary inbound messages intentionally produce no application
  // reply. Twilio and participating carriers retain opt-out enforcement.
  return twiml();
}
