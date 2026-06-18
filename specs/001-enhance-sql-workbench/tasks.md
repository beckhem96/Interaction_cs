# Tasks: SQL/DATABASE Workbench Enhancement

**Input**: Design documents from `specs/001-enhance-sql-workbench/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/database-workbench-ui.md`, `quickstart.md`

**Tests**: Trace generation tests and component render/control tests are REQUIRED by the feature specification.

**Organization**: Tasks are grouped by user story so each learning slice can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or has no dependency on incomplete tasks
- **[Story]**: User story label from `specs/001-enhance-sql-workbench/spec.md`
- Every task includes an exact repository-relative file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared database trace types and test expectations before user-story work.

- [X] T001 Extend SQL example ids, phases, row motions, and highlight tones for `UNION ALL` and `WINDOW RANK` in `src/concepts/database/types.ts`
- [X] T002 [P] Review SQL tokenization support for `UNION ALL`, `RANK`, `OVER`, and window clauses in `src/concepts/database/code/sqlSyntaxHighlight.ts`
- [X] T003 [P] Record current database workbench visual problem areas for implementation reference in `specs/001-enhance-sql-workbench/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add failing coverage that defines the expected 8-example trace contract before implementation.

**CRITICAL**: Complete this phase before changing the UI or adding new examples.

- [X] T004 [P] Add failing test that `generateSqlOperationExamples()` returns 8 examples including `union-all` and `window-rank` in `src/concepts/database/tests/selectLogicalExecution.test.ts`
- [X] T005 [P] Add failing trace validation test for `UNION ALL` duplicate-retained rows in `src/concepts/database/tests/selectLogicalExecution.test.ts`
- [X] T006 [P] Add failing trace validation test for `WINDOW RANK` tie rows and rank gaps in `src/concepts/database/tests/selectLogicalExecution.test.ts`
- [X] T007 [P] Add failing component test for 8 SQL example tabs and Korean workbench labels in `src/concepts/database/components/DatabasePage.test.tsx`
- [X] T008 [P] Add failing component test that switching examples resets the current SQL step in `src/concepts/database/components/DatabasePage.test.tsx`
- [X] T009 Add shared row-key handling for new duplicate/rank examples in `src/concepts/database/engine/selectLogicalExecution.ts`

**Checkpoint**: Required tests exist and fail for missing `UNION ALL`, `WINDOW RANK`, or reset behavior.

---

## Phase 3: User Story 1 - 읽기 쉬운 데이터베이스 화면으로 학습하기 (Priority: P1)

**Goal**: The database workbench no longer appears as an unreadable black screen, and text/table/control colors remain readable.

**Independent Test**: Open the database page and verify headings, SQL text, table cells, tabs, buttons, and status labels are readable and visually distinct.

### Tests for User Story 1

- [X] T010 [P] [US1] Add component assertions for readable database workbench regions and visible Korean labels in `src/concepts/database/components/DatabasePage.test.tsx`
- [X] T011 [P] [US1] Add DOM/class assertions for state labels that do not rely only on color in `src/concepts/database/components/DatabasePage.test.tsx`

### Implementation for User Story 1

- [X] T012 [US1] Remove or neutralize unreadable database cinematic dark overrides in `src/styles.css`
- [X] T013 [US1] Define WCAG AA-oriented database panel, table, query, tab, and control color tokens in `src/styles.css`
- [X] T014 [US1] Update SQL table row and cell highlight styles for distinguishable active, match, reject, output, duplicate, and rank states in `src/styles.css`
- [X] T015 [US1] Ensure the database workbench keeps the interaction stage and SQL query panel side by side on desktop in `src/styles.css`
- [X] T016 [US1] Ensure database workbench text does not overlap on mobile viewports in `src/styles.css`

**Checkpoint**: User Story 1 is independently verifiable through component tests and visual inspection.

---

## Phase 4: User Story 2 - 쿼리 라인에 맞춰 한 단계씩 실행 흐름 보기 (Priority: P1)

**Goal**: Every SQL example step synchronizes active query lines, phase label, table state, and Korean explanation.

**Independent Test**: For each interactive example, press Next repeatedly and confirm query highlight, table state, phase badge, and explanation change together.

### Tests for User Story 2

- [X] T017 [P] [US2] Add test that every trace step has in-range active SQL query lines in `src/concepts/database/tests/selectLogicalExecution.test.ts`
- [X] T018 [P] [US2] Add test that every cell highlight points to a real row and column in `src/concepts/database/tests/selectLogicalExecution.test.ts`
- [X] T019 [P] [US2] Add component test that Next updates active query line and result table together in `src/concepts/database/components/DatabasePage.test.tsx`

### Implementation for User Story 2

- [X] T020 [US2] Add curated `UNION ALL` query, input rows, intermediate rows, and final rows in `src/concepts/database/engine/selectLogicalExecution.ts`
- [X] T021 [US2] Add `UNION ALL` trace steps showing source scan, append, retained duplicate rows, and final result in `src/concepts/database/engine/selectLogicalExecution.ts`
- [X] T022 [US2] Add curated `WINDOW RANK` query, input rows, sorted rows, tied rows, and ranked rows in `src/concepts/database/engine/selectLogicalExecution.ts`
- [X] T023 [US2] Add `WINDOW RANK` trace steps showing partition/order basis, tie handling, rank gap, and final result in `src/concepts/database/engine/selectLogicalExecution.ts`
- [X] T024 [US2] Extend phase labels for `UNION ALL` and `WINDOW RANK` display in `src/concepts/database/components/DatabasePage.tsx`
- [X] T025 [US2] Render empty or no-result table states with Korean explanation in `src/concepts/database/components/DatabasePage.tsx`
- [X] T026 [US2] Ensure SQL query line highlighting uses the current trace step as the single source of truth in `src/concepts/database/components/DatabasePage.tsx`

**Checkpoint**: User Story 2 is independently verifiable by trace tests and stepping through all examples.

---

## Phase 5: User Story 3 - 다양한 SQL/DATABASE 기술 카테고리 탐색하기 (Priority: P2)

**Goal**: Learners can select all 8 SQL/DATABASE categories, and each category has its own query, tables, and reset behavior.

**Independent Test**: Select each category and confirm the query, input tables, output table, pseudo/logical sequence, and current step reset to that category.

### Tests for User Story 3

- [X] T027 [P] [US3] Add trace test that all 8 required categories are independently selectable examples in `src/concepts/database/tests/selectLogicalExecution.test.ts`
- [X] T028 [P] [US3] Add component test that each tab renders its own query and input table names in `src/concepts/database/components/DatabasePage.test.tsx`
- [X] T029 [P] [US3] Add component test that switching from JOIN to WINDOW RANK resets step index and query content in `src/concepts/database/components/DatabasePage.test.tsx`

### Implementation for User Story 3

- [X] T030 [US3] Add topic category metadata for the 8 required SQL categories in `src/concepts/database/engine/selectLogicalExecution.ts`
- [X] T031 [US3] Update `generateSqlOperationExamples()` ordering to SUB QUERY, JOIN, GROUP BY, HAVING, UNION, UNION ALL, ORDER/LIMIT, WINDOW RANK in `src/concepts/database/engine/selectLogicalExecution.ts`
- [X] T032 [US3] Update tab labels and selected-example state handling for the 8 categories in `src/concepts/database/components/DatabasePage.tsx`
- [X] T033 [US3] Add Korean intro text and summary items for `UNION ALL` and `WINDOW RANK` in `src/concepts/database/engine/selectLogicalExecution.ts`
- [X] T034 [US3] Ensure planned categories beyond the initial 8 are not shown as interactive tabs in `src/concepts/database/components/DatabasePage.tsx`

**Checkpoint**: User Story 3 is independently verifiable by selecting every SQL category.

---

## Phase 6: User Story 4 - 릴스 참고 영상을 웹 학습 패턴으로 재해석하기 (Priority: P3)

**Goal**: The experience remains web-native and step-controllable while using reference videos only as inspiration.

**Independent Test**: Auto play, pause, previous, next, and reset remain usable; no required learning flow depends on video playback.

### Tests for User Story 4

- [X] T035 [P] [US4] Add component test that auto play controls remain visible with SQL query and table regions in `src/concepts/database/components/DatabasePage.test.tsx`
- [X] T036 [P] [US4] Add component test that reference videos are not required for database page rendering in `src/concepts/database/components/DatabasePage.test.tsx`

### Implementation for User Story 4

- [X] T037 [US4] Keep reference video material out of runtime database rendering in `src/concepts/database/components/DatabasePage.tsx`
- [X] T038 [US4] Add Korean helper copy that the workbench uses curated examples rather than arbitrary SQL input in `src/concepts/database/components/DatabasePage.tsx`
- [X] T039 [US4] Ensure play/pause remains a secondary control and manual Next remains visible in the database workbench in `src/concepts/database/components/DatabasePage.tsx`

**Checkpoint**: User Story 4 is independently verifiable by using controls without any video dependency.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature, remove regressions, and update supporting documentation where useful.

- [X] T040 [P] Update database quickstart verification notes after implementation in `specs/001-enhance-sql-workbench/quickstart.md`
- [X] T041 [P] Update concept-level SQL coverage notes if new examples change documented behavior in `CONCEPT_SPEC.md`
- [X] T042 Run focused database trace and component tests through `package.json`
- [X] T043 Run full test suite through `package.json`
- [X] T044 Run production build through `package.json`
- [X] T045 Review final database workbench against `specs/001-enhance-sql-workbench/contracts/database-workbench-ui.md`
- [X] T046 Confirm no unrelated domains were modified by reviewing `src/concepts/database/types.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1; blocks all user story work.
- **Phase 3 US1**: Depends on Phase 2; can proceed before new SQL examples because it is visual/readability focused.
- **Phase 4 US2**: Depends on Phase 2; adds step synchronization and new trace behavior.
- **Phase 5 US3**: Depends on Phase 4 because category exploration requires the new examples to exist.
- **Phase 6 US4**: Depends on Phase 3 and can run after core workbench controls are stable.
- **Phase 7 Polish**: Depends on all selected user stories.

