# Provider Contract Design Spec

Date: 2026-05-03
Domain: scoreline.site
Status: Approved draft for implementation planning

## Purpose

Scoreline needs a stable sports provider boundary before it grows more sync jobs and more sports. The public app should never depend on provider-specific payloads, field names, or edge-case behavior. Instead, the domain should expose a normalized contract for competitions, teams, fixtures, results, standings, and live event state, and each provider adapter should map into that contract.

The first implementation slice will support soccer through API-Football, but the contract itself must be broad enough to support the rest of the launch sports without rework.

## Goals

- Define a provider-agnostic sports data contract in the domain layer.
- Normalize provider payloads into stable internal models.
- Keep provider-specific details behind adapters.
- Start with API-Football soccer support as the first real adapter.
- Make missing or partial provider data degrade gracefully instead of crashing sync jobs.
- Make the contract easy to test with recorded payload fixtures.

## Out Of Scope

- Public routes or UI for sports data.
- Provider retry, rate-limit, or HTTP client sophistication beyond the adapter boundary.
- Multi-provider fallback logic.
- Paid provider upgrade wiring.
- Full sync job orchestration beyond a thin adapter consumer.

## Architecture

The domain layer will define a normalized provider contract that expresses what Scoreline needs, not what any external API happens to return. The contract should cover:

- competitions and tournaments
- seasons
- teams
- fixtures and events
- results and scores
- standings
- venue references when available
- live status and kickoff metadata

Each adapter will:

- accept a provider response or request context
- map provider payloads into normalized records
- preserve provider IDs and raw snapshot metadata where useful for debugging
- return structured data that the rest of the app can consume without provider branching

The first concrete adapter will be API-Football soccer. It should prove the contract shape with enough surface area to support upcoming sync jobs for fixtures, live scores, results, and standings.

## Contract Shape

The shared contract should favor small, explicit types over a single giant record. The important principle is that each normalized record can stand on its own and be compared in tests.

The initial contract should include:

- `ProviderCompetition`
- `ProviderSeason`
- `ProviderTeam`
- `ProviderVenue`
- `ProviderFixture`
- `ProviderStanding`
- `ProviderSnapshot`

The contract should preserve:

- stable internal IDs or provider mappings when known
- canonical slugs where the domain already has them
- timestamps in UTC
- source/provider metadata
- a minimal raw snapshot reference or payload for debugging

The contract should avoid:

- provider-specific field names in the public shape
- optional nesting that only exists for one provider
- forcing every sport into one competition model if the shape does not fit

## First Implementation Slice

The first slice will implement:

- domain types for provider contract records
- an API-Football soccer adapter module
- a recorded-payload mapping test for competitions and fixtures
- a thin adapter consumer stub that proves the contract can be used by sync jobs later

This slice is intentionally narrow. Its job is to make the boundary real and testable, not to build every sync job at once.

## Error Handling

Provider adapters should fail in two distinct ways:

- hard failures for malformed or unusable payloads
- soft degradation for missing optional fields

If a provider omits a noncritical field like venue name or a secondary status label, the adapter should still produce a usable normalized record. If a payload is structurally invalid or missing the minimum fields needed to identify the entity, the adapter should reject it clearly so the calling job can retry or log the failure.

## Testing

Tests should cover:

- normalized type shape and exported contract helpers
- soccer payload mapping from recorded provider examples
- graceful handling of missing optional fields
- stable mapping of IDs, timestamps, and status values

The first tests should be fixture-driven and deterministic. They should prove that the adapter produces the same normalized output for the same source payload, regardless of irrelevant provider field ordering or extra noise.

## Implementation Notes

- Keep the contract in the domain layer, not in the API route layer.
- Use explicit mappers for each provider entity instead of one giant transform.
- Prefer readable normalization code over clever generic helpers.
- Do not let the adapter reach into public routes or page rendering.
- Treat raw payload storage as an adapter concern, not a public API concern.

## Success Criteria

This design is ready when:

- the domain has a clear provider contract surface
- API-Football soccer can be mapped into that surface
- tests pin the normalized output
- the rest of the job system can consume the contract without provider branching

