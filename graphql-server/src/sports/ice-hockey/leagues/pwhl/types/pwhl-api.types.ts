/**
 * PWHL API Types
 */

export interface PWHLTeamStanding {
  teamAbbrev: string;
  teamName: string;
  teamLogo: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  points: number;
  regulationWins: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifferential: number;
  winPercentage: number;
  homeRecord: string;
  awayRecord: string;
  streak: string;
  last10: string;
  date: string;
}

export interface PWHLPlayer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  number: number;
  position: 'G' | 'D' | 'F';
  teamAbbrev: string;
  country: string;
  countryCode: string;
  birthDate: string;
}

export interface PWHLPlayerStats {
  playerId: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
  powerPlayGoals: number;
  shortHandedGoals: number;
  gameWinningGoals: number;
  shots: number;
  shootingPct: number;
}

export interface PWHLGoalieStats {
  playerId: string;
  gamesPlayed: number;
  gamesStarted: number;
  wins: number;
  losses: number;
  otLosses: number;
  savePct: number;
  goalsAgainstAvg: number;
  shutouts: number;
  saves: number;
  shotsAgainst: number;
}
