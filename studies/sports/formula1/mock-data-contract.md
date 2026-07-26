# Formula 1 Mock Data Contract

## Purpose

`mock-events.json` supports UI/UX exploration before production feeds exist. It is intentionally denormalized for fixtures and must not become the provider-domain model.

## Envelope

Every record contains:

- `schemaVersion`, `id`, `source: "MOCK"`, and `fictional: true`.
- `variant`: `PRE_EVENT`, `LIVE_SAFE`, `COMPLETED_HIDDEN`, or `REVEALED`.
- `knowledgeAsOf` and `spoilerLevel`.
- `event`: identity, weekend/session context, schedule, and lifecycle state.
- `recommendation`: tier, format, approximate minutes, reasons, traits, confidence, and missing inputs.
- `safeContext`: information permitted in that variant.
- `protectedOutcome`: absent/null unless `variant === "REVEALED"`.

Fixtures use invented “Aurora Grand Prix,” drivers, constructors, circuit, timings, and standings. They must never be mixed with production analytics or shown without a Mock badge in internal prototypes.

## Reveal boundary

`COMPLETED_HIDDEN` may carry an internal recommendation band to exercise UI, but no winner, finishing order, actual duration, flags, weather occurrence, retirements, overtakes, points change, or structural reason. `protectedOutcome` is `null`. A real API should fetch the protected payload through a separately authorized operation rather than deliver and hide it.

`LIVE_SAFE` includes only facts known before start plus neutral lifecycle text. It deliberately excludes current running order, elapsed laps, incidents, and a post-start score. The safe UI may say “In progress; details protected.”

`REVEALED` exercises outcome UI and contains classification, event-shape metrics, derived features, explanations, and recommended chapters. Mock chapter timestamps are illustrative, not broadcast availability.

## MVP field set

Required for initial prototypes:

- Session/weekend identity, type, format, UTC schedule/status, circuit label.
- Ruleset/season/round and pre-session standings snapshot.
- Explicit followed participants and pre-session importance band/reasons.
- Spoiler mode and variant.
- Recommendation format/band, confidence, and approximate minutes where safe.
- Two explanation strings selected from field-backed reason codes.
- Source, fictional marker, observation time, and missing inputs.

For completed analysis, the minimum protected calculation inputs are classification checkpoints, timestamped gaps/positions, grid, pit/tyre timeline, track-status/race-control events, weather state, and final/provisional classification.

## Extended field set

- Lap/sector/speed observations and confidence.
- Attributed pass/position-change events.
- Tyre age and stint state, pit-loss estimates, strategy alternatives.
- Qualifying attempts, cut lines, deleted/aborted laps.
- Championship simulations and model distributions.
- Viewer-specific feature weights and feedback history.
- Broadcast products, territory, verified duration, and chapter mapping.
- Steward revision/appeal state and correction history.

## UI rules

- Treat `recommendation.approxMinutes` as estimated when `minutesEstimated` is true.
- Render `confidence` qualitatively; surface `missingInputs` when material.
- Use `reasonCodes` to select vetted localized copy; strings are prototype copy only.
- Never build a thumbnail, accessible label, URL, telemetry event, or notification from `protectedOutcome` while hidden.
- Do not compare score numbers across session types until calibrated.
- The same session ID across variants represents lifecycle snapshots, not duplicate events.

## Contract checks

- Every object has `source === "MOCK"` and `fictional === true`.
- `PRE_EVENT`, `LIVE_SAFE`, and `COMPLETED_HIDDEN` have `protectedOutcome === null`.
- Only `REVEALED` may contain `winner`, `classification`, `actualDurationMinutes`, or observed incident/strategy fields.
- Timestamps are ISO 8601 UTC and numbers are finite.
- Feature values/confidence/coverage stay in `[0,1]`.
- Safe reasons cannot contain participant result verbs or structural-event terms.
