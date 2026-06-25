# Data Model: SCC Graph Step Workbench

## SCC Example

**Purpose**: Learner가 Kosaraju 방식 SCC 탐색을 따라가는 curated directed graph lesson.

**Fields**:

- `id`: stable example identifier
- `title`: Korean lesson title
- `description`: Korean explanation of the directed graph story
- `nodes`: ordered `SccNode[]`
- `edges`: ordered `SccEdge[]`
- `traversalOrder`: deterministic first-pass start order
- `adjacencyOrder`: deterministic outgoing edge order per node
- `layout`: SVG viewport and optional component label positions

**Validation Rules**:

- Example ids are unique.
- Node ids are unique.
- Edge ids are unique.
- Every edge endpoint references an existing node id.
- Main lesson includes at least one 3-node SCC, one 2-node SCC, and one singleton SCC.
- Main lesson includes at least two cross-component directed edges.
- Node, edge, and label coordinates keep the visual clear of overlap.

## SCC Node

**Purpose**: A directed graph vertex whose visited, finished, active, and component membership state changes across trace steps.

**Fields**:

- `id`: stable node id
- `label`: visible node label
- `x`, `y`: curated SVG coordinates
- `description`: optional Korean role in the example story
- `expectedComponentId`: optional validation target for the curated example

**Validation Rules**:

- Label is readable and unique within the example.
- Coordinates keep nodes clear of each other and edge labels.
- Node labels are stable so DFS order and tests remain deterministic.

## SCC Edge

**Purpose**: A directed relationship used by first-pass traversal, reversed-graph traversal, and condensation summary.

**Fields**:

- `id`: stable edge id
- `from`: source node id
- `to`: destination node id
- `label`: visible relation label or compact edge id
- `labelX`, `labelY`: optional curated label coordinates
- `curve`: optional render hint for bidirectional or nearby edges

**Validation Rules**:

- `from` and `to` reference existing nodes.
- The edge direction must be visually clear with arrow marker and accessible label.
- Duplicate directed edges are not allowed in the curated example.
- Reversed edges preserve stable ids derived from original edge ids.

## DFS Pass State

**Purpose**: Step-level traversal state for either the original graph pass or reversed graph pass.

**Fields**:

- `pass`: `first` or `second`
- `startedNodeId`: current DFS root for the pass
- `activeNodeId`: current node being visited or finished
- `activeEdgeId`: currently inspected edge, if any
- `visitedNodeIds`: ordered nodes visited in the current pass
- `pathNodeIds`: current DFS path or recursion stack
- `skippedEdgeReason`: optional Korean reason when an inspected edge is ignored

**Validation Rules**:

- `activeNodeId`, `activeEdgeId`, and `pathNodeIds` must reference visible graph elements.
- First-pass visited nodes and second-pass visited nodes are tracked separately.
- Every inspected edge explanation matches the active pass direction.

## Finish Order Stack

**Purpose**: Ordered stack produced by first-pass DFS finish events and consumed by second-pass DFS starts.

**Fields**:

- `items`: ordered node ids
- `topNodeId`: node currently popped or inspected, if any
- `lastPushedNodeId`: node most recently finished, if any
- `lastPoppedNodeId`: node most recently selected for second pass, if any

**Validation Rules**:

- Items are unique.
- A node is pushed only after its first-pass outgoing exploration is complete.
- A node can be popped for second pass only after the reverse graph phase begins.

## SCC Group

**Purpose**: A finalized set of nodes that are mutually reachable.

**Fields**:

- `id`: stable component id
- `label`: visible component label
- `nodeIds`: ordered node ids in the component
- `status`: `candidate` or `finalized`
- `representativeNodeId`: node that started the second-pass DFS for the group

**Validation Rules**:

- `nodeIds` are unique within a group.
- Finalized groups do not overlap.
- A finalized group contains only nodes reached by one second-pass DFS.
- Every final graph node appears in exactly one finalized group.

## Condensation Edge

**Purpose**: Directed edge between two SCC groups after internal SCC edges are compressed.

**Fields**:

- `id`: stable condensation edge id
- `fromComponentId`
- `toComponentId`
- `sourceEdgeIds`: original directed edges that create this component edge

**Validation Rules**:

- `fromComponentId` and `toComponentId` are different.
- Duplicate component-to-component edges are collapsed into one condensation edge.
- Internal SCC edges do not become condensation edges.

## SCC Trace Step

**Purpose**: One teachable state transition in the SCC lesson.

**Fields**:

- `id`: stable step id
- `title`: Korean step title
- `description`: Korean learner explanation
- `phase`: `original-dfs`, `reverse-graph`, `reversed-dfs`, `condensation`, or `complete`
- `motion`: `initialize`, `start-dfs`, `visit-node`, `inspect-edge`, `skip-edge`, `finish-node`, `reverse-edges`, `pop-stack`, `add-to-component`, `finalize-component`, `build-condensation`, `complete`
- `nodes`: render state for SVG nodes
- `edges`: render state for SVG directed edges
- `dfs`: `DFS Pass State`
- `finishStack`: `Finish Order Stack`
- `currentComponent`: candidate `SCC Group`, if any
- `finalizedComponents`: finalized `SCC Group[]`
- `condensationEdges`: `CondensationEdge[]`
- `validation`: final summary when applicable
- `codeLineHighlights`: language-to-line mapping

**Validation Rules**:

- Every trace step has Korean title and description.
- Every visible graph/stack/component/code highlight state comes from this object.
- First-pass finish events update `finishStack`.
- Reverse-graph steps show direction changes before any second-pass component discovery.
- Complete step exists only when every node appears in exactly one finalized SCC.

## SCC Validation Result

**Purpose**: Final learner-facing correctness summary for SCC membership and condensation.

**Fields**:

- `componentCount`
- `nodeCoverage`: node ids grouped exactly once
- `components`: finalized SCC groups
- `condensationEdges`: summarized inter-component edges
- `allNodesCovered`: boolean
- `hasDuplicateMembership`: boolean
- `summaryText`: Korean final explanation

**Validation Rules**:

- `allNodesCovered` is true only when every example node appears in a finalized SCC.
- `hasDuplicateMembership` is false for a valid final result.
- `componentCount` equals the number of finalized SCC groups.

## Code Example

**Purpose**: Learner-facing SCC source snippet with step highlights.

**Fields**:

- `language`: C, C++, Java, Python, or JavaScript
- `label`: visible tab label
- `fileName`
- `code`
- `highlightMap`: trace motion or phase to code line ranges

**Validation Rules**:

- All five required languages are present.
- Every trace motion used by the lesson maps to at least one code line in every language.
- Labels remain readable in the code tab UI.

## Relationships

- An `SCC Example` owns many `SCC Node` and `SCC Edge` records.
- An `SCC Trace Step` references the example and derives render states from its nodes and edges.
- `DFS Pass State`, `Finish Order Stack`, `SCC Group`, and `Condensation Edge` are step-level views derived from the algorithm state.
- `Code Example.highlightMap` is consumed by `SCC Trace Step.codeLineHighlights`.

## State Transitions

```text
initialize
  -> start-dfs
  -> visit-node
  -> inspect-edge
  -> visit-node | skip-edge
  -> finish-node
  -> start-dfs
  -> ...
  -> reverse-edges
  -> pop-stack
  -> start-dfs
  -> add-to-component
  -> finalize-component
  -> pop-stack
  -> ...
  -> build-condensation
  -> complete
```

Second-pass stack pops may skip nodes that already belong to a finalized SCC, but the trace must explain that the node was already collected by an earlier reversed DFS.
