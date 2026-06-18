# Feature Specification: Dijkstra Graph Step Workbench

**Feature Branch**: `002-dijkstra-graph-steps`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "다익스트라 그래프 단계별로 이해할 수 있는 것도 추가해줘."

## Clarifications

### Session 2026-06-18

- Q: 학습용 다익스트라 예제 그래프는 방향성을 어떻게 다뤄야 하나요? → A: 무방향/방향 예제를 둘 다 제공한다.
- Q: 최종 최단 경로 확인에서 도착 노드는 어떻게 정해야 하나요? → A: 학습자가 최종 단계에서 도착 노드를 선택할 수 있다.
- Q: 다익스트라 학습 화면에 코드 표현은 어떤 수준으로 포함해야 하나요? → A: 5개 언어 코드 탭과 단계별 라인 강조를 포함한다.
- Q: 같은 임시 거리 후보가 여러 개일 때 다음 확정 노드는 어떻게 선택하나요? → A: 노드 라벨 알파벳순으로 선택한다.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 다익스트라 최단 거리 흐름 따라가기 (Priority: P1)

학습자는 가중 그래프에서 시작 노드를 기준으로 다익스트라 알고리즘이 어떤 노드를 먼저 확정하고, 어떤 간선을 검사하며, 거리 표가 어떻게 바뀌는지 한 단계씩 따라갈 수 있다.

**Why this priority**: 다익스트라의 핵심 학습 가치는 "가장 짧은 임시 거리 노드를 선택하고 주변 거리를 갱신한다"는 반복 구조를 눈으로 확인하는 데 있다. 이 흐름이 보이지 않으면 최종 최단 거리만 외우게 된다.

**Independent Test**: 고정 그래프 예시에서 Next를 반복해 눌렀을 때 현재 노드, 검사 중인 간선, 후보 거리, 갱신된 거리 표, 확정된 노드 설명, 선택된 언어의 강조 코드 라인이 같은 단계로 함께 바뀌는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 시작 노드가 선택된 그래프가 열려 있을 때, **When** 학습자가 첫 번째 단계를 본다면, **Then** 시작 노드의 거리는 0으로 표시되고 다른 노드는 아직 미확정 또는 무한대로 표시된다.
2. **Given** 현재 노드와 인접 간선이 강조된 상태일 때, **When** 학습자가 다음 단계로 이동하면, **Then** 해당 간선을 통해 계산된 후보 거리와 기존 거리의 비교 결과가 한국어 설명과 거리 표에 함께 표시된다.
3. **Given** 여러 후보 노드가 frontier에 있을 때, **When** 다음 확정 노드를 선택하는 단계가 되면, **Then** 아직 확정되지 않은 노드 중 가장 작은 임시 거리를 가진 노드가 선택되는 이유가 보인다.

---

### User Story 2 - 거리 갱신과 확정 상태 구분하기 (Priority: P2)

학습자는 같은 그래프에서 후보 노드, 갱신된 노드, 이미 확정된 노드, 더 짧아지지 않은 노드를 서로 구분하며 다익스트라의 상태 전이를 이해할 수 있다.

**Why this priority**: 거리 갱신이 언제 일어나고 언제 무시되는지 이해해야 알고리즘의 정당성과 종료 조건을 설명할 수 있다.

**Independent Test**: 한 간선 검사 단계에서 후보 거리 계산, 갱신 여부, 거리 표 변화 여부, 노드 상태 라벨이 색상 외의 텍스트나 상태 값으로도 확인되는지 검증한다.

**Acceptance Scenarios**:

1. **Given** 더 짧은 경로가 발견된 노드가 있을 때, **When** 학습자가 해당 단계를 본다면, **Then** 거리 표의 이전 값과 새 값이 구분되고 해당 노드는 갱신됨 상태로 표시된다.
2. **Given** 이미 더 짧은 거리가 있는 노드를 다시 검사할 때, **When** 후보 거리가 기존 거리보다 크거나 같다면, **Then** 거리 표는 그대로 유지되고 왜 갱신하지 않는지 설명된다.
3. **Given** 노드가 최단 거리로 확정된 뒤, **When** 이후 단계에서 그 노드가 다시 보이면, **Then** 확정 상태가 유지되고 임시 후보와 혼동되지 않는다.

---

### User Story 3 - 최종 최단 경로 결과 확인하기 (Priority: P3)

학습자는 모든 단계가 끝난 뒤 시작 노드에서 각 노드까지의 최단 거리와 이전 노드 정보를 확인하고, 최종 단계에서 도착 노드를 선택해 해당 노드까지의 실제 최단 경로를 따라볼 수 있다.

**Why this priority**: 다익스트라는 거리 값뿐 아니라 predecessor 관계를 통해 최단 경로 자체를 복원하는 알고리즘이므로, 최종 결과를 경로로 해석하는 경험이 필요하다.

**Independent Test**: 마지막 단계에서 모든 도달 가능한 노드의 최단 거리와 이전 노드가 표시되고, 학습자가 도착 노드를 바꾸면 선택된 도착 노드의 경로가 시작 노드부터 도착 노드까지 순서대로 갱신되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 알고리즘이 종료된 상태일 때, **When** 학습자가 최종 결과를 보면, **Then** 각 노드의 최단 거리와 이전 노드가 한 표에서 확인된다.
2. **Given** 알고리즘이 종료된 상태일 때, **When** 학습자가 도착 노드를 선택하면, **Then** 시작 노드부터 선택한 도착 노드까지의 노드 순서와 총 비용이 표시된다.

