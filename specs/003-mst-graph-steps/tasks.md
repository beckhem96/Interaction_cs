# Tasks: MST Graph Step Workbench

**Input**: Design documents from `specs/003-mst-graph-steps/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/mst-workbench.md](./contracts/mst-workbench.md), [quickstart.md](./quickstart.md)

**Tests**: Trace generation tests are REQUIRED by the project constitution and this feature plan. Component tests are REQUIRED because controls, labels, workbench rendering, code tabs, component summaries, and final result display change.

**Organization**: Tasks are grouped by user story so each learning slice can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it edits a different file and does not depend on incomplete tasks
- **[Story]**: Maps to a user story from `spec.md`
- Every task includes an exact repository-relative file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the MST slice entry points and file shells inside the existing graph domain.

- [X] T001 Add MST-specific exported type declarations for examples, nodes, edges, sorted edge rows, component groups, candidate decisions, results, and trace state in `src/concepts/graphs/types.ts`
- [X] T002 [P] Create the MST code example module shell with C, C++, Java, Python, and JavaScript entries in `src/concepts/graphs/code/mstExamples.ts`
- [X] T003 [P] Create the MST trace test file scaffold in `src/concepts/graphs/tests/mst.test.ts`
- [X] T004 [P] Create the MST page component test file scaffold in `src/concepts/graphs/components/MstPage.test.tsx`
- [X] T005 Create the MST page component shell and export `MstPage` in `src/concepts/graphs/components/MstPage.tsx`
- [X] T006 Register the `/graphs/mst` route for `MstPage` in `src/App.tsx`
- [X] T007 Add a Korean Home page card linking to `/graphs/mst` in `src/pages/HomePage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish deterministic MST example data, code highlight mapping, and shared helper behavior before story UI work.

**CRITICAL**: No story implementation should render algorithm behavior until the trace contracts and example data are defined.

- [X] T008 [P] Add base trace tests for MST example existence, connected graph validity, sorted edge order, Korean step descriptions, and all-language code highlights in `src/concepts/graphs/tests/mst.test.ts`
- [X] T009 Define the curated connected undirected weighted graph example with stable node labels, coordinates, equal-weight tie case, selected-edge candidates, and skipped-cycle candidates in `src/concepts/graphs/algorithms/mst.ts`
- [X] T010 [P] Add five-language Kruskal code snippets and language metadata in `src/concepts/graphs/code/mstExamples.ts`
- [X] T011 Add MST code line highlight map keys for initialize, sort-edges, inspect-edge, select-edge, skip-cycle, and complete phases in `src/concepts/graphs/code/mstExamples.ts`
- [X] T012 Implement shared MST validation, edge sorting, edge label tie-break, component lookup, and component merge helpers in `src/concepts/graphs/algorithms/mst.ts`
- [X] T013 [P] Add graph layout clearance tests for MST node, edge, and weight-label overlap safety in `src/concepts/graphs/tests/mst.test.ts`

**Checkpoint**: Example data, code examples, and helper contracts are ready for story implementation.

---

## Phase 3: User Story 1 - MST 후보 간선 선택 흐름 따라가기 (Priority: P1) MVP

**Goal**: Learner can step through sorted-edge preparation, current candidate edge inspection, select-or-skip decisions, visible total cost changes, and synchronized graph/edge-list/explanation/code highlight.

**Independent Test**: In the fixed MST example, repeatedly pressing Next updates the current candidate edge, graph highlight, sorted edge row, select-or-skip label, total cost, Korean explanation, and selected-language highlighted code line together.

### Tests for User Story 1

- [X] T014 [P] [US1] Add trace tests for initialize, sort-edges, first candidate inspection, selected-edge decision, skipped-cycle decision, and deterministic edge label tie-break in `src/concepts/graphs/tests/mst.test.ts`
- [X] T015 [US1] Add component tests for page title, graph stage, sorted edge list, total cost summary, code tabs, and primary Next control in `src/concepts/graphs/components/MstPage.test.tsx`
- [X] T016 [US1] Add component tests for manual Next, Previous, Reset, slider movement, autoplay stop on manual movement, and synchronized code highlight updates in `src/concepts/graphs/components/MstPage.test.tsx`

### Implementation for User Story 1

- [X] T017 [US1] Implement `generateMstTrace` initialize, sort-edges, inspect-edge, select-edge, and skip-cycle decision steps in `src/concepts/graphs/algorithms/mst.ts`
- [X] T018 [US1] Build `MstPage` state selection for active trace, active code language, active step, and `useStepController` integration in `src/concepts/graphs/components/MstPage.tsx`
- [X] T019 [US1] Render SVG graph nodes, undirected weighted edges, active edge labels, and weight labels from MST trace state in `src/concepts/graphs/components/MstPage.tsx`
- [X] T020 [US1] Render the sorted edge list with order, edge label, weight, status, and decision reason columns in `src/concepts/graphs/components/MstPage.tsx`
- [X] T021 [US1] Render Korean current-step explanation, total cost summary, Previous, Next, Reset, autoplay, and step slider controls in `src/concepts/graphs/components/MstPage.tsx`
- [X] T022 [US1] Render five-language Kruskal code tabs with selected-language line highlighting from trace state in `src/concepts/graphs/components/MstPage.tsx`
- [X] T023 [US1] Add MST graph, sorted edge list, cost summary, code panel, and timeline control styles while keeping desktop graph/code side by side in `src/styles.css`

