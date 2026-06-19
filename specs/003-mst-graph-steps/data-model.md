# Data Model: MST Graph Step Workbench

## MST Example

**Purpose**: Learner가 Kruskal MST를 따라가는 curated weighted graph lesson.

**Fields**:

- `id`: stable example id, 예: `"kruskal-basic"`
- `title`: 한국어 예제 이름
- `description`: 예제의 학습 초점
- `nodes`: `MstNode[]`
- `edges`: `MstEdge[]`

**Relationships**:

- 하나의 example은 여러 node와 edge를 가진다.
- 하나의 example은 하나의 deterministic trace를 생성한다.

**Validation Rules**:

- `nodes`의 id는 중복될 수 없다.
- 모든 edge endpoint는 `nodes` 안에 존재해야 한다.
- graph는 connected undirected graph여야 한다.
- 모든 edge weight는 finite number여야 한다.
- 첫 slice는 self-loop와 parallel edge를 포함하지 않는다.

## MST Node

**Purpose**: SVG graph와 component summary에 동시에 나타나는 vertex.

**Fields**:

- `id`: canonical node id, 예: `"A"`
- `label`: 화면 표시 라벨
- `x`, `y`: SVG 좌표

**Relationships**:

- 여러 edge의 `fromId` 또는 `toId`가 될 수 있다.
- 각 trace step에서 하나의 component group에 속한다.

**Validation Rules**:

- `label`은 tie-break 설명에 사용할 수 있도록 안정적인 문자열이어야 한다.
- `x`, `y`는 SVG viewport 안에 있어야 한다.

## MST Edge

**Purpose**: Kruskal이 weight 순서로 검사하는 undirected weighted connection.

**Fields**:

- `id`: stable edge id, 예: `"A-B"`
- `fromId`: 한쪽 endpoint node id
- `toId`: 다른 endpoint node id
- `weight`: numeric cost
- `label`: 화면 표시용 edge label, 예: `"A-B"`
- `orderKey`: equal-weight tie-break에 사용할 stable key

**Relationships**:

- 하나의 edge는 두 node를 연결한다.
- sorted edge row, SVG edge render state, candidate decision에서 같은 `id`로 참조된다.

**Validation Rules**:

- `fromId`와 `toId`는 서로 달라야 한다.
- `id`와 `orderKey`는 stable하고 중복될 수 없다.
- 정렬 순서는 `weight` 오름차순, 같은 weight일 때 `orderKey` 오름차순이다.

## Sorted Edge Row

**Purpose**: Kruskal이 검사하는 간선 순서와 현재 decision 상태를 보여주는 목록 행.

**Fields**:

- `edgeId`
- `label`
- `weight`
- `order`
- `status`: `"pending"`, `"candidate"`, `"selected"`, `"skipped-cycle"`, `"not-needed"`
- `decisionLabel`: 한국어 상태 설명
- `componentRelation`: 후보 단계에서 endpoint component 관계

**Relationships**:

- 하나의 row는 하나의 MST edge와 대응한다.
- current candidate edge와 selected/skipped edge set에서 상태가 결정된다.

**Validation Rules**:

- row order는 trace 전체에서 변하지 않는다.
- selected row의 weight 합은 trace의 `totalCost`와 같아야 한다.
- skipped-cycle row는 total cost를 바꾸지 않아야 한다.

## Component Group

**Purpose**: 현재 선택된 간선들이 만든 connected component를 learner에게 보여준다.

**Fields**:

- `id`: stable component id
- `nodeIds`: component에 포함된 node ids
- `label`: 화면 표시 라벨, 예: `"{A, C, D}"`
- `isMergedThisStep`: 현재 step에서 병합되었는지 여부

**Relationships**:

- 모든 node는 정확히 하나의 component group에 속한다.
- selected edge가 서로 다른 component를 잇는 경우 두 group이 하나로 병합된다.

**Validation Rules**:

- 한 trace step에서 component groups의 node id 합집합은 example의 전체 node set과 같아야 한다.
- 같은 step에서 node id가 둘 이상의 group에 중복될 수 없다.
- skipped-cycle step에서는 component groups가 이전 decision 이후 상태와 동일해야 한다.

## Candidate Decision

**Purpose**: 현재 candidate edge를 선택할지 건너뛸지 설명하는 판단 결과.

**Fields**:

- `edgeId`
- `fromNodeId`
- `toNodeId`
- `weight`
- `fromComponentId`
- `toComponentId`
- `willSelect`: boolean
- `reason`: 한국어 decision 설명

**Relationships**:

- `willSelect`가 true이면 selected edge set과 component groups가 변경된다.
- `willSelect`가 false이면 skipped edge set만 변경된다.

**Validation Rules**:

- `fromComponentId`와 `toComponentId`가 다르면 `willSelect`는 true여야 한다.
- 두 component id가 같으면 `willSelect`는 false이고 reason은 cycle 생성을 설명해야 한다.

## MST Trace Step

**Purpose**: UI가 렌더링하는 단일 학습 전이.

**Fields**:

- `id`
- `title`
- `description`
- `pseudoCodeLine`
- `codeLineHighlights`: C, C++, Java, Python, JavaScript line arrays
- `state.exampleId`
- `state.motion`: `"initialize"`, `"sort-edges"`, `"inspect-edge"`, `"select-edge"`, `"skip-cycle"`, `"complete"`
- `state.nodes`: render-ready node states
- `state.edges`: render-ready edge states
- `state.sortedEdges`
- `state.components`
- `state.candidateDecision`
- `state.selectedEdgeIds`
- `state.skippedEdgeIds`
- `state.totalCost`
- `state.selectedEdgeCount`
- `state.result`

**Relationships**:

- 모든 UI panel은 같은 trace step에서 데이터를 읽는다.
- code highlight는 step의 algorithm action과 대응한다.

**Validation Rules**:

- 모든 step은 한국어 title과 description을 가진다.
- graph, edge list, component summary, total cost, code highlight는 같은 algorithm action을 가리켜야 한다.
- complete step은 selected edge count가 `node count - 1`이고 result를 포함해야 한다.

## MST Result

**Purpose**: 완료 단계에서 MST correctness를 요약한다.

**Fields**:

- `selectedEdgeIds`
- `selectedEdgeLabels`
- `coveredNodeIds`
- `totalCost`
- `costFormulaLabel`
- `isComplete`

**Relationships**:

- complete step의 selected edge set과 total cost에서 계산된다.

**Validation Rules**:

- connected graph complete result는 모든 node를 포함해야 한다.
- selected edge count는 `node count - 1`이어야 한다.
- `totalCost`는 selected edge weights의 합이어야 한다.

## Code Example

**Purpose**: 선택된 언어의 Kruskal 구현과 line highlight 대상.

**Fields**:

- `language`: `"C"`, `"C++"`, `"Java"`, `"Python"`, `"JavaScript"`
- `fileName`
- `code`
- `lineMapKey`: trace action과 언어별 line range를 연결하는 key

**Relationships**:

- `MST Trace Step.codeLineHighlights`가 language별 line number를 참조한다.

**Validation Rules**:

- 모든 language tab은 같은 algorithm phases를 표현해야 한다.
- 모든 trace step은 현재 language에서 최소 하나의 highlighted line 또는 range를 가져야 한다.

## State Transitions

```text
initialize
  -> sort-edges
  -> inspect-edge
  -> select-edge | skip-cycle
  -> inspect-edge | complete
```

Selected edge는 이후 step에서 unselected 상태로 되돌아가지 않는다. Complete 이후 step control은 trace order를 변경하지 않고, reset만 초기 상태로 되돌린다.
