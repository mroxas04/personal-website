export const TESTIMONIAL_PERMISSIONS = ['private', 'anonymous', 'named'] as const;
export type TestimonialPermission = (typeof TESTIMONIAL_PERMISSIONS)[number];

export const REFERRAL_INTENTS = ['yes', 'maybe', 'no'] as const;
export type ReferralIntent = (typeof REFERRAL_INTENTS)[number];

export const FEEDBACK_STATUSES = ['new', 'reviewed', 'approved', 'declined'] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: 'New',
  reviewed: 'Reviewed',
  approved: 'Approved for later use',
  declined: 'Do not use',
};

export const SUPPORT_TYPES = [
  'venmo',
  'zelle',
  'referral',
  'testimonial',
  'feedback',
  'word_of_mouth',
  'other',
] as const;
export type SupportType = (typeof SUPPORT_TYPES)[number];

export const SUPPORT_TYPE_LABELS: Record<SupportType, string> = {
  venmo: 'Venmo',
  zelle: 'Zelle',
  referral: 'Referral',
  testimonial: 'Testimonial',
  feedback: 'Private feedback',
  word_of_mouth: 'Word of mouth',
  other: 'Other support',
};

export function includesValue<T extends readonly string[]>(values: T, value: string): value is T[number] {
  return values.includes(value);
}