**Checkpoint**: User Story 1 is fully functional and testable as the MVP.

---

## Phase 4: User Story 2 - 연결 성분 변화로 사이클 방지 이해하기 (Priority: P2)

**Goal**: Learner can distinguish different-component selection from same-component cycle skip by reading component groups, candidate decision text, graph labels, and edge-list status without relying only on color.

**Independent Test**: For a selected edge step, component groups merge and total cost increases; for a skipped cycle step, component groups and total cost stay stable while the explanation says the endpoints were already connected.

### Tests for User Story 2

- [X] T024 [P] [US2] Add trace tests for selected edges merging two component groups, updating selected edge ids, and increasing total cost in `src/concepts/graphs/tests/mst.test.ts`
- [X] T025 [US2] Add trace tests for skipped cycle edges preserving component groups, preserving total cost, and recording same-component reasons in `src/concepts/graphs/tests/mst.test.ts`
- [X] T026 [P] [US2] Add component tests for component summary labels, merged component indicators, skipped cycle text, graph aria labels, and non-color state text in `src/concepts/graphs/components/MstPage.test.tsx`

### Implementation for User Story 2

- [X] T027 [US2] Extend `generateMstTrace` to emit component groups, candidate decisions, merge metadata, same-component cycle reasons, and stable component snapshots in `src/concepts/graphs/algorithms/mst.ts`
- [X] T028 [US2] Render component summary groups, candidate endpoint component relationship, merge explanations, and skip-cycle explanations in `src/concepts/graphs/components/MstPage.tsx`
- [X] T029 [US2] Render visible state labels and aria labels for candidate, selected, skipped-cycle, component-merged, pending, and not-needed states in `src/concepts/graphs/components/MstPage.tsx`
- [X] T030 [US2] Add CSS classes for MST candidate, selected, skipped-cycle, component-merged, pending, and not-needed states with distinct non-conflicting colors in `src/styles.css`
- [X] T031 [US2] Update Kruskal code line highlight mappings for find, union/merge, cycle skip, and cost update steps across all five languages in `src/concepts/graphs/code/mstExamples.ts`

**Checkpoint**: User Stories 1 and 2 both work independently and preserve trace/UI/code synchronization.

---

## Phase 5: User Story 3 - 최종 MST 결과 검증하기 (Priority: P3)

**Goal**: Learner can inspect the completed MST, verify that selected edge count equals `node count - 1`, read the selected edge order, and confirm total cost from the selected edge weights.

**Independent Test**: On the complete step, selected edge count, expected count, covered nodes, selected order, cost formula, total cost, final graph highlight, and edge-list statuses all match the trace result.

### Tests for User Story 3

- [X] T032 [P] [US3] Add trace tests for complete step selected edge count, `node count - 1` expectation, covered node ids, selected edge order, and total cost formula in `src/concepts/graphs/tests/mst.test.ts`
- [X] T033 [P] [US3] Add component tests for final result selected count, expected count label, selected edge order, covered nodes, cost formula, and total cost in `src/concepts/graphs/components/MstPage.test.tsx`
- [X] T034 [US3] Add component tests for returning from final step, replaying to final step, and preserving deterministic result values in `src/concepts/graphs/components/MstPage.test.tsx`

### Implementation for User Story 3

- [X] T035 [US3] Extend `generateMstTrace` to emit a complete step with MST result, final selected edges, not-needed remaining edges, covered nodes, and cost formula metadata in `src/concepts/graphs/algorithms/mst.ts`
- [X] T036 [US3] Render final MST result summary with selected edge count, expected count, selected edge order, covered nodes, total cost, and cost formula in `src/concepts/graphs/components/MstPage.tsx`
- [X] T037 [US3] Render final selected-edge graph highlights and final edge-list statuses based on `MstResult` in `src/concepts/graphs/components/MstPage.tsx`
- [X] T038 [US3] Add final MST result and complete-state styles in `src/styles.css`

**Checkpoint**: All selected user stories work independently and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify routing, accessibility, responsive layout, documentation alignment, and build/test quality gates.

