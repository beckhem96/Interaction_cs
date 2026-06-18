# Implementation Plan: SQL/DATABASE Workbench Enhancement

**Branch**: `001-enhance-sql-workbench` | **Date**: 2026-06-18 | **Spec**: `specs/001-enhance-sql-workbench/spec.md`

**Input**: Feature specification from `specs/001-enhance-sql-workbench/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

데이터베이스 학습 화면의 어두운 배경/불안정한 글자색 문제를 고치고, 고정 SQL 예시 기반의 단계별 workbench를 8개 초기 카테고리로 확장한다. 기존 `SUB QUERY`, `JOIN`, `GROUP BY`, `HAVING`, `UNION`, `ORDER/LIMIT` 예시는 보존하며, `UNION ALL`과 `WINDOW RANK`를 완전 인터랙티브 예시로 추가한다. 모든 예시는 쿼리 라인 강조, 입력 테이블, 중간/결과 테이블, 현재 단계 설명을 같은 작업 영역에서 동기화한다.

## Technical Context

**Concept Domain**: Database / SQL

**Learning Slice**: SQL/DATABASE workbench 가독성 개선 + 8개 고정 예시의 단계형 시각화

**Language/Version**: TypeScript, React, Vite 프로젝트의 기존 버전 사용

**Primary Dependencies**: 기존 React, React Router, Vitest 사용. 새 SQL 엔진, parser, 외부 렌더링 라이브러리는 추가하지 않음.

**Trace Model**: `TraceStep<DatabaseTraceState>` 기반. 각 step은 SQL phase, active query lines, input tables, output rows, active columns/rows, row motion, cell highlights, Korean summary/explanation을 포함한다.

**Interaction Mode**: 수동 Previous/Next/Reset이 기준이며, 기존 자동 재생은 보조 기능으로 유지한다. 예시 전환 시 단계는 첫 단계로 초기화한다.

**Visualization Technology**: 기존 HTML table + CSS 기반 workbench를 유지한다. SQL/table 동기화는 DOM 렌더링과 CSS 상태 클래스/데이터 속성으로 표현한다.

**Code/Query Presentation**: SQL query line highlight를 각 trace step의 `activeQueryLines`와 동기화한다. `UNION ALL`과 `RANK()`는 별도 query와 pseudo/logical sequence를 가진다.

**Storage**: 브라우저 영속 저장 없음. 고정 예시 데이터는 database concept 모듈의 정적 fixtures로 관리한다.

**Testing**: Vitest trace tests, component render/control tests, query line/table synchronization tests, contrast-token/DOM 상태 검증.

**Target Platform**: 브라우저 기반 로컬 웹 앱

**Project Type**: Concept visualization web app

**Performance Goals**: 8개 예시 전환과 단계 이동이 즉시 반응해야 하며, 각 예시는 3개 이하의 입력 테이블과 학습 가능한 소형 데이터셋을 사용한다.

**Constraints**: Korean-first UI, database/SQL 단일 도메인, 고정 예시 기반 수동 trace, 임의 SQL 입력/실행 제외, WCAG AA 대비 기대치, 기존 6개 예시 보존.

**Scale/Scope**: 완전 인터랙티브 초기 카테고리 8개: `SUB QUERY`, `JOIN`, `GROUP BY`, `HAVING`, `UNION`, `UNION ALL`, `ORDER/LIMIT`, `WINDOW RANK`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Trace-first: PASS. 모든 SQL 예시는 UI 렌더링 전에 deterministic trace step으로 정의한다.
- Domain separation: PASS. SQL 동작/fixtures/trace 생성은 `src/concepts/database/engine/` 및 `types.ts`에 두고 React component는 현재 step 렌더링만 담당한다.
- Korean workbench: PASS. learner-facing 설명, 단계 제목, 컨트롤, 예시 탭은 한국어 중심으로 유지한다.
- Semantic sync: PASS. `activeQueryLines`, `phase`, row motion, cell highlights가 같은 trace step에서 나온다.
- Verification: PASS. trace generator tests와 component render/control tests를 추가/수정하고 `npm run build`를 완료 조건으로 둔다.
- Technology policy: PASS. 새 SQL 엔진/외부 라이브러리 없이 고정 manual trace로 구현한다.

## Project Structure

### Documentation (this feature)

```text
specs/001-enhance-sql-workbench/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── database-workbench-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
src/concepts/database/
├── types.ts
├── engine/
│   └── selectLogicalExecution.ts
├── code/
│   └── sqlSyntaxHighlight.ts
├── components/
│   ├── DatabasePage.tsx
│   └── DatabasePage.test.tsx
└── tests/
    └── selectLogicalExecution.test.ts

src/styles.css
```

**Structure Decision**: 기존 database concept 구조를 유지한다. `selectLogicalExecution.ts`는 기존 6개 예시와 신규 `UNION ALL`, `WINDOW RANK` trace를 생성한다. `types.ts`에는 필요한 phase/id/motion/highlight tone만 확장한다. `DatabasePage.tsx`는 예시 선택, 현재 step 렌더링, 쿼리/테이블/workbench 동기화를 담당하되 SQL 동작 로직을 포함하지 않는다. `src/styles.css`는 database workbench의 WCAG AA 색상 기준과 상태별 시각 구분을 정리한다.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 없음 | 해당 없음 | 해당 없음 |

## Phase 0: Research Summary

`research.md`에 다음 결정을 기록했다.

- 고정 curated SQL 예시 + manual trace를 사용하고 임의 SQL 실행은 제외한다.
- 기존 6개 예시를 보존하고 `UNION ALL`, `WINDOW RANK`를 추가한다.
- database cinematic dark override는 WCAG AA를 만족하는 workbench 색상 체계로 대체한다.
- trace tests와 component tests를 검증의 중심으로 둔다.

## Phase 1: Design Summary

생성 산출물:

- `data-model.md`: SQL topic/category/example/visualization step/input table/result/highlight/reference video 모델 정의
- `contracts/database-workbench-ui.md`: UI 동작 계약과 테스트 가능한 화면 상태 정의
- `quickstart.md`: 구현 후 검증 절차

## Post-Design Constitution Check

- Trace-first: PASS. data model과 UI contract 모두 trace step을 단일 source of truth로 둔다.
- Domain separation: PASS. 설계 산출물은 engine/types/components 경계를 유지한다.
- Korean workbench: PASS. quickstart와 contract에서 한국어 설명/컨트롤 가시성을 검증한다.
- Semantic sync: PASS. contract가 active query line, phase, input/output table state 동시 변경을 요구한다.
- Verification: PASS. quickstart가 `npm run test`, `npm run build`, 수동 viewport/contrast 확인을 포함한다.
- Technology policy: PASS. 새 dependency 없음, manual trace 우선 원칙 준수.
