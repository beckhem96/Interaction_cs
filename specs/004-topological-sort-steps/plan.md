# Implementation Plan: DAG Topological Sort Step Workbench

**Branch**: `004-topological-sort-steps` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-topological-sort-steps/spec.md`

## Summary

그래프 도메인에 DAG 위상 정렬 workbench를 추가한다. 구현은 기존 `src/concepts/graphs` 패턴을 확장해, 순수 trace 생성 함수가 진입 차수 계산, zero-in-degree 후보 큐, 선택 노드, outgoing edge 처리, 새 후보 개방, 최종 순서 검증을 단계별 상태로 반환하게 한다. React page는 이 trace를 SVG DAG, 진입 차수 표, 후보 큐, 결과 순서, 설명, 코드 패널, 수동/자동 컨트롤로 렌더링만 한다.

## Technical Context

**Concept Domain**: Graph algorithms

**Learning Slice**: DAG에서 in-degree/Kahn 방식 위상 정렬을 학습한다. 한 단계에서 후보 노드를 확인하고, deterministic tie rule로 노드를 선택하고, outgoing edge 처리로 진입 차수가 줄어 새 후보가 열리는 흐름과 최종 순서 검증을 하나의 workbench에서 다룬다.

**Language/Version**: TypeScript 5.8, React 19, Vite 7, Vitest 3

**Primary Dependencies**: 기존 React/Vite/React Router/Vitest만 사용한다. graph layout library, animation library, parser, external algorithm package는 추가하지 않는다.

**Trace Model**: `TraceStep<TopologicalSortTraceState>[]`를 생성한다. 각 step은 예제 id, 현재 motion/action, SVG node/edge render state, zero-in-degree candidate queue, selected node, affected outgoing edges, in-degree rows with before/after values, accumulated result order, remaining nodes, final validation summary, cycle-blocked summary when applicable, Korean explanation, pseudo-code phase, language별 code line highlight를 포함한다.

**Interaction Mode**: 수동 Previous/Next/Reset과 단계 slider가 기본이다. 자동 재생은 보조 컨트롤로 제공하며, 사용자가 수동 이동하거나 reset하면 자동 진행을 멈춘다. 후보 tie는 node label alphabetical order 또는 example-defined order로 고정해 replay가 항상 같다.

**Visualization Technology**: SVG first. 고정 DAG layout은 6-7개 노드, 7-9개 방향 간선을 대상으로 하며, node/edge/arrow/label overlap을 피하는 좌표를 수동 curated data로 둔다. candidate, selected, processed, affected edge, newly opened candidate, complete state는 색상과 텍스트/아이콘/표 상태를 함께 사용해 구분한다.

**Code/Query Presentation**: C, C++, Java, Python, JavaScript 코드 탭을 제공한다. 각 trace step은 선택된 언어의 위상 정렬 코드 line 또는 line range를 highlight한다. SQL/query panel은 사용하지 않는다.

**Storage**: N/A. curated DAG example, trace generation, code examples는 source constants와 pure functions로 제공하고 browser storage는 사용하지 않는다.

**Testing**: Vitest trace unit tests로 initial in-degree, candidate queue, deterministic tie-break, node selection, outgoing edge processing, in-degree decrement, new candidate enqueue, final order validation, cycle guard, all-language code highlights를 검증한다. React Testing Library component tests로 page title, SVG DAG, candidate queue, in-degree table, result order, controls, slider, code tabs, step synchronization을 검증한다.

**Target Platform**: Browser/local web app

**Project Type**: Interactive CS concept visualization web app

**Performance Goals**: fixed example trace에서 단계 이동과 자동 재생이 즉시 반응해야 한다. trace는 module-level constant 또는 memoized value로 재사용하고, 단계 이동 중 graph layout 재계산을 하지 않는다.

**Constraints**: Korean-first UI, graph domain 단일 scope, trace logic outside React, React components render immutable trace state only, manual controls remain primary, desktop에서 interaction stage와 code panel side-by-side, primary Next button visible in the workbench, visual state는 색상만으로 구분하지 않는다.

**Scale/Scope**: fixed DAG example 1개, nodes 6-7개, directed edges 7-9개, multi-candidate step 최소 1개, new-candidate step 최소 1개, complete validation step 포함, total 18-30 trace steps 예상. DFS-based topological sort, editable graph input, tree/network/Redis lessons, multiple graph algorithms comparison은 제외한다.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Trace-first: PASS. 위상 정렬 trace 생성 함수가 UI보다 먼저 단계 상태와 highlight metadata를 정의한다.
- Domain separation: PASS. 후보 선택, 진입 차수 갱신, cycle guard, final validation은 `src/concepts/graphs/algorithms/topologicalSort.ts`에 두고 React는 렌더링과 step control만 담당한다.
- Korean workbench: PASS. 한국어 설명, DAG stage, 후보 큐, 진입 차수 표, 결과 순서, 코드 패널, primary Next control을 한 workbench에 배치한다.
- Semantic sync: PASS. graph state, table row, queue, result order, explanation, code highlight 모두 같은 trace step에서 나온다.
- Verification: PASS. trace unit tests, component render/interaction tests, full test/build verification을 계획한다.
- Technology policy: PASS. 새 dependency 없이 기존 SVG/React/Vitest 패턴을 사용한다.

## Project Structure

### Documentation (this feature)

```text
specs/004-topological-sort-steps/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- topological-sort-workbench.md
|-- checklists/
|   `-- requirements.md
`-- spec.md
```

### Source Code (repository root)

```text
src/concepts/graphs/
|-- types.ts
|-- algorithms/
|   `-- topologicalSort.ts
|-- code/
|   `-- topologicalSortExamples.ts
|-- components/
|   |-- TopologicalSortPage.tsx
|   `-- TopologicalSortPage.test.tsx
`-- tests/
    `-- topologicalSort.test.ts

src/
|-- App.tsx
|-- App.test.tsx
|-- pages/HomePage.tsx
|-- pages/HomePage.test.tsx
`-- styles.css

