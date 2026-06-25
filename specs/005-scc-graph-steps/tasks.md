# Tasks: SCC Graph Step Workbench

**Input**: Design documents from `specs/005-scc-graph-steps/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/scc-workbench.md, quickstart.md

**Tests**: Trace generation tests are REQUIRED for concept behavior. Component tests are REQUIRED because this feature adds a new workbench page, route, controls, labels, graph states, SCC panels, and synchronized code highlights.

**Organization**: Tasks are grouped by user story so each learning slice can be implemented, tested, and demonstrated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or depends only on completed contracts
- **[Story]**: Maps to the user story from `spec.md`
- Every task includes exact repository-relative file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the SCC file shells and shared graph-domain entry points.

- [X] T001 Add SCC exported type declarations for examples, nodes, directed edges, DFS pass state, finish stack, SCC groups, condensation edges, validation results, render states, and trace state in `src/concepts/graphs/types.ts`
- [X] T002 [P] Create the SCC code example module shell with C, C++, Java, Python, and JavaScript entries in `src/concepts/graphs/code/stronglyConnectedComponentsExamples.ts`
- [X] T003 [P] Create the SCC trace test file scaffold in `src/concepts/graphs/tests/stronglyConnectedComponents.test.ts`
- [X] T004 [P] Create the SCC page component test file scaffold in `src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx`
- [X] T005 Create the SCC page component shell and export `StronglyConnectedComponentsPage` in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish deterministic directed graph data, code highlight mapping, shared helpers, render-state vocabulary, and base trace guarantees before user story UI work.

**CRITICAL**: No user story UI work should begin until trace shape, code highlight keys, and example validation behavior are defined.

- [X] T006 [P] Add complete SCC code examples and highlight map keys for initialize, first-pass DFS, edge inspection, finish stack push, reverse graph, second-pass pop, component add, component finalize, condensation, and complete phases in `src/concepts/graphs/code/stronglyConnectedComponentsExamples.ts`
- [X] T007 [P] Add base trace tests for example validity, required SCC shape, deterministic traversal order, Korean titles/descriptions, and all-language code highlights in `src/concepts/graphs/tests/stronglyConnectedComponents.test.ts`
- [X] T008 Create curated directed graph data with 6 nodes, 7-9 directed edges, one 3-node SCC, one 2-node SCC, one singleton SCC, at least two cross-component edges, fixed coordinates, and label offsets in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T009 Implement shared helpers for adjacency lookup, first-pass DFS order, finish stack handling, graph reversal, second-pass DFS order, SCC membership validation, and node coverage validation in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T010 Add graph layout clearance tests for SCC node spacing, edge label placement, arrow readability, and component badge positions in `src/concepts/graphs/tests/stronglyConnectedComponents.test.ts`
- [X] T011 Implement shared render-state derivation for unvisited, first-pass active, first-pass finished, stack top, second-pass active, current component, finalized component, singleton, reversed edge, internal SCC edge, and cross-component edge states in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`

**Checkpoint**: Trace model foundation is ready and story rendering can now begin.

---

## Phase 3: User Story 1 - 첫 DFS로 종료 순서 이해하기 (Priority: P1) MVP

**Goal**: Learner can follow the original directed graph DFS, distinguish visit from finish, and watch nodes enter the finish order stack.

**Independent Test**: In the fixed directed graph example, stepping forward shows the current DFS start node, active node, inspected outgoing edge, visited nodes, recursion path, finish stack updates, Korean explanation, and matching code highlight.

### Tests for User Story 1

- [X] T012 [P] [US1] Add trace tests for original-dfs initialize, start-dfs, visit-node, inspect-edge, skip-edge, finish-node, and finish stack push behavior in `src/concepts/graphs/tests/stronglyConnectedComponents.test.ts`
- [X] T013 [P] [US1] Add component tests for page title, SVG directed graph stage, DFS path, finish stack, controls, slider, and code tabs in `src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx`
- [X] T014 [P] [US1] Add route test coverage for `/graphs/scc` rendering `강한 연결 요소: SCC` in `src/App.test.tsx`

### Implementation for User Story 1

- [X] T015 [US1] Implement `generateStronglyConnectedComponentsTrace` original-dfs initialize, start-dfs, visit-node, inspect-edge, skip-edge, and finish-node steps in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T016 [US1] Populate `dfs`, `finishStack`, active node, active edge, visited nodes, path nodes, and code highlights for all original-dfs steps in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T017 [US1] Render SVG directed graph nodes and edges with original-dfs unvisited, active, inspected edge, skipped edge, and finished states from immutable trace state in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T018 [US1] Render phase badge, current step title, Korean description, DFS path, visited list, and finish order stack in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T019 [US1] Add Previous, Next, Reset, and step slider controls using the existing step controller pattern in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T020 [US1] Render C, C++, Java, Python, and JavaScript code tabs with original-dfs current-step highlight synchronization in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T021 [US1] Register the `/graphs/scc` route and page import in `src/App.tsx`
- [X] T022 [US1] Add base SCC workbench, directed graph stage, DFS status, finish stack, timeline controls, and code panel styles in `src/styles.css`

