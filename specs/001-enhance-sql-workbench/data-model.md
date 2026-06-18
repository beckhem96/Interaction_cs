# Data Model: SQL/DATABASE Workbench Enhancement

## SQL Topic Category

**Purpose**: 학습자가 선택하는 SQL/DATABASE 기술 단위.

**Fields**:

- `id`: canonical category id. 예: `sub-query`, `join`, `group-by`, `having`, `union`, `union-all`, `order-limit`, `window-rank`.
- `label`: 한국어/SQL 혼합 탭 라벨. 예: `WINDOW RANK`.
- `description`: 카테고리 학습 목적.
- `isInteractive`: 초기 8개는 `true`.
- `exampleIds`: 해당 category에 연결된 SQL Example id 목록.

**Validation rules**:

- 초기 세트에는 정확히 다음 8개 interactive category가 포함되어야 한다: SUB QUERY, JOIN, GROUP BY, HAVING, UNION, UNION ALL, ORDER/LIMIT, WINDOW RANK.
- 추가 planned category는 interactive 초기 세트와 시각적으로 구분되어야 한다.

## SQL Example

**Purpose**: 하나의 고정 SQL query와 그 query를 설명하는 ordered trace.

**Fields**:

- `id`: stable id.
- `categoryId`: SQL Topic Category id.
- `title`: 한국어 중심 예시 제목.
- `tabLabel`: workbench selector label.
- `intro`: 학습자가 처음 읽는 설명.
- `query`: 고정 SQL 문자열.
- `pseudoCode`: 논리 처리 순서 또는 학습 단계 라벨 목록.
- `trace`: Visualization Step 목록.

**Validation rules**:

- 모든 example은 trace step을 4개 이상 가져야 한다.
- `query`는 사용자가 수정하지 않는 고정 예시다.
- 모든 trace step의 `activeQueryLines`는 query line 범위 안에 있어야 한다.
- `UNION ALL` example은 duplicate retained 상태를 보여야 한다.
- `WINDOW RANK` example은 tie 처리와 rank gap을 설명해야 한다.

## Visualization Step

**Purpose**: 한 번의 Next/Previous 조작으로 보여주는 학습 상태.

**Fields**:

- `id`: example 안에서 unique한 step id.
- `title`: 단계 제목.
- `description`: 한국어 단계 설명.
- `pseudoCodeLine`: pseudoCode에서 강조할 1-based line.
- `state.phase`: SQL logical phase.
- `state.query`: 현재 example query.
- `state.activeQueryLines`: 강조할 query line 번호 배열.
- `state.inputTables`: 현재 단계에서 보이는 입력 테이블 목록.
- `state.rows`: 중간 또는 결과 테이블 rows.
- `state.activeColumns`: 강조할 output columns.
- `state.activeRowKeys`: 강조할 output row keys.
- `state.rowMotionByKey`: row key별 motion state.
- `state.cellHighlights`: input/output cell highlight 목록.
- `state.summaryItems`: 현재 단계 요약 key-value 목록.

**State transitions**:

1. example 선택 시 첫 step으로 초기화한다.
2. Next는 다음 step으로 이동하되 마지막 step 이후로 넘어가지 않는다.
3. Previous는 이전 step으로 이동하되 첫 step 이전으로 넘어가지 않는다.
4. Reset은 첫 step으로 이동한다.
5. Play는 step을 자동으로 전진시키되 사용자가 조작하면 현재 step state와 동기화된다.

## Input Table State

**Purpose**: 현재 step에서 참조되는 source table의 표시 상태.

**Fields**:

- `name`: table name.
- `rows`: 표시할 source rows.
- `activeColumns`: 현재 query line에서 사용하는 columns.
- `activeRowKeys`: 현재 단계의 active source rows.
- `rowMotionByKey`: source row motion state.
- `cellHighlights`: table-specific highlights.

**Validation rules**:

- multi-table example은 관련 input table을 동시에 보여야 한다.
- cell highlight는 실제 row key와 column을 가리켜야 한다.

## Result Table State

**Purpose**: 현재 step의 intermediate 또는 final output.

**Fields**:

- `rows`: 표시할 output rows.
- `activeColumns`: 강조 columns.
- `activeRowKeys`: 강조 rows.
- `rowMotionByKey`: output row motion state.
- `cellHighlights`: output cell highlights.

**Validation rules**:

- 결과가 비어 있는 단계도 빈 상태와 설명을 제공해야 한다.
- final step은 해당 example의 학습 목표 결과를 명확히 보여야 한다.

## Row Motion

**Purpose**: 행의 의미 상태를 색상 외 라벨/데이터 속성으로도 구분하는 상태.

**Allowed values**:

- `source`, `candidate`, `matched`, `joined`, `filtered`, `rejected`, `grouped`, `aggregated`, `projected`, `unioned`, `deduped`, `sorted`, `limited`, `cutoff`, `ranked`, `tie`, `retainedDuplicate`

**Validation rules**:

- 상태 색상은 서로 구분되어야 하며 색상만으로 의미를 전달하면 안 된다.
- 신규 `ranked`, `tie`, `retainedDuplicate`는 tests에서 사용 여부를 검증한다.

## Cell Highlight

**Purpose**: query line과 직접 관련된 cell-level 의미 강조.

**Fields**:

- `scope`: `input` 또는 `output`.
- `tableName`: input scope일 때 source table name.
- `rowKey`: 대상 row key.
- `column`: 대상 column name.
- `tone`: visual tone.

**Allowed tones**:

- 기존: `active`, `join`, `match`, `output`, `reject`
- 신규 후보: `rank`, `duplicate`, `tie`

## Reference Video

**Purpose**: `example/*.mp4`에 있는 시각 참고 자료.

**Fields**:

- `path`: reference video path.
- `usage`: visual inspiration only.

**Validation rules**:

- Reference Video는 interactive requirement를 대체하지 않는다.
- 최종 학습 흐름은 step-controllable web workbench여야 한다.
