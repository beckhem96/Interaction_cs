# Research: SCC Graph Step Workbench

## Decision: 그래프 도메인의 다음 slice는 SCC이다

**Rationale**: 현재 graph coverage는 graph structures, BFS/DFS traversal, Dijkstra shortest path, Kruskal MST, DAG topological sort까지 포함한다. 하지만 directed graph에서 cycle과 mutual reachability를 분석하는 dedicated lesson이 없다. SCC는 방향 그래프의 순환 구조를 컴포넌트로 압축해 이후 dependency graph, condensation DAG, compiler/analysis topics와 연결할 수 있어 graph domain 안에서 이어지는 학습 가치가 크다.

**Alternatives considered**:

- Tree feature로 이동: tree domain은 이미 여러 구조와 연산이 구현되어 있으며, 사용자 요청은 graph gap 확인이 먼저였다.
- TCP/UDP/Redis로 이동: network/cache domain도 중요하지만 graph에 아직 directed cyclic component concept이 남아 있다.
- Bellman-Ford/Floyd-Warshall/A*: shortest path 계열을 더 늘리는 선택이지만, 이미 Dijkstra가 있고 SCC는 shortest path와 다른 graph concept을 새롭게 보여준다.

## Decision: 첫 구현은 Kosaraju 방식으로 제한한다

**Rationale**: Kosaraju 방식은 첫 DFS 종료 순서, graph reversal, 두 번째 DFS라는 큰 phase가 분명해 stage와 side panels로 설명하기 좋다. 특히 finish stack과 reversed graph를 눈으로 따라가며 "왜 이 순서로 두 번째 탐색을 시작하는지"를 학습할 수 있다.

**Alternatives considered**:

- Tarjan algorithm: low-link value와 stack membership을 동시에 설명해야 해서 첫 SCC lesson으로는 cognitive load가 크다.
- Gabow algorithm: 두 stack을 관리해야 해 UI와 trace가 더 복잡해진다.
- Kosaraju, Tarjan 비교: 하나의 feature가 알고리즘 비교 페이지로 커져 scope가 넓어진다.

## Decision: curated fixed directed graph 하나를 사용한다

**Rationale**: deterministic example은 trace tests와 code highlight mapping을 안정적으로 만든다. 예제는 3-node SCC, 2-node SCC, singleton SCC, cross-component directed edges를 모두 포함해 FR-011을 만족한다. 수동 좌표와 edge label offsets를 사용하면 node/edge/label overlap을 구현 전부터 제어할 수 있다.

**Alternatives considered**:

- 여러 SCC 예제 제공: 초기 MVP의 test surface와 UI controls가 커진다.
- learner-authored graph: 입력 검증, dynamic layout, multiple valid traversal orders가 핵심 학습보다 커진다.
- random graph generation: replay와 한국어 설명 문구가 불안정해진다.

## Decision: traversal order와 adjacency iteration order를 고정한다

**Rationale**: DFS는 시작 노드와 adjacency 순서에 따라 finish order가 달라진다. example-defined order를 두면 같은 입력에서 항상 같은 trace와 SCC 목록이 나오고, learner는 순서 차이보다 mutual reachability와 graph reversal에 집중할 수 있다.

**Alternatives considered**:

- Node label alphabetical order만 사용: edge story와 layout이 바뀔 때 학습 흐름을 세밀하게 조정하기 어렵다.
- 사용자가 시작 노드를 선택: 가능한 trace branch가 많아져 첫 구현 범위가 커진다.
- 암묵적인 object insertion order 사용: 테스트와 설명에서 순서 기준이 보이지 않는다.

## Decision: condensation view를 final summary로 포함한다

**Rationale**: SCC 결과는 각 그룹을 찾는 데서 끝나지 않고, SCC를 하나의 노드로 압축하면 컴포넌트 사이의 방향 관계만 남는다는 점이 중요하다. final summary에서 condensation DAG를 보여주면 이전 위상 정렬 lesson과 자연스럽게 연결된다.

**Alternatives considered**:

- SCC list만 표시: grouping 결과는 보이지만 directed graph structure가 어떻게 요약되는지 놓친다.
- 별도 condensation lesson으로 분리: SCC의 실용적 의미가 첫 lesson에서 약해진다.
- 모든 internal edge를 계속 강조: 완료 단계가 시각적으로 복잡해지고 핵심인 inter-component edges가 흐려진다.

## Decision: 기존 SVG/React/Vitest 패턴만 사용한다

**Rationale**: 예제 규모가 작고 layout이 고정되어 있어 external graph layout 또는 animation library가 필요 없다. 기존 graph pages와 같은 structure를 따르면 review 범위가 작고 trace correctness를 unit test로 직접 검증할 수 있다.

**Alternatives considered**:

- Graph layout library: dependency cost가 학습 가치보다 크고 deterministic label clearance를 별도로 검증해야 한다.
- Canvas/WebGL: SVG보다 inspectability와 accessible label 관리가 불리하다.
- Animation library: 단계별 trace sync가 우선이며, motion polish는 나중에 추가할 수 있다.
