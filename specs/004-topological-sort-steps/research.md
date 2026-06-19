# Research: DAG Topological Sort Step Workbench

## Decision: 그래프 도메인의 다음 slice는 DAG 위상 정렬이다

**Rationale**: 현재 graph coverage는 graph structures, BFS/DFS traversal, Dijkstra shortest path, Kruskal MST까지 포함한다. 하지만 directed acyclic graph에서 prerequisite ordering을 설명하는 dedicated algorithm page가 없다. 위상 정렬은 DAG 구조, dependency ordering, queue/frontier 개념을 연결하므로 graph domain 안에서 이어지는 학습 가치가 크다.

**Alternatives considered**:

- Tree feature로 이동: tree domain은 이미 AVL, Red-Black, B-Tree, B+Tree, Heap, Trie, Segment Tree, BST deletion 등 coverage가 더 넓다.
- TCP/UDP/Redis로 이동: network/cache domain도 중요하지만 user priority는 graph gap 확인이 먼저였고 graph에 아직 core DAG ordering gap이 남아 있다.
- Bellman-Ford/Floyd-Warshall/A*: shortest path 계열을 더 늘리는 선택이지만, 이미 Dijkstra가 있고 DAG ordering은 다른 graph concept을 새롭게 보여준다.

## Decision: 첫 구현은 in-degree/Kahn 방식으로 제한한다

**Rationale**: Kahn 방식은 zero-in-degree 후보 큐, edge removal, in-degree decrement가 모두 화면에 드러나 학습자가 "왜 이 노드를 지금 처리할 수 있는지"를 단계별로 이해하기 좋다. 기존 BFS/Dijkstra/MST workbench처럼 queue/list/table과 SVG state를 동기화하기도 쉽다.

**Alternatives considered**:

- DFS postorder 기반 위상 정렬: recursion stack과 finish time을 보여줘야 해서 별도 lesson으로 더 적합하다.
- Kahn과 DFS를 동시에 비교: 하나의 feature가 두 알고리즘 비교로 커져 scope가 넓어진다.
- 실제 graph editing 입력: 학습보다 입력 검증과 layout 문제가 커진다.

## Decision: curated fixed DAG 하나를 사용한다

**Rationale**: deterministic example은 trace tests와 code highlight mapping을 안정적으로 만든다. 예제에는 multi-candidate step과 edge removal로 새 후보가 열리는 step을 포함해 핵심 개념을 모두 보여준다. 수동 좌표를 사용하면 node/edge/label overlap을 미리 방지할 수 있다.

**Alternatives considered**:

- 여러 DAG 예제 제공: 초기 MVP의 test surface와 UI controls가 커진다.
- learner-authored graph: cycle validation, layout, 입력 UI가 핵심 알고리즘 학습보다 커진다.
- random graph generation: replay와 설명 문구가 불안정해진다.

## Decision: tie-break는 node label 또는 example-defined order로 고정한다

**Rationale**: 위상 정렬은 가능한 답이 여러 개일 수 있다. fixed tie-break를 두면 같은 입력에서 항상 같은 trace와 final order가 나오고, 학습자는 동시에 가능한 후보와 실제 선택 이유를 분리해서 볼 수 있다.

**Alternatives considered**:

- 사용자가 후보를 직접 선택: 학습 상호작용은 좋아지지만 가능한 여러 trace branch를 관리해야 한다.
- queue insertion order만 암묵적으로 사용: 왜 특정 후보가 먼저 처리되는지 설명이 약해진다.
- random choice: tests와 replay에 부적합하다.

## Decision: cycle guard는 trace generator와 edge-case UI contract에 포함한다

**Rationale**: topological sort는 DAG에서만 완료된다. 첫 UI example은 acyclic으로 유지하되, trace generator는 unprocessed nodes가 남았는데 zero-in-degree 후보가 없는 상태를 cycle-blocked step으로 표현할 수 있어야 한다. 이를 unit test로 검증하면 향후 cycle example 추가도 안전하다.

**Alternatives considered**:

- cycle behavior를 완전히 제외: 위상 정렬의 전제 조건을 놓치게 된다.
- cycle example을 UI에서 같이 제공: 첫 lesson의 흐름이 커지고 acyclic ordering 학습을 방해할 수 있다.

## Decision: 기존 SVG/React/Vitest 패턴만 사용한다

**Rationale**: 예제 규모가 작고 layout이 고정되어 있어 external graph layout 또는 animation library가 필요 없다. 기존 graph pages와 같은 structure를 따르면 review 범위가 작고 trace correctness를 unit test로 직접 검증할 수 있다.

**Alternatives considered**:

- Graph layout library: dependency cost가 학습 가치보다 크고 deterministic label clearance를 별도로 검증해야 한다.
- Canvas/WebGL: SVG보다 inspectability와 accessible label 관리가 불리하다.
- Animation library: 단계별 trace sync가 우선이며, motion polish는 나중에 추가할 수 있다.
