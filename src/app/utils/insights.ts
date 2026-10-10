import { fUser } from '../services/userService/user.service';

export const SATISFACTION_LEVELS = ['Delighted', 'OK', 'Undecided', 'Not at all'];
export const SERVICES = ['Ecommerce service', 'Delivery Service', 'Supply Chain Service'];
export const SOCIALS = ['twitter', 'linkedIn', 'facebook', 'instagram'];

export interface Share {
  label: string;
  count: number;
  /** share of all responses, 0-100 */
  percent: number;
}

export interface Insights {
  customers: number;
  responses: number;
  /** 0-100 */
  responseRate: number;
  /** 1-5, or null when there is no feedback yet */
  averageRating: number | null;
  /** 0-100, or null when there is no feedback yet */
  delightedRate: number | null;
  satisfaction: Share[];
  services: Share[];
  /** 5 stars down to 1 */
  ratings: Share[];
  socials: Share[];
}

const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

function shares(labels: string[], values: string[], total: number): Share[] {
  return labels.map((label) => {
    const count = values.filter((v) => v === label).length;
    return { label, count, percent: percent(count, total) };
  });
}

export function computeInsights(users: fUser[]): Insights {
  const feedbacks = users.map((u) => u.feedback).filter((f): f is NonNullable<typeof f> => !!f);
  const responses = feedbacks.length;
  const ratingSum = feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 0), 0);

  return {
    customers: users.length,
    responses,
    responseRate: percent(responses, users.length),
    averageRating: responses ? Math.round((ratingSum / responses) * 10) / 10 : null,
    delightedRate: responses ? percent(feedbacks.filter((f) => f.satisfactory === 'Delighted').length, responses) : null,
    satisfaction: shares(SATISFACTION_LEVELS, feedbacks.map((f) => f.satisfactory), responses),
    services: shares(SERVICES, feedbacks.map((f) => f.services), responses),
    ratings: [5, 4, 3, 2, 1].map((stars) => {
      const count = feedbacks.filter((f) => Number(f.rating) === stars).length;
      return { label: `${stars}`, count, percent: percent(count, responses) };
    }),
    socials: shares(SOCIALS, feedbacks.flatMap((f) => f.social || []), responses),
  };
}

const csvCell = (value: unknown) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function toCsv(users: fUser[]): string {
  const header = ['Name', 'Email', 'Phone', 'City', 'Country', 'Status', 'Rating', 'Satisfaction',
    'Best service', 'Why', 'Follows us on', 'Submitted'];
  const rows = users.map((u) => {
    const f = u.feedback;
    return [
      u.name, u.email, u.phone, u.location?.city, u.location?.country,
      f ? 'Received' : 'Pending',
      f?.rating, f?.satisfactory, f?.services, f?.reason, f?.social?.join('; '),
      f?.date ? f.date.slice(0, 10) : '',
    ];
  });
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
