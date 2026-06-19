# Feature Specification: MST Graph Step Workbench

**Feature Branch**: `003-mst-graph-steps`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "그래프에서 더 추가할 개념이나 알고리즘 없는지 확인해주고, 없으면 트리 확인해줘. 없으면 tcp, udp 동작을 설명하는 것이나, redis 동작 등을 추가해줘."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - MST 후보 간선 선택 흐름 따라가기 (Priority: P1)

학습자는 가중 무방향 그래프에서 Kruskal 알고리즘이 간선을 가중치 순서로 살펴보고, 현재 후보 간선을 최소 신장 트리에 넣을지 건너뛸지 한 단계씩 따라갈 수 있다.

**Why this priority**: MST의 핵심 학습 가치는 "가장 싼 간선부터 보되, 사이클을 만들면 선택하지 않는다"는 결정 과정을 눈으로 확인하는 데 있다. 후보 간선 선택 흐름이 보이지 않으면 최종 간선 집합만 암기하게 된다.

**Independent Test**: 정렬된 간선 목록, 현재 후보 간선, 선택된 간선, 건너뛴 간선, 현재 총 비용이 trace 단계마다 결정적으로 바뀌는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 가중 무방향 그래프와 정렬된 간선 목록이 보이는 첫 단계, **When** 학습자가 다음 단계로 이동하면, **Then** 가장 낮은 가중치의 후보 간선이 그래프와 간선 목록에서 함께 강조되고 한국어 설명이 그 선택 이유를 안내한다.
2. **Given** 현재 후보 간선이 이미 다른 경로로 연결된 두 노드를 잇는 상황, **When** 학습자가 다음 단계로 이동하면, **Then** 해당 간선은 건너뛴 상태로 표시되고 설명은 사이클이 생기기 때문에 제외한다고 안내한다.

---

### User Story 2 - 연결 성분 변화로 사이클 방지 이해하기 (Priority: P2)

학습자는 선택된 간선이 두 연결 성분을 합칠 때와, 이미 같은 성분 안의 노드를 연결해 사이클을 만들 때의 차이를 볼 수 있다.

**Why this priority**: Kruskal은 간선 정렬만으로 끝나지 않고 "두 노드가 이미 연결되어 있는가"를 판단해야 하므로, 연결 성분 변화가 보여야 사이클 방지 원리를 이해할 수 있다.

**Independent Test**: 각 단계의 성분 표시가 선택된 간선 이후에는 병합되고, 건너뛴 간선 이후에는 유지되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 두 노드가 서로 다른 성분에 속한 후보 간선 단계, **When** 학습자가 다음 단계로 이동하면, **Then** 두 성분이 하나로 합쳐지고 선택된 간선 수와 총 비용이 증가한다.
2. **Given** 두 노드가 이미 같은 성분에 속한 후보 간선 단계, **When** 학습자가 다음 단계로 이동하면, **Then** 성분 상태와 총 비용은 유지되고 건너뛰기 사유가 표시된다.

---

### User Story 3 - 최종 MST 결과 검증하기 (Priority: P3)

학습자는 모든 노드를 연결하는 최종 MST가 노드 수보다 하나 적은 간선으로 구성되고, 최종 총 비용이 어떻게 계산되는지 확인할 수 있다.

**Why this priority**: MST 학습은 단계별 선택뿐 아니라 최종 결과가 "모든 노드를 연결하면서 총 비용이 최소"라는 조건을 만족하는지 검증하는 경험까지 포함해야 한다.

**Independent Test**: 완료 단계에서 선택된 간선 수, 포함된 노드, 총 비용, 선택 순서 요약이 trace 결과와 일치하는지 확인한다.

**Acceptance Scenarios**:

1. **Given** MST가 완성되는 단계, **When** 학습자가 완료 상태를 확인하면, **Then** 선택된 간선 수가 `노드 수 - 1`임을 보여주고 전체 총 비용을 계산식과 함께 표시한다.
2. **Given** 학습자가 완료 후 이전 단계로 되돌아가면, **When** 다시 다음 단계로 이동한다, **Then** 동일한 후보 간선, 성분 상태, 총 비용 순서가 재현된다.

### Edge Cases