CONCEPT_SPEC.md
```

**Structure Decision**: 기존 graph domain을 재사용한다. `types.ts`에는 topological sort 전용 state/type을 추가하고, `algorithms/topologicalSort.ts`에는 curated DAG, trace generation, in-degree helpers, queue/tie-break, edge processing, final validation, cycle guard를 둔다. `code/topologicalSortExamples.ts`는 5개 언어 코드와 highlight map을 제공한다. `components/TopologicalSortPage.tsx`는 `useStepController` 패턴으로 SVG DAG, 후보 큐, 진입 차수 표, 결과 순서, 설명, 코드 패널, 컨트롤을 조합한다. route는 `/graphs/topological-sort`로 추가하고 Home과 concept 문서에서 접근 가능하게 한다.

## Phase 0: Research

Completed in [research.md](./research.md). 모든 기술/UX 결정은 기존 프로젝트 패턴과 constitution에 맞춰 해결했으며 unresolved clarification marker는 없다.

## Phase 1: Design & Contracts

Completed artifacts:

- [data-model.md](./data-model.md)
- [contracts/topological-sort-workbench.md](./contracts/topological-sort-workbench.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Trace-first: PASS. data model과 contract가 `TopologicalSortTraceStep` 중심으로 작성되어 UI가 trace state를 렌더링하는 구조를 요구한다.
- Domain separation: PASS. trace helpers, code examples, page rendering, tests가 파일 단위로 분리되어 있다.
- Korean workbench: PASS. contract와 quickstart가 Korean labels, visible controls, desktop graph/code side-by-side를 요구한다.
- Semantic sync: PASS. contract가 DAG, queue, in-degree table, result order, explanation, code highlight synchronization을 검증 조건으로 명시한다.
- Verification: PASS. quickstart에 focused trace/component tests, full test suite, build verification을 포함했다.
- Technology policy: PASS. SVG와 기존 dependencies만 사용하므로 추가 justification이 필요 없다.

## Complexity Tracking

No constitution violations.
