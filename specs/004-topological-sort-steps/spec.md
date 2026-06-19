# Feature Specification: DAG Topological Sort Step Workbench

**Feature Branch**: `[004-topological-sort-steps]`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "그래프에서 더 추가할 개념이나 알고리즘 없는지 확인해주고, 없으면 트리 확인해줘. 없으면 tcp, udp 동작을 설명하는 것이나, redis 동작 등을 추가해줘."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 진입 차수 기반 다음 노드 선택하기 (Priority: P1)

학습자는 방향 비순환 그래프(DAG)에서 위상 정렬이 "먼저 와야 하는 의존성이 더 이상 없는 노드"를 골라 순서에 추가하는 과정을 한 단계씩 따라갈 수 있다.

**Why this priority**: 위상 정렬의 핵심 학습 가치는 간선 방향이 의미하는 선후관계와 진입 차수 0 조건을 연결해 보는 데 있다. 다음 노드를 고르는 기준이 보이지 않으면 결과 순서만 외우게 된다.

**Independent Test**: 고정 DAG 예제의 첫 단계부터 다음 단계로 이동할 때 현재 선택 가능한 노드, 선택된 노드, 누적된 정렬 결과, 한국어 설명, 코드 하이라이트가 같은 trace 위치를 가리키는지 확인한다.

**Acceptance Scenarios**:

1. **Given** DAG 도표와 각 노드의 진입 차수 표가 보이는 첫 단계, **When** 학습자가 다음 단계로 이동하면, **Then** 진입 차수가 0인 후보 노드들이 강조되고 한국어 설명이 왜 해당 노드들이 먼저 처리 가능한지 안내한다.
2. **Given** 하나 이상의 후보 노드가 있는 단계, **When** 학습자가 다음 단계로 이동하면, **Then** 결정 규칙에 따라 선택된 노드가 정렬 결과에 추가되고 해당 코드 줄이 선택된 언어에서 강조된다.

---

### User Story 2 - 간선 제거와 진입 차수 감소 추적하기 (Priority: P2)

학습자는 선택된 노드의 outgoing edge가 제거되는 것처럼 처리되고, 연결된 다음 노드들의 진입 차수가 어떻게 줄어들어 새 후보가 되는지 확인할 수 있다.

**Why this priority**: 위상 정렬은 단순히 노드를 나열하는 알고리즘이 아니라, 의존성이 해소되는 순간을 반복해서 추적하는 과정이다. 간선 제거와 진입 차수 변화가 보이면 "왜 지금 이 노드가 가능해졌는지"가 명확해진다.

**Independent Test**: 특정 노드를 처리하는 단계에서 제거 대상 간선, 영향을 받는 이웃 노드, 감소 전후 진입 차수, 새로 열린 후보 큐가 trace 상태와 화면 설명에서 일치하는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 현재 선택된 노드가 outgoing edge를 가진 단계, **When** 학습자가 다음 단계로 이동하면, **Then** 제거되는 간선이 표시되고 각 도착 노드의 진입 차수가 1씩 감소한다.
2. **Given** 간선 제거 후 어떤 노드의 진입 차수가 0이 되는 단계, **When** 학습자가 현재 상태를 확인하면, **Then** 해당 노드가 새 후보로 큐에 추가되고 그 이유가 설명된다.

---

### User Story 3 - 최종 위상 순서 검증하기 (Priority: P3)

학습자는 모든 노드가 처리된 뒤 최종 위상 정렬 결과가 모든 방향 간선의 선후관계를 만족하는지 확인할 수 있다.

**Why this priority**: 위상 정렬의 결과는 하나의 가능한 순서이며, "모든 간선 u -> v에서 u가 v보다 앞선다"는 조건으로 검증되어야 한다. 완료 검증이 있어야 알고리즘 결과를 신뢰할 수 있다.

**Independent Test**: 완료 단계에서 정렬 결과가 모든 노드를 정확히 한 번 포함하고, 예제의 모든 방향 간선에 대해 시작 노드가 끝 노드보다 먼저 등장한다는 검증 요약을 확인한다.

**Acceptance Scenarios**:

1. **Given** 모든 노드가 처리된 완료 단계, **When** 학습자가 최종 결과를 확인하면, **Then** 최종 위상 순서, 처리된 노드 수, 전체 노드 수, 간선 조건 검증 결과가 함께 표시된다.
2. **Given** 학습자가 이전 단계로 되돌아간 뒤 다시 진행하는 상황, **When** 완료 단계에 도달하면, **Then** 같은 입력에 대해 같은 최종 순서와 검증 결과가 재현된다.

---

### Edge Cases

