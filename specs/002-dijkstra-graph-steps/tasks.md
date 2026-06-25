# Tasks: Dijkstra Graph Step Workbench

**Input**: Design documents from `specs/002-dijkstra-graph-steps/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/dijkstra-workbench.md](./contracts/dijkstra-workbench.md), [quickstart.md](./quickstart.md)

**Tests**: Trace generation tests are REQUIRED by the project constitution and this feature plan. Component tests are REQUIRED because controls, labels, workbench rendering, code tabs, and final destination selection change.

**Organization**: Tasks are grouped by user story so each learning slice can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it edits a different file and does not depend on incomplete tasks
- **[Story]**: Maps to a user story from `spec.md`
- Every task includes an exact repository-relative file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the Dijkstra slice entry points and file shells inside the existing graph domain.

- [X] T001 Add Dijkstra-specific exported type declarations for examples, nodes, edges, distance rows, frontier candidates, comparisons, trace state, and path results in `src/concepts/graphs/types.ts`
- [X] T002 [P] Create the Dijkstra code example module shell with C, C++, Java, Python, and JavaScript entries in `src/concepts/graphs/code/dijkstraExamples.ts`
- [X] T003 [P] Create the Dijkstra trace test file scaffold in `src/concepts/graphs/tests/dijkstra.test.ts`
- [X] T004 [P] Create the Dijkstra page component test file scaffold in `src/concepts/graphs/components/DijkstraPage.test.tsx`
- [X] T005 Create the Dijkstra page component shell and export `DijkstraPage` in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T006 Register the `/graphs/dijkstra` route for `DijkstraPage` in `src/App.tsx`
- [X] T007 Add a Korean Home page card linking to `/graphs/dijkstra` in `src/pages/HomePage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish deterministic graph examples, code highlight mapping, and shared helper behavior before story UI work.

**CRITICAL**: No story implementation should render algorithm behavior until the trace contracts and example data are defined.

- [X] T008 Define curated undirected and directed weighted graph examples with non-negative weights, stable node labels, coordinates, start nodes, and default destinations in `src/concepts/graphs/algorithms/dijkstra.ts`
- [X] T009 [P] Add five-language Dijkstra code snippets and language metadata in `src/concepts/graphs/code/dijkstraExamples.ts`
- [X] T010 Add Dijkstra code line highlight map keys for initialize, select-current, inspect-edge, relax, skip, settle, and complete phases in `src/concepts/graphs/code/dijkstraExamples.ts`
- [X] T011 Implement shared adjacency creation, non-negative weight validation, alphabetical tie-break comparison, and path reconstruction helpers in `src/concepts/graphs/algorithms/dijkstra.ts`
- [X] T012 [P] Add base trace tests for both examples, Korean step descriptions, direction modes, and all-language code highlights in `src/concepts/graphs/tests/dijkstra.test.ts`

**Checkpoint**: Example data, code examples, and helper contracts are ready for story implementation.

---

## Phase 3: User Story 1 - 다익스트라 최단 거리 흐름 따라가기 (Priority: P1) MVP

**Goal**: Learner can step through the start state, current-node selection, inspected edge, candidate distance comparison, and synchronized graph/table/explanation/code highlight.

**Independent Test**: In a fixed example, repeatedly pressing Next updates the current node, inspected edge, candidate distance, distance table, settled/current explanation, and selected-language highlighted code line together.

### Tests for User Story 1

- [X] T013 [P] [US1] Add trace tests for initialization, first current-node selection, edge inspection, candidate distance comparison, and alphabetic tie-break selection in `src/concepts/graphs/tests/dijkstra.test.ts`
- [X] T014 [US1] Add component tests for page title, undirected/directed tabs, graph stage, distance table, code tabs, and primary Next control in `src/concepts/graphs/components/DijkstraPage.test.tsx`
- [X] T015 [US1] Add component tests for manual Next, Previous, Reset, slider movement, and synchronized code highlight updates in `src/concepts/graphs/components/DijkstraPage.test.tsx`

### Implementation for User Story 1

- [X] T016 [US1] Implement `generateDijkstraTrace` start, select-current, inspect-edge, and candidate comparison steps in `src/concepts/graphs/algorithms/dijkstra.ts`
- [X] T017 [US1] Build `DijkstraPage` state selection for active graph example, active code language, active step, and `useStepController` integration in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T018 [US1] Render SVG graph nodes, directed/undirected weighted edges, active node labels, active edge labels, and weight labels in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T019 [US1] Render the distance table with node label, current best distance, previous node, status, and candidate comparison columns in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T020 [US1] Render Korean current-step explanation, frontier candidate summary, example tabs, Previous, Next, Reset, autoplay, and step slider controls in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T021 [US1] Render five-language Dijkstra code tabs with selected-language line highlighting from trace state in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T022 [US1] Add Dijkstra graph, distance table, frontier, code panel, and control styles while keeping desktop graph/code side by side in `src/styles.css`

