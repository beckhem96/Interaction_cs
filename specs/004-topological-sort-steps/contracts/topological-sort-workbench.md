# Contract: DAG Topological Sort Workbench

## Route and Navigation

- Route: `/graphs/topological-sort`
- Page title: `위상 정렬: DAG`
- Home page graph section MUST expose a card or link for the page.
- App route tests MUST verify the route renders the page title.

## Workbench Layout Contract

The page MUST render one integrated workbench with:

- SVG DAG stage
- Current step title and Korean explanation
- Zero-in-degree candidate queue
- In-degree table
- Accumulated topological order
- Final validation panel when complete
- Code panel with C, C++, Java, Python, JavaScript tabs
- Previous, Next, Reset, Play/Pause, speed, and step slider controls

Desktop layout MUST keep the interaction stage and code panel visible side by side. The primary Next button MUST remain in the same visible workbench area.

## Trace Contract

The trace generation API MUST expose a pure function equivalent to:

```ts
function generateTopologicalSortTrace(exampleId?: TopologicalSortExampleId): TraceStep<TopologicalSortTraceState>[];
```

Trace output MUST be deterministic for a given example id.

Each trace step MUST provide:

- Korean `title`
- Korean `description`
- `state.motion`
- `state.nodes`
- `state.edges`
- `state.candidateQueue`
- `state.inDegreeRows`
- `state.resultOrder`
- `state.selectedNodeId` when a node is selected
- `state.affectedEdgeIds` when outgoing edges are handled
- `state.newCandidateNodeIds` when new candidates open
- `state.validation` on completion or cycle-blocked state
- `codeLineHighlights` for all required code languages

## Algorithm Behavior Contract

- Initial in-degree values MUST be computed from directed edges.
- Candidate queue MUST include only unprocessed nodes with current in-degree 0.
- Multiple candidates MUST be ordered by the fixed tie rule.
- Selecting a node MUST append it exactly once to the result order.
- Processing a selected node MUST affect only its outgoing edges.
- Each affected outgoing edge MUST decrement the destination node's in-degree exactly once.
- A node MUST enter the candidate queue when its in-degree becomes 0 and it has not been processed.
- Completion MUST occur only when all nodes are processed.
- Cycle-blocked MUST occur when unprocessed nodes remain but no candidate exists.

## Visual State Contract

SVG node states MUST distinguish:

- pending
- candidate
- selected
- processed
- newly opened
- blocked

SVG edge states MUST distinguish:

- pending
- active outgoing edge
- removed or satisfied edge
- prerequisite still blocking
- cycle-blocked edge when applicable

The UI MUST not rely on color alone. Labels, badges, row status text, or icons MUST reinforce active states.

## Code Highlight Contract

Required language tabs:

- C
- C++
- Java
- Python
- JavaScript

Each language MUST support highlight mappings for:

- initialize in-degree
- seed zero-in-degree queue
- inspect candidate queue
- select or dequeue node
- append result order
- iterate outgoing edge
- decrement in-degree
- enqueue newly zero-in-degree node
- complete validation
- cycle-blocked guard

## Test Contract

Trace tests MUST verify:

- example validity and DAG acyclicity
- initial in-degree counts
- multi-candidate deterministic tie order
- selected node result append
- outgoing edge processing
- in-degree decrement and new candidate opening
- final order includes every node once
- every directed edge is respected in the final order
- cycle guard behavior for a cyclic input fixture or helper
- all-language code highlight coverage

Component tests MUST verify:

- page title and graph stage render
- candidate queue and in-degree table render
- controls move forward/back/reset and slider jumps to a step
- code tabs switch visible examples
- final validation panel renders on the complete step
