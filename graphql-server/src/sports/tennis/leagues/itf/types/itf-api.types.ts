/**
 * ITF API Types
 */

export type EventType = 'davis_cup' | 'bjk_cup' | 'olympics' | 'united_cup';
export type DavisCupPhase = 'group_stage' | 'quarterfinal' | 'semifinal' | 'final';
export type OlympicDraw = 'mens_singles' | 'womens_singles' | 'mens_doubles' | 'womens_doubles' | 'mixed_doubles';

export interface ITFEvent {
  id: string;
  name: string;
  type: EventType;
  year: number;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  surface: 'hard' | 'clay' | 'grass' | 'indoor_hard';
  status: 'upcoming' | 'in_progress' | 'completed';
}

export interface ITFTeam {
  code: string;
  name: string;
  flag: string;
  captain?: string;
  players: ITFPlayer[];
}

export interface ITFPlayer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  countryCode: string;
  ranking?: number;
}

export interface DavisCupTie {
  id: string;
  eventId: string;
  phase: DavisCupPhase;
  homeTeam: ITFTeam;
  awayTeam: ITFTeam;
  score?: {
    home: number;
    away: number;
  };
  date: string;
  venue: string;
  surface: 'hard' | 'clay' | 'grass' | 'indoor_hard';
  status: 'scheduled' | 'live' | 'completed';
  rubbers?: DavisCupRubber[];
}

export interface DavisCupRubber {
  id: string;
  rubberNumber: number;
  type: 'singles' | 'doubles';
  homePlayer: ITFPlayer | ITFPlayer[];
  awayPlayer: ITFPlayer | ITFPlayer[];
  score?: string;
  winner?: 'home' | 'away';
  status: 'scheduled' | 'live' | 'completed';
}

export interface OlympicMatch {
  id: string;
  eventId: string;
  draw: OlympicDraw;
  round: string;
  player1: {
    player: ITFPlayer | ITFPlayer[];
    countryCode: string;
    seed?: number;
  };
  player2: {
    player: ITFPlayer | ITFPlayer[];
    countryCode: string;
    seed?: number;
  };
  score?: string;
  winner?: 'player1' | 'player2';
  medal?: 'gold' | 'silver' | 'bronze';
  scheduledTime: string;
  status: 'scheduled' | 'live' | 'completed';
  court?: string;
}

export interface ITFGroupStanding {
  team: ITFTeam;
  group: string;
  played: number;
  won: number;
  lost: number;
  rubberWins: number;
  rubberLosses: number;
  setWins: number;
  setLosses: number;
  rank: number;
}
