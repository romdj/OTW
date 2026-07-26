# Shared Event Envelope

## Recommended contract

```ts
type Sport =
  | 'AMERICAN_FOOTBALL' | 'ASSOCIATION_FOOTBALL' | 'BASKETBALL'
  | 'CYCLING' | 'FORMULA_1' | 'HANDBALL' | 'ICE_HOCKEY'
  | 'MOTOGP' | 'RALLY' | 'SUPERBIKE' | 'TENNIS' | 'VOLLEYBALL';

type Lifecycle = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'DELAYED'
  | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED' | 'ABANDONED' | 'PROVISIONAL';
type Disclosure = 'PRE_EVENT' | 'LIVE_SAFE' | 'COMPLETED_HIDDEN' | 'REVEALED';
type SpoilerMode = 'NO_HINTS' | 'LIGHT_CONTEXT' | 'RESULTS_ALLOWED';
type ViewingFormat =
  | 'FULL' | 'CONDENSED' | 'FINAL_PHASE' | 'HIGHLIGHTS'
  | 'RECAP' | 'SKIP' | 'QUEUE';
type Band = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

type Confidence = {
  value: number;                 // [0,1], internal/diagnostic
  band: 'LOW'|'MEDIUM'|'HIGH';
  coverage?: number;             // [0,1], observations available
  missingInputs: string[];
  modelVersion?: string;
};

type QualitativeDimensionKey =
  | 'SUSPENSE' | 'ACTION_DENSITY' | 'INTENT_PROGRESSION'
  | 'VOLATILITY' | 'TACTICAL_TENSION' | 'EXPRESSIVE_SKILL'
  | 'FLOW' | 'ADVERSITY_RECOVERY' | 'STAKES_NARRATIVE'
  | 'NOVELTY_HISTORIC' | 'PERSONAL_RELEVANCE';

type QualitativeProfile = {
  disclosure: 'PROTECTED'|'REVEALED';
  dataGrade: 'G0_IDENTITY'|'G1_SUMMARY'|'G2_EVENT_STREAM'
    | 'G3_STATE_STREAM'|'G4_TRACKING_CONTEXT'|'G5_HUMAN_AUGMENTED';
  dimensions: Partial<Record<QualitativeDimensionKey, {
    band: Band;
    confidence: Confidence;
    evidenceCodes: string[];
    factIds: string[]; // supports attribution caps and double-count audits
  }>>;
  composites: {
    competitiveness?: Band;
    eventfulness?: Band;
    aestheticQuality?: Band;
    importance?: Band;
  };
  modelVersion: string;
};

type SharedEvent<TSport extends Sport> = {
  schemaVersion: '1.0.0';
  id: string;
  sport: TSport;
  source: 'MOCK';
  fictional: true;
  sourceStudy: string;
  sourceMockId: string;
  knowledgeAsOf: string;
  lifecycle: Lifecycle;
  disclosure: Disclosure;
  spoilerMode: SpoilerMode;
  identity: {
    title: string;
    competition: string;
    contextLabel: string;
    scheduledStartUtc: string;
  };
  hierarchy: {
    kind: 'STANDALONE'|'CHILD';
    parentId?: string;
    parentKind?: string;
  };
  rules: { profileId: string };
  recommendation: {
    basis: 'PRE_EVENT_ONLY'|'POST_EVENT_PROTECTED'|'POST_EVENT_REVEALED';
    importanceBand: Band;
    watchabilityBand?: Band;
    format: ViewingFormat;
    estimatedMinutes?: number;
    reasonCodes: string[];
    safeReasons: string[];
    confidence: Confidence;
  };
  affinity: Array<{ entityId: string; entityType: string; label: string }>;
  qualitativeProfile?: QualitativeProfile;
  sportDetails: SportDetailsBySport[TSport];
  protectedOutcome?: RevealedOutcomeBySport[TSport];
  provenance: {
    provider: 'MOCK';
    generatedAt: string;
    isSynthetic: true;
  };
};
```

