# Tasks: DAG Topological Sort Step Workbench

**Input**: Design documents from `specs/004-topological-sort-steps/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/topological-sort-workbench.md, quickstart.md

**Tests**: Trace generation tests are REQUIRED for concept behavior. Component tests are REQUIRED because this feature adds a new workbench page, route, controls, labels, and synchronized code highlights.

**Organization**: Tasks are grouped by user story so each learning slice can be implemented, tested, and demonstrated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or depends only on completed contracts
- **[Story]**: Maps to the user story from `spec.md`
- Every task includes exact repository-relative file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the topological sort file shells and shared graph-domain entry points.

- [ ] T001 Add topological sort exported type declarations for examples, nodes, directed edges, in-degree rows, candidate queues, validation results, render states, and trace state in `src/concepts/graphs/types.ts`
- [ ] T002 [P] Create the topological sort code example module shell with C, C++, Java, Python, and JavaScript entries in `src/concepts/graphs/code/topologicalSortExamples.ts`
- [ ] T003 [P] Create the topological sort trace test file scaffold in `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T004 [P] Create the topological sort page component test file scaffold in `src/concepts/graphs/components/TopologicalSortPage.test.tsx`
- [ ] T005 Create the topological sort page component shell and export `TopologicalSortPage` in `src/concepts/graphs/components/TopologicalSortPage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish deterministic DAG data, code highlight mapping, shared helpers, and base trace guarantees before user story UI work.

**CRITICAL**: No user story UI work should begin until trace shape, code highlight keys, and example validation behavior are defined.

- [ ] T006 [P] Add complete topological sort code examples and highlight map keys for initialize, seed-queue, inspect-candidates, select-node, append-result, iterate-edge, decrement-indegree, enqueue-candidate, complete, and cycle-blocked phases in `src/concepts/graphs/code/topologicalSortExamples.ts`
- [ ] T007 [P] Add base trace tests for example validity, DAG acyclicity, initial in-degree values, deterministic candidate ordering, Korean titles/descriptions, and all-language code highlights in `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T008 Create curated DAG example data with 6-7 nodes, 7-9 directed edges, fixed coordinates, at least one multi-candidate step, and at least one new-candidate step in `src/concepts/graphs/algorithms/topologicalSort.ts`
- [ ] T009 Implement shared helpers for in-degree computation, outgoing edge lookup, candidate sorting, DAG validation, final edge-order validation, and cycle-blocked detection in `src/concepts/graphs/algorithms/topologicalSort.ts`
- [ ] T010 Add graph layout clearance tests for topological sort node spacing, edge label placement, and arrow label readability in `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T011 Implement shared render-state derivation for pending, candidate, selected, processed, newly opened, affected edge, removed edge, blocking edge, complete, and blocked states in `src/concepts/graphs/algorithms/topologicalSort.ts`

**Checkpoint**: Trace model foundation is ready and story rendering can now begin.

---

## Phase 3: User Story 1 - 진입 차수 기반 다음 노드 선택하기 (Priority: P1) MVP

**Goal**: Learner can see zero-in-degree candidates, understand the deterministic tie rule, select the next node, and watch the result order grow.

**Independent Test**: In the fixed DAG example, stepping forward shows candidate nodes, selects the deterministic next node, appends it to the result order, updates Korean explanation, and highlights the matching code line.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add trace tests for initial zero-in-degree candidate queue, multi-candidate tie ordering, selected node id, and result-order append in `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T013 [P] [US1] Add component tests for page title, SVG DAG stage, candidate queue, result order, controls, slider, and code tabs in `src/concepts/graphs/components/TopologicalSortPage.test.tsx`
- [ ] T014 [P] [US1] Add route test coverage for `/graphs/topological-sort` rendering `위상 정렬: DAG` in `src/App.test.tsx`

### Implementation for User Story 1

- [ ] T015 [US1] Implement `generateTopologicalSortTrace` initial, inspect-candidates, select-node, and append-result steps in `src/concepts/graphs/algorithms/topologicalSort.ts`
- [ ] T016 [US1] Render SVG DAG nodes with pending, candidate, selected, and processed states from immutable trace state in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T017 [US1] Render candidate queue, tie-rule explanation, accumulated result order, current step title, and Korean description in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T018 [US1] Add Previous, Next, Reset, and step slider controls using the existing step controller pattern in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T019 [US1] Render C, C++, Java, Python, and JavaScript code tabs with current-step highlight synchronization in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T020 [US1] Register the `/graphs/topological-sort` route and page import in `src/App.tsx`
- [ ] T021 [US1] Add base topological sort workbench, DAG stage, candidate queue, result order, timeline controls, and code panel styles in `src/styles.css`

