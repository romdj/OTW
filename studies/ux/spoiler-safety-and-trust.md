# Spoiler Safety and Recommendation Trust

## Evidence and design position

Spoiler studies conflict. Early short-story experiments found neutral or increased enjoyment after spoilers ([Leavitt & Christenfeld](https://pubmed.ncbi.nlm.nih.gov/21841150/)), while later work found reduced enjoyment for television and some spoiler timings/types ([Daniel & Katz](https://journals.sagepub.com/doi/10.1177/0033294118793971); [Johnson & Rosenbaum summary](https://eric.ed.gov/?id=EJ1112914)). Involvement and medium can moderate effects ([Rosenbaum & Johnson](https://www.tandfonline.com/doi/abs/10.1080/15213269.2017.1338964)).

**Conclusion:** do not argue that spoilers are harmless. User autonomy and perceived violation matter even if average enjoyment effects are uncertain. OTW’s stricter modes are a product contract.

Explainable recommender research associates explanations with transparency, effectiveness, and trust, but persuasive explanations can differ from faithful ones ([explainable recommendation survey](https://arxiv.org/abs/1804.11192)). Scrutability—letting users inspect and correct the basis—is a stronger goal than maximizing acceptance ([Balog & Radlinski](https://doi.org/10.1145/3605357)).

## Threat model: information leakage

A spoiler is not only a final result. Protect against:

- **Direct:** score, winner, podium, eliminated player, bracket/series advancement.
- **Structural:** match/race duration, set count, overtime/shootout, retirement/DNF, safety-car count.
- **Evaluative:** “classic,” “comeback,” “upset,” “dominant,” score/tier, emotional profile.
- **Visual:** winner-centered thumbnail, celebration, dejected participant, trophy.
- **Navigational:** changed standings, next-round opponent, record badges, event ordering.
- **External:** URL slug, provider page title, notification preview, share metadata, analytics event names.

The strongest mode must treat even recommendation rank as a weak spoiler. Offer an optional **Blind plan**: formats and ordering derived mainly from pre-event affinity/context, with post-event quality hidden until the user opts in.

## Protection model

| Mode | Allowed | Hidden |
|---|---|---|
| No hints | Identity, pre-event context, personal relevance, availability | All post-event evaluative, structural, and outcome data |
| Light context | Above plus broad non-outcome reason such as “strong match for your preferences” | Scores, outcomes, event shape, explicit emotional tags |
| Results allowed | Full recommendation and result | Only details user separately elects to hide |

Do not label any mode “spoiler free” until every field and outbound destination is audited. Protection should be session-visible, adjustable per event, and default to the strictest previously chosen state. Result reveal must be a deliberate button, not an accordion with a large accidental target. Do not allow bulk reveal from a feed without confirmation.

## Trust contract

Each recommendation should answer:

- **Action:** Full replay, condensed/extended highlights, short highlights, or skip.
- **Reason:** at most two faithful, user-relevant factors.
- **Known limits:** incomplete data, low confidence, unavailable provider, estimated duration.
- **Provenance:** event data timestamp and availability source.
- **Control:** “Tune recommendations” and “This was wrong.”

Prefer calibrated language: “Likely a good fit because you follow…” rather than “You’ll love this.” Avoid false precision; use ordered choices or bands unless research proves numeric scores aid decisions.

Feedback must be causal enough to help:

- Recommendation right / wrong.
- Wrong because: format, time estimate, taste, already knew result, replay unavailable, or spoiler.
- Let users view and delete learned preferences.

## Notification consent

Ask only after a user creates a catch-up routine or explicitly requests an alert. Android’s official guidance recommends requesting permissions in context when a feature needs them ([Android permissions guidance](https://developer.android.com/training/permissions/requesting)). Use a pre-permission screen that states exact value and sample protected copy.

Notification controls:

- Morning plan ready / weekend reminder / followed-event reminder.
- Schedule, quiet hours, sport, and spoiler mode.
- Lock-screen preview off by default in No hints mode.
- One-tap pause during travel or a live-event backlog.
- A denial must not block the core product.

Safe example: “Your 45-minute catch-up plan is ready: 3 events.”
Unsafe examples: “Overtime thriller,” “historic upset,” a winner’s image, or a badge count that identifies how many followed teams won.

## Failure response

Treat a spoiler report as a trust incident:

1. Immediately suppress further event details.
2. Capture field, surface, mode, event, provider, and timestamp without asking the user to restate the spoiler.
3. Acknowledge plainly; do not claim the information was technically “safe.”
4. Quarantine the content template/provider field for equivalent events.
5. Report resolution and add the case to a regression corpus.

Primary safety metric: **critical spoiler incidents per 1,000 protected event impressions**, segmented by sport, mode, field, and surface.
