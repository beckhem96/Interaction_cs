# Implementation Plan: SCC Graph Step Workbench

**Branch**: `005-scc-graph-steps` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-scc-graph-steps/spec.md`

## Summary

그래프 도메인에 방향 그래프 SCC(Strongly Connected Components) workbench를 추가한다. 구현은 기존 `src/concepts/graphs` 패턴을 확장해, 순수 trace 생성 함수가 Kosaraju 방식의 첫 DFS 종료 순서, reversed graph 전환, 두 번째 DFS 컴포넌트 수집, 최종 SCC 검증과 condensation DAG 요약을 단계별 상태로 반환하게 한다. React page는 이 trace를 SVG 방향 그래프, 종료 순서 스택, 현재 컴포넌트, 확정 SCC 목록, condensation 요약, 설명, 코드 패널, 수동/자동 컨트롤로 렌더링만 한다.

## Technical Context

**Concept Domain**: Graph algorithms

**Learning Slice**: 방향 그래프에서 "서로 도달 가능한 노드 집합"을 SCC로 묶는 흐름을 학습한다. 한 단계에서 첫 DFS 방문/종료, finish stack 누적, 간선 방향 뒤집기, stack pop 순서의 두 번째 DFS, SCC 확정, 컴포넌트 압축 결과를 하나의 workbench에서 다룬다.

**Language/Version**: TypeScript 5.8, React 19, Vite 7, Vitest 3

**렌더링 변경 (2026-06-21)**: 사용자가 그래프 렌더링 기술로 React Flow와 ELK.js를 선택했다. 이 결정은 기존 SVG 전용 의존성 결정을 대체한다. trace 생성은 계속 순수 함수로 유지하고, React 컴포넌트는 불변 trace 상태를 공용 React Flow 캔버스로 변환하며, ELK는 그래프 구조별로 겹침을 줄인 안정적인 배치를 계산한다.

**Primary Dependencies**: 기존 React/Vite/React Router/Vitest만 사용한다. graph layout library, animation library, parser, external algorithm package는 추가하지 않는다.

**Trace Model**: `TraceStep<SccTraceState>[]`를 생성한다. 각 step은 예제 id, 현재 phase/motion, SVG node/edge render state, DFS pass, active node, active edge, recursion/path stack, visited nodes for current pass, finish order stack, reversed graph flag, stack pop candidate, current SCC candidate, finalized SCC groups, condensation edges, final validation summary, Korean explanation, pseudo-code phase, language별 code line highlight를 포함한다.

**Interaction Mode**: 수동 Previous/Next/Reset과 단계 slider가 기본이다. 자동 재생은 보조 컨트롤로 제공하며, 사용자가 수동 이동하거나 reset하면 자동 진행을 멈춘다. 첫 DFS 시작 순서와 adjacency iteration order는 example-defined order로 고정해 replay가 항상 같다.

**Visualization Technology**: SVG first. 고정 directed graph layout은 6개 노드, 7-9개 방향 간선을 대상으로 하며, node/edge/label overlap을 피하는 좌표와 label offset을 curated data로 둔다. 역방향 graph phase에서는 같은 좌표를 유지하고 arrow direction/state만 바꾼다. SCC group, active path, current component, finalized component, cross-component edge는 색상과 텍스트/아이콘/outline/badge를 함께 사용해 구분한다.

**Code/Query Presentation**: C, C++, Java, Python, JavaScript 코드 탭을 제공한다. 각 trace step은 선택된 언어의 SCC 코드 line 또는 line range를 highlight한다. SQL/query panel은 사용하지 않는다.

**Storage**: N/A. curated directed graph example, trace generation, code examples는 source constants와 pure functions로 제공하고 browser storage는 사용하지 않는다.

**Testing**: Vitest trace unit tests로 example validity, first-pass finish order, reversed edge generation, second-pass pop order, SCC membership, singleton SCC, cross-component edge handling, condensation edge generation, final validation, all-language code highlights를 검증한다. React Testing Library component tests로 page title, SVG graph, finish stack, current component, finalized SCC list, condensation panel, controls, slider, code tabs, step synchronization을 검증한다.

**Target Platform**: Browser/local web app

**Project Type**: Interactive CS concept visualization web app

**Performance Goals**: fixed example trace에서 단계 이동과 자동 재생이 즉시 반응해야 한다. trace는 module-level constant 또는 memoized value로 재사용하고, 단계 이동 중 graph layout 재계산을 하지 않는다.

**Constraints**: Korean-first UI, graph domain 단일 scope, trace logic outside React, React components render immutable trace state only, manual controls remain primary, desktop에서 interaction stage와 code panel side-by-side, primary Next button visible in the workbench, visual state는 색상만으로 구분하지 않는다.

**Scale/Scope**: fixed directed graph example 1개, nodes 6개, directed edges 7-9개, 3-node SCC 1개, 2-node SCC 1개, singleton SCC 1개, cross-component directed edge 최소 2개, complete validation step과 condensation summary 포함, total 24-40 trace steps 예상. Tarjan/Gabow 비교, editable graph input, shortest path 확장, tree/network/Redis lessons는 제외한다.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Trace-first: PASS. SCC trace 생성 함수가 UI보다 먼저 단계 상태와 highlight metadata를 정의한다.
- Domain separation: PASS. DFS pass, finish stack, edge reversal, component grouping, condensation validation은 `src/concepts/graphs/algorithms/stronglyConnectedComponents.ts`에 두고 React는 렌더링과 step control만 담당한다.
- Korean workbench: PASS. 한국어 설명, SVG graph stage, 종료 순서 스택, SCC 목록, condensation 요약, 코드 패널, primary Next control을 한 workbench에 배치한다.
- Semantic sync: PASS. graph state, stack, current component, finalized SCC list, explanation, code highlight 모두 같은 trace step에서 나온다.
- Verification: PASS. trace unit tests, component render/interaction tests, full test/build verification을 계획한다.
- Technology policy: PASS. 새 dependency 없이 기존 SVG/React/Vitest 패턴을 사용한다.

## Project Structure

### Documentation (this feature)

```text
specs/005-scc-graph-steps/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- scc-workbench.md
|-- checklists/
|   `-- requirements.md
`-- spec.md
```

### Source Code (repository root)

```text
src/concepts/graphs/
|-- types.ts
|-- algorithms/
|   `-- stronglyConnectedComponents.ts
|-- code/
|   `-- stronglyConnectedComponentsExamples.ts
|-- components/
|   |-- StronglyConnectedComponentsPage.tsx
|   `-- StronglyConnectedComponentsPage.test.tsx
`-- tests/
    `-- stronglyConnectedComponents.test.ts

src/
|-- App.tsx
|-- App.test.tsx
|-- pages/HomePage.tsx
|-- pages/HomePage.test.tsx
`-- styles.css