**Checkpoint**: User Story 1 is fully functional and testable independently as the MVP.

---

## Phase 4: User Story 2 - 간선 제거와 진입 차수 감소 추적하기 (Priority: P2)

**Goal**: Learner can follow outgoing edge processing, in-degree decrement, and newly opened candidates after a selected node is processed.

**Independent Test**: For a selected node with outgoing edges, stepping through the trace marks affected edges, decrements destination in-degree rows, and adds any newly zero-in-degree node to the candidate queue with synchronized explanation and code highlight.

### Tests for User Story 2

- [ ] T022 [P] [US2] Add trace tests for outgoing edge processing, affected edge ids, in-degree decrement, and no-new-candidate explanation in `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T023 [P] [US2] Add trace tests for newly opened candidate enqueue behavior and queue ordering after edge removal in `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T024 [P] [US2] Add component tests for directed edge states, in-degree table rows, delta labels, affected edges, and newly opened candidate labels in `src/concepts/graphs/components/TopologicalSortPage.test.tsx`

### Implementation for User Story 2

- [ ] T025 [US2] Extend `generateTopologicalSortTrace` with remove-edge, update-indegree, and enqueue-candidate phases in `src/concepts/graphs/algorithms/topologicalSort.ts`
- [ ] T026 [US2] Populate `inDegreeRows`, `affectedEdgeIds`, `newCandidateNodeIds`, and step-specific queue snapshots for each edge-processing step in `src/concepts/graphs/algorithms/topologicalSort.ts`
- [ ] T027 [US2] Render directed edges with arrow markers and pending, active outgoing, removed, blocking, and newly satisfied states in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T028 [US2] Render the in-degree table with previous value, current value, delta, row status text, and source edge references in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T029 [US2] Update code highlight mappings for outgoing edge iteration, in-degree decrement, and newly zero-in-degree enqueue phases in `src/concepts/graphs/code/topologicalSortExamples.ts`
- [ ] T030 [US2] Add edge state, arrow marker, in-degree table, delta badge, opened candidate, and non-color status styles in `src/styles.css`

**Checkpoint**: User Stories 1 and 2 both work independently and explain why candidates become available.

---

## Phase 5: User Story 3 - 최종 위상 순서 검증하기 (Priority: P3)

**Goal**: Learner can verify the completed topological order and understand the cycle-blocked guard condition.

**Independent Test**: The complete step shows every node exactly once, validates every directed edge prerequisite, remains deterministic after replay, and the trace generator emits a cycle-blocked step for cyclic input fixtures.

### Tests for User Story 3

- [ ] T031 [P] [US3] Add trace tests for final order containing every node once, every directed edge check passing, and deterministic replay in `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T032 [P] [US3] Add trace tests for cycle-blocked guard behavior with a cyclic fixture or helper input in `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T033 [P] [US3] Add component tests for final validation panel, edge check summary, reset replay behavior, and cycle-blocked messaging in `src/concepts/graphs/components/TopologicalSortPage.test.tsx`

### Implementation for User Story 3

- [ ] T034 [US3] Extend `generateTopologicalSortTrace` with complete-state validation summary, processed count, node count, edge checks, and final Korean explanation in `src/concepts/graphs/algorithms/topologicalSort.ts`
- [ ] T035 [US3] Add cycle-blocked trace support for unprocessed nodes with an empty candidate queue without adding a second UI example in `src/concepts/graphs/algorithms/topologicalSort.ts`
- [ ] T036 [US3] Render final validation result, topological order, processed count, and directed-edge prerequisite checks in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T037 [US3] Render cycle-blocked messaging for trace states that cannot complete topological sorting in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T038 [US3] Add Play/Pause, speed selection, and pause-on-manual-change behavior for guided automatic progression in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T039 [US3] Add final validation, edge check, auto-play, complete, and cycle-blocked styles in `src/styles.css`

**Checkpoint**: All user stories work independently and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Integrate navigation, documentation, accessibility, responsive behavior, and final verification.

