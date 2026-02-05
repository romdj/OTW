/**
 * IIHF API Types
 */

export type TournamentType = 'world_championship' | 'world_juniors' | 'olympics' | 'u18';

export type TournamentPhase =
  | 'preliminary_round'
  | 'qualification_round'
  | 'quarterfinal'
  | 'semifinal'
  | 'bronze_medal'
  | 'gold_medal';

export interface IIHFTournament {
  id: string;
  name: string;
  type: TournamentType;
  year: number;
  hostCountry: string;
  hostCity: string;
  startDate: string;
  endDate: string;
  teams: number;
  status: 'upcoming' | 'in_progress' | 'completed';
}

export interface IIHFTeamStanding {
  nationCode: string;
  nationName: string;
  flag: string;
  group: string;
  gamesPlayed: number;
  wins: number;
  otWins: number;
  otLosses: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifferential: number;
  rank: number;
}

export interface IIHFGame {
  id: string;
  tournamentId: string;
  phase: TournamentPhase;
  date: string;
  time: string;
  venue: string;
  homeTeam: {
    code: string;
    name: string;
    score?: number;
  };
  awayTeam: {
    code: string;
    name: string;
    score?: number;
  };
  status: 'scheduled' | 'live' | 'final' | 'final_ot' | 'final_so';
  period?: string;
  attendance?: number;
}

export interface IIHFPlayer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  number: number;
  position: 'G' | 'D' | 'F';
  nationCode: string;
  birthDate: string;
  nhlTeam?: string;
}

export interface IIHFTournamentStats {
  tournamentId: string;
  scoringLeaders: Array<{
    player: IIHFPlayer;
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
  }>;
  goalieLeaders: Array<{
    player: IIHFPlayer;
    gamesPlayed: number;
    savePct: number;
    gaa: number;
  }>;
}
