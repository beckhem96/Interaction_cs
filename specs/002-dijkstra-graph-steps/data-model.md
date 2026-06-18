# Data Model: Dijkstra Graph Step Workbench

## Dijkstra Example

**Purpose**: Learner가 선택하는 curated graph lesson.

**Fields**:

- `id`: `"undirected"` 또는 `"directed"`
- `title`: 한국어 예제 이름
- `description`: 예제의 학습 초점
- `directionMode`: `"undirected"` 또는 `"directed"`
- `startNodeId`: 시작 노드 id
- `defaultDestinationId`: 최종 결과에서 처음 보여줄 도착 노드 id
- `nodes`: `DijkstraNode[]`
- `edges`: `DijkstraEdge[]`

**Relationships**:

- 하나의 example은 여러 node와 edge를 가진다.
- 하나의 example은 하나의 trace를 생성한다.

**Validation Rules**:

- `nodes`의 id는 중복될 수 없다.
- `startNodeId`와 `defaultDestinationId`는 `nodes` 안에 존재해야 한다.
- 모든 edge weight는 0 이상의 finite number여야 한다.
- directed example의 edge는 한 방향으로만 adjacency를 만든다.
- undirected example의 edge는 양방향 adjacency를 만든다.

## Dijkstra Node

**Purpose**: SVG graph와 distance table에 동시에 나타나는 vertex.

**Fields**:

- `id`: canonical node id, 예: `"A"`
- `label`: 화면 표시 라벨
- `x`, `y`: SVG 좌표
- `role`: `"start"`, `"normal"`, `"destination"` 중 선택

**Relationships**:

- 여러 edge의 `fromId` 또는 `toId`가 될 수 있다.
- 하나의 distance table row와 대응한다.

**Validation Rules**:

- `label`은 tie-break 설명에 사용할 수 있도록 안정적인 문자열이어야 한다.
- `x`, `y`는 SVG viewport 안에 있어야 한다.

## Dijkstra Edge

**Purpose**: Weighted graph의 연결과 relaxation 대상.

**Fields**:

- `id`: stable edge id
- `fromId`: 시작 node id
- `toId`: 끝 node id
- `weight`: 0 이상의 비용
- `directed`: 방향 간선 여부

**Relationships**:

- directed edge는 `fromId -> toId`로만 검사된다.
- undirected edge는 trace 생성 시 양방향 adjacency item으로 사용된다.

**Validation Rules**:

- `weight`는 음수가 될 수 없다.
- `fromId`와 `toId`는 서로 달라야 한다.
- 같은 direction의 중복 edge는 초기 예제에 포함하지 않는다.

## Distance Table Row

**Purpose**: 각 step에서 learner가 현재 최단 거리 후보와 확정 상태를 읽는 표 행.

**Fields**:

- `nodeId`
- `label`
- `distance`: number 또는 `"Infinity"`
- `previousNodeId`: string 또는 null
- `status`: `"unreached"`, `"frontier"`, `"current"`, `"updated"`, `"skipped"`, `"settled"`, `"final-path"`
- `candidateDistance`: 비교 중일 때만 number
- `changed`: 현재 step에서 값이 갱신되었는지 여부

**Relationships**:

- 하나의 row는 하나의 graph node와 대응한다.
- final path step에서 `Shortest Path Result`가 참조한다.

**Validation Rules**:

- 시작 노드의 초기 distance는 0이다.
- unreached 노드는 `previousNodeId`가 null이다.
- settled row는 이후 step에서 unsettled 상태로 되돌아갈 수 없다.

## Frontier Candidate

**Purpose**: 다음 current node 후보 목록과 선택 이유를 보여준다.

**Fields**:

- `nodeId`
- `distance`
- `tieBreakLabel`
- `isSelected`
- `reason`: 한국어 선택/비선택 설명

**Relationships**:

- unsettled이며 finite distance를 가진 node에서 만들어진다.

**Validation Rules**:

- 최소 distance 후보가 선택된다.
- 같은 distance가 여러 개면 `tieBreakLabel` 알파벳순 첫 후보가 선택된다.

## Dijkstra Trace Step

**Purpose**: UI가 렌더링하는 단일 학습 전이.

**Fields**:

- `id`
- `title`
- `description`
- `pseudoCodeLine`
- `codeLineHighlights`: C, C++, Java, Python, JavaScript line arrays
- `state.exampleId`
- `state.directionMode`
- `state.motion`: `"initialize"`, `"select-current"`, `"inspect-edge"`, `"relax"`, `"skip"`, `"settle"`, `"complete"`
- `state.nodes`: render-ready node states
- `state.edges`: render-ready edge states
- `state.distanceRows`
- `state.frontierCandidates`
- `state.currentNodeId`
- `state.inspectedEdgeId`
- `state.comparison`: current distance + edge weight + candidate distance + previous best
- `state.finalDistances`
- `state.finalPathNodeIds`

**Relationships**:

- 모든 UI panel은 같은 trace step에서 데이터를 읽는다.
- code highlight는 step의 algorithm action과 대응한다.

**Validation Rules**:

- 모든 step은 한국어 description을 가진다.
- graph/table/explanation/code highlight는 같은 algorithm action을 가리켜야 한다.
- complete step은 모든 reachable node의 final distance와 predecessor를 포함해야 한다.

## Code Example

**Purpose**: 선택된 언어의 다익스트라 구현과 line highlight 대상.

**Fields**:

- `language`: `"C"`, `"C++"`, `"Java"`, `"Python"`, `"JavaScript"`
- `fileName`
- `code`
- `lineMapKey`: trace action과 언어별 line range를 연결하는 key

**Relationships**:

- `Dijkstra Trace Step.codeLineHighlights`가 language별 line number를 참조한다.

**Validation Rules**:

- 모든 language tab은 같은 algorithm phases를 표현해야 한다.
- 모든 trace step은 현재 language에서 최소 하나의 highlighted line 또는 range를 가져야 한다.

## Shortest Path Result

**Purpose**: 최종 단계에서 learner가 선택한 도착 노드까지의 path를 보여준다.

**Fields**:

- `destinationNodeId`
- `distance`: number 또는 `"Infinity"`
- `pathNodeIds`: start에서 destination까지 순서 배열
- `totalCostLabel`
- `isReachable`

**Relationships**:

- complete step의 predecessor chain에서 계산된다.
- destination selector 값이 바뀔 때 표시 결과가 갱신된다.

**Validation Rules**:

- `isReachable`이 false이면 `pathNodeIds`는 빈 배열이고 도달 불가 설명을 보여준다.
- start와 destination이 같으면 distance는 0이고 path는 start node 하나다.

## State Transitions

```text
initialize
  -> select-current
  -> inspect-edge
  -> relax | skip
  -> inspect-edge | settle
  -> select-current | complete
```

Settled node는 이후 step에서 `frontier`, `updated`, `current`로 되돌아가지 않는다. Complete 이후 destination selector는 final path display만 바꾸며 trace order를 변경하지 않는다.
