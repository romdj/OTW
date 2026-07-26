export type DisclosureMode = 'no-hints' | 'guidance' | 'full-story';
export type TimeBudget = 15 | 30 | 60 | 120;
export type SportAccent = 'racing' | 'tennis' | 'hockey';

type EventBase = {
  id: string;
  sport: string;
  accent: SportAccent;
  context: string;
  title: string;
  dateLabel: string;
  format: 'Full replay' | 'Condensed' | 'Highlights' | 'Recap';
  estimatedMinutes: number;
  availability: 'available' | 'unavailable' | 'postponed';
  availabilityLabel: string;
};

export type NoHintsEvent = EventBase & {
  projection: 'no-hints';
  preEventReason: string;
};

export type GuidanceEvent = EventBase & {
  projection: 'guidance';
  score: number;
  scoreBand: string;
  percentile?: string;
  fit: string;
  safeReasons: string[];
  confidence: 'High' | 'Medium' | 'Low';
};

export type FullStoryEvent = EventBase & {
  projection: 'full-story';
  score: number;
  scoreBand: string;
  percentile?: string;
  fit: string;
  safeReasons: string[];
  confidence: 'High' | 'Medium' | 'Low';
  result: string;
  analysis: string;
  dimensions: Array<{ label: string; value: number; band: string }>;
};

export type PlanEvent = NoHintsEvent | GuidanceEvent | FullStoryEvent;

export type ViewingPlanResponse = {
  mode: DisclosureMode;
  budgetMinutes: TimeBudget;
  generatedAt: string;
  totalMinutes: number;
  headline: string;
  plan: PlanEvent[];
  excluded: PlanEvent[];
};

export type FeedbackReason = 'Great pick' | 'Wrong format' | 'Not my taste' | 'Too long' | 'Spoiler issue';
