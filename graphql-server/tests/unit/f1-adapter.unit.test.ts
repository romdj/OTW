import nock from 'nock';
import { BallDontLieF1Adapter, F1ProviderUnavailableError } from '../../src/sports/racing/formula1/adapters/BallDontLieF1Adapter';

const event = {
  id: 10,
  name: 'Belgian Grand Prix',
  season: 2026,
  start_date: '2026-07-17T11:30:00.000Z',
  end_date: '2026-07-19T13:00:00.000Z',
  status: 'scheduled',
  circuit: { id: 7, name: 'Spa-Francorchamps', country_code: 'BEL', country_name: 'Belgium' },
  location: 'Stavelot',
  country_code: 'BEL',
  country_name: 'Belgium',
};

describe('BallDontLieF1Adapter', () => {
  afterEach(() => nock.cleanAll());

  it('paginates events and preserves provider instants and provenance', async () => {
    const api = nock('https://f1.test')
      .get('/f1/v1/events').query({ season: 2026, per_page: 100 })
      .reply(200, { data: [event], meta: { next_cursor: 10 } })
      .get('/f1/v1/events').query({ season: 2026, per_page: 100, cursor: 10 })
      .reply(200, { data: [], meta: {} })
      .get('/f1/v1/sessions').query({ 'event_ids[]': '10', per_page: 100 })
      .reply(200, {
        data: [{
          id: 99, event, type: 'Sprint', name: 'Sprint',
          date: '2026-07-18T10:00:00.000Z', status: 'scheduled',
        }],
        meta: {},
      });
    const adapter = new BallDontLieF1Adapter({
      baseUrl: 'https://f1.test',
      apiKey: 'secret',
      clock: () => new Date('2026-01-01T00:00:00.000Z'),
    });

    const calendar = await adapter.fetchCalendar(2026);

    expect(api.isDone()).toBe(true);
    expect(calendar[0]).toMatchObject({
      round: 1,
      date: '2026-07-19T13:00:00.000Z',
      format: 'sprint',
      status: 'upcoming',
      provenance: {
        source: 'balldontlie-f1',
        fetchedAt: '2026-01-01T00:00:00.000Z',
        isStale: false,
      },
    });
    expect(calendar[0].sessions[0]).toMatchObject({
      providerId: '99',
      type: 'sprint',
      date: '2026-07-18T10:00:00.000Z',
    });
  });

  it('fails explicitly when credentials are absent', async () => {
    const adapter = new BallDontLieF1Adapter({ baseUrl: 'https://f1.test', apiKey: '' });
    await expect(adapter.fetchCalendar(2031)).rejects.toBeInstanceOf(F1ProviderUnavailableError);
  });

  it('rejects round-specific standings instead of returning latest', async () => {
    const adapter = new BallDontLieF1Adapter({ baseUrl: 'https://f1.test', apiKey: 'secret' });
    await expect(adapter.fetchDriverStandings(2026, 4)).rejects.toThrow('round-specific');
  });

  it('does not retry authentication failures', async () => {
    const request = nock('https://f1.test')
      .get('/f1/v1/events').query({ season: 2032, per_page: 100 })
      .once().reply(401, { error: 'invalid key' });
    const adapter = new BallDontLieF1Adapter({ baseUrl: 'https://f1.test', apiKey: 'bad' });
    await expect(adapter.fetchCalendar(2032)).rejects.toThrow('(401)');
    expect(request.isDone()).toBe(true);
  });
});
