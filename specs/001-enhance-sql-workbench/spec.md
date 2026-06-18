# Feature Specification: SQL/DATABASE Workbench Enhancement

**Feature Branch**: `001-enhance-sql-workbench`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "데이터베이스 화면만 검정색이고 글자 색도 뒤죽박죽인 상태다. 최대한 많은 카테고리의 SQL or DATABASE 기술을 표현할 수 있어야 하고, 동작은 한 단계씩 진행할 수 있어야 한다. 쿼리 라인에 따라서 동작이 바뀌어야 하며 예시 테이블의 상태도 함께 보여줘야 한다. 이미 구현되어 있는 부분은 보완하고 수정한다. 새로운 기술을 추가할 게 있으면 UNION ALL, RANK() 등을 추가한다. example/*.mp4는 인스타그램 릴스에서 본 예시이며, 웹으로 만들고 싶다."

## Clarifications

### Session 2026-06-18

- Q: 이번 기능에서 완전 인터랙티브로 구현할 초기 SQL/DATABASE 카테고리 8개는 무엇으로 고정할까요? → A: SUB QUERY, JOIN, GROUP BY, HAVING, UNION, UNION ALL, ORDER/LIMIT, WINDOW RANK
- Q: 데이터베이스 화면의 색상/가독성 합격 기준은 어느 수준으로 둘까요? → A: 일반 텍스트와 테이블 셀은 WCAG AA 대비 수준을 만족
- Q: SQL 실행 방식은 어떻게 정할까요? → A: 고정 예시 기반 수동 trace만 사용하고 임의 SQL 입력은 제공하지 않음
- Q: 이번 구현에서 “완전 인터랙티브”로 제공할 SQL 예시 범위는 어디까지로 할까요? → A: 기존 6개 개선 + 8개 이상 SQL 카테고리를 모두 완전 인터랙티브로 추가

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 읽기 쉬운 데이터베이스 화면으로 학습하기 (Priority: P1)

학습자는 데이터베이스 화면에 들어왔을 때 검정색 배경이나 뒤섞인 글자 색 때문에 내용을 놓치지 않고, 쿼리, 입력 테이블, 결과 테이블, 현재 단계 설명을 한 화면에서 읽을 수 있다.

**Why this priority**: 현재 문제의 직접 원인이 색상과 가독성이라서, 이 흐름이 해결되지 않으면 어떤 SQL 예시도 학습 가치가 떨어진다.

**Independent Test**: 데이터베이스 화면을 열고 모든 주요 영역의 제목, 본문, 쿼리, 테이블 셀, 버튼, 탭 텍스트가 배경과 충분히 구분되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 데이터베이스 학습 화면이 열려 있을 때, **When** 사용자가 SQL 예시 탭을 바꿔도, **Then** 화면은 일관된 밝은 작업 영역과 읽기 쉬운 글자 색을 유지한다.
2. **Given** 쿼리와 테이블이 함께 표시될 때, **When** 현재 단계가 바뀌어도, **Then** active line, active row, active cell, rejected row, output row의 색상은 서로 구분된다.

---

### User Story 2 - 쿼리 라인에 맞춰 한 단계씩 실행 흐름 보기 (Priority: P1)

학습자는 SQL 예시를 이전/다음 단계로 이동하면서 현재 쿼리 라인이 강조되고, 해당 라인이 왜 현재 테이블 상태를 만드는지 한국어 설명으로 이해할 수 있다.

**Why this priority**: 이 기능의 핵심은 SQL 문장을 외우는 것이 아니라 쿼리 라인과 데이터 변화가 연결되는 과정을 이해하는 것이다.

**Independent Test**: 각 예시에서 다음 버튼을 반복해서 누르면 active query line, 현재 단계 제목, 설명, 입력/결과 테이블 상태가 같은 단계로 함께 바뀌는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 사용자가 `GROUP BY` 예시를 보고 있을 때, **When** GROUP BY 단계로 이동하면, **Then** `GROUP BY` 라인이 강조되고 행들이 그룹 단위로 묶인 상태가 보인다.
2. **Given** 사용자가 `UNION` 또는 `UNION ALL` 예시를 보고 있을 때, **When** 결합 단계로 이동하면, **Then** 두 입력 테이블의 행이 결과 후보로 합쳐지는 상태가 보인다.
3. **Given** 사용자가 `RANK()` 예시를 보고 있을 때, **When** 순위 계산 단계로 이동하면, **Then** 정렬 기준과 같은 순위 처리 방식이 함께 표시된다.

