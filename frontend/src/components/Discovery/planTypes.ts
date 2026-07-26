export type DisclosureMode = 'no-hints' | 'guidance' | 'full-story';

export type Sport = 'Formula 1' | 'Tennis' | 'NHL';

export type ViewingFormat = 'Full replay' | 'Condensed' | 'Highlights' | 'Recap';

export type PlanEvent = {
  id: string;
  sport: Sport;
  accent: 'racing' | 'tennis' | 'hockey';
  competition: string;
  context: string;
  title: string;
  dateLabel: string;
  score: number;
  scoreBand: 'Exceptional' | 'Excellent' | 'Very good';
  percentile: string;
  fit: 'Great fit' | 'Good fit';
  format: ViewingFormat;
  minutes: number;
  safeReason: string;
  guidanceTraits: string[];
  result: string;
  fullReason: string;
  dimensions: Array<{
    label: 'Competitiveness' | 'Eventfulness' | 'Aesthetic quality' | 'Importance';
    value: number;
    band: 'Exceptional' | 'High' | 'Medium';
  }>;
  preEventRank: number;
  guidanceRank: number;
  fullStoryRank: number;
};

export type TimeBudget = 15 | 30 | 60 | 120;
