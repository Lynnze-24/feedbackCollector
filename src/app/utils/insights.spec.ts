import { fUser } from '../services/userService/user.service';
import { computeInsights, initials, toCsv } from './insights';

const customer = (id: string, fb: Partial<fUser['feedback']> | null = null): fUser => ({
  id,
  name: `Customer ${id}`,
  email: `${id}@example.com`,
  phone: '+10000000',
  avatar: '',
  location: { city: 'Paris', country: 'France' },
  feedback: fb
    ? { name: `Customer ${id}`, rating: 3, reason: 'ok', satisfactory: 'OK', services: 'Delivery Service', social: [], ...fb }
    : null,
});

describe('computeInsights', () => {
  it('handles an empty list', () => {
    const result = computeInsights([]);
    expect(result.customers).toBe(0);
    expect(result.responseRate).toBe(0);
    expect(result.averageRating).toBeNull();
    expect(result.delightedRate).toBeNull();
  });

  it('summarises responses, ratings and satisfaction', () => {
    const result = computeInsights([
      customer('a', { rating: 5, satisfactory: 'Delighted', services: 'Ecommerce service', social: ['twitter'] }),
      customer('b', { rating: 4, satisfactory: 'Delighted' }),
      customer('c', { rating: 2, satisfactory: 'Not at all' }),
      customer('d'),
    ]);

    expect(result.customers).toBe(4);
    expect(result.responses).toBe(3);
    expect(result.responseRate).toBe(75);
    expect(result.averageRating).toBe(3.7);
    expect(result.delightedRate).toBe(67);
    expect(result.satisfaction.find((s) => s.label === 'Delighted')?.count).toBe(2);
    expect(result.services.find((s) => s.label === 'Delivery Service')?.count).toBe(2);
    expect(result.ratings.map((r) => r.count)).toEqual([1, 1, 0, 1, 0]);
    expect(result.socials.find((s) => s.label === 'twitter')?.count).toBe(1);
  });
});

describe('toCsv', () => {
  it('writes a header and escapes commas, quotes and new lines', () => {
    const csv = toCsv([customer('a', { reason: 'Fast, "friendly"\nservice' })]);
    const [header, row] = csv.split('\r\n');
    expect(header.startsWith('Name,Email,Phone')).toBeTrue();
    expect(row).toContain('"Fast, ""friendly""\nservice"');
    expect(row).toContain('Received');
  });

  it('marks customers without feedback as pending', () => {
    expect(toCsv([customer('b')])).toContain('Pending');
  });
});

describe('initials', () => {
  it('uses the first two words', () => {
    expect(initials('Mia Chen')).toBe('MC');
    expect(initials('  priya   nair  rao ')).toBe('PN');
    expect(initials('Cher')).toBe('C');
  });
});
