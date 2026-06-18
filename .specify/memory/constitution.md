<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- PRINCIPLE_1_NAME placeholder -> I. Trace-First Educational Flow
- PRINCIPLE_2_NAME placeholder -> II. Domain Engine and UI Separation
- PRINCIPLE_3_NAME placeholder -> III. Interactive Korean Workbench
- PRINCIPLE_4_NAME placeholder -> IV. Code, Query, and Visual Semantics
- PRINCIPLE_5_NAME placeholder -> V. Verified, Reviewable Increments
Added sections:
- Product Scope and Technology Policy
- Development Workflow and Quality Gates
Removed sections:
- Placeholder section tokens from the initial template
Templates requiring updates:
- ✅ updated .specify/templates/plan-template.md
- ✅ updated .specify/templates/spec-template.md
- ✅ updated .specify/templates/tasks-template.md
- ✅ reviewed .specify/extensions/git/commands/*.md
- ✅ reviewed .specify/extensions/agent-context/commands/*.md
Runtime guidance updated:
- ✅ updated README.md
- ✅ updated AGENTS.md
- ✅ updated PROJECT_PLAN.md
- ✅ updated CONCEPT_SPEC.md
Follow-up TODOs: None
-->
# CS Visual Lab Constitution

## Core Principles

### I. Trace-First Educational Flow
Every concept MUST be represented as an ordered trace of explainable steps before UI
rendering is built. A trace step MUST include the current state, the meaningful
highlight metadata, and a Korean learner-facing explanation of why the next action
occurs. Algorithm, data-structure, SQL, network, and operating-system topics MUST
prefer explicit manual traces first; real execution engines, parsers, simulators, or
external libraries MAY be added after the manual learning flow is correct and tested.

Rationale: learners understand a concept by seeing state transitions, not by watching
opaque execution output.

### II. Domain Engine and UI Separation
Concept logic MUST live outside React components in domain-specific algorithms,
engines, or simulators. React components MUST render immutable trace state and MUST
NOT mutate trace progress or contain algorithm decisions. Each concept area MUST keep
its own `types.ts`, algorithm or engine module, components, code examples, and tests.
A task MUST NOT implement multiple concept domains unless the specification explicitly
marks shared infrastructure as the goal.

Rationale: pure trace generation keeps learning behavior testable and lets UI evolve
without changing concept correctness.

### III. Interactive Korean Workbench
Learning pages MUST be Korean-first except for programming language syntax, SQL
keywords, protocol names, and other established English terms. Each workbench MUST
support manual stepping; automatic play and semi-automatic guided modes SHOULD be
provided when they clarify the concept. On desktop layouts, the interaction stage,
current explanation, code or query panel, and primary Next control MUST remain in one
visible workbench. Controls MUST be stable, readable, and predictable across states.

Rationale: the product is an interactive learning site, so navigation and explanation
must stay close to the changing state.

### IV. Code, Query, and Visual Semantics
Algorithm and data-structure examples MUST provide C, C++, Java, Python, and
JavaScript code when code is part of the lesson. The currently active step MUST map to
highlighted code lines in the selected language. SQL lessons MUST keep the active
query, relevant input tables, intermediate table changes, and final result visible in
one workbench, and SQL topics such as JOIN, GROUP BY, UNION, ORDER BY, and LIMIT MUST
be separated into teachable operations. Visual legends MUST show only meaningful
states for the current visualization, and active states MUST use distinct colors.

Rationale: code, query, and visualization are separate explanations of the same state
transition and must stay synchronized.

### V. Verified, Reviewable Increments
Every concept change MUST be small enough to review as a single learning slice. Trace
generation MUST have unit tests, and visual components MUST test controls and key
learner-facing labels. `npm run build` MUST pass before a task is considered done;
`npm run test` MUST pass when tests are added, changed, or relevant to the touched
concept. New dependencies or non-default technologies MUST be justified in the plan by
how they improve correctness, clarity, performance, or maintainability.

Rationale: educational regressions are easiest to catch at the trace level, and small
changes prevent unrelated domains from coupling accidentally.

## Product Scope and Technology Policy

CS Visual Lab teaches computer science concepts through step-by-step visual execution.
The product scope includes, but is not limited to, data structures, algorithms, SQL
query behavior, network communication, and operating-system behavior. SQL coverage MUST
include operation-specific lessons for GROUP BY, UNION, JOIN, ORDER BY, LIMIT, and
other operations when they are introduced.

The current application uses React, TypeScript, Vite, React Router, Vitest, and
SVG-first visualization. These are implementation defaults, not constitutional limits.
Python, JavaScript, WebAssembly, Canvas, WebGL, parser libraries, graph/layout engines,
SQL engines, animation libraries, or other external libraries MAY be used when the plan
explains the learning value and isolates the dependency from trace correctness. SVG
SHOULD remain the first choice for inspectable 2D visuals; Canvas or other rendering
technologies MAY be used when SVG becomes insufficient for scale, performance, or
interaction quality.

## Development Workflow and Quality Gates

Specifications MUST define one independently testable learning slice at a time. Plans
MUST identify the concept domain, trace model, interaction mode, visualization states,
code or query presentation, technology choices, and test strategy. Tasks MUST separate
trace tests, trace implementation, UI rendering, code/query examples, styling, and
verification.

A task is complete only when the requested learning behavior works, scope did not
expand unexpectedly, relevant tests are added or updated, build passes, and the final
response summarizes changed files, commands run, and remaining risks.

## Governance

This constitution supersedes conflicting project guidance for Spec Kit planning and
implementation. Amendments MUST update this file, include a Sync Impact Report, and
propagate any changed rules to dependent templates and runtime guidance. Versioning
uses semantic versioning: MAJOR for incompatible governance or principle changes,
MINOR for added or materially expanded principles or sections, and PATCH for wording
or clarification changes. Every plan, task list, and implementation review MUST check
compliance with the Core Principles before work is considered ready.

**Version**: 1.0.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-18
