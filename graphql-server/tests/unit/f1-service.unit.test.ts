import type { F1DataAdapter, F1RaceData } from '../../src/sports/racing/formula1/adapters/types';
import { F1Service } from '../../src/sports/racing/formula1/services/F1Service';

function adapter(calendar: F1RaceData[] = []): F1DataAdapter {
  return {
    fetchCalendar: async () => calendar,
    fetchDriverStandings: async () => [],
    fetchConstructorStandings: async () => [],
    fetchCircuit: async () => null,
    getSource: () => 'test',
  };
}

describe('F1Service', () => {
  it('uses full ISO session instants and provider status', async () => {
    const service = new F1Service(adapter([{
      season: 2026, round: 1, raceName: 'Test GP', circuitId: 'test',
      circuitName: 'Test Circuit', location: 'Test', country: 'Belgium',
      countryCode: 'BEL', date: '2099-07-19T13:00:00.000Z', time: '13:00:00Z',
      format: 'standard', status: 'in_progress',
      provenance: { source: 'test', fetchedAt: '2026-01-01T00:00:00.000Z', isStale: false },
      sessions: [{
        providerId: 'session-1', type: 'race', date: '2099-07-19T13:00:00.000Z',
        time: '13:00:00Z', status: 'live',
      }],
    }]));

    const [grandPrix] = await service.getCalendar({ season: 2026 });
    expect(grandPrix.status).toBe('in_progress');
    expect(grandPrix.sessions[0].id).toBe('session-1');
    expect(grandPrix.sessions[0].date.toISOString()).toBe('2099-07-19T13:00:00.000Z');
    expect(grandPrix.sessions[0].status).toBe('live');
  });

  it('reports unavailable championship data instead of dereferencing an empty leader', async () => {
    const service = new F1Service(adapter());
    await expect(service.getChampionshipBattle(2030)).rejects.toThrow(
      'standings are unavailable'
    );
  });
});
