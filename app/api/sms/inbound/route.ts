import { env } from 'cloudflare:workers';
import { handleTwilioSmsWebhook } from '../../../twilio-sms';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return handleTwilioSmsWebhook(request, {
    authToken: env.TWILIO_AUTH_TOKEN ?? '',
    webhookUrl: env.TWILIO_SMS_WEBHOOK_URL ?? '',
  });
}
