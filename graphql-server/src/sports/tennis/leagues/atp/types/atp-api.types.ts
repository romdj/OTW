/**
 * ATP API Types - Data structures for ATP Tour integration
 */

export interface ATPRankingEntry {
  rank: number;
  previousRank: number;
  playerName: string;
  playerId: string;
  country: string;
  countryCode: string;
  points: number;
  tournamentsPlayed: number;
  pointsDropping: number;
  nextBestPoints: number;
}

export interface ATPTournamentEntry {
  id: string;
  name: string;
  location: string;
  country: string;
  surface: 'hard' | 'clay' | 'grass' | 'indoor_hard';
  category: 'grand_slam' | 'masters_1000' | 'atp_500' | 'atp_250' | 'atp_finals';
  startDate: string;
  endDate: string;
  prizeMoney: number;
  currency: string;
  drawSize: number;
  points: {
    winner: number;
    finalist: number;
    semifinalist: number;
    quarterfinalist: number;
    round16: number;
    round32: number;
    round64?: number;
    round128?: number;
  };
}

export interface ATPMatchEntry {
  id: string;
  tournamentId: string;
  tournamentName: string;
  round: string;
  surface: string;
  player1: {
    id: string;
    name: string;
    seed?: number;
    countryCode: string;
  };
  player2: {
    id: string;
    name: string;
    seed?: number;
    countryCode: string;
  };
  score?: {
    sets: Array<{
      player1: number;
      player2: number;
      tiebreak?: { player1: number; player2: number };
    }>;
    winner?: 'player1' | 'player2';
    retired?: boolean;
    walkover?: boolean;
  };
  scheduledTime?: string;
  completedTime?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  court?: string;
  duration?: number; // minutes
}

export interface ATPPlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  country: string;
  countryCode: string;
  birthDate: string;
  birthPlace: string;
  height: number; // cm
  weight: number; // kg
  turnedPro: number;
  plays: 'right' | 'left';
  backhand: 'one-handed' | 'two-handed';
  coach?: string;
  currentRanking: number;
  highestRanking: number;
  highestRankingDate: string;
  careerTitles: number;
  careerWins: number;
  careerLosses: number;
  ytdWins: number;
  ytdLosses: number;
  prizeMoney: number;
}

// Query argument types
export interface RankingsQueryArgs {
  tour?: 'atp' | 'wta';
  type?: 'singles' | 'doubles';
  limit?: number;
}

export interface TournamentsQueryArgs {
  tour?: 'atp' | 'wta';
  year?: number;
  surface?: 'hard' | 'clay' | 'grass';
  category?: string;
}

export interface MatchesQueryArgs {
  tournamentId?: string;
  playerId?: string;
  status?: 'scheduled' | 'live' | 'completed';
  date?: string;
}

export interface PlayerQueryArgs {
  playerId: string;
}