**Checkpoint**: User Story 1 is fully functional and testable independently as the MVP.

---

## Phase 4: User Story 2 - 뒤집은 그래프에서 SCC 묶기 (Priority: P2)

**Goal**: Learner can see every edge reverse, pop finish-stack roots, run DFS on the reversed graph, and finalize SCC groups.

**Independent Test**: After the first pass completes, stepping forward shows reversed edge directions, the stack pop root, current SCC candidate growth, skipped already-assigned nodes, and finalized SCC labels for the 3-node, 2-node, and singleton groups.

### Tests for User Story 2

- [X] T023 [P] [US2] Add trace tests for reverse-edges phase showing every original directed edge inverted before second-pass DFS starts in `src/concepts/graphs/tests/stronglyConnectedComponents.test.ts`
- [X] T024 [P] [US2] Add trace tests for second-pass pop order, current component growth, finalized 3-node SCC, finalized 2-node SCC, singleton SCC, and skipped already-assigned pop behavior in `src/concepts/graphs/tests/stronglyConnectedComponents.test.ts`
- [X] T025 [P] [US2] Add component tests for reversed graph indicator, stack pop label, current SCC candidate, finalized SCC list, and non-color component labels in `src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx`

### Implementation for User Story 2

- [X] T026 [US2] Extend `generateStronglyConnectedComponentsTrace` with reverse-edges phase and reversed edge render states in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T027 [US2] Extend `generateStronglyConnectedComponentsTrace` with pop-stack, second-pass start-dfs, visit-node, add-to-component, and finalize-component steps in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T028 [US2] Add assigned-node skip handling and Korean explanations for finish-stack pops that already belong to a finalized SCC in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T029 [US2] Render reversed edge directions, reversed graph phase indicator, active reversed edge, and stack-top root state in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T030 [US2] Render current SCC candidate, newly added nodes, finalized SCC list, representative nodes, and singleton component labels in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T031 [US2] Update code highlight mappings for reverse graph, second-pass stack pop, second-pass DFS visit, add-to-component, and finalize-component phases in `src/concepts/graphs/code/stronglyConnectedComponentsExamples.ts`
- [X] T032 [US2] Add reversed edge, current SCC, finalized SCC, stack pop, singleton badge, and non-color component styles in `src/styles.css`

**Checkpoint**: User Stories 1 and 2 both work independently and explain why mutually reachable nodes become one SCC.

---

## Phase 5: User Story 3 - SCC 결과와 condensation DAG 확인하기 (Priority: P3)

**Goal**: Learner can verify every node belongs to exactly one SCC and understand how SCC groups compress into a condensation DAG.

**Independent Test**: The complete step shows SCC count, component membership, node coverage, no duplicate membership, inter-component condensation edges, omitted internal edges, Korean explanation, and matching code highlight.

### Tests for User Story 3

- [X] T033 [P] [US3] Add trace tests for final SCC count, every node appearing exactly once, no duplicate membership, and deterministic replay in `src/concepts/graphs/tests/stronglyConnectedComponents.test.ts`
- [X] T034 [P] [US3] Add trace tests for condensation edge generation, internal SCC edge omission, duplicate component-edge collapse, and cross-component one-way edge preservation in `src/concepts/graphs/tests/stronglyConnectedComponents.test.ts`
- [X] T035 [P] [US3] Add component tests for final validation panel, SCC membership summary, condensation panel, auto-play control, speed selection, and reset replay behavior in `src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx`

### Implementation for User Story 3

- [X] T036 [US3] Extend `generateStronglyConnectedComponentsTrace` with complete-state validation summary, component count, node coverage, duplicate-membership flag, and final Korean explanation in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T037 [US3] Implement condensation edge generation from finalized SCC groups with internal-edge omission and duplicate component-edge collapse in `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`
- [X] T038 [US3] Render final SCC result, component count, per-node membership, all-nodes-covered check, and duplicate-membership check in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T039 [US3] Render condensation DAG summary with component nodes, inter-component directed edges, source edge labels, and explanation of compressed internal edges in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T040 [US3] Add Play/Pause, speed selection, and pause-on-manual-change behavior for guided automatic progression in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T041 [US3] Update code highlight mappings for build-condensation and complete validation phases in `src/concepts/graphs/code/stronglyConnectedComponentsExamples.ts`
- [X] T042 [US3] Add final validation, condensation DAG, component edge, auto-play, complete state, and coverage badge styles in `src/styles.css`

**Checkpoint**: All user stories work independently and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Integrate navigation, documentation, accessibility, responsive behavior, and final verification.