---

### Edge Cases

- 시작 노드와 도착 노드가 같으면 거리는 0이고 경로는 시작 노드 하나로 설명되어야 한다.
- 도달할 수 없는 노드가 있는 그래프에서는 해당 노드가 미도달 상태로 남아야 하며, 무한대 또는 도달 불가 설명이 제공되어야 한다.
- 같은 임시 거리 후보가 여러 개 있을 때는 노드 라벨 알파벳순으로 다음 확정 노드를 선택하고 그 규칙이 설명되어야 한다.
- 이미 확정된 노드로 이어지는 간선을 다시 보더라도 확정 상태가 되돌아가면 안 된다.
- 음수 가중치가 있는 그래프는 다익스트라 학습 범위가 아니므로, 예시에 포함하지 않거나 지원하지 않는 이유를 명확히 안내해야 한다.
- 자동 재생 중 첫 단계, 마지막 단계, 일시정지, reset 상태가 수동 조작과 충돌하지 않아야 한다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a fully step-controllable Dijkstra shortest path lesson for a weighted graph.
- **FR-002**: System MUST use an ordered trace where every step contains the current graph state, distance table state, highlighted node or edge, and Korean learner-facing explanation.
- **FR-003**: Users MUST be able to move forward, move backward, reset to the first step, and inspect the current step without losing synchronization between graph, table, and explanation.
- **FR-004**: System SHOULD provide automatic play as a secondary control while preserving manual step navigation as the primary learning path.
- **FR-005**: System MUST show the start node, current node, frontier candidates, settled nodes, inspected edge, and distance update result when those states are meaningful.
- **FR-006**: System MUST show a distance table containing at least each node's current best distance, previous node, and settled/unsettled status.
- **FR-007**: System MUST distinguish candidate, updated, skipped, settled, current, and final-path states using visible labels or state attributes in addition to color.
- **FR-008**: System MUST show why the next current node is selected from frontier candidates.
- **FR-009**: System MUST show both successful relaxation steps and no-update comparison steps.
- **FR-010**: System MUST include a final result state with shortest distances from the start node and a learner-selectable destination for reconstructing the shortest path.
- **FR-011**: System MUST keep the graph visualization, distance table, current explanation, and step control in one visible workbench on desktop layouts.
- **FR-012**: System MUST keep learner-facing text Korean-first while preserving established terms such as Dijkstra, distance, frontier, and relaxation when helpful.
- **FR-013**: System MUST NOT present negative-weight examples as supported Dijkstra inputs.
- **FR-014**: System MUST provide Dijkstra code examples in C, C++, Java, Python, and JavaScript with readable language tabs.
- **FR-015**: System MUST provide both an undirected weighted graph example and a directed weighted graph example, with the active example clearly identified for the learner.
- **FR-016**: System MUST update the displayed final path and total cost when the learner selects a different reachable destination node in the final result state.
- **FR-017**: System MUST keep the highlighted code line in the selected language synchronized with the current trace step.
- **FR-018**: System MUST resolve equal tentative-distance frontier candidates by node label alphabetical order and explain that tie-break rule in the relevant step.

### Key Entities *(include if feature involves data)*

- **Weighted Graph**: A set of nodes and non-negative weighted edges used as the lesson input, with an explicit direction mode of either undirected or directed.
- **Graph Node**: A vertex with a label, current distance, previous node, and state such as unvisited, frontier, current, settled, or final path.
- **Weighted Edge**: A connection between two nodes with a non-negative cost, optional direction, and a state such as idle, inspected, relaxed, skipped, or final path.
- **Distance Table Row**: The learner-visible record for one node, including current best distance, previous node, and settled status.
- **Frontier Candidate**: An unsettled node with a known tentative distance and node-label tie-break key that can become the next current node.
- **Trace Step**: One teachable transition in the Dijkstra flow, including graph state, distance table state, highlights, and Korean explanation.
- **Code Example**: A language-specific Dijkstra implementation whose highlight ranges map to trace steps.
- **Shortest Path Result**: The final distance and predecessor chain from the start node to the learner-selected destination.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner can identify the current node, inspected edge, and any changed distance within 5 seconds on every Dijkstra step.
- **SC-002**: 100% of trace steps keep graph highlights, distance table values, and Korean explanation synchronized.
- **SC-003**: The final result correctly shows shortest distances from the start node to every reachable node in the curated graph.
- **SC-004**: The final path display lets a learner choose a reachable destination and read the complete shortest path from start to that destination without needing external explanation.
- **SC-005**: Manual Previous, Next, and Reset controls work across every step, including first and last states.
- **SC-006**: The lesson can be completed without relying only on color to understand node, edge, or distance-table states.
- **SC-007**: 100% of trace steps highlight the corresponding code line or range in the currently selected language tab.

## Assumptions

- The feature targets the graph/search concept domain only.
- The initial lesson uses fixed curated undirected and directed graphs with non-negative edge weights so each algorithm flow is deterministic and testable.
- Arbitrary graph editing is out of scope for the initial specification unless a later plan explicitly adds it.
- The default learning flow prioritizes manual stepping; automatic play is optional and secondary.
- The workbench should align with existing CS Visual Lab interaction patterns for concept pages.
