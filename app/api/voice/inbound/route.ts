import { env } from 'cloudflare:workers';
import { handleTwilioVoiceWebhook } from '../../../twilio-voice';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return handleTwilioVoiceWebhook(request, {
    authToken: env.TWILIO_AUTH_TOKEN ?? '',
    forwardingNumber: env.TWILIO_VOICE_FORWARDING_NUMBER ?? '',
    webhookUrl: env.TWILIO_VOICE_WEBHOOK_URL ?? '',
  });
}
