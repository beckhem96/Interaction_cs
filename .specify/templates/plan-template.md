# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary learning requirement + technical approach]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Concept Domain**: [e.g., sorting, tree, SQL, network communication, operating system or NEEDS CLARIFICATION]

**Learning Slice**: [single independently testable concept/operation taught by this feature]

**Language/Version**: [e.g., TypeScript 5.x, Python 3.11 helper, WebAssembly module or NEEDS CLARIFICATION]

**Primary Dependencies**: [React/Vite defaults plus any new libraries, or N/A]

**Trace Model**: [state shape, highlights, current code/query line mapping]

**Interaction Mode**: [manual, automatic, semi-automatic guided mode]

**Visualization Technology**: [SVG first; Canvas/WebGL/other only with rationale]

**Code/Query Presentation**: [languages, SQL operation, highlighted line/phase behavior]

**Storage**: [if applicable, e.g., local examples, files, browser state or N/A]

**Testing**: [Vitest trace tests, component render tests, parser/engine tests]

**Target Platform**: [browser/local web app unless otherwise justified]

**Project Type**: [concept visualization web app, helper engine, simulator, etc.]

**Performance Goals**: [e.g., smooth stepping/playback, responsive large traces or NEEDS CLARIFICATION]

**Constraints**: [Korean-first UI, one domain per task, immutable trace rendering, etc.]

**Scale/Scope**: [number of examples, trace steps, operations, screen states]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Trace-first: Does the plan define an ordered trace before UI rendering?
- Domain separation: Is concept logic outside React components and scoped to one domain?
- Korean workbench: Are manual controls, explanation, visualization, and code/query panel kept together?
- Semantic sync: Are highlighted visual states mapped to code lines, SQL phases, or protocol/OS steps?
- Verification: Are trace unit tests, relevant component tests, and build verification planned?
- Technology policy: Are new libraries or non-default technologies justified by learning value or maintainability?

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command, if applicable)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/concepts/[domain]/
├── types.ts
├── algorithms/ or engine/
├── code/
├── components/
└── tests/
```

**Structure Decision**: [Document the selected domain structure and exact files]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., Canvas instead of SVG] | [current need] | [why SVG is insufficient] |
| [e.g., external parser/engine] | [specific learning need] | [why manual trace or smaller helper is insufficient] |