---

### User Story 3 - 다양한 SQL/DATABASE 기술 카테고리 탐색하기 (Priority: P2)

학습자는 SQL/DATABASE 카테고리 목록에서 원하는 기술을 선택하고, 각 기술마다 독립적인 쿼리와 예시 테이블을 통해 단계별 동작을 확인할 수 있다.

**Why this priority**: 데이터베이스 학습 화면은 단일 SELECT 예시가 아니라 여러 SQL 개념을 비교하고 확장할 수 있는 학습 허브가 되어야 한다.

**Independent Test**: 카테고리 탭 또는 목록에서 각 SQL 기술을 선택하면 이전 예시의 쿼리/테이블 상태가 섞이지 않고 해당 기술의 예시로 초기화되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 사용자가 `JOIN` 예시를 보다가 `WINDOW FUNCTION` 예시를 선택할 때, **When** 예시가 전환되면, **Then** 단계 위치는 처음으로 돌아가고 쿼리와 입력 테이블은 새 예시에 맞게 바뀐다.
2. **Given** 사용자가 기술 카테고리를 둘러볼 때, **When** 아직 상세 구현되지 않은 고급 주제가 있을 경우, **Then** 구현된 예시와 예정 예시는 명확히 구분된다.

---

### User Story 4 - 릴스 참고 영상을 웹 학습 패턴으로 재해석하기 (Priority: P3)

학습자는 짧은 영상처럼 빠르게 흘러가는 설명이 아니라, 영상에서 얻은 시각적 아이디어를 웹에서 멈추고 되돌리고 단계별로 확인할 수 있는 형태로 학습한다.

**Why this priority**: `example/*.mp4`는 방향 참고 자료지만, 최종 산출물은 사용자가 직접 조작하는 웹 경험이어야 한다.

**Independent Test**: 자동 재생을 사용하더라도 사용자가 언제든 일시정지, 이전 단계, 다음 단계, 처음으로 돌아가기를 수행할 수 있는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 자동 재생 중일 때, **When** 사용자가 일시정지하거나 다음/이전 단계를 누르면, **Then** 현재 단계가 사용자의 조작에 맞춰 즉시 안정적으로 멈추거나 이동한다.

### Edge Cases

