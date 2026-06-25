# Feature Specification: SCC Graph Step Workbench

**Feature Branch**: `[005-scc-graph-steps]`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "그래프에서 더 추가할 개념이나 알고리즘 없는지 확인해주고, 없으면 트리 확인해줘. 없으면 tcp, udp 동작을 설명하는 것이나, redis 동작 등을 추가해줘."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 첫 DFS로 종료 순서 이해하기 (Priority: P1)

학습자는 방향 그래프에서 아직 방문하지 않은 노드부터 깊이 우선 탐색을 진행하며, 각 노드가 언제 종료 순서 스택에 들어가는지 한 단계씩 따라갈 수 있다.

**Why this priority**: SCC 학습의 첫 관문은 "방문"과 "종료"가 다르다는 점을 보는 것이다. 종료 순서가 보이지 않으면 두 번째 탐색이 왜 특정 순서로 시작되는지 이해하기 어렵다.

**Independent Test**: 첫 번째 pass 단계만 실행해도 현재 노드, 현재 간선, 방문된 노드, 재귀 경로, 종료 순서 스택, 한국어 설명, 선택한 코드 예시의 현재 줄 강조가 서로 같은 상태를 가리키는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** SCC 예제 방향 그래프의 시작 단계, **When** 학습자가 다음 단계로 이동하면, **Then** 현재 DFS 시작 노드와 탐색 중인 outgoing edge가 표시되고 방문 상태와 설명이 함께 갱신된다.
2. **Given** 어떤 노드의 모든 outgoing edge 확인이 끝난 단계, **When** 학습자가 다음 단계로 이동하면, **Then** 해당 노드는 종료 순서 스택에 추가되고 그래프 상태, 스택 표시, 설명, 코드 강조가 같은 종료 동작을 가리킨다.

---

### User Story 2 - 뒤집은 그래프에서 SCC 묶기 (Priority: P2)

학습자는 모든 간선을 뒤집은 그래프에서 종료 순서 스택의 맨 위 노드부터 DFS를 다시 시작하며, 한 번의 탐색으로 같은 SCC에 속하는 노드들이 묶이는 과정을 볼 수 있다.

**Why this priority**: SCC의 핵심 학습 가치는 "서로 도달 가능한 노드 집합"을 직접 확인하는 데 있다. 뒤집은 그래프에서 두 번째 DFS를 보여주면 컴포넌트가 만들어지는 이유가 결과 목록보다 선명해진다.

**Independent Test**: 두 번째 pass 단계에서는 스택에서 꺼낸 시작 노드, 뒤집힌 방향 간선, 현재 SCC 후보, 이미 확정된 SCC가 함께 보이며, 예제의 3개 이상 노드 순환 그룹과 2개 노드 순환 그룹이 각각 하나의 SCC로 확정되는지 검증할 수 있다.

**Acceptance Scenarios**:

1. **Given** 첫 번째 pass가 끝나 종료 순서 스택이 완성된 상태, **When** 학습자가 두 번째 pass를 시작하면, **Then** 간선 방향이 뒤집힌 그래프와 스택의 다음 시작 노드가 함께 표시된다.
2. **Given** 두 번째 DFS가 한 컴포넌트 내부를 탐색 중인 상태, **When** 학습자가 다음 단계로 이동하면, **Then** 새로 도달한 노드는 현재 SCC 후보에 추가되고 이미 확정된 다른 SCC와 시각적으로 구분된다.
3. **Given** 현재 두 번째 DFS에서 더 이상 방문할 노드가 없는 상태, **When** 학습자가 다음 단계로 이동하면, **Then** 현재 후보 노드 집합은 하나의 SCC로 확정되고 SCC 목록에 추가된다.

---

### User Story 3 - SCC 결과와 condensation DAG 확인하기 (Priority: P3)

학습자는 모든 노드가 정확히 하나의 SCC에 속하는지 확인하고, SCC들을 하나의 노드처럼 압축했을 때 컴포넌트 사이의 방향 관계가 순환 없는 그래프로 정리되는지 볼 수 있다.

**Why this priority**: SCC는 단순한 그룹 색칠이 아니라 방향 그래프를 더 큰 구조로 요약하는 개념이다. 최종 검증과 압축 그래프를 함께 보여주면 이후 위상 정렬이나 의존성 분석과 연결된다.

**Independent Test**: 완료 단계에서 SCC 개수, 각 SCC의 노드 목록, 모든 원래 노드의 정확한 1회 포함 여부, 컴포넌트 사이 간선, condensation DAG 설명이 표시되는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** 모든 두 번째 pass 탐색이 끝난 완료 단계, **When** 학습자가 결과 패널을 확인하면, **Then** SCC 목록, 컴포넌트 개수, 각 노드의 소속, 컴포넌트 사이 방향 간선이 함께 표시된다.
2. **Given** 완료 단계의 condensation 보기, **When** 학습자가 컴포넌트 간선을 확인하면, **Then** 같은 SCC 내부 간선은 압축되고 서로 다른 SCC 사이의 방향 관계만 남는다는 설명이 제공된다.

### Edge Cases

