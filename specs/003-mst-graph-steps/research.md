# Research: MST Graph Step Workbench

## Decision: 기존 graph domain 안에 MST slice를 추가한다

**Rationale**: 프로젝트에는 이미 `src/concepts/graphs` 아래에 graph structures, BFS/DFS traversal, Dijkstra가 분리되어 있다. MST는 weighted graph의 대표 알고리즘이므로 같은 graph algorithm domain에서 타입, SVG 스타일, route, Home 카드, code tab 패턴을 확장하는 편이 scope를 작게 유지한다.

**Alternatives considered**:

- 별도 `src/concepts/mst` domain: graph와 중복되는 node/edge/render 패턴이 늘어난다.
- tree domain으로 이동: MST 결과는 트리 형태지만 학습 입력과 알고리즘 결정은 weighted graph에서 출발한다.
- TCP/UDP/Redis로 전환: 그래프 도메인에 아직 core weighted-graph algorithm gap이 남아 있어 사용자 요청의 우선순위와 맞지 않는다.

## Decision: Kruskal을 첫 MST 학습 slice로 삼는다

**Rationale**: Kruskal은 정렬된 간선 목록, 현재 후보 간선, 선택/스킵 이유, 연결 성분 변화를 단계별로 보여주기 좋다. 다익스트라 workbench 이후 learners가 weighted edge를 이미 보았으므로 "간선 비용을 기준으로 전체 연결 비용을 최소화한다"는 다음 학습 흐름도 자연스럽다.

**Alternatives considered**:

- Prim: frontier와 현재 트리 확장이 핵심이라 Dijkstra와 시각 흐름이 비슷해 보일 수 있다. Kruskal의 cycle prevention이 MST 개념을 더 선명하게 보여준다.
- Kruskal과 Prim 동시 구현: 한 task가 여러 알고리즘 비교로 커져 review 범위가 커진다. Prim은 후속 feature로 분리한다.

## Decision: 수동 deterministic trace generator를 사용한다

**Rationale**: 학습 목표는 library 실행 결과보다 각 decision step을 설명하는 것이다. 고정 예제와 순수 함수 trace는 sorted edge order, union decision, cycle skip, total cost, code highlight를 테스트하기 쉽다.

**Alternatives considered**:

- 외부 union-find/graph library: 작은 curated graph에는 과하고 learner-facing metadata를 직접 만들기 어렵다.
- React component 안에서 step 계산: constitution의 domain separation 원칙을 위반한다.

## Decision: fixed connected undirected weighted graph 1개로 시작한다

**Rationale**: 첫 MST slice는 graph editing보다 Kruskal의 decision process가 중요하다. 한 curated graph에 select와 skip, equal-weight tie, final total cost가 모두 들어가면 학습과 테스트가 명확하다.

**Alternatives considered**:

- 여러 예제 tabs: 초기 구현 범위가 커지고 핵심 trace contract를 검증하기 전 UI 상태가 늘어난다.
- disconnected graph 포함: minimum spanning forest 설명이 필요해져 첫 MST lesson의 범위가 흐려진다.
- learner-authored graph: validation, layout, edge editing이 별도 기능이 된다.

## Decision: equal-weight tie-break는 weight 다음 edge label 순서로 고정한다

**Rationale**: 같은 weight 간선이 있을 때 deterministic order를 명시하면 trace 순서와 테스트 기대값이 항상 같다. edge label 순서는 화면 설명에도 그대로 사용할 수 있다.

**Alternatives considered**:

- 입력 배열 순서: 구현 세부에 기대어 learner 설명이 약해진다.
- tie가 없는 예제만 사용: spec의 edge case와 deterministic replay 요구를 충분히 검증하지 못한다.

## Decision: SVG 시각화를 유지한다

**Rationale**: 노드 6개 안팎의 2D weighted graph는 SVG로 충분하다. SVG는 edge weight label, selected/skipped class, component labels, aria labels, component tests를 지원하기 좋다.

**Alternatives considered**:

- Canvas: 현재 규모에서는 접근성과 테스트 비용이 더 크다.
- WebGL/Three.js: 2D 알고리즘 학습 slice에는 과하다.

## Decision: graph, sorted edge list, component summary, total cost를 함께 보여준다

**Rationale**: Kruskal은 그래프 그림만으로는 "왜 이 간선을 건너뛰는지"가 모호하다. sorted edge list는 알고리즘 진행 순서를 보여주고, component summary는 cycle 여부를 설명하며, total cost는 선택 결과를 누적해 final MST 의미를 확인하게 한다.

**Alternatives considered**:

- graph-only visualization: cycle skip 이유와 tie-break 순서를 설명하기 어렵다.
- table-only visualization: MST가 모든 노드를 연결하는 구조라는 시각 학습 가치가 줄어든다.

## Decision: 5개 언어 코드 탭과 per-language line mapping을 제공한다

**Rationale**: 프로젝트 규칙상 algorithm/data-structure code examples는 C, C++, Java, Python, JavaScript를 제공해야 한다. 기존 graph 구조와 Dijkstra 코드 패널 패턴을 재사용하면 line highlight를 trace step에 안정적으로 연결할 수 있다.

**Alternatives considered**:

- 의사코드만 제공: 프로젝트 규칙을 충족하지 못한다.
- 한 언어만 제공: 기존 학습 페이지의 code tab 일관성이 깨진다.

## Decision: 테스트는 trace correctness를 중심으로 둔다

**Rationale**: MST correctness는 sorted order, component merge, cycle skip, selected edge count, total cost에서 결정된다. UI 테스트는 workbench render와 control/highlight sync에 집중하고, 알고리즘 판단은 trace unit tests에서 직접 검증한다.

**Alternatives considered**:

- 시각 snapshot 위주 테스트: 스타일 변화에 취약하고 MST correctness를 직접 보장하지 못한다.
