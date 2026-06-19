# Data Model: DAG Topological Sort Step Workbench

## Topological Sort Example

**Purpose**: Learner가 Kahn 방식 위상 정렬을 따라가는 curated DAG lesson.

**Fields**:

- `id`: stable example identifier
- `title`: Korean lesson title
- `description`: Korean explanation of the DAG dependency story
- `nodes`: ordered `TopologicalNode[]`
- `edges`: ordered `TopologicalEdge[]`
- `candidateTieRule`: learner-facing deterministic rule text
- `layout`: SVG viewport and optional group labels

**Validation Rules**:

- Example ids are unique.
- Node ids are unique.
- Edge ids are unique.
- Every edge endpoint references an existing node id.
- Main lesson example is acyclic.
- Main lesson includes at least one step with multiple zero-in-degree candidates.
- Main lesson includes at least one edge removal that opens a new candidate.

## Topological Node

**Purpose**: A DAG vertex whose in-degree and processed status change across trace steps.

**Fields**:

- `id`: stable node id
- `label`: visible node label
- `x`, `y`: curated SVG coordinates
- `description`: optional Korean dependency meaning

**Validation Rules**:

- Label is readable and unique within the example.
- Coordinates keep nodes clear of each other and edge labels.
- Node labels are stable so tie-break and tests remain deterministic.

## Topological Edge

**Purpose**: A directed prerequisite relation from one node to another.

**Fields**:

- `id`: stable edge id
- `from`: prerequisite node id
- `to`: dependent node id
- `label`: visible relation label or compact edge id
- `labelX`, `labelY`: optional curated label coordinates

**Validation Rules**:

- `from` and `to` are different nodes.
- The edge direction must be visually clear with arrow marker and accessible label.
- Duplicate directed edges are not allowed in the curated example.

## In-Degree Row

**Purpose**: Learner-facing table row for one node's current incoming dependency count.

**Fields**:

- `nodeId`
- `label`
- `previousValue`
- `currentValue`
- `delta`
- `status`: `waiting`, `candidate`, `selected`, `processed`, `opened`
- `sourceEdgeIds`: edges that changed this value in the current step

**Validation Rules**:

- `currentValue` is never negative.
- `delta` reflects the current step only.
- `opened` is used only when the value reaches 0 because of the current step.

## Zero-In-Degree Queue

**Purpose**: Ordered set of currently processable nodes.

**Fields**:

- `items`: ordered node ids
- `selectedNodeId`: node selected by the current decision, if any
- `tieReason`: Korean explanation when multiple candidates exist

**Validation Rules**:

- Every item has current in-degree 0 and is not processed.
- Items are unique.
- Ordering follows the example tie rule.

## Topological Trace Step

**Purpose**: One teachable state transition in the topological sort lesson.

**Fields**:

- `id`: stable step id
- `title`: Korean step title
- `description`: Korean learner explanation
- `motion`: `initialize`, `inspect-candidates`, `select-node`, `remove-edge`, `update-indegree`, `enqueue-candidate`, `complete`, `cycle-blocked`
- `selectedNodeId`: current selected node, if any
- `affectedEdgeIds`: outgoing edges handled in this step
- `newCandidateNodeIds`: nodes that became processable in this step
- `processedNodeIds`: nodes already appended to the result
- `remainingNodeIds`: nodes not yet processed
- `candidateQueue`: `ZeroInDegreeQueue`
- `inDegreeRows`: `InDegreeRow[]`
- `resultOrder`: ordered processed node labels or ids
- `nodes`: render state for SVG nodes
- `edges`: render state for SVG directed edges
- `validation`: final or cycle-blocked summary when applicable
- `codeLineHighlights`: language-to-line mapping

**Validation Rules**:

- Every trace step has Korean title and description.
- Every visible table/queue/graph/code highlight state comes from this object.
- `resultOrder` contains no duplicate node.
- Processed nodes are never returned to the candidate queue.
- Complete step exists only when every node is processed.
- Cycle-blocked step exists only when unprocessed nodes remain and the candidate queue is empty.

## Topological Order Result

**Purpose**: Final validation summary for a completed DAG ordering.

**Fields**:

- `order`: ordered node ids or labels
- `nodeCount`
- `processedCount`
- `edgeChecks`: list of edge prerequisite checks
- `isValid`
- `summaryText`: Korean final explanation

**Validation Rules**:

- `processedCount` equals `nodeCount` for a valid complete result.
- Every edge check confirms `from` appears before `to`.
- `isValid` is true only when all nodes are included once and every edge check passes.

## Code Example

**Purpose**: Learner-facing topological sort source snippet with step highlights.

**Fields**:

- `language`: C, C++, Java, Python, or JavaScript
- `label`: visible tab label
- `fileName`
- `code`
- `highlightMap`: trace motion or action to code line ranges

**Validation Rules**:

- All five required languages are present.
- Every trace motion used by the lesson maps to at least one code line in every language.
- Labels remain readable in the code tab UI.

## Relationships

- A `Topological Sort Example` owns many `Topological Node` and `Topological Edge` records.
- A `Topological Trace Step` references the example and derives render states from its nodes and edges.
- `In-Degree Row`, `Zero-In-Degree Queue`, and `Topological Order Result` are step-level views derived from the algorithm state.
- `Code Example.highlightMap` is consumed by `Topological Trace Step.codeLineHighlights`.

## State Transitions

```text
initialize
  -> inspect-candidates
  -> select-node
  -> remove-edge
  -> update-indegree
  -> enqueue-candidate
  -> inspect-candidates
  -> ...
  -> complete
```

Cycle guard transition:

```text
inspect-candidates
  -> cycle-blocked
```

This transition is valid only when unprocessed nodes remain and no zero-in-degree candidate exists.