## Why each field converges

- `id`, `sport`, `source`, timestamps, and provenance exist across every study, although names differ.
- Every study separates pre-event importance from outcome-informed watchability and requires confidence/missingness.
- Every study needs a recommended viewing format and safe reasons.
- Every sport has a lifecycle, rules version, competition context, participants/affinity, and some hierarchy—even when the hierarchy is trivial.
- Every study forbids outcome/structural details in strict views.

No universal `homeTeam`, `score`, `duration`, `round`, `clock`, or `standing` belongs here.

The qualitative dimension vocabulary converges as questions, not raw measurement. See [Qualitative watchability](qualitative-watchability.md). Operational inputs, baselines, thresholds, and available dimensions remain sport-calibrated. `qualitativeProfile` must be omitted from strict safe payloads when it uses post-event evidence.

## Lifecycle normalization

Source fixtures use `PRE_GAME`, `PRE_MATCH`, `PRACTICE_PRE`, `COMPLETED_PROTECTED`, session-specific variants, and other names. Normalize two independent axes:

- `lifecycle` describes official operational state.
- `disclosure` describes what this payload is allowed to reveal.

Do not overload lifecycle with UI authorization. A completed event can be `COMPLETED_HIDDEN` or `REVEALED`; a live event can be strict `LIVE_SAFE` or a future opted-in live payload.

`PROVISIONAL` belongs to lifecycle when classification is awaiting official correction. `REVEALED` does not imply finality. Cancelled/abandoned disposition may itself be structurally protected under a sport study; safe UI can use a neutral unavailable state until authorized.

## Recommendation semantics

- `importanceBand`: pre-event consequence and personal relevance; always computed with a temporal cutoff.
- `watchabilityBand`: observed reward estimate; omit in strict completed mode, never send `null` to mean both “unknown” and “hidden.”
- `basis`: proves the temporal/disclosure boundary used.
- `format`: best use of time; it is independent from availability.
- `estimatedMinutes`: optional because actual/estimated duration can leak structure. Omit when unsafe.
- `reasonCodes`: stable localization/analytics identifiers. `safeReasons` are vetted rendering copy, not generated from arbitrary metrics.
- `confidence`: epistemic/data confidence, not recommendation strength.

Bands must be calibrated within sport/format cohorts before cross-sport ranking. Until then, use user-specific utility or pre-event importance—not raw analytical scores—to build a mixed-sport plan.

## Optionality rules

1. Omitted means unavailable or unauthorized; `null` is reserved for an explicit domain value only where meaningful.
2. Required card fields never depend on protected data.
3. `watchabilityBand` is permitted only for `POST_EVENT_PROTECTED` when Light Context explicitly allows ranking leakage, or `POST_EVENT_REVEALED`; absent in No Hints.
4. `protectedOutcome` exists only when disclosure is `REVEALED`.
5. `estimatedMinutes` requires `format` and an estimation/availability distinction in details or UI copy.
6. `parentId` and `parentKind` are both required for `CHILD`.
7. Confidence without coverage is allowed for pre-event editorial/context models; outcome metrics should carry coverage.
8. `knowledgeAsOf` and rules profile are required so standings, routes, entrants, and formats cannot be silently updated with outcome-leaking state.
9. A qualitative dimension is omitted when unsupported; never encode missing evidence as `LOW`.
10. Post-event qualitative profiles require `REVEALED`, except a separately consented Light Context payload whose individual dimensions remain hidden.
11. `factIds` are required for computed dimension contributions so one observation cannot be rewarded repeatedly without attribution review.

## Provenance and traceability

The mock catalog uses `sourceStudy` and `sourceMockId` to trace adaptations. Production provenance will need provider record ID, fetched/effective timestamps, correction/version state, license class, and stale status; those are intentionally deferred rather than invented here.
