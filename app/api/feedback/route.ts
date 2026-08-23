import {
  includesValue,
  REFERRAL_INTENTS,
  TESTIMONIAL_PERMISSIONS,
} from '../../support-types';
import { createConsultationFeedback } from '../../../db/support';

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (clean(body.website, 200)) return Response.json({ ok: true });

    const name = clean(body.name, 120);
    const email = clean(body.email, 180).toLowerCase();
    const organization = clean(body.organization, 180);
    const rating = Number.parseInt(clean(body.rating, 2), 10);
    const outcome = clean(body.outcome, 2400);
    const testimonial = clean(body.testimonial, 800);
    const testimonialPermission = clean(body.testimonialPermission, 30);
    const referralIntent = clean(body.referralIntent, 20);
    const canFollowUp = clean(body.canFollowUp, 10) === 'yes';

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || rating < 1 || rating > 5 || outcome.length < 20) {
      return Response.json({ error: 'Please complete the required fields with a valid email.' }, { status: 400 });
    }
    if (!includesValue(TESTIMONIAL_PERMISSIONS, testimonialPermission) || !includesValue(REFERRAL_INTENTS, referralIntent)) {
      return Response.json({ error: 'Please choose valid consent and referral options.' }, { status: 400 });
    }

    await createConsultationFeedback({
      name,
      email,
      organization: organization || null,
      rating,
      outcome,
      testimonial: testimonial || null,
      testimonialPermission: testimonial ? testimonialPermission : 'private',
      referralIntent,
      canFollowUp,
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Feedback submission failed', error);
    return Response.json({ error: 'Your feedback could not be saved just now. Please try again.' }, { status: 500 });
  }
}