**Checkpoint**: User Story 1 is fully functional and testable as the MVP.

---

## Phase 4: User Story 2 - 거리 갱신과 확정 상태 구분하기 (Priority: P2)

**Goal**: Learner can distinguish candidate, updated, skipped/no-update, current, frontier, and settled states using table text, graph labels, and Korean explanations without relying only on color.

**Independent Test**: For a single inspected edge step, candidate calculation, update/no-update result, table mutation or non-mutation, node status labels, and settled-state persistence are visible and testable.

### Tests for User Story 2

- [X] T023 [P] [US2] Add trace tests for successful relaxation, previous/new distance values, predecessor updates, and updated node status in `src/concepts/graphs/tests/dijkstra.test.ts`
- [X] T024 [US2] Add trace tests for no-update skip steps, unchanged distance rows, settled nodes not returning to frontier/current, and unreachable row behavior in `src/concepts/graphs/tests/dijkstra.test.ts`
- [X] T025 [P] [US2] Add component tests for updated/skipped/settled table labels, graph aria labels, and non-color state text in `src/concepts/graphs/components/DijkstraPage.test.tsx`

### Implementation for User Story 2

- [X] T026 [US2] Extend `generateDijkstraTrace` to emit relax, skip/no-update, settle, settled persistence, unreachable, and updated distance table snapshots in `src/concepts/graphs/algorithms/dijkstra.ts`
- [X] T027 [US2] Render relaxation comparison details with previous distance, edge weight, candidate distance, and update/no-update reason in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T028 [US2] Render visible state labels and aria labels for candidate, updated, skipped, settled, current, inspected edge, and frontier states in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T029 [US2] Add CSS classes for candidate, updated, skipped, settled, current, inspected edge, frontier, and unreachable states with distinct non-conflicting colors in `src/styles.css`
- [X] T030 [US2] Update Dijkstra code line highlight mappings for relax, skip/no-update, and settle steps across all five languages in `src/concepts/graphs/code/dijkstraExamples.ts`

**Checkpoint**: User Stories 1 and 2 both work independently and preserve trace/UI/code synchronization.

---

## Phase 5: User Story 3 - 최종 최단 경로 결과 확인하기 (Priority: P3)

**Goal**: Learner can inspect final shortest distances and choose a destination node to reconstruct and highlight the shortest path from the start node.

**Independent Test**: On the final step, all reachable final distances and previous nodes are visible; changing the destination updates path sequence, total cost, and graph final-path highlight.

### Tests for User Story 3

- [X] T031 [P] [US3] Add trace tests for complete step final distances, predecessor chains, start-equals-destination path, selected destination path, and total cost in `src/concepts/graphs/tests/dijkstra.test.ts`
- [X] T032 [P] [US3] Add component tests for final destination selector, path sequence update, total cost update, and final path graph highlight in `src/concepts/graphs/components/DijkstraPage.test.tsx`
- [X] T033 [US3] Add component tests for switching between undirected and directed examples resetting step state and preserving final result correctness in `src/concepts/graphs/components/DijkstraPage.test.tsx`

### Implementation for User Story 3

- [X] T034 [US3] Extend `generateDijkstraTrace` to emit a complete step with final distances, predecessors, reachable destinations, and final path metadata in `src/concepts/graphs/algorithms/dijkstra.ts`
- [X] T035 [US3] Implement learner-selected destination state and derived path result rendering in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T036 [US3] Render final shortest-distance summary, predecessor table values, path node sequence, total cost, start-equals-destination result, and unreachable destination copy in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T037 [US3] Render final-path node and edge highlights in the SVG graph based on the selected destination in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T038 [US3] Update final result and destination selector styles in `src/styles.css`

**Checkpoint**: All selected user stories work independently and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify routing, accessibility, responsive layout, documentation alignment, and build/test quality gates.