### User Story Dependencies

- **US1**: Independent readability slice after foundational tests.
- **US2**: Independent trace synchronization slice after foundational tests.
- **US3**: Depends on US2 for `UNION ALL` and `WINDOW RANK` examples.
- **US4**: Depends on stable controls from US1/US2.

### Within Each User Story

- Tests first, and confirm they fail before implementation when behavior is missing.
- Type/trace changes before UI rendering changes.
- UI state rendering before CSS polish when a new state is introduced.
- Story checkpoint before starting the next dependent story.

---

## Parallel Opportunities

- T002 and T003 can run in parallel with T001.
- T004, T005, T006, T007, and T008 can run in parallel because they add independent test coverage.
- T010 and T011 can run in parallel.
- T017, T018, and T019 can run in parallel.
- T027, T028, and T029 can run in parallel.
- T035 and T036 can run in parallel.
- T040 and T041 can run in parallel during polish.

## Parallel Example: User Story 2

```bash
Task: "T017 Add active query line range tests in src/concepts/database/tests/selectLogicalExecution.test.ts"
Task: "T018 Add cell highlight target tests in src/concepts/database/tests/selectLogicalExecution.test.ts"
Task: "T019 Add Next synchronization component test in src/concepts/database/components/DatabasePage.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T027 Add 8-category trace coverage test in src/concepts/database/tests/selectLogicalExecution.test.ts"
Task: "T028 Add per-tab query/table render test in src/concepts/database/components/DatabasePage.test.tsx"
Task: "T029 Add JOIN to WINDOW RANK reset test in src/concepts/database/components/DatabasePage.test.tsx"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 readability and WCAG AA-oriented workbench color cleanup.
3. Validate component tests and manual database page readability.

### Incremental Delivery

1. US1: make the current database page readable and stable.
2. US2: add synchronized trace behavior for `UNION ALL` and `WINDOW RANK`.
3. US3: expose all 8 categories as independently selectable examples.
4. US4: confirm web-native controls and no video dependency.
5. Polish: run tests, build, and quickstart checks.

### Final Validation

1. Run `npm run test`.
2. Run `npm run build`.
3. Manually verify the 8 examples from `specs/001-enhance-sql-workbench/quickstart.md`.

---

## Notes

- Keep all SQL learning logic in `src/concepts/database/engine/selectLogicalExecution.ts` and `src/concepts/database/types.ts`.
- Do not add arbitrary SQL input or real SQL execution in this feature.
- Do not modify unrelated concept domains.
- Use `example/*.mp4` only as design inspiration; do not make video playback part of the required learning flow.
