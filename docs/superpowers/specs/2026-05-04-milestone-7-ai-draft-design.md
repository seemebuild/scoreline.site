# Milestone 7 AI Draft Design Spec

Date: 2026-05-04
Domain: scoreline.site
Status: Draft for implementation planning

## Purpose

Scoreline needs a safe, auditable AI draft workflow that helps editors turn verified source material into article drafts without weakening the site's trust posture. The AI layer should generate draft editorial packages from stored editorial sources, validate the output, and save the result into a dedicated review queue for studio review.

The first implementation must be narrow and review-only. It should not auto-publish content, accept arbitrary URLs, or blur the boundary between editorial source material and generated copy.

## Goals

- Define a narrow AI draft provider contract in the domain layer.
- Generate draft packages from stored editorial source records only.
- Validate AI input and output before any draft is saved.
- Save generated drafts into a dedicated `ai-drafts` review queue.
- Keep the existing job system responsible for retries, logging, and execution auditability.
- Make the workflow easy to test with deterministic fixtures and provider mocks.

## Out Of Scope

- Auto-publishing generated drafts.
- Direct human-written article editing inside the AI provider flow.
- Arbitrary URL ingestion from the request path or browser UI.
- Multi-provider AI fallback logic.
- Real-time chat or conversational drafting UI.
- Search, ranking, or SEO optimization beyond the editorial surfaces already in place.

## Architecture

The AI workflow will sit beside the existing editorial content model and reuse the job system already in place.

The domain layer will define a small AI draft contract that expresses what the system needs, not what a provider happens to return. That contract should cover:

- draft variant
- prompt source material
- target topic or article angle
- source references
- generated draft output
- provider identity and metadata

The job runner will orchestrate the flow:

1. Load the stored editorial source records referenced by the job.
2. Build a provider prompt from the sources and requested draft variant.
3. Call the AI provider through a narrow adapter contract.
4. Validate the provider response.
5. Save the resulting draft into a dedicated `ai-drafts` queue for studio review.

The studio surface will later consume that queue, but the first slice should focus on generating and persisting the draft record cleanly.

## Contract Shape

The contract should stay intentionally small and explicit. The first AI layer should include:

- `AiDraftVariant`
- `AiDraftSource`
- `AiDraftInput`
- `AiDraftOutput`
- `AiDraftProvider`

The first provider implementation should:

- accept a structured prompt input
- require stored editorial source references
- reject unsupported or risky inputs
- return a normalized draft package with:
  - headline
  - summary
  - body
  - suggested category
  - source URLs

The output should be plain and reviewable. The system should not try to infer missing editorial intent beyond the structured input provided by the job.

## Draft Queue Model

The dedicated `ai-drafts` review queue should store generated draft packages separately from publish-ready news content.

Each review item should preserve:

- the source record references used for generation
- the AI provider name and generation metadata
- the requested draft variant
- the draft headline, summary, and body
- the suggested category when present
- creation timestamps and review state

The queue is not the publish target. It is a holding area for editor review, refinement, and later promotion into the editorial content model.

## Guardrails

The first version should enforce the following rules:

- only editorial source URLs already stored in the system may be used
- no arbitrary URL input in the generation request
- no betting or gambling language in generated drafts
- no auto-publish behavior
- no silent correction of malformed AI output

If the provider output is missing required fields or violates the validation rules, the job should fail clearly and be eligible for retry through the existing job infrastructure.

## Error Handling

AI failures should be classified into two groups:

- hard failures for missing sources, unsupported variants, or malformed output
- soft failures for transient provider issues or rate limits

Hard failures should be logged and surfaced as job failures. Soft failures should use the existing job retry/backoff machinery. The AI layer itself should not invent retry policy; it should return clear errors that the job runner can classify.

## Testing

Tests should cover:

- prompt construction from editorial sources
- AI draft input validation
- AI draft output validation
- provider adapter behavior with mocked responses
- rejection of unsupported inputs or unsafe output
- persistence of generated drafts into the dedicated review queue

The first tests should be deterministic and fixture-driven. They should prove that a given source set produces a stable prompt and a stable validated draft shape.

## Implementation Notes

- Keep the AI provider boundary in the domain layer, not in the route layer.
- Reuse the existing job queue and logging infrastructure.
- Store generated drafts separately from publish-ready editorial content.
- Treat source records as the only authoritative input to the first version.
- Prefer readable validation code over loosely typed parsing helpers.

## Success Criteria

This design is ready when:

- the domain has a clear AI draft provider contract
- stored editorial sources can be turned into validated draft packages
- generated drafts land in a dedicated review queue
- the workflow remains review-only and auditable
- tests pin prompt creation, validation, and persistence behavior
