export const SMS_CONSENT_VERSION = 'contact-form-v1-2026-08-25';

export type StoredSmsConsent = {
  phone: string | null;
  sms_consent_at: number | null;
  sms_consent_version: string | null;
};

type SmsConsentResult =
  | { value: StoredSmsConsent }
  | { error: string };

function cleanPhone(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 40) : '';
}

function isValidPhone(value: string) {
  const digitCount = value.replace(/\D/g, '').length;
  return /^[+\d().\-\s]+$/.test(value) && digitCount >= 7 && digitCount <= 15;
}

export function parseSmsConsentSubmission(
  body: Record<string, unknown>,
  now = Date.now(),
): SmsConsentResult {
  const phone = cleanPhone(body.phone);
  const consented = body.smsConsent === 'yes';

  if (phone && !isValidPhone(phone)) {
    return { error: 'Enter a valid mobile number or leave that field blank.' };
  }

  if (consented && !phone) {
    return { error: 'Add a mobile number before opting in to SMS follow-up.' };
  }

  return {
    value: {
      phone: phone || null,
      sms_consent_at: consented ? now : null,
      sms_consent_version: consented ? SMS_CONSENT_VERSION : null,
    },
  };
}