- 동일한 가중치의 간선이 여러 개 있을 때는 예제에서 정한 간선 라벨 순서로 후보를 고정해 학습 흐름이 매번 같아야 한다.
- 가장 작은 의미 있는 입력은 2개 노드와 1개 간선이며, 이 경우 첫 선택만으로 MST가 완성되어야 한다.
- 이미 MST가 완성된 뒤 남은 간선은 학습자가 원하면 확인할 수 있되, 결과에는 더 이상 영향을 주지 않는다고 설명해야 한다.
- 후보 간선 단계에서 시각 상태 변화가 크지 않더라도 설명, 간선 목록, 코드 강조는 현재 판단 위치를 명확히 보여야 한다.
- 첫 단계, 마지막 단계, 일시정지, 재설정 상태에서 수동 이동과 자동 재생은 현재 단계 번호와 설명을 일관되게 유지해야 한다.
- 연결되지 않은 그래프는 단일 MST가 존재하지 않으므로, 이 첫 학습 예제에는 포함하지 않고 향후 확장 시 "최소 신장 숲"으로 구분해 안내해야 한다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a fully step-controllable minimum spanning tree lesson for a weighted undirected graph.
- **FR-002**: System MUST present Kruskal algorithm as the first MST learning slice and keep other graph algorithms outside this feature scope.
- **FR-003**: System MUST generate an ordered trace for the MST decision flow before UI rendering depends on it.
- **FR-004**: Each trace step MUST include learner-facing Korean explanation text, current candidate edge, selected edge set, skipped edge set, component state, total cost, and highlight data.
- **FR-005**: Users MUST be able to step forward, step backward, reset, and inspect the current MST step.
- **FR-006**: System SHOULD support automatic play or semi-automatic guided progression when it improves the lesson.
- **FR-007**: System MUST keep graph visualization, sorted edge list, component explanation, total cost, and code highlight synchronized.
- **FR-008**: System MUST show why each candidate edge is selected or skipped, including whether the endpoints are in different components or already connected.
- **FR-009**: System MUST show the final MST result with selected edge count, selected edge order, covered nodes, and total cost.
- **FR-010**: System MUST use deterministic tie-breaking for equal edge weights so repeated runs produce the same trace.
- **FR-011**: System MUST keep learner-facing text Korean-first while preserving established terms such as MST, Kruskal, cycle, and component when helpful.
- **FR-012**: Algorithm code lessons MUST include C, C++, Java, Python, and JavaScript examples with readable language tabs.
- **FR-013**: The selected code example MUST highlight the line or lines that correspond to the current MST trace step.
- **FR-014**: The workbench MUST provide meaningful non-color labels for candidate, selected, skipped, component-merged, and complete states.
- **FR-015**: System MUST NOT include tree, TCP, UDP, or Redis lessons in this feature, because the graph domain still has a missing core MST concept.

### Key Entities

- **Weighted Graph**: A connected undirected graph with labeled nodes and weighted edges used as the MST learning input.
- **Graph Node**: A labeled vertex that belongs to one current component during the Kruskal trace.
- **Weighted Edge**: A labeled connection between two nodes with a numeric cost and a deterministic ordering key.
- **MST Candidate Edge**: The edge currently being inspected, including endpoint component relationship and select-or-skip decision.
- **Component Group**: The current connected group of nodes used to explain whether adding an edge would create a cycle.
- **MST Trace Step**: One teachable transition containing the current candidate, graph state, component state, selected/skipped edges, total cost, explanation, and highlight mapping.
- **MST Result**: The completed selected edge set, selected order, covered nodes, and final total cost.
- **Code Example**: A language-specific Kruskal implementation whose highlight ranges map to trace steps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner can identify the current candidate edge and whether it will be selected or skipped within 5 seconds on every MST decision step.
- **SC-002**: A learner can explain, from the visible component state, why a skipped edge would create a cycle in at least 90% of checked skip steps.
- **SC-003**: The completed lesson shows exactly `노드 수 - 1` selected edges and the correct total MST cost for the provided example.
- **SC-004**: Every tested trace step has deterministic state and highlight output, including equal-weight tie cases.
- **SC-005**: The selected code highlight changes correctly when the step changes across all provided language tabs.
- **SC-006**: The feature remains scoped to the graph domain and passes the required build and relevant tests before implementation is considered complete.

## Assumptions

- Existing graph coverage includes graph structures, BFS/DFS traversal, and Dijkstra shortest path, but does not include a dedicated MST lesson.
- The next graph feature should be MST before moving to tree, TCP, UDP, or Redis topics because weighted graph documentation already names minimum spanning tree as a core use case.
- This feature targets Kruskal MST as one independently testable graph learning slice; Prim can be specified later as a separate comparison or follow-up feature.
- The initial learning input is a fixed connected weighted undirected graph, not arbitrary learner-authored graph editing.
- Manual trace behavior is the baseline; automatic play is an enhancement around the same deterministic trace.