- [X] T039 [P] Add App route coverage for `/graphs/mst` in `src/App.test.tsx`
- [X] T040 [P] Add Home page card coverage for the MST link in `src/pages/HomePage.test.tsx`
- [X] T041 [P] Update graph concept documentation references for the MST page and Kruskal learning slice in `CONCEPT_SPEC.md`
- [X] T042 Review Korean learner-facing copy, aria labels, algorithm terminology, and non-color labels in `src/concepts/graphs/components/MstPage.tsx`
- [X] T043 Review responsive workbench layout so the interaction stage and code panel remain side by side on desktop and non-overlapping on mobile in `src/styles.css`
- [X] T044 Run focused MST tests with `npm run test -- src/concepts/graphs/tests/mst.test.ts src/concepts/graphs/components/MstPage.test.tsx --run`
- [X] T045 Run the full test suite with `npm run test -- --run` using the script defined in `package.json`
- [X] T046 Run the production build with `npm run build` using the script defined in `package.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1; blocks user-story UI work.
- **User Story 1 (Phase 3)**: Depends on Phase 2; MVP scope.
- **User Story 2 (Phase 4)**: Depends on Phase 2 and should integrate after US1 for the shared graph/edge-list/component surface.
- **User Story 3 (Phase 5)**: Depends on Phase 2 and is easiest after US1/US2 because it reuses selected edges, component state, graph highlights, and edge-list layout.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational; no dependency on US2 or US3.
- **US2 (P2)**: Can start after Foundational; independently testable through trace and component summary rendering, but shares files with US1.
- **US3 (P3)**: Can start after Foundational; independently testable through complete step and final result summary, but shares files with US1/US2.

### Within Each User Story

- Write trace/component tests first and confirm they fail before implementation.
- Types before trace generator.
- Trace generator before React rendering.
- Code examples and highlight maps before code panel verification.
- Story checkpoint validation before moving to the next priority.

## Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001 decisions are understood because they edit different files.
- T008, T010, and T013 can run in parallel after file scaffolds exist because they edit different files or independent test sections.
- T014 can run in parallel with T015 after the US1 trace contract is known; T016 should coordinate with T015 because both edit `src/concepts/graphs/components/MstPage.test.tsx`.
- T024 can run in parallel with T026 after US2 expected component states are known; T025 should coordinate with T024 because both edit `src/concepts/graphs/tests/mst.test.ts`.
- T032 can run in parallel with T033 after final result contract is known; T034 should coordinate with T033 because both edit `src/concepts/graphs/components/MstPage.test.tsx`.
- T039, T040, T041, and T042 can run in parallel during polish because they touch different files.

## Parallel Example: User Story 1

```bash
Task: "T014 [US1] Add trace tests for initialize, sort-edges, candidate inspection, and deterministic tie-break in src/concepts/graphs/tests/mst.test.ts"
Task: "T015 [US1] Add component tests for graph stage, sorted edge list, code tabs, and Next control in src/concepts/graphs/components/MstPage.test.tsx"
Task: "T022 [US1] Render five-language Kruskal code tabs in src/concepts/graphs/components/MstPage.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T024 [US2] Add trace tests for selected edges merging component groups in src/concepts/graphs/tests/mst.test.ts"
Task: "T026 [US2] Add component tests for component labels and skipped cycle text in src/concepts/graphs/components/MstPage.test.tsx"
Task: "T031 [US2] Update Kruskal code line highlight mappings in src/concepts/graphs/code/mstExamples.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T032 [US3] Add trace tests for complete step selected count and total cost in src/concepts/graphs/tests/mst.test.ts"
Task: "T033 [US3] Add component tests for final result summary in src/concepts/graphs/components/MstPage.test.tsx"
Task: "T038 [US3] Add final MST result styles in src/styles.css"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup and Phase 2 foundation.
2. Complete Phase 3 tasks T014-T023.
3. Validate with focused trace/component tests and build.
4. Demo `/graphs/mst` with manual stepping, graph/edge-list/explanation/code sync, and visible candidate select-or-skip decisions.

### Incremental Delivery

1. Add foundation: MST example, types, code snippets, helper functions, and base tests.
2. Add US1: visible Kruskal candidate edge flow and controls.
3. Add US2: component merge/cycle skip reasoning and non-color labels.
4. Add US3: final MST result, selected edge count, cost formula, and final highlights.
5. Run focused tests, full tests, and build after completing the selected story set.

### Parallel Team Strategy

1. Agree on `MstTraceState` and `MstPage` props/state shape through T001-T013.
2. One developer can own trace tests and generator in `src/concepts/graphs/tests/mst.test.ts` and `src/concepts/graphs/algorithms/mst.ts`.
3. One developer can own page/component tests and rendering in `src/concepts/graphs/components/MstPage.test.tsx` and `src/concepts/graphs/components/MstPage.tsx`.
4. One developer can own code examples/styles/routes/docs in `src/concepts/graphs/code/mstExamples.ts`, `src/styles.css`, `src/App.tsx`, `src/pages/HomePage.tsx`, and `CONCEPT_SPEC.md`.

## Notes

- Keep all learner-facing UI text Korean-first except programming language names and established algorithm terms.
- Do not add new dependencies for this feature.
- Do not move Kruskal/MST algorithm decisions into React components.
- Keep graph visualization SVG-first.
- Keep scope limited to the graph algorithm domain.
- Do not add Prim, tree, TCP, UDP, Redis, learner-authored graph editing, or disconnected graph spanning forest behavior in this task list.
