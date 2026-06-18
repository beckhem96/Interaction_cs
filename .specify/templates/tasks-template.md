---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Trace generation tests are REQUIRED for concept behavior. Component tests are REQUIRED when controls, labels, or workbench rendering change.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each learning slice.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Concept domain: `src/concepts/[domain]/`
- Types: `src/concepts/[domain]/types.ts`
- Trace logic: `src/concepts/[domain]/algorithms/` or `src/concepts/[domain]/engine/`
- Components: `src/concepts/[domain]/components/`
- Code/query examples: `src/concepts/[domain]/code/`
- Tests: `src/concepts/[domain]/tests/` and component `*.test.tsx`

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Trace model, interaction mode, and visualization requirements from plan.md
  - Code/query/protocol/OS phase presentation requirements
  - Test requirements required by the constitution

  Tasks MUST be organized by user story so each story can be implemented,
  tested, and demonstrated independently.

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the domain files and shared workbench prerequisites

- [ ] T001 Create concept directory structure under `src/concepts/[domain]/`
- [ ] T002 Define trace/state types in `src/concepts/[domain]/types.ts`
- [ ] T003 [P] Add code/query/example fixtures in `src/concepts/[domain]/code/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Trace and control infrastructure that MUST be complete before UI story work

**CRITICAL**: No user story UI work can begin until trace generation and test shape are defined

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Define deterministic sample input and expected trace outline
- [ ] T005 [P] Write failing trace generation tests in `src/concepts/[domain]/tests/[feature].test.ts`
- [ ] T006 Implement trace generator in `src/concepts/[domain]/algorithms/[feature].ts` or `src/concepts/[domain]/engine/[feature].ts`
- [ ] T007 Map trace steps to code/query/protocol/OS phase highlights
- [ ] T008 Verify trace tests fail before implementation and pass after implementation

**Checkpoint**: Trace model ready - user story rendering can now begin

---

## Phase 3: User Story 1 - [Title] (Priority: P1) MVP

**Goal**: [Brief description of what this story teaches]

**Independent Test**: [How to verify this learning slice works on its own]

### Tests for User Story 1

> **NOTE: Write these tests FIRST and confirm they fail before implementation**

- [ ] T009 [P] [US1] Trace test for [state transition] in `src/concepts/[domain]/tests/[feature].test.ts`
- [ ] T010 [P] [US1] Component render test for controls and key labels in `src/concepts/[domain]/components/[Feature]Page.test.tsx`

### Implementation for User Story 1

- [ ] T011 [US1] Implement trace behavior for [operation]
- [ ] T012 [US1] Render current trace state in `src/concepts/[domain]/components/[Feature]Page.tsx`
- [ ] T013 [US1] Add manual Previous/Next/Reset controls in the workbench
- [ ] T014 [US1] Add synchronized explanation and code/query/phase highlight
- [ ] T015 [US1] Add Korean learner-facing labels and descriptions

**Checkpoint**: User Story 1 is fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story teaches]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2

- [ ] T016 [P] [US2] Trace test for [additional transition]
- [ ] T017 [P] [US2] Component render/control test for [new interaction]

### Implementation for User Story 2

- [ ] T018 [US2] Extend trace behavior for [operation]
- [ ] T019 [US2] Render additional visual state without moving domain logic into React
- [ ] T020 [US2] Update code/query/phase highlight mappings

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story teaches]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3

- [ ] T021 [P] [US3] Trace test for [additional transition]
- [ ] T022 [P] [US3] Component render/control test for [new interaction]

### Implementation for User Story 3

- [ ] T023 [US3] Extend trace behavior for [operation]
- [ ] T024 [US3] Add automatic or semi-automatic mode if required by the spec
- [ ] T025 [US3] Update Korean explanation and synchronized highlights

**Checkpoint**: All selected user stories work independently

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in `PROJECT_PLAN.md`, `CONCEPT_SPEC.md`, or feature docs when required
- [ ] TXXX Code cleanup and refactoring limited to touched files
- [ ] TXXX Performance optimization for smooth step/play interaction
- [ ] TXXX [P] Additional trace or component tests for edge cases
- [ ] TXXX Accessibility and responsive workbench checks
- [ ] TXXX Run `npm run build`
- [ ] TXXX Run `npm run test` when tests are added, changed, or relevant

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS UI work
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order or in parallel if files do not conflict
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - may integrate with US1 but must remain independently testable
- **User Story 3 (P3)**: Can start after Foundational - may integrate with US1/US2 but must remain independently testable

### Within Each User Story

- Tests MUST be written and fail before implementation when behavior changes
- Types before trace generator
- Trace generator before UI rendering
- Code/query/phase highlight mapping before visual highlight UI
- Story complete before moving to the next priority

### Parallel Opportunities

- Setup tasks in different files can run in parallel
- Trace tests and code/query examples can run in parallel
- Component tests can run in parallel with trace implementation after the interface is known
- Different user stories can run in parallel only when they do not edit the same files

---

## Parallel Example: User Story 1

```bash
Task: "Trace test for [operation] in src/concepts/[domain]/tests/[feature].test.ts"
Task: "Code examples for [operation] in src/concepts/[domain]/code/[feature]Examples.ts"
Task: "Component render test in src/concepts/[domain]/components/[Feature]Page.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational trace behavior and tests
3. Complete Phase 3: User Story 1
4. STOP and VALIDATE: trace tests, component tests, and build
5. Demo the learning slice if ready

### Incremental Delivery

1. Complete setup and trace foundation
2. Add User Story 1 -> test independently -> demo
3. Add User Story 2 -> test independently -> demo
4. Add User Story 3 -> test independently -> demo
5. Each story adds learning value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes setup and trace contract together
2. Once trace contracts are stable:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to a specific learning slice
- Keep domain logic outside React components
- Verify tests fail before implementing behavior changes
- Commit after each task or logical group when requested
- Stop at checkpoints to validate story independently
- Avoid vague tasks, same-file conflicts, and cross-domain scope expansion
