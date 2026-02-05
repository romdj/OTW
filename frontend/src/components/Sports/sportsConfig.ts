export interface SportConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  available: boolean;
  /** Brief description of what makes this sport exciting to watch */
  tagline: string;
  /** Example watchability factors for this sport */
  watchabilityHints: string[];
}

export const SPORTS: SportConfig[] = [
  {
    id: 'ice-hockey',
    name: 'Ice Hockey',
    icon: '🏒',
    color: 'primary',
    available: true,
    tagline: 'Fast-paced action on ice',
    watchabilityHints: ['Playoff races', 'Rivalry matchups', 'Overtime thrillers'],
  },
  {
    id: 'american-football',
    name: 'American Football',
    icon: '🏈',
    color: 'secondary',
    available: false,
    tagline: 'Strategic gridiron battles',
    watchabilityHints: ['Prime time showdowns', 'Division deciders', 'Comeback kings'],
  },
  {
    id: 'association-football',
    name: 'Football',
    icon: '⚽',
    color: 'accent',
    available: false,
    tagline: 'The beautiful game',
    watchabilityHints: ['Derby days', 'Title chasers', 'Relegation battles'],
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    color: 'success',
    available: true,
    tagline: 'Individual brilliance on court',
    watchabilityHints: ['Ranking clashes', 'Surface specialists', 'Grand Slam drama'],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    color: 'warning',
    available: false,
    tagline: 'High-flying hoops action',
    watchabilityHints: ['Buzzer beaters', 'Star matchups', 'Playoff intensity'],
  },
  {
    id: 'baseball',
    name: 'Baseball',
    icon: '⚾',
    color: 'error',
    available: false,
    tagline: 'America\'s pastime',
    watchabilityHints: ['Pennant races', 'No-hitter alerts', 'Walk-off potential'],
  },
  {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    color: 'info',
    available: false,
    tagline: 'Strategic bat and ball',
    watchabilityHints: ['Test match tension', 'T20 fireworks', 'Historic rivalries'],
  },
  {
    id: 'lacrosse',
    name: 'Lacrosse',
    icon: '🥍',
    color: 'neutral',
    available: false,
    tagline: 'The fastest game on two feet',
    watchabilityHints: ['College showdowns', 'Championship runs', 'Goal fests'],
  },
  {
    id: 'formula1',
    name: 'Formula 1',
    icon: '🏎️',
    color: 'error',
    available: true,
    tagline: 'The pinnacle of motorsport',
    watchabilityHints: ['Championship battles', 'Street circuit chaos', 'Weather wildcards'],
  },
  {
    id: 'cycling',
    name: 'Pro Cycling',
    icon: '🚴',
    color: 'warning',
    available: true,
    tagline: 'Grand Tours and Monuments',
    watchabilityHints: ['Mountain stages', 'GC shake-ups', 'Sprint finishes'],
  },
];

/** Sports categories for future filtering/grouping */
export type SportCategory = 'team' | 'individual' | 'racing';

export const SPORT_CATEGORIES: Record<string, SportCategory> = {
  'ice-hockey': 'team',
  'american-football': 'team',
  'association-football': 'team',
  'basketball': 'team',
  'baseball': 'team',
  'cricket': 'team',
  'lacrosse': 'team',
  'tennis': 'individual',
  'formula1': 'racing',
  'cycling': 'racing',
};