- [X] T043 [P] Add Home graph card/link coverage for `강한 연결 요소: SCC` in `src/pages/HomePage.tsx` and `src/pages/HomePage.test.tsx`
- [X] T044 [P] Update graph concept documentation with the SCC learning slice and route reference in `CONCEPT_SPEC.md`
- [X] T045 Audit Korean learner-facing copy, aria labels, legends, status labels, and non-color state cues in `src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx`
- [X] T046 Audit responsive desktop/mobile workbench layout, text fitting, and SVG node/edge/label overlap for SCC styles in `src/styles.css`
- [X] T047 Run focused SCC tests with `npm run test -- src/concepts/graphs/tests/stronglyConnectedComponents.test.ts src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx --run` using `package.json`
- [X] T048 Run route and Home coverage with `npm run test -- src/App.test.tsx src/pages/HomePage.test.tsx --run` using `package.json`
- [X] T049 Run the full test suite with `npm run test -- --run` using `package.json`
- [X] T050 Run the production build with `npm run build` using `package.json`
- [X] T051 Run whitespace validation with `git diff --check` for `specs/005-scc-graph-steps/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks story UI work.
- **Phase 3 US1**: Depends on Phase 2 and is the MVP.
- **Phase 4 US2**: Depends on Phase 2; integrates naturally after US1 because the page shell and finish stack are already visible.
- **Phase 5 US3**: Depends on Phase 2; final UI integration is clearest after US1 and US2.
- **Phase 6 Polish**: Depends on implemented stories.

### User Story Dependencies

- **US1 (P1)**: Starts after foundational trace shape and provides MVP.
- **US2 (P2)**: Uses the same trace model and extends reverse-graph/SCC grouping states; can start after helpers are stable.
- **US3 (P3)**: Uses completed SCC groups and condensation helpers; can start after helpers are stable, with final panel integration after US1 page shell exists.

### Within Each User Story

- Tests first, then trace behavior, then UI rendering, then styles.
- Types and code highlight maps before trace implementation.
- Trace generator before React rendering.
- Story checkpoint before moving to the next priority when working sequentially.

---

## Parallel Opportunities

- T002, T003, T004 can run in parallel after T001.
- T006, T007, T010 can run in parallel after setup because they touch different files or independent test sections.
- T012, T013, T014 can run in parallel once foundation contracts are known.
- T023, T024, T025 can run in parallel for US2 test coverage.
- T033, T034, T035 can run in parallel for US3 test coverage.
- T043 and T044 can run in parallel during polish because they touch navigation/docs separately.

## Parallel Example: User Story 1

```bash
Task: "T012 [P] [US1] Add trace tests for original-dfs initialize, start-dfs, visit-node, inspect-edge, skip-edge, finish-node, and finish stack push behavior in src/concepts/graphs/tests/stronglyConnectedComponents.test.ts"
Task: "T013 [P] [US1] Add component tests for page title, SVG directed graph stage, DFS path, finish stack, controls, slider, and code tabs in src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx"
Task: "T014 [P] [US1] Add route test coverage for /graphs/scc rendering 강한 연결 요소: SCC in src/App.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T023 [P] [US2] Add trace tests for reverse-edges phase showing every original directed edge inverted before second-pass DFS starts in src/concepts/graphs/tests/stronglyConnectedComponents.test.ts"
Task: "T025 [P] [US2] Add component tests for reversed graph indicator, stack pop label, current SCC candidate, finalized SCC list, and non-color component labels in src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx"
Task: "T031 [US2] Update code highlight mappings for reverse graph, second-pass stack pop, second-pass DFS visit, add-to-component, and finalize-component phases in src/concepts/graphs/code/stronglyConnectedComponentsExamples.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T033 [P] [US3] Add trace tests for final SCC count, every node appearing exactly once, no duplicate membership, and deterministic replay in src/concepts/graphs/tests/stronglyConnectedComponents.test.ts"
Task: "T034 [P] [US3] Add trace tests for condensation edge generation, internal SCC edge omission, duplicate component-edge collapse, and cross-component one-way edge preservation in src/concepts/graphs/tests/stronglyConnectedComponents.test.ts"
Task: "T035 [P] [US3] Add component tests for final validation panel, SCC membership summary, condensation panel, auto-play control, speed selection, and reset replay behavior in src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 trace foundation.
3. Complete Phase 3 US1.
4. Validate focused trace/component tests and route test.
5. Demo original DFS visit/finish behavior and finish stack before adding reversed graph grouping.

### Incremental Delivery

1. Add setup and foundation.
2. Add US1 first DFS and finish stack MVP.
3. Add US2 reversed graph and SCC grouping.
4. Add US3 final validation and condensation DAG.
5. Finish polish, route/Home/docs, full tests, and build.

### Scope Boundaries

- Do not add tree, TCP, UDP, Redis, Tarjan/Gabow comparison, shortest-path expansion, or editable graph input.
- Do not move SCC decisions into React components.
- Do not introduce graph layout or animation dependencies.
- Keep visual legends minimal and show only meaningful SCC states.
- Keep the fixed SVG layout clear of node, edge, label, and component badge overlap.

---

## Summary

- Total tasks: 51
- Setup tasks: 5
- Foundational tasks: 6
- US1 tasks: 11
- US2 tasks: 10
- US3 tasks: 10
- Polish tasks: 9
- MVP scope: Phase 1 + Phase 2 + Phase 3 (US1)