- [ ] T040 [P] Add Home graph card/link coverage for `위상 정렬: DAG` in `src/pages/HomePage.tsx` and `src/pages/HomePage.test.tsx`
- [ ] T041 [P] Update graph concept documentation with the DAG topological sort learning slice in `CONCEPT_SPEC.md`
- [ ] T042 Audit Korean learner-facing copy, aria labels, legends, status labels, and non-color state cues in `src/concepts/graphs/components/TopologicalSortPage.tsx`
- [ ] T043 Audit responsive desktop/mobile workbench layout and text fitting for topological sort styles in `src/styles.css`
- [ ] T044 Run focused topological sort tests with `npm run test -- src/concepts/graphs/tests/topologicalSort.test.ts src/concepts/graphs/components/TopologicalSortPage.test.tsx --run` for `src/concepts/graphs/tests/topologicalSort.test.ts`
- [ ] T045 Run route and Home coverage with `npm run test -- src/App.test.tsx src/pages/HomePage.test.tsx --run` for `src/App.test.tsx`
- [ ] T046 Run the full test suite with `npm run test -- --run` using `package.json`
- [ ] T047 Run the production build with `npm run build` using `package.json`
- [ ] T048 Run whitespace validation with `git diff --check` for `specs/004-topological-sort-steps/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks story UI work.
- **Phase 3 US1**: Depends on Phase 2 and is the MVP.
- **Phase 4 US2**: Depends on Phase 2; integrates naturally after US1 but remains trace-testable by itself.
- **Phase 5 US3**: Depends on Phase 2; final UI integration is clearest after US1 and US2.
- **Phase 6 Polish**: Depends on implemented stories.

### User Story Dependencies

- **US1 (P1)**: Starts after foundational trace shape and provides MVP.
- **US2 (P2)**: Uses the same trace model and extends edge-processing states; can start after helpers are stable.
- **US3 (P3)**: Uses completed trace data and validation helpers; can start after helpers are stable, with final panel integration after US1 page shell exists.

### Within Each User Story

- Tests first, then trace behavior, then UI rendering, then styles.
- Types and code highlight maps before trace implementation.
- Trace generator before React rendering.
- Story checkpoint before moving to the next priority when working sequentially.

---

## Parallel Opportunities

- T002, T003, T004 can run in parallel after T001.
- T006, T007, T010 can run in parallel after setup because they touch different files.
- T012, T013, T014 can run in parallel once foundation contracts are known.
- T022, T023, T024 can run in parallel for US2 test coverage.
- T031, T032, T033 can run in parallel for US3 test coverage.
- T040 and T041 can run in parallel during polish because they touch navigation/docs separately.

## Parallel Example: User Story 1

```bash
Task: "T012 [P] [US1] Add trace tests for initial zero-in-degree candidate queue, multi-candidate tie ordering, selected node id, and result-order append in src/concepts/graphs/tests/topologicalSort.test.ts"
Task: "T013 [P] [US1] Add component tests for page title, SVG DAG stage, candidate queue, result order, controls, slider, and code tabs in src/concepts/graphs/components/TopologicalSortPage.test.tsx"
Task: "T014 [P] [US1] Add route test coverage for /graphs/topological-sort rendering 위상 정렬: DAG in src/App.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T022 [P] [US2] Add trace tests for outgoing edge processing, affected edge ids, in-degree decrement, and no-new-candidate explanation in src/concepts/graphs/tests/topologicalSort.test.ts"
Task: "T024 [P] [US2] Add component tests for directed edge states, in-degree table rows, delta labels, affected edges, and newly opened candidate labels in src/concepts/graphs/components/TopologicalSortPage.test.tsx"
Task: "T029 [US2] Update code highlight mappings for outgoing edge iteration, in-degree decrement, and newly zero-in-degree enqueue phases in src/concepts/graphs/code/topologicalSortExamples.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T031 [P] [US3] Add trace tests for final order containing every node once, every directed edge check passing, and deterministic replay in src/concepts/graphs/tests/topologicalSort.test.ts"
Task: "T032 [P] [US3] Add trace tests for cycle-blocked guard behavior with a cyclic fixture or helper input in src/concepts/graphs/tests/topologicalSort.test.ts"
Task: "T033 [P] [US3] Add component tests for final validation panel, edge check summary, reset replay behavior, and cycle-blocked messaging in src/concepts/graphs/components/TopologicalSortPage.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 trace foundation.
3. Complete Phase 3 US1.
4. Validate focused trace/component tests and route test.
5. Demo candidate selection and result-order append before adding edge-processing detail.

### Incremental Delivery

1. Add setup and foundation.
2. Add US1 candidate selection MVP.
3. Add US2 edge removal and in-degree decrement.
4. Add US3 final validation and cycle guard.
5. Finish polish, route/Home/docs, full tests, and build.

### Scope Boundaries

- Do not add tree, TCP, UDP, Redis, DFS topological sort comparison, or editable graph input.
- Do not move topological sort decisions into React components.
- Do not introduce graph layout or animation dependencies.
- Keep visual legends minimal and show only meaningful topological sort states.

---

## Summary

- Total tasks: 48
- Setup tasks: 5
- Foundational tasks: 6
- US1 tasks: 10
- US2 tasks: 9
- US3 tasks: 9
- Polish tasks: 9
- MVP scope: Phase 1 + Phase 2 + Phase 3 (US1)