- 단일 노드와 간선이 없는 방향 그래프는 하나의 SCC로 표시되어야 한다.
- 자기 자신으로 향하는 self-loop 노드는 하나의 SCC로 유지되며, 자기 순환 상태임을 색상 외의 라벨로도 알 수 있어야 한다.
- 방향 비순환 그래프에서는 모든 노드가 각각 하나의 SCC가 된다는 점을 결과 설명에서 이해할 수 있어야 한다.
- 연결되지 않은 방향 그래프도 모든 미방문 노드에서 첫 번째 pass를 시작해 빠진 노드 없이 처리되어야 한다.
- 한 방향으로만 이어지는 cross-component 간선은 두 컴포넌트를 합치지 않아야 하며, 상호 도달 가능성이 있어야 같은 SCC가 된다는 설명을 제공해야 한다.
- 첫 단계, 마지막 단계, 일시정지, 되돌리기, 리셋 상태에서도 그래프, 스택, SCC 목록, 설명, 코드 강조가 현재 단계와 동기화되어야 한다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST add one graph-domain learning slice for strongly connected components before moving to tree, TCP, UDP, Redis, or other domains.
- **FR-002**: System MUST present SCC as a directed-graph lesson centered on mutual reachability, not as a shortest-path or undirected-connectivity lesson.
- **FR-003**: System MUST generate an ordered SCC learning trace before UI rendering depends on it.
- **FR-004**: Each trace step MUST include learner-facing Korean explanation text and meaningful state/highlight data for the graph, stack, component list, and current phase.
- **FR-005**: Users MUST be able to step forward, step backward, reset, and inspect the current SCC step.
- **FR-006**: System SHOULD support automatic guided progression with pause behavior when the learner manually changes the step.
- **FR-007**: System MUST keep visualization, explanation, stack/component state, and code highlight synchronized at every step.
- **FR-008**: System MUST show the first DFS pass with current node, inspected outgoing edge, visited nodes, active path, and finish-order stack.
- **FR-009**: System MUST show the reversed graph phase so learners can see that every directed edge has changed direction before the second pass starts.
- **FR-010**: System MUST show the second DFS pass with the stack pop order, current SCC candidate, newly added nodes, and finalized SCC groups.
- **FR-011**: System MUST use a deterministic curated directed graph containing at least one 3-node SCC, one 2-node SCC, one singleton SCC, and cross-component directed edges.
- **FR-012**: System MUST show final SCC results with component count, node membership, and a check that every graph node appears in exactly one SCC.
- **FR-013**: System MUST show a condensation view or equivalent summary where each SCC is compressed and only inter-component directed edges remain.
- **FR-014**: Algorithm and data-structure code lessons MUST include C, C++, Java, Python, and JavaScript examples when code is presented.
- **FR-015**: Current visual states MUST be distinguishable by text labels, outlines, or icons in addition to color.
- **FR-016**: System MUST keep tree topics, network protocol lessons, Redis behavior, editable graph input, and alternative SCC algorithms outside this feature scope.

### Key Entities

- **Directed Graph Example**: A curated set of labeled nodes and directed edges used for the SCC lesson.
- **Graph Node**: A vertex with a stable label, position, visit status, finish status, and optional SCC membership.
- **Directed Edge**: A one-way relationship between two graph nodes with normal, active, reversed, internal-component, or cross-component state.
- **DFS Pass**: One traversal phase that records the current node, active path, inspected edge, and visited nodes.
- **Finish Order Stack**: The ordered stack produced when nodes finish during the first DFS pass.
- **Reversed Graph View**: The same graph with every edge direction reversed for the second pass.
- **SCC Group**: A finalized set of nodes that are mutually reachable.
- **Condensation Edge**: A directed edge between two SCC groups after internal SCC edges are compressed.
- **Trace Step**: One teachable state transition with title, explanation, visual state, stack/component data, and code highlight.
- **Code Example**: Learner-facing source text with highlight mappings for trace steps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On any SCC step, learners can identify the current phase, active node or component, and next action within 5 seconds using visible workbench information.
- **SC-002**: 100% of curated example nodes appear exactly once across the final SCC groups.
- **SC-003**: The final result shows the correct SCC count for the curated example and distinguishes at least three SCC groups.
- **SC-004**: Learners can explain, from the final screen, that nodes are grouped only when they are mutually reachable.
- **SC-005**: Step changes update the graph state, stack or component state, explanation, and selected code highlight together without contradictory information.
- **SC-006**: The completed feature remains limited to the SCC graph lesson and does not introduce tree, TCP, UDP, Redis, or unrelated graph-topic pages.

## Assumptions

- 그래프 도메인에는 아직 방향 그래프의 순환 컴포넌트를 다루는 핵심 개념이 남아 있으므로, 이번 기능은 트리나 TCP/UDP/Redis보다 SCC를 우선한다.
- 첫 구현 학습 흐름은 Kosaraju 방식의 두 번 DFS 흐름으로 설명한다. Tarjan 방식, Gabow 방식, 알고리즘 비교는 이후 별도 기능으로 다룬다.
- 입력 편집 없이 고정된 예제 그래프를 사용해 단계, 설명, 코드 강조, 검증 결과가 항상 같은 순서로 재현되게 한다.
- 노드 라벨과 tie-break 순서는 결정적으로 유지해 같은 예제에서 항상 같은 trace와 SCC 목록이 나오게 한다.
