export const CONTACT_REQUEST_STATUSES = [
  'new',
  'contacted',
  'follow_up',
  'closed',
  'ignore',
] as const;

export type ContactRequestStatus = (typeof CONTACT_REQUEST_STATUSES)[number];

export const CONTACT_REQUEST_STATUS_LABELS: Record<ContactRequestStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  follow_up: 'Follow up',
  closed: 'Closed',
  ignore: 'Ignore',
};

export function isContactRequestStatus(value: string): value is ContactRequestStatus {
  return CONTACT_REQUEST_STATUSES.includes(value as ContactRequestStatus);
}
