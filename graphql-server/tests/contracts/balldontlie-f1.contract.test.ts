import got from 'got';
import { config } from '../../src/config/env';

const configured = Boolean(
  config.BALLDONTLIE_API_KEY &&
  config.BALLDONTLIE_API_KEY !== 'your_api_key_here'
);
const describeWithCredentials = configured ? describe : describe.skip;
const baseUrl = `${config.BALLDONTLIE_API_BASE_URL}/f1/v1`.replace(/([^:]\/)\/+/g, '$1');

async function get(path: string, searchParams: Record<string, string | number>) {
  return got(`${baseUrl}${path}`, {
    headers: { Authorization: config.BALLDONTLIE_API_KEY },
    searchParams: { ...searchParams, per_page: 2 },
    timeout: { request: 15000 },
    responseType: 'json',
  }).json<Record<string, unknown>>();
}

function expectEnvelope(body: Record<string, unknown>) {
  expect(Array.isArray(body.data)).toBe(true);
  expect((body.data as unknown[]).length).toBeGreaterThan(0);
  expect(body.meta).toEqual(expect.any(Object));
}

describeWithCredentials('BALLDONTLIE F1 live contract', () => {
  jest.setTimeout(30000);

  it('returns documented event and cursor envelope shapes', async () => {
    const body = await get('/events', { season: 2024 });
    expectEnvelope(body);
    expect((body.data as unknown[])[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      season: 2024,
      start_date: expect.stringMatching(/Z$/),
      end_date: expect.stringMatching(/Z$/),
      status: expect.any(String),
      circuit: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        country_code: expect.any(String),
      }),
    }));
  });

  it('returns sessions with event identity and an ISO instant', async () => {
    const body = await get('/sessions', {});
    expectEnvelope(body);
    expect((body.data as unknown[])[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      event: expect.objectContaining({ id: expect.any(Number), season: expect.any(Number) }),
      type: expect.any(String),
      date: expect.stringMatching(/Z$/),
      status: expect.any(String),
    }));
  });

  it.each(['/driver_standings', '/team_standings'])(
    'returns half-point-safe standings from %s',
    async path => {
      const body = await get(path, { season: 2024 });
      expectEnvelope(body);
      expect((body.data as unknown[])[0]).toEqual(expect.objectContaining({
        season: 2024,
        position: expect.any(Number),
        points: expect.any(Number),
      }));
    }
  );
});
