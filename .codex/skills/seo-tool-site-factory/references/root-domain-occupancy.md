# Root-Domain Occupancy Rule

Use this rule during keyword research and recommendation ranking after Bing Webmaster Top 5 competitor rows are captured.

## Purpose

Search volume and weak pages are not enough. If Bing Top 5 already contains independent root domains whose names strongly match the keyword, the SERP has likely been claimed by exact-match or partial-match tool sites.

For future recommendations, prioritize weak-competition keywords with zero strongly keyword-matching root domains in Bing Top 5.

## Strong Root-Domain Match

Mark a Bing Top 5 root domain as strongly related when any of these are true:

- The root domain directly contains the keyword core phrase.
- The root domain is a hyphenated version of the keyword.
- The root domain is a close lexical variant of the keyword.
- The domain clearly exists as a dedicated exact-match or partial-match tool site for that keyword.

Example:

```text
Keyword: board foot calculator

Strong matching root domains:
- boardfootcalculator.cc
- board-foot-calculator.org
- board-footcalculator.com
```

This has three occupied root-domain slots and should not be prioritized.

## Occupancy Decision

```text
0 strong root-domain matches:
  Occupancy decision: open
  Recommendation: preferred weak-competition keyword

1 strong root-domain match:
  Occupancy decision: partially occupied
  Recommendation: caution; recommend only if competitor UX is weak and differentiation is clear

2 strong root-domain matches:
  Occupancy decision: occupied
  Recommendation: avoid as first choice

3+ strong root-domain matches:
  Occupancy decision: heavily occupied
  Recommendation: do not recommend by default
```

## Opportunity Score

Use this scoring component in `keyword-intent.md`:

```text
Root-domain availability: 15 max

15: Bing Top 5 has 0 strong keyword-matching root domains.
8: Bing Top 5 has 1 strong keyword-matching root domain.
3: Bing Top 5 has 2 strong keyword-matching root domains.
0: Bing Top 5 has 3+ strong keyword-matching root domains.
```

## Required Research Fields

Add this section to competitor research:

```text
Root-domain occupancy:
- Strong keyword-matching root domains in Bing Top 5:
- Matching domains:
  - <domain> - <reason>
- Occupancy decision: open / partially occupied / occupied / heavily occupied
- Recommendation impact: recommended / caution / avoid
```

Add this section to keyword intent:

```text
Root-domain availability score:
Root-domain rule decision: pass / caution / fail
```

## Recommendation Rule

When the user asks which keywords to do next, list only zero-occupancy keywords by default. If no zero-occupancy keywords exist, clearly label any recommended fallback as higher risk and explain the root-domain occupancy.
