# Implementation Plan: Dijkstra Graph Step Workbench

**Branch**: `002-dijkstra-graph-steps` | **Date**: 2026-06-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-dijkstra-graph-steps/spec.md`

## Summary

다익스트라 최단 경로를 무방향/방향 가중 그래프 예제로 단계별 학습하는 그래프 알고리즘 workbench를 추가한다. 구현은 기존 `src/concepts/graphs` 패턴을 확장하여 순수 trace 생성 함수가 그래프 상태, 거리 표, frontier, relaxation 결과, 코드 라인 매핑을 반환하고, React 컴포넌트는 그 trace를 SVG 그래프, 거리 표, 설명, 코드 패널, 수동/자동 컨트롤로 렌더링한다.

## Technical Context

**Concept Domain**: Graph algorithms

**Learning Slice**: 다익스트라의 현재 노드 선택, 간선 검사, relaxation, no-update, 확정 상태, 최종 경로 복원을 한 workbench에서 학습한다.

**Language/Version**: TypeScript 5.8, React 19, Vite 7, Vitest 3

**Primary Dependencies**: 기존 React/Vite/React Router/Vitest만 사용한다. 새 런타임 라이브러리나 그래프 알고리즘 패키지는 추가하지 않는다.

**Trace Model**: `TraceStep<DijkstraTraceState>[]`를 생성한다. 각 step은 예제 id, 방향 모드, 현재 motion, 노드/간선 SVG 상태, 거리 표 행, frontier 후보, 현재 노드, 검사 간선, relaxation 비교값, 최종 경로, 한국어 설명, pseudo-code line, 언어별 code line highlight를 포함한다.

**Interaction Mode**: 수동 Previous/Next/Reset과 단계 슬라이더가 기본이다. 자동 재생은 보조 컨트롤로 제공하며, 예제 전환 또는 수동 이동 시 정지/초기화한다. 최종 단계에서는 도착 노드 선택으로 경로 표시만 갱신하고 알고리즘 trace 자체는 변형하지 않는다.

**Visualization Technology**: SVG first. 기존 graph SVG 구성요소 스타일을 확장해 방향 화살표, 가중치 라벨, 현재/후보/갱신/건너뜀/확정/최종 경로 상태를 표현한다.

**Code/Query Presentation**: C, C++, Java, Python, JavaScript 코드 탭을 제공한다. 각 trace step은 선택된 언어의 line 또는 range를 강조한다. SQL이나 외부 query 패널은 사용하지 않는다.

**Storage**: N/A. 고정 curated 예제와 trace는 소스 코드 상수/순수 함수로 제공하며 브라우저 저장소를 사용하지 않는다.

**Testing**: Vitest trace unit tests로 최단 거리, predecessor, tie-break, directed/undirected adjacency, unreachable, no-update, final path reconstruction, code line highlight mapping을 검증한다. React Testing Library component tests로 예제 탭, 단계 컨트롤, 거리 표, 코드 탭, 최종 도착 노드 선택을 검증한다.

**Target Platform**: Browser/local web app

**Project Type**: Interactive CS concept visualization web app

**Performance Goals**: 고정 예제 2개와 짧은 trace에서 단계 이동/자동 재생이 즉시 반응해야 한다. trace는 렌더 중 재계산하지 않고 모듈 상수 또는 memoized 값으로 사용한다.

**Constraints**: 한국어-first UI, graph/search domain 단일 scope, algorithm logic은 React 밖에 둔다, 수동 step이 primary, 색상 외 텍스트/라벨로 상태를 구분한다, 음수 가중치 입력은 지원하지 않는다.

**Scale/Scope**: 무방향 그래프 예제 1개, 방향 그래프 예제 1개, 각 예제 노드 약 5-7개와 간선 약 7-10개. 임의 그래프 편집, 사용자 가중치 입력, 음수 가중치 대응, 여러 알고리즘 비교는 이번 slice에서 제외한다.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Trace-first: PASS. 다익스트라 trace 생성 함수와 step 상태를 먼저 정의한다.
- Domain separation: PASS. 알고리즘과 trace 생성은 `src/concepts/graphs/algorithms/dijkstra.ts`에 두고 React 컴포넌트는 렌더링만 담당한다.
- Korean workbench: PASS. 한국어 설명, 그래프, 거리 표, 코드 패널, primary Next control을 한 workbench 안에 둔다.
- Semantic sync: PASS. 그래프/거리 표 상태와 code line highlight가 같은 trace step에서 나온다.
- Verification: PASS. trace unit tests, component render/interaction tests, build verification을 계획한다.
- Technology policy: PASS. 새 dependency 없이 기존 SVG/React/Vitest 패턴을 사용한다.

## Project Structure

### Documentation (this feature)

```text
specs/002-dijkstra-graph-steps/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dijkstra-workbench.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
src/concepts/graphs/
├── types.ts
├── algorithms/
│   └── dijkstra.ts
├── code/
│   └── dijkstraExamples.ts
├── components/
│   ├── DijkstraPage.tsx
│   └── DijkstraPage.test.tsx
└── tests/
    └── dijkstra.test.ts

src/
├── App.tsx
├── pages/HomePage.tsx
└── styles.css
```

**Structure Decision**: 기존 graph domain을 재사용한다. `types.ts`에는 다익스트라 전용 타입을 추가하고, `algorithms/dijkstra.ts`는 두 curated 예제와 trace 생성, path reconstruction, tie-break를 담당한다. `code/dijkstraExamples.ts`는 5개 언어 코드와 라인 매핑을 제공한다. `components/DijkstraPage.tsx`는 `useStepController`와 SVG/표/코드 패널을 조합한다. 라우트는 `/graphs/dijkstra`를 추가하고 Home 카드에서 접근 가능하게 한다.

## Phase 0: Research

Completed in [research.md](./research.md). 모든 기술/UX 결정은 기존 프로젝트 패턴과 constitution에 맞춰 해결되었으며 미해결 clarification marker는 없다.

## Phase 1: Design & Contracts

Completed artifacts:

- [data-model.md](./data-model.md)
- [contracts/dijkstra-workbench.md](./contracts/dijkstra-workbench.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Trace-first: PASS. 데이터 모델은 `DijkstraTraceStep` 중심이며 UI contract도 trace-driven 렌더링을 요구한다.
- Domain separation: PASS. 순수 trace 함수, code examples, React page, tests가 파일 단위로 분리되어 있다.
- Korean workbench: PASS. quickstart와 UI contract가 한국어 label/description과 desktop workbench 배치를 요구한다.
- Semantic sync: PASS. contract가 graph/table/explanation/code highlight 동기화를 검증 조건으로 명시한다.
- Verification: PASS. trace tests, component tests, full test/build 명령이 quickstart에 포함되어 있다.
- Technology policy: PASS. SVG와 기존 dependencies만 사용하므로 추가 justification이 필요 없다.

## Complexity Tracking

No constitution violations.