- [X] T039 [P] Add App route coverage for `/graphs/dijkstra` in `src/App.test.tsx`
- [X] T040 [P] Add Home page card coverage for the Dijkstra link in `src/pages/HomePage.test.tsx`
- [X] T041 [P] Review Korean learner-facing copy, aria labels, and terminology consistency in `src/concepts/graphs/components/DijkstraPage.tsx`
- [X] T042 Review responsive workbench layout so the interaction stage and code panel remain side by side on desktop and non-overlapping on mobile in `src/styles.css`
- [X] T043 [P] Update graph concept documentation references for the Dijkstra page in `CONCEPT_SPEC.md`
- [X] T044 Run focused Dijkstra tests with `npm run test -- src/concepts/graphs/tests/dijkstra.test.ts src/concepts/graphs/components/DijkstraPage.test.tsx --run`
- [X] T045 Run the full test suite with `npm run test -- --run` using the script defined in `package.json`
- [X] T046 Run the production build with `npm run build` using the script defined in `package.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1; blocks user-story UI work.
- **User Story 1 (Phase 3)**: Depends on Phase 2; MVP scope.
- **User Story 2 (Phase 4)**: Depends on Phase 2 and should integrate after US1 for the shared page/table/graph surface.
- **User Story 3 (Phase 5)**: Depends on Phase 2 and is easiest after US1/US2 because it reuses final distance rows, graph states, and table layout.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational; no dependency on US2 or US3.
- **US2 (P2)**: Can start after Foundational; independently testable through trace and table/status rendering, but shares files with US1.
- **US3 (P3)**: Can start after Foundational; independently testable through complete step and destination selector, but shares files with US1/US2.

### Within Each User Story

- Write trace/component tests first and confirm they fail before implementation.
- Types before trace generator.
- Trace generator before React rendering.
- Code examples and highlight maps before code panel verification.
- Story checkpoint validation before moving to the next priority.

## Parallel Opportunities

- T002, T003, T004 can run in parallel after T001 planning decisions are understood.
- T009 and T012 can run in parallel because they edit different files.
- T013 can run in parallel with T014 after the US1 trace contract is known; T015 should follow or coordinate with T014 because both edit `src/concepts/graphs/components/DijkstraPage.test.tsx`.
- T023 can run in parallel with T025 after US2 expected states are known; T024 should coordinate with T023 because both edit `src/concepts/graphs/tests/dijkstra.test.ts`.
- T031 can run in parallel with T032 after final result contract is known; T033 should coordinate with T032 because both edit `src/concepts/graphs/components/DijkstraPage.test.tsx`.
- T039, T040, T041, and T043 can run in parallel during polish because they touch different files.

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] Add trace tests for initialization and current-node selection in src/concepts/graphs/tests/dijkstra.test.ts"
Task: "T014 [US1] Add component tests for graph stage, distance table, code tabs, and Next control in src/concepts/graphs/components/DijkstraPage.test.tsx"
Task: "T021 [US1] Render five-language Dijkstra code tabs in src/concepts/graphs/components/DijkstraPage.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T023 [US2] Add trace tests for successful relaxation in src/concepts/graphs/tests/dijkstra.test.ts"
Task: "T025 [US2] Add component tests for updated/skipped/settled labels in src/concepts/graphs/components/DijkstraPage.test.tsx"
Task: "T030 [US2] Update code line highlight mappings in src/concepts/graphs/code/dijkstraExamples.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T031 [US3] Add trace tests for complete step and predecessor chains in src/concepts/graphs/tests/dijkstra.test.ts"
Task: "T032 [US3] Add component tests for destination selector in src/concepts/graphs/components/DijkstraPage.test.tsx"
Task: "T038 [US3] Update final result styles in src/styles.css"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup and Phase 2 foundation.
2. Complete Phase 3 tasks T013-T022.
3. Validate with focused trace/component tests and build.
4. Demo `/graphs/dijkstra` with manual stepping, graph/table/explanation/code sync, and both graph examples visible.

### Incremental Delivery

1. Add foundation: graph examples, types, code snippets, shared helpers.
2. Add US1: visible Dijkstra step flow and controls.
3. Add US2: relaxation/no-update/settled states and non-color labels.
4. Add US3: final result, selectable destination, reconstructed path.
5. Run focused tests, full tests, and build after completing the selected story set.

### Parallel Team Strategy

1. Agree on `DijkstraTraceState` and `DijkstraPage` props/state shape through T001-T012.
2. One developer can own trace tests and generator in `src/concepts/graphs/tests/dijkstra.test.ts` and `src/concepts/graphs/algorithms/dijkstra.ts`.
3. One developer can own page/component tests and rendering in `src/concepts/graphs/components/DijkstraPage.test.tsx` and `src/concepts/graphs/components/DijkstraPage.tsx`.
4. One developer can own code examples/styles/routes in `src/concepts/graphs/code/dijkstraExamples.ts`, `src/styles.css`, `src/App.tsx`, and `src/pages/HomePage.tsx`.

## Notes

- Keep all learner-facing UI text Korean-first except programming language names and established algorithm terms.
- Do not add new dependencies for this feature.
- Do not move Dijkstra algorithm decisions into React components.
- Keep graph visualization SVG-first.
- Keep scope limited to the graph algorithm domain.

