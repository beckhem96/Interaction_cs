# UI Contract: Database Workbench

## Scope

이 계약은 `DatabasePage`가 사용자에게 노출해야 하는 화면 동작을 정의한다. 외부 API 계약은 없으며, 고정 SQL 예시 기반의 UI/trace 계약이다.

## Example Selector Contract

### Required interactive examples

다음 8개 예시는 selector에서 선택 가능해야 하며 모두 완전 인터랙티브여야 한다.

1. SUB QUERY
2. JOIN
3. GROUP BY
4. HAVING
5. UNION
6. UNION ALL
7. ORDER/LIMIT
8. WINDOW RANK

### Selection behavior

- 사용자가 예시를 선택하면 current step은 1번째 step으로 초기화된다.
- 이전 예시의 active query line, active row, active cell, phase badge가 남지 않는다.
- query block, input tables, output table, pseudo/logical sequence, current step explanation이 모두 선택된 예시에 맞게 바뀐다.

## Step Control Contract

### Controls

- Previous: 첫 step에서는 disabled.
- Next: 마지막 step에서는 disabled.
- Reset: 언제든 첫 step으로 이동.
- Play/Pause: 자동 전진은 보조 기능이며 수동 조작과 충돌하지 않아야 한다.
- Step slider가 유지되는 경우 현재 step index와 항상 동기화되어야 한다.

### State transition

For every step change:

- 현재 phase label이 바뀐다.
- active query line이 바뀐다.
- 현재 단계 제목과 한국어 설명이 바뀐다.
- input table highlights가 바뀐다.
- output/intermediate table rows 또는 row state가 바뀐다.

## Query Line Contract

- 각 visible SQL line은 1-based line number를 표시한다.
- `activeQueryLines`에 포함된 line은 `aria-current="step"` 또는 동등한 접근성 상태를 가져야 한다.
- `UNION ALL` step은 `UNION ALL` line을 강조하고 duplicate retained 설명을 보여야 한다.
- `WINDOW RANK` step은 `RANK()` line과 `ORDER BY` 기준 line을 단계에 맞게 강조해야 한다.

## Table Contract

### Input tables

- multi-table examples는 모든 관련 input table을 같은 workbench 안에서 동시에 보여야 한다.
- active columns와 rows는 current query line과 의미적으로 연결되어야 한다.

### Output table

- intermediate result와 final result는 같은 result region에서 단계별로 갱신된다.
- empty result는 빈 영역만 보여주지 않고 “결과 없음”에 해당하는 설명을 제공해야 한다.

### Row/cell state

- row motion 상태는 DOM attribute 또는 test 가능한 class로 노출되어야 한다.
- cell highlight는 실제 row/column을 대상으로 해야 한다.
- 색상 상태는 설명/라벨/행 상태와 함께 제공되어야 한다.

## Visual Accessibility Contract

- 일반 텍스트와 table cell text는 WCAG AA 대비 기대치를 만족해야 한다.
- page/panel/table/control 기본 workbench는 읽기 쉬운 색상 체계를 사용한다.
- SQL code block은 어두운 배경을 사용할 수 있지만 line number, keyword, identifier, active line이 모두 읽혀야 한다.
- 상태 색상은 서로 충분히 구분되어야 한다.

## Test Contract

자동화 테스트는 다음을 검증해야 한다.

- 8개 interactive example selector가 렌더링된다.
- 각 example은 4개 이상 trace step을 가진다.
- 각 step의 active query line은 query line 범위 안에 있다.
- 각 cell highlight는 실제 row와 column을 가리킨다.
- `UNION ALL` final/intermediate state는 duplicate retained row를 보여준다.
- `WINDOW RANK` state는 tie row와 rank gap을 보여준다.
- 예시 전환 시 current step이 첫 step으로 초기화된다.
- 주요 controls와 한국어 label이 렌더링된다.
