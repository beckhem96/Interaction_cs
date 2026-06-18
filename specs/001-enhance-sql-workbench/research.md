# Research: SQL/DATABASE Workbench Enhancement

## Decision: 고정 curated SQL 예시 + manual trace 사용

**Rationale**: constitution은 manual trace를 우선하고, 이번 feature는 8개 카테고리를 완전 인터랙티브로 제공해야 한다. 임의 SQL 입력/실행기를 포함하면 parser/engine integration, 오류 처리, SQL dialect, 사용자가 만든 쿼리의 시각화 범위가 모두 추가되어 이번 slice의 핵심인 가독성 개선과 단계 동기화가 흐려진다.

**Alternatives considered**:

- 실제 SQL 엔진 통합: 결과 계산 검증에는 유용하지만 query line과 학습용 중간 상태를 직접 설명하기 어렵고 범위가 커진다.
- 사용자가 SQL 직접 입력: 학습 자유도는 높지만 arbitrary SQL visualization이 필요해 현재 feature 목표와 충돌한다.

## Decision: 초기 완전 인터랙티브 카테고리 8개 고정

**Rationale**: spec clarification에서 `SUB QUERY`, `JOIN`, `GROUP BY`, `HAVING`, `UNION`, `UNION ALL`, `ORDER/LIMIT`, `WINDOW RANK`가 초기 세트로 확정됐다. 기존 6개 예시는 이미 구조와 테스트가 있으므로 보존/개선하고, 신규 2개는 기존 trace pattern을 확장해 구현한다.

**Alternatives considered**:

- 모든 database category를 즉시 구현: 테스트/디자인 범위가 커지고 기존 regression 위험이 증가한다.
- 일부를 준비 중으로만 표시: 사용자 clarification의 “8개 이상 모두 완전 인터랙티브” 결정과 맞지 않는다.

## Decision: WCAG AA 기대치를 만족하는 밝은 workbench 색상 체계

**Rationale**: 현재 문제는 database 화면의 검정 배경과 뒤섞인 글자색이다. SQL code block은 어두운 배경을 제한적으로 유지할 수 있지만, page/panel/table/control의 기본 workbench는 일반 텍스트와 테이블 셀 대비가 검증 가능한 수준이어야 한다.

**Alternatives considered**:

- 기존 cinematic dark theme 유지: 사용자 문제를 직접 해결하지 못하고 대비 검증이 어렵다.
- WCAG AAA 목표: 학습 UI의 상태 색상 다양성과 브랜드/시각 강조를 과도하게 제한할 수 있다.

## Decision: trace state를 단일 동기화 source로 사용

**Rationale**: query line, phase badge, input tables, output table, row motion, cell highlights가 서로 다른 state에서 계산되면 단계 전환 시 불일치가 생긴다. 각 `TraceStep<DatabaseTraceState>`가 현재 화면의 모든 의미 상태를 포함해야 한다.

**Alternatives considered**:

- component에서 phase별 표시를 재계산: React component에 SQL logic이 섞이고 테스트가 어려워진다.
- CSS만으로 상태 표현: query/table/설명 동기화 검증이 불가능하다.

## Decision: 테스트는 trace correctness와 UI synchronization 중심

**Rationale**: SQL 학습 기능의 correctness는 최종 결과뿐 아니라 중간 단계의 설명 가능성에 있다. 따라서 모든 예시는 query line range, row/cell highlight target, phase mapping, final output, component controls를 테스트해야 한다.

**Alternatives considered**:

- 시각 snapshot 중심 테스트: 색상/레이아웃 변화에 취약하고 SQL 동작 의미를 검증하지 못한다.
- 수동 확인만 사용: 8개 예시 확장 후 regression을 잡기 어렵다.