- SQL 예시를 전환할 때 이전 예시의 단계 번호, 강조 라인, 테이블 강조가 남지 않아야 한다.
- 결과 행이 없는 단계도 빈 상태를 명확히 설명해야 하며 화면이 깨지지 않아야 한다.
- 같은 값이 여러 행에 있어도 `UNION`, `UNION ALL`, `RANK()`, `DENSE_RANK()`의 차이를 구분해서 보여줘야 한다.
- 입력 테이블이 2개 이상인 예시는 모든 관련 입력 테이블을 동시에 확인할 수 있어야 한다.
- 자동 재생 마지막 단계에서는 다음 동작이 비활성화되거나 완료 상태가 명확해야 한다.
- 색상만으로 상태를 구분하지 않고 라벨, 행 상태, 설명도 함께 제공해야 한다.
- `example/*.mp4`는 참고 자료이므로 영상 그대로 재생하는 방식만 제공해서는 안 된다.
- 사용자가 SQL을 직접 입력하거나 수정하려는 경우, 이번 기능에서는 제공된 예시를 선택하라는 안내가 필요하다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present the database workbench with readable and consistent colors for page background, panels, SQL text, table text, tabs, buttons, and status labels; normal text and table cells MUST meet WCAG AA contrast expectations.
- **FR-002**: System MUST preserve and improve existing SQL examples for SUB QUERY, JOIN, GROUP BY, HAVING, UNION, and ORDER/LIMIT without removing their step-by-step behavior.
- **FR-003**: Users MUST be able to move each SQL example one step at a time using visible previous, next, reset, and optional play controls.
- **FR-004**: System MUST highlight the SQL query line or lines that explain the current step.
- **FR-005**: System MUST update input table state, intermediate result state, final result state, current phase label, and Korean explanation when the active step changes.
- **FR-006**: System MUST show all relevant input tables at the same time for multi-table examples such as JOIN, UNION, UNION ALL, subquery, and ranking examples.
- **FR-007**: System MUST provide distinguishable visual states for source rows, candidate rows, matched rows, rejected rows, grouped rows, aggregated rows, projected rows, unioned rows, duplicate-removed rows, sorted rows, limited rows, and ranked rows when those states appear in an example.
- **FR-008**: System MUST add at least one `UNION ALL` lesson that contrasts retained duplicates with `UNION` duplicate removal.
- **FR-009**: System MUST add at least one window function lesson covering `RANK()` and tie handling; `ROW_NUMBER()` or `DENSE_RANK()` may be included when it clarifies the difference.
- **FR-010**: System MUST provide fully interactive step-by-step examples for these 8 initial SQL/DATABASE categories: SUB QUERY, JOIN, GROUP BY, HAVING, UNION, UNION ALL, ORDER/LIMIT, and WINDOW RANK.
- **FR-011**: System MAY include additional planned topic entries beyond SUB QUERY, JOIN, GROUP BY, HAVING, UNION, UNION ALL, ORDER/LIMIT, and WINDOW RANK only when they are clearly labeled as not yet interactive.
- **FR-012**: System MUST treat `example/*.mp4` as visual references only; the learning interaction must remain web-native, step-controllable, and inspectable.
- **FR-013**: System MUST keep Korean learner-facing descriptions close to the visual table changes and avoid relying only on color to explain state.
- **FR-014**: System MUST reset the current step to the first step when the selected SQL example changes.
- **FR-015**: System MUST provide tests or validation evidence that query line highlights and table states change together for each interactive example.
- **FR-016**: System MUST use fixed, curated SQL examples with manual trace steps for this feature and MUST NOT provide arbitrary SQL input or free-form query execution.

### Key Entities *(include if feature involves data)*

- **SQL Topic Category**: A group of related database concepts such as JOIN, GROUP BY, set operations, window functions, or execution concepts.
- **SQL Example**: A single teachable query with title, Korean introduction, topic category, query text, input tables, and ordered steps.
- **Visualization Step**: One learner-visible transition containing active query lines, phase label, Korean explanation, input table state, output table state, and row/cell highlights.
- **Input Table State**: The visible source table rows and columns relevant to the current step.
- **Result Table State**: The intermediate or final output rows generated by the current step.
- **Reference Video**: A non-authoritative visual inspiration file under `example/*.mp4`; it guides style ideas but does not define required playback behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner can identify the active SQL line and the corresponding table change within 5 seconds on every step of every interactive example.
- **SC-002**: SUB QUERY, JOIN, GROUP BY, HAVING, UNION, UNION ALL, ORDER/LIMIT, and WINDOW RANK are all fully interactive, including newly added or enhanced `UNION ALL` and `RANK()` behavior.
- **SC-003**: 100% of interactive SQL examples allow previous, next, reset, and step inspection without losing query/table synchronization.
- **SC-004**: Existing examples for SUB QUERY, JOIN, GROUP BY, HAVING, UNION, and ORDER/LIMIT still render and remain independently selectable after the enhancement.
- **SC-005**: All visible normal text and table cell text in the database workbench meets WCAG AA contrast expectations in normal desktop and mobile viewport checks.
- **SC-006**: Multi-table examples show all relevant input tables concurrently for every step where they are needed.
- **SC-007**: Learners can distinguish `UNION` and `UNION ALL`, and can explain why tied rows receive the displayed `RANK()` value after completing the examples.

## Assumptions

- The primary users are Korean-speaking learners preparing for CS, SQL, or database concept study.
- The current database page already includes interactive examples that should be preserved and improved rather than replaced wholesale.
- This feature uses fixed, curated examples only; arbitrary SQL editing and real query execution are out of scope for this slice.
- The initial enhancement remains within the database/SQL domain and does not add unrelated algorithm, tree, network, or OS pages.
- `example/*.mp4` files are used as design inspiration, not as embedded final content or mandatory video playback.
- Advanced database execution topics such as index scan, transaction isolation, locking, and execution plans may appear as planned entries only after the initial 8 fully interactive category examples are satisfied.