- 후보 노드가 여러 개일 때는 고정된 결정 규칙으로 선택 순서를 정하고, 후보 목록에는 동시에 가능한 노드들을 모두 보여준다.
- 간선 제거 단계에서 새 후보가 생기지 않더라도 해당 단계는 "아직 남은 의존성이 있다"는 설명과 함께 시각 상태와 코드 하이라이트를 유지해야 한다.
- 처리되지 않은 노드가 남았는데 진입 차수 0 후보가 없으면 순환 의존성이 있는 상태로 판단하고, 위상 정렬을 완료할 수 없음을 명확히 안내해야 한다.
- 가장 작은 의미 있는 입력은 간선이 없거나 하나의 방향 간선만 있는 DAG이며, 후보 큐와 최종 순서가 빈 단계 없이 설명되어야 한다.
- 첫 단계, 마지막 단계, 일시정지, 리셋 상태에서 수동 조작과 자동 진행 상태가 서로 어긋나지 않아야 한다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST add DAG topological sort as the next graph-domain learning slice because current graph coverage has graph structure, BFS/DFS traversal, Dijkstra, and MST, but no dedicated DAG ordering algorithm.
- **FR-002**: System MUST keep tree, TCP, UDP, and Redis lessons outside this feature scope because the graph domain still has a missing core algorithm concept.
- **FR-003**: System MUST present in-degree based topological sorting as the first lesson for this feature.
- **FR-004**: System MUST use a deterministic DAG learning example that includes at least one multi-candidate step and at least one step where removing outgoing edges opens a new candidate.
- **FR-005**: System MUST generate an ordered trace for the topological sort flow before UI rendering depends on it.
- **FR-006**: Each trace step MUST include Korean learner-facing title, explanation, current graph state, candidate state, result order state, and highlight metadata.
- **FR-007**: System MUST show the DAG diagram, current selected node, directed edges affected by the current step, zero-in-degree candidate queue, in-degree table, and accumulated topological order in one workbench.
- **FR-008**: When a zero-in-degree node is selected, System MUST append it to the result order, mark it as processed, and show how its outgoing edges affect neighbor in-degree values.
- **FR-009**: When multiple zero-in-degree candidates exist, System MUST apply a stable deterministic tie rule and make the chosen candidate understandable to learners.
- **FR-010**: System MUST show a final validation summary proving that the topological order includes every node once and satisfies every directed edge prerequisite.
- **FR-011**: System MUST clearly indicate that topological sorting cannot complete if an input state contains a cycle or no remaining zero-in-degree candidate while unprocessed nodes remain.
- **FR-012**: Users MUST be able to step forward, step backward, reset, inspect the current step, and use guided automatic progression without losing manual control.
- **FR-013**: Algorithm code lessons MUST include C, C++, Java, Python, and JavaScript examples, and the selected example MUST highlight the line or lines corresponding to the current trace step.
- **FR-014**: System MUST keep learner-facing text Korean-first while preserving established terms such as DAG, topological sort, in-degree, queue, and edge when helpful.
- **FR-015**: Visual states for candidate, selected, processed, affected edge, newly opened candidate, and completed result MUST be meaningfully distinguishable by more than color alone.
- **FR-016**: The primary interaction stage, explanation, code panel, and next-step control MUST remain visible together on desktop-sized workbench layouts.

### Key Entities *(include if feature involves data)*

- **DAG Example**: A directed acyclic graph lesson input with labeled nodes, directed edges, and deterministic ordering rules.
- **Graph Node**: A labeled vertex with processed state, current in-degree value, and candidate eligibility.
- **Directed Edge**: A prerequisite relationship from one node to another that constrains the final order.
- **In-Degree Row**: The learner-facing table row showing one node's current incoming edge count and whether it is available.
- **Zero-In-Degree Queue**: The ordered set of currently processable nodes.
- **Topological Trace Step**: One teachable transition containing graph state, candidate queue, selected node, affected edges, in-degree changes, result order, explanation, and highlight mapping.
- **Topological Order Result**: The completed node ordering and validation summary for the DAG.
- **Code Example**: Learner-facing source text in the supported languages with highlight mappings for trace steps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner can identify the next processable node and the reason it is eligible within 5 seconds on every selection step.
- **SC-002**: On every trace step, the visible candidate queue, in-degree table, selected node, affected edges, and accumulated result match the trace state exactly.
- **SC-003**: The completed lesson shows a final order that includes every example node exactly once and passes every directed-edge prerequisite check.
- **SC-004**: Changing step position changes the highlighted code line consistently for all supported code example languages.
- **SC-005**: Learners can move from the first step to the completed result using only visible workbench controls, then reset to the first step without stale state.
- **SC-006**: The feature passes relevant trace, component, and build verification without adding tree, network, Redis, or unrelated graph algorithm scope.

## Assumptions

- Existing graph coverage already includes graph structures, BFS/DFS traversal, Dijkstra shortest path, and Kruskal MST, but does not include a dedicated topological sort lesson.
- Topological sort is the next graph-domain priority before moving to tree, TCP, UDP, or Redis topics.
- The first slice teaches the in-degree/Kahn-style flow; DFS-based topological sorting can be specified later as a separate comparison feature.
- The initial lesson uses a curated fixed DAG rather than learner-authored graph editing.
- Candidate tie handling is deterministic so replay, tests, and explanations remain stable.