CONCEPT_SPEC.md
```

**Structure Decision**: 기존 graph domain을 재사용한다. `types.ts`에는 SCC 전용 state/type을 추가하고, `algorithms/stronglyConnectedComponents.ts`에는 curated directed graph, trace generation, first DFS helpers, reverse-edge helpers, second DFS helpers, SCC validation, condensation edge generation을 둔다. `code/stronglyConnectedComponentsExamples.ts`는 5개 언어 코드와 highlight map을 제공한다. `components/StronglyConnectedComponentsPage.tsx`는 `useStepController` 패턴으로 SVG graph, finish stack, current component, finalized SCC list, condensation panel, 설명, 코드 패널, 컨트롤을 조합한다. route는 `/graphs/scc`로 추가하고 Home과 concept 문서에서 접근 가능하게 한다.

## Phase 0: Research

Completed in [research.md](./research.md). 모든 기술/UX 결정은 기존 프로젝트 패턴과 constitution에 맞춰 해결했으며 unresolved clarification marker는 없다.

## Phase 1: Design & Contracts

Completed artifacts:

- [data-model.md](./data-model.md)
- [contracts/scc-workbench.md](./contracts/scc-workbench.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Trace-first: PASS. data model과 contract가 `SccTraceStep` 중심으로 작성되어 UI가 trace state를 렌더링하는 구조를 요구한다.
- Domain separation: PASS. trace helpers, code examples, page rendering, tests가 파일 단위로 분리되어 있다.
- Korean workbench: PASS. contract와 quickstart가 Korean labels, visible controls, desktop graph/code side-by-side를 요구한다.
- Semantic sync: PASS. contract가 graph, finish stack, current component, SCC list, condensation panel, explanation, code highlight synchronization을 검증 조건으로 명시한다.
- Verification: PASS. quickstart에 focused trace/component tests, full test suite, build verification을 포함했다.
- Technology policy: PASS. SVG와 기존 dependencies만 사용하므로 추가 justification이 필요 없다.

## Complexity Tracking

No constitution violations.
