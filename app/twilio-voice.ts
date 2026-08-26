import twilio from 'twilio';

type TwilioVoiceSettings = {
  authToken: string;
  forwardingNumber: string;
  webhookUrl: string;
};

const MAX_TWILIO_FORM_BYTES = 64 * 1024;
const E164_PHONE_NUMBER = /^\+[1-9]\d{7,14}$/;

const XML_HEADERS = {
  'cache-control': 'no-store',
  'content-type': 'text/xml; charset=utf-8',
};

function textResponse(body: string, status: number) {
  return new Response(body, {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
    },
  });
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

function toTwilioParameters(parameters: URLSearchParams) {
  const result: Record<string, string | string[]> = {};

  for (const [name, value] of parameters) {
    const existing = result[name];
    if (existing === undefined) {
      result[name] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      result[name] = [existing, value];
    }
  }

  return result;
}

function hasUsableSettings(settings: TwilioVoiceSettings) {
  const authToken = settings.authToken.trim();
  const forwardingNumber = settings.forwardingNumber.trim();
  const webhookUrl = settings.webhookUrl.trim();
  if (!authToken || !E164_PHONE_NUMBER.test(forwardingNumber) || !webhookUrl) return false;

  try {
    const url = new URL(webhookUrl);
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

export async function handleTwilioVoiceWebhook(
  request: Request,
  settings: TwilioVoiceSettings,
) {
  if (!hasUsableSettings(settings)) {
    return textResponse('Voice webhook unavailable', 503);
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
  let isValid = false;
  try {
    isValid = twilio.validateRequest(
      settings.authToken,
      signature,
      settings.webhookUrl,
      toTwilioParameters(parameters),
    );
  } catch {
    isValid = false;
  }

  if (!isValid) return textResponse('Forbidden', 403);

  const response = new twilio.twiml.VoiceResponse();
  response.dial(settings.forwardingNumber.trim());
  return new Response(response.toString(), { status: 200, headers: XML_HEADERS });
}
