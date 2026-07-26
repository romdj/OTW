# OTW Watchability Scoring Study

This study defines a transparent v0 methodology for converting qualitative event tags into a historical **Event Watchability Score**. It is deliberately separate from personal fit and viewing recommendations:

```text
event evidence → qualitative tags → dimension scores → watchability score
watchability profile × user preferences → personal fit
fit + time + availability + spoiler mode → viewing recommendation
```

The methodology is documented in [methodology-v0.md](methodology-v0.md), including:

- aggregation alternatives and trade-offs;
- the recommended robust top-four power-mean formula;
- tag and dimension taxonomy;
- evidence, confidence, missingness, and normalization rules;
- score lifecycle, versioning, calibration, and bias audits;
- worked F1, tennis, and NHL examples;
- the tactical 0–0/masterclass principle.

## Decision summary

Use a **confidence-adjusted, rank-weighted power mean over at most four active dimensions**, with a support factor, evidence caps, and tightly bounded interaction bonuses. This treats watchability as the magnitude of demonstrated positive qualities: absent or irrelevant attributes do not enter the denominator. A lone high or low-confidence signal cannot produce an elite score.

Do not use a plain arithmetic mean across the full taxonomy, a raw Euclidean norm, the maximum tag, or an opaque learned score in v0. Preserve the complete score recipe, inputs, confidence, model version, and correction history with every published value.
