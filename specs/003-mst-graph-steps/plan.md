# Implementation Plan: MST Graph Step Workbench

**Branch**: `003-mst-graph-steps` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-mst-graph-steps/spec.md`

## Summary

그래프 도메인에 Kruskal 최소 신장 트리(MST) workbench를 추가한다. 구현은 기존 `src/concepts/graphs` 패턴을 확장해 순수 trace 생성 함수가 정렬된 간선, 현재 후보 간선, 선택/스킵 결정, 연결 성분 병합, 누적 비용, 코드 라인 매핑을 반환하고, React 컴포넌트는 그 trace를 SVG 그래프, 정렬 간선 목록, 성분 요약, 설명, 코드 패널, 수동/자동 컨트롤로 렌더링한다.

## Technical Context

**Concept Domain**: Graph algorithms

**Learning Slice**: Kruskal MST의 가중치순 후보 간선 검사, 사이클 여부 판단, 연결 성분 병합, 선택 간선 누적, 최종 총 비용 검증을 한 workbench에서 학습한다.

**Language/Version**: TypeScript 5.8, React 19, Vite 7, Vitest 3

**Primary Dependencies**: 기존 React/Vite/React Router/Vitest만 사용한다. 새 그래프 알고리즘 라이브러리, union-find 패키지, 레이아웃 라이브러리는 추가하지 않는다.

**Trace Model**: `TraceStep<MstTraceState>[]`를 생성한다. 각 step은 예제 id, 현재 motion, SVG node/edge render state, 정렬된 edge row 목록, 현재 candidate edge, 선택된 edge ids, skipped edge ids, component groups, merge decision, cycle reason, total cost, selected edge count, completion summary, 한국어 설명, pseudo-code line, 언어별 code line highlight를 포함한다.

**Interaction Mode**: 수동 Previous/Next/Reset과 단계 slider가 기본이다. 자동 재생은 보조 컨트롤로 제공하며, 수동 이동이나 reset 시 정지한다. MST가 완성된 뒤에는 완료 step에서 남은 간선이 결과에 영향을 주지 않는 이유를 표시한다.

**Visualization Technology**: SVG first. 노드 6개 안팎과 간선 8-10개 규모의 curated weighted graph는 SVG로 충분하며, 간선 weight label, candidate/selected/skipped 상태, component label, aria label을 테스트하기 쉽다.

**Code/Query Presentation**: C, C++, Java, Python, JavaScript 코드 탭을 제공한다. 각 trace step은 선택된 언어의 Kruskal 코드 line 또는 range를 강조한다. SQL/query 패널은 사용하지 않는다.

**Storage**: N/A. 고정 예제와 trace는 코드 상수와 순수 함수로 제공하며 브라우저 저장소를 사용하지 않는다.

**Testing**: Vitest trace unit tests로 edge sorting, equal-weight tie-break, component merge, cycle skip, selected edge count, total cost, deterministic replay, all-language code highlights를 검증한다. React Testing Library component tests로 page title, graph stage, edge list, component summary, controls, code tabs, synchronized step movement를 검증한다.

**Target Platform**: Browser/local web app

**Project Type**: Interactive CS concept visualization web app

**Performance Goals**: 고정 예제 trace에서 단계 이동과 자동 재생이 즉시 반응해야 한다. trace는 모듈 상수 또는 memoized 값으로 재사용하고, 단계 이동 중 graph layout 재계산이 없어야 한다.

**Constraints**: 한국어-first UI, graph domain 단일 scope, 알고리즘/trace logic은 React 밖에 둔다, React는 immutable trace state만 렌더링한다, 수동 step이 primary interaction이다, 색상만으로 상태를 구분하지 않는다, tree/TCP/UDP/Redis 범위로 확장하지 않는다.

**Scale/Scope**: fixed connected undirected weighted graph 1개, 노드 6개 내외, 간선 8-10개, equal-weight tie 사례 최소 1개, 선택/스킵/완료를 포함한 약 18-30 trace steps. Prim 비교, learner-authored graph editing, disconnected graph spanning forest는 이번 slice에서 제외한다.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Trace-first: PASS. MST trace 생성 함수와 step 상태를 먼저 정의하고 UI는 그 결과만 렌더링한다.
- Domain separation: PASS. Kruskal decision, sorting, component merge logic은 `src/concepts/graphs/algorithms/mst.ts`에 두고 React 컴포넌트는 렌더링과 컨트롤 상태만 담당한다.
- Korean workbench: PASS. 한국어 설명, SVG 그래프, 간선 목록, 성분 요약, 코드 패널, primary Next control을 한 workbench 안에 둔다.
- Semantic sync: PASS. graph state, edge list status, component summary, total cost, code line highlight가 같은 trace step에서 나온다.
- Verification: PASS. trace unit tests, component render/interaction tests, full test/build verification을 계획한다.
- Technology policy: PASS. 새 dependency 없이 기존 SVG/React/Vitest 패턴을 사용한다.

## Project Structure

### Documentation (this feature)

```text
specs/003-mst-graph-steps/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── mst-workbench.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
src/concepts/graphs/
├── types.ts
├── algorithms/
│   └── mst.ts
├── code/
│   └── mstExamples.ts
├── components/
│   ├── MstPage.tsx
│   └── MstPage.test.tsx
└── tests/
    └── mst.test.ts

src/
├── App.tsx
├── App.test.tsx
├── pages/HomePage.tsx
├── pages/HomePage.test.tsx
└── styles.css

CONCEPT_SPEC.md
```

**Structure Decision**: 기존 graph domain을 재사용한다. `types.ts`에는 MST 전용 타입을 추가하고, `algorithms/mst.ts`는 curated 예제, Kruskal trace generation, component merge/cycle decision, deterministic tie-break를 담당한다. `code/mstExamples.ts`는 5개 언어 코드와 highlight mapping을 제공한다. `components/MstPage.tsx`는 `useStepController`와 SVG/edge list/component summary/code panel을 조합한다. 라우트는 `/graphs/mst`를 추가하고 Home 카드와 graph documentation에서 접근 가능하게 한다.

## Phase 0: Research

Completed in [research.md](./research.md). 모든 기술/UX 결정은 기존 프로젝트 패턴과 constitution에 맞춰 해결했으며 미해결 clarification marker는 없다.

## Phase 1: Design & Contracts

Completed artifacts:

- [data-model.md](./data-model.md)
- [contracts/mst-workbench.md](./contracts/mst-workbench.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Trace-first: PASS. data model과 UI contract 모두 `MstTraceStep` 중심으로 정의한다.
- Domain separation: PASS. trace, code examples, page rendering, tests가 파일 단위로 분리된다.
- Korean workbench: PASS. contract와 quickstart가 한국어 labels, visible controls, desktop graph/code side-by-side를 요구한다.
- Semantic sync: PASS. contract가 graph/edge list/component/explanation/code highlight 동기화를 검증 조건으로 명시한다.
- Verification: PASS. quickstart에 focused trace/component tests, full test suite, build 검증을 포함했다.
- Technology policy: PASS. SVG와 기존 dependencies만 사용하므로 추가 justification이 필요 없다.

## Complexity Tracking

No constitution violations.
