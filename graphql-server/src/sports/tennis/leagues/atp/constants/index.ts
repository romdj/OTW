/**
 * ATP Tour Constants
 */

export const ATP_TOUR_CONFIG = {
  name: 'ATP Tour',
  sport: 'Tennis',
  founded: 1972,
  headquarters: 'London, UK',
} as const;

// Grand Slams (shared with WTA)
export const GRAND_SLAMS = {
  AUSTRALIAN_OPEN: {
    name: 'Australian Open',
    location: 'Melbourne, Australia',
    surface: 'hard',
    month: 1,
    points: 2000,
  },
  FRENCH_OPEN: {
    name: 'Roland Garros',
    location: 'Paris, France',
    surface: 'clay',
    month: 5,
    points: 2000,
  },
  WIMBLEDON: {
    name: 'Wimbledon',
    location: 'London, UK',
    surface: 'grass',
    month: 7,
    points: 2000,
  },
  US_OPEN: {
    name: 'US Open',
    location: 'New York, USA',
    surface: 'hard',
    month: 9,
    points: 2000,
  },
} as const;

// ATP Masters 1000 events
export const ATP_MASTERS_1000 = [
  { name: 'Indian Wells Masters', location: 'Indian Wells, USA', surface: 'hard', month: 3 },
  { name: 'Miami Open', location: 'Miami, USA', surface: 'hard', month: 3 },
  { name: 'Monte-Carlo Masters', location: 'Monte-Carlo, Monaco', surface: 'clay', month: 4 },
  { name: 'Madrid Open', location: 'Madrid, Spain', surface: 'clay', month: 5 },
  { name: 'Italian Open', location: 'Rome, Italy', surface: 'clay', month: 5 },
  { name: 'Canadian Open', location: 'Toronto/Montreal, Canada', surface: 'hard', month: 8 },
  { name: 'Cincinnati Masters', location: 'Cincinnati, USA', surface: 'hard', month: 8 },
  { name: 'Shanghai Masters', location: 'Shanghai, China', surface: 'hard', month: 10 },
  { name: 'Paris Masters', location: 'Paris, France', surface: 'indoor_hard', month: 11 },
] as const;

// Ranking points by tournament category and round
export const ATP_RANKING_POINTS = {
  grand_slam: {
    winner: 2000,
    finalist: 1300,
    semifinalist: 800,
    quarterfinalist: 400,
    round16: 200,
    round32: 100,
    round64: 50,
    round128: 10,
  },
  masters_1000: {
    winner: 1000,
    finalist: 650,
    semifinalist: 390,
    quarterfinalist: 195,
    round16: 100,
    round32: 50,
    round64: 25,
  },
  atp_500: {
    winner: 500,
    finalist: 330,
    semifinalist: 180,
    quarterfinalist: 90,
    round16: 45,
    round32: 20,
  },
  atp_250: {
    winner: 250,
    finalist: 165,
    semifinalist: 100,
    quarterfinalist: 50,
    round16: 25,
    round32: 10,
  },
} as const;

// Match rounds in order
export const TOURNAMENT_ROUNDS = [
  'Final',
  'Semifinal',
  'Quarterfinal',
  'Round of 16',
  'Round of 32',
  'Round of 64',
  'Round of 128',
  'Qualifying',
] as const;

export const ATP_ERROR_MESSAGES = {
  FETCH_RANKINGS_FAILED: 'Failed to fetch ATP rankings',
  FETCH_TOURNAMENTS_FAILED: 'Failed to fetch ATP tournaments',
  FETCH_MATCHES_FAILED: 'Failed to fetch ATP matches',
  FETCH_PLAYER_FAILED: 'Failed to fetch player profile',
  INVALID_TOUR: 'Invalid tour specified',
  INVALID_SURFACE: 'Invalid surface specified',
} as const;
