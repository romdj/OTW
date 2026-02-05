/**
 * ATP Tournaments Service Tests
 *
 * Tests for ATP tournament schedule and match data.
 */

import { atpTournamentsService } from '../../../../../src/sports/tennis/leagues/atp/services/tournamentsService';

describe('ATPTournamentsService', () => {
  describe('getTournaments', () => {
    it('should return tournaments array', async () => {
      const tournaments = await atpTournamentsService.getTournaments();

      expect(Array.isArray(tournaments)).toBe(true);
      expect(tournaments.length).toBeGreaterThan(0);
    });

    it('should have required fields on each tournament', async () => {
      const tournaments = await atpTournamentsService.getTournaments();

      for (const tournament of tournaments) {
        expect(typeof tournament.id).toBe('string');
        expect(typeof tournament.name).toBe('string');
        expect(typeof tournament.location).toBe('string');
        expect(typeof tournament.country).toBe('string');
        expect(['hard', 'clay', 'grass']).toContain(tournament.surface);
        expect(['grand_slam', 'masters_1000', 'atp_500', 'atp_250']).toContain(tournament.category);
        expect(tournament.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(tournament.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(typeof tournament.prizeMoney).toBe('number');
        expect(typeof tournament.drawSize).toBe('number');
        expect(typeof tournament.points).toBe('number');
      }
    });

    it('should filter by surface', async () => {
      const clayTournaments = await atpTournamentsService.getTournaments({ surface: 'clay' });

      expect(clayTournaments.length).toBeGreaterThan(0);
      expect(clayTournaments.every(t => t.surface === 'clay')).toBe(true);
    });

    it('should filter by category', async () => {
      const grandSlams = await atpTournamentsService.getTournaments({ category: 'grand_slam' });

      expect(grandSlams.length).toBe(4); // AO, RG, Wimbledon, USO
      expect(grandSlams.every(t => t.category === 'grand_slam')).toBe(true);
    });

    it('should filter by year', async () => {
      const tournaments2025 = await atpTournamentsService.getTournaments({ year: 2025 });

      expect(tournaments2025.length).toBeGreaterThan(0);
      for (const t of tournaments2025) {
        expect(new Date(t.startDate).getFullYear()).toBe(2025);
      }
    });

    it('should include all Grand Slams', async () => {
      const tournaments = await atpTournamentsService.getTournaments();
      const names = tournaments.map(t => t.name);

      expect(names.some(n => n.includes('Australian Open'))).toBe(true);
      expect(names.some(n => n.includes('Roland Garros'))).toBe(true);
      expect(names.some(n => n.includes('Wimbledon'))).toBe(true);
      expect(names.some(n => n.includes('US Open'))).toBe(true);
    });
  });

  describe('getTournamentById', () => {
    it('should return tournament for valid ID', async () => {
      const tournament = await atpTournamentsService.getTournamentById('ao-2025');

      expect(tournament).not.toBeNull();
      expect(tournament?.id).toBe('ao-2025');
      expect(tournament?.name).toBe('Australian Open');
    });

    it('should return null for invalid ID', async () => {
      const tournament = await atpTournamentsService.getTournamentById('invalid-id');

      expect(tournament).toBeNull();
    });
  });

  describe('getMatches', () => {
    it('should return matches array', async () => {
      const matches = await atpTournamentsService.getMatches();

      expect(Array.isArray(matches)).toBe(true);
    });

    it('should have required fields on matches', async () => {
      const matches = await atpTournamentsService.getMatches();

      for (const match of matches) {
        expect(typeof match.id).toBe('string');
        expect(typeof match.tournamentId).toBe('string');
        expect(typeof match.tournamentName).toBe('string');
        expect(typeof match.round).toBe('string');
        expect(['hard', 'clay', 'grass']).toContain(match.surface);

        // Player 1
        expect(match.player1).toBeDefined();
        expect(typeof match.player1.id).toBe('string');
        expect(typeof match.player1.name).toBe('string');

        // Player 2
        expect(match.player2).toBeDefined();
        expect(typeof match.player2.id).toBe('string');
        expect(typeof match.player2.name).toBe('string');

        // Status
        expect(['scheduled', 'live', 'completed', 'cancelled']).toContain(match.status);
      }
    });

    it('should filter by tournament', async () => {
      const matches = await atpTournamentsService.getMatches({ tournamentId: 'ao-2025' });

      expect(matches.every(m => m.tournamentId === 'ao-2025')).toBe(true);
    });

    it('should filter by player', async () => {
      const matches = await atpTournamentsService.getMatches({ playerId: 'S0AG' });

      for (const match of matches) {
        const playerInMatch = match.player1.id === 'S0AG' || match.player2.id === 'S0AG';
        expect(playerInMatch).toBe(true);
      }
    });

    it('should filter by status', async () => {
      const completedMatches = await atpTournamentsService.getMatches({ status: 'completed' });

      expect(completedMatches.every(m => m.status === 'completed')).toBe(true);
    });
  });

  describe('getLiveMatches', () => {
    it('should return only live matches', async () => {
      const liveMatches = await atpTournamentsService.getLiveMatches();

      expect(Array.isArray(liveMatches)).toBe(true);
      // May be empty if no live matches
      for (const match of liveMatches) {
        expect(match.status).toBe('live');
      }
    });
  });

  describe('formatScore', () => {
    it('should format completed match score', () => {
      const match = {
        id: 'test',
        tournamentId: 'test',
        tournamentName: 'Test',
        round: 'Final',
        surface: 'hard' as const,
        player1: { id: 'P1', name: 'Player 1', countryCode: 'USA' },
        player2: { id: 'P2', name: 'Player 2', countryCode: 'ESP' },
        score: {
          sets: [
            { player1: 6, player2: 4 },
            { player1: 7, player2: 6, tiebreak: { player1: 7, player2: 3 } },
          ],
          winner: 'player1' as const,
        },
        scheduledTime: '2025-01-01T10:00:00Z',
        status: 'completed' as const,
      };

      const formatted = atpTournamentsService.formatScore(match);
      expect(formatted).toBe('6-4 7-6(7-3)');
    });

    it('should return "Not started" for match without score', () => {
      const match = {
        id: 'test',
        tournamentId: 'test',
        tournamentName: 'Test',
        round: 'R1',
        surface: 'hard' as const,
        player1: { id: 'P1', name: 'Player 1', countryCode: 'USA' },
        player2: { id: 'P2', name: 'Player 2', countryCode: 'ESP' },
        scheduledTime: '2025-01-01T10:00:00Z',
        status: 'scheduled' as const,
      };

      const formatted = atpTournamentsService.formatScore(match);
      expect(formatted).toBe('Not started');
    });
  });
});
