/**
 * TypeScript interfaces for NHL API responses
 */

export interface NHLApiTeam {
  conferenceAbbrev: string;
  conferenceName: string;
  conferenceSequence: number;
  date: string;
  divisionName: string;
  divisionSequence: number;
  gamesPlayed: number;
  goalDifferential: number;
  goalAgainst: number;
  goalFor: number;
  homePoints: number;
  losses: number;
  otLosses: number;
  points: number;
  regulationWins: number;
  roadPoints: number;
  teamName: {
    default: string;
  };
  teamAbbrev: {
    default: string;
  };
  teamLogo: string;
  winPctg: number;
  wins: number;
  teamId?: number;
}

export interface NHLApiStandingsResponse {
  standings: NHLApiTeam[];
}

export interface StandingsQueryArgs {
  date?: string;
}

export interface PowerplayStats {
  powerplayGoals: number;
  powerplayMinutes: number;
  minutesPerPowerplayGoal: number | null;
  powerplayOpportunities: number;
  powerplayPercentage: number;
}

export interface NHLApiTeamPowerplayResponse {
  gamesPlayed: number;
  losses: number;
  otLosses: number;
  pointPct: number;
  points: number;
  powerPlayGoalsFor: number;
  powerPlayNetPct: number;
  powerPlayPct: number;
  ppGoalsPerGame: number;
  ppNetGoals: number;
  ppNetGoalsPerGame: number;
  ppOpportunities: number;
  ppOpportunitiesPerGame: number;
  ppTimeOnIcePerGame: number; // in seconds per game
  seasonId: number;
  shGoalsAgainst: number;
  shGoalsAgainstPerGame: number;
  teamFullName: string;
  teamId: number;
  ties: null | number;
  wins: number;
}

export interface TransformedTeam {
  conferenceAbbrev: string;
  conferenceName: string;
  conferenceSequence: number;
  date: string;
  divisionName: string;
  divisionSequence: number;
  gamesPlayed: number;
  goalDifferential: number;
  goalAgainst: number;
  goalFor: number;
  homePoints: number;
  losses: number;
  otWins: number;
  otLosses: number;
  points: number;
  internationalSystemPoints: number;
  regulationWins: number;
  roadPoints: number;
  teamName: string;
  teamAbbrev: string;
  teamLogo: string;
  winPercentage: number;
  wins: number;
  powerplayStats?: PowerplayStats;
}

export interface NHLApiScheduleTeam {
  id: number;
  abbrev: string;
  logo?: string;
  score?: number;
  commonName?: {
    default: string;
  };
  placeName?: {
    default: string;
  };
}

export interface NHLApiScheduleGame {
  id: number;
  season: number;
  gameType: number;
  gameState: string;
  gameScheduleState?: string;
  startTimeUTC: string;
  venue?: {
    default: string;
  };
  neutralSite?: boolean;
  awayTeam: NHLApiScheduleTeam;
  homeTeam: NHLApiScheduleTeam;
}

export interface NHLApiScheduleDay {
  date: string;
  games: NHLApiScheduleGame[];
}

export interface NHLApiScheduleResponse {
  gameWeek: NHLApiScheduleDay[];
}
