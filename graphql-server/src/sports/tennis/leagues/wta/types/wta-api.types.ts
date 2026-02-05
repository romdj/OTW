/**
 * WTA API Types
 */

export interface WTARankingEntry {
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

export interface WTAPlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  country: string;
  countryCode: string;
  birthDate: string;
  birthPlace?: string;
  height?: number; // cm
  turnedPro?: number;
  plays?: 'right' | 'left';
  backhand?: 'one-handed' | 'two-handed';
  coach?: string;
  currentRanking: number;
  highestRanking: number;
  highestRankingDate?: string;
  careerTitles: number;
  careerWins: number;
  careerLosses: number;
  ytdWins: number;
  ytdLosses: number;
  prizeMoney: number;
}

export interface WTATournamentEntry {
  id: string;
  name: string;
  location: string;
  country: string;
  surface: 'hard' | 'clay' | 'grass';
  category: 'grand_slam' | 'wta_1000' | 'wta_500' | 'wta_250' | 'wta_125';
  startDate: string;
  endDate: string;
  prizeMoney: number;
  currency: string;
  drawSize: number;
  points: number;
}

export interface WTAMatchEntry {
  id: string;
  tournamentId: string;
  tournamentName: string;
  round: string;
  surface: 'hard' | 'clay' | 'grass';
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
  };
  scheduledTime: string;
  completedTime?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  court?: string;
  duration?: number; // minutes
}

export interface RankingsQueryArgs {
  limit?: number;
}

export interface TournamentsQueryArgs {
  year?: number;
  surface?: 'hard' | 'clay' | 'grass';
  category?: 'grand_slam' | 'wta_1000' | 'wta_500' | 'wta_250';
}
