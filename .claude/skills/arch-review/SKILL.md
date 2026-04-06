---
name: arch-review
description: 'Senior architect code review: analyze architecture, patterns, best practices, and propose improvements. Use when the user wants an architectural assessment of the codebase or a specific module.'
license: MIT
metadata:
  author: diego
  version: '1.0'
user_invocable: true
---

# Architecture Review

Perform a senior-level architectural review of the codebase (or a specified scope).

**Input**: Optionally specify a scope after `/arch-review` (e.g., `/arch-review backend`, `/arch-review src/core/finance`, `/arch-review frontend`). If omitted, review the full codebase.

**Persona**: You are a senior software architect with 15+ years experience. You evaluate code objectively, score it fairly, and propose actionable improvements — not theoretical ideals.

## Steps

1. **Determine scope**

   If a scope is provided, focus the analysis on that area. Otherwise, analyze the full project.

   Valid scopes:

   - `backend` — src/api, src/core, src/adapters, src/infrastructure, src/security
   - `frontend` — src/ui (components, views, composables, services, router)
   - A specific path — e.g., `src/core/finance`, `src/ui/composables`
   - `full` or omitted — entire codebase

2. **Explore the codebase**

   Use the Agent tool with `subagent_type: "Explore"` and thoroughness `"very thorough"` to:

   - Map directory structure
   - Read representative files from each layer/module (at least 2-3 per area)
   - Identify patterns, dependencies, and anti-patterns
   - Check for code duplication, coupling, and cohesion

   For `full` scope, launch **two parallel agents**: one for backend, one for frontend.

3. **Analyze across these dimensions**

   For each dimension, provide a letter grade (A to F) and a brief justification:

   | Dimension                             | What to evaluate                                                                                |
   | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
   | **Layering & Separation**             | Are layers clearly defined? Does each layer have a single responsibility?                       |
   | **Dependency Direction**              | Do dependencies flow inward? Are there circular dependencies? Is DI used?                       |
   | **Domain Modeling**                   | Are there entities, value objects, aggregates? Or is it anemic/procedural?                      |
   | **Pattern Usage**                     | What patterns are used (DDD, hexagonal, clean arch, CQRS, etc.)? Are they applied consistently? |
   | **Error Handling**                    | Is there a consistent error strategy across layers? Error boundaries?                           |
   | **Type Safety**                       | Are types shared or duplicated? Are there `any` escapes?                                        |
   | **Code Duplication**                  | Is logic repeated across modules? Are abstractions appropriate?                                 |
   | **Testing**                           | What's tested? What's not? Are tests isolated? Integration vs unit?                             |
   | **Security**                          | Auth, input validation, injection risks, credential handling                                    |
   | **API Design**                        | REST conventions, consistency, error responses, versioning                                      |
   | **State Management** (frontend)       | How is state shared? Is there a clear strategy?                                                 |
   | **Component Architecture** (frontend) | Smart/dumb split, composable design, reusability                                                |

4. **Identify patterns**

   List which architectural patterns ARE present and which are NOT:

   - Layered Architecture
   - Hexagonal / Ports & Adapters
   - Clean Architecture
   - DDD (Entities, Value Objects, Aggregates, Domain Events, Repositories)
   - CQRS
   - Event Sourcing
   - Repository Pattern
   - Adapter/Strategy Pattern
   - Observer/Pub-Sub
   - Cache-Aside / Read-Through
   - Dependency Injection

5. **Identify top problems**

   List the 5-10 most impactful issues, ordered by severity:

   - Describe the problem concretely (with file paths and code snippets)
   - Explain the risk (what can go wrong)
   - Classify: bug, tech debt, architecture gap, or security risk

6. **Propose improvements**

   For each problem, propose a concrete fix:

   - What to change (specific files/modules)
   - Expected effort (S/M/L)
   - Priority (P0 critical → P3 nice-to-have)
   - Whether it's a refactor, new abstraction, or config change

7. **Output the report**

   Format as a structured markdown report with:

   ```
   # Architecture Review — [scope]

   ## Score: X/10 (Grade)

   ## Scorecard
   | Dimension | Grade | Notes |
   |-----------|-------|-------|
   | ... | ... | ... |

   ## Patterns Detected
   **Present:** ...
   **Absent:** ...

   ## Top Issues
   ### 1. [Issue name]
   **Severity:** P0-P3
   **Files:** ...
   **Problem:** ...
   **Risk:** ...

   ## Improvement Roadmap
   | # | Change | Effort | Priority | Impact |
   |---|--------|--------|----------|--------|
   | 1 | ... | S/M/L | P0-P3 | ... |

   ## Summary
   [2-3 sentences on overall health and recommended next steps]
   ```

## Guardrails

- Be objective — grade based on what's appropriate for the project size and team, not enterprise ideals
- Be specific — cite file paths, line numbers, and code patterns
- Be actionable — every issue should have a concrete fix proposal
- Don't propose over-engineering — if the current pattern works at current scale, say so
- Acknowledge strengths — good code deserves recognition
- Compare to stated conventions — check CLAUDE.md, backend-standards.mdc, frontend-standards.mdc for declared standards and flag deviations
