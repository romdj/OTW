import { jest } from '@jest/globals';
import {
  normalizeBdlMatch,
  normalizeBdlStatus,
  tennisQueryCacheKey,
  type BdlMatch,
} from '../../src/sports/tennis/providers/balldontlie.js';
import { mapDavisCupTie } from '../../src/sports/tennis/leagues/itf/davisCupService.js';
import { tennisResolvers } from '../../src/sports/tennis/leagues/atp/resolvers/tennisResolvers.js';
import { ballDontLieTennisProvider } from '../../src/sports/tennis/providers/balldontlie.js';

const match: BdlMatch = {
  id: 44,
  tournament: { id: 7, name: 'Test Open', season: 2026, surface: 'Indoor Hard' },
  season: 2026,
  round: 'Finals',
  player1: { id: 1, full_name: 'Player One', country_code: 'BEL' },
  player2: { id: 2, full_name: 'Player Two', country_code: 'FRA' },
  winner: { id: 2, full_name: 'Player Two' },
  score: '6-7(5) 6-4 3-0 RET',
  set_scores: [
    { set_number: 1, player1_games: 6, player2_games: 7, player1_tiebreak: 5, player2_tiebreak: 7 },
    { set_number: 2, player1_games: 6, player2_games: 4 },
    { set_number: 3, player1_games: 3, player2_games: 0 },
  ],
  match_status: 'retired',
  is_live: false,
};

describe('tennis provider normalization', () => {
  it.each([
    [{ match_status: 'scheduled', is_live: false }, 'SCHEDULED'],
    [{ match_status: 'in_progress', is_live: true }, 'LIVE'],
    [{ match_status: 'finished', is_live: false }, 'COMPLETED'],
    [{ match_status: 'retired', is_live: false }, 'RETIRED'],
    [{ match_status: 'walkover', is_live: false }, 'WALKOVER'],
    [{ match_status: 'defaulted', is_live: false }, 'DEFAULTED'],
    [{ match_status: 'postponed', is_live: false }, 'POSTPONED'],
    [{ match_status: 'cancelled', is_live: false }, 'CANCELLED'],
  ])('maps provider status %#', (input, expected) => {
    expect(normalizeBdlStatus(input)).toBe(expected);
  });

  it('preserves score, winner, stable IDs, tour, and provenance', () => {
    const normalized = normalizeBdlMatch('WTA', match, '2026-07-25T10:00:00.000Z');
    expect(normalized.tour).toBe('WTA');
    expect(normalized.otwId).toBe('tennis:bdl-wta:match:44');
    expect(normalized.winnerId).toBe('tennis:bdl-wta:player:2');
    expect(normalized.status).toBe('RETIRED');
    expect(normalized.sets[0]).toMatchObject({ player1Tiebreak: 5, player2Tiebreak: 7 });
    expect(normalized.provenance).toMatchObject({ provider: 'BALLDONTLIE', isStale: false });
  });

  it('isolates cache entries by tour and every query filter', () => {
    const atp = tennisQueryCacheKey('ATP', 'matches', { playerId: '1', status: 'LIVE' });
    const wta = tennisQueryCacheKey('WTA', 'matches', { playerId: '1', status: 'LIVE' });
    const otherPlayer = tennisQueryCacheKey('ATP', 'matches', { playerId: '2', status: 'LIVE' });
    expect(new Set([atp, wta, otherPlayer]).size).toBe(3);
  });
});

describe('ATP/WTA resolver dispatch', () => {
  const ranking = {
    rank: 1,
    previousRank: 1,
    playerName: 'Test Player',
    playerId: 'TEST',
    country: 'Belgium',
    countryCode: 'BEL',
    points: 1000,
    tournamentsPlayed: 10,
    pointsDropping: 0,
    nextBestPoints: 0,
  };

  it('never answers WTA rankings with the ATP service', async () => {
    const provider = jest.spyOn(ballDontLieTennisProvider, 'rankings').mockResolvedValue([ranking]);
    const resolver = tennisResolvers.Query.tennisRankings;
    const result = await resolver(undefined, { tour: 'wta', type: 'singles' });
    expect(provider).toHaveBeenCalledWith('WTA', undefined);
    expect(result[0]).toMatchObject({ tour: 'WTA', playerId: 'TEST' });
  });

  it('never answers ATP rankings with the WTA service', async () => {
    const provider = jest.spyOn(ballDontLieTennisProvider, 'rankings').mockResolvedValue([ranking]);
    const resolver = tennisResolvers.Query.tennisRankings;
    const result = await resolver(undefined, { tour: 'atp', type: 'singles' });
    expect(provider).toHaveBeenCalledWith('ATP', undefined);
    expect(result[0]).toMatchObject({ tour: 'ATP', playerId: 'TEST' });
  });
});

describe('Davis Cup mapping', () => {
  it('maps event, tie, and rubber stable IDs without losing team context', () => {
    const provenance = {
      provider: 'TEST',
      providerId: 'tie-1',
      fetchedAt: '2026-07-25T10:00:00.000Z',
      isStale: false,
    };
    const tie = mapDavisCupTie('2026', {
      providerId: 'tie-1',
      stage: 'Quarterfinal',
      knockout: true,
      home: { code: 'BEL', name: 'Belgium' },
      away: { code: 'FRA', name: 'France' },
      neutralVenue: true,
      status: 'COMPLETED',
      homeScore: 2,
      awayScore: 1,
      provenance,
      rubbers: [{
        otwId: '',
        providerId: 'rubber-1',
        order: 1,
        matchType: 'SINGLES',
        status: 'COMPLETED',
        homeCompetitors: ['Player One'],
        awayCompetitors: ['Player Two'],
        winnerSide: 'HOME',
        provenance,
      }],
    });
    expect(tie.otwId).toBe('tennis:itf:tie:tie-1');
    expect(tie.eventId).toBe('tennis:itf:event:2026');
    expect(tie.rubbers[0].otwId).toBe('tennis:itf:rubber:rubber-1');
  });
});
