# Contract: SCC Graph Workbench

## Route and Navigation

- Route: `/graphs/scc`
- Page title: `강한 연결 요소: SCC`
- Home page graph section MUST expose a card or link for the page.
- App route tests MUST verify the route renders the page title.

## Workbench Layout Contract

The page MUST render one integrated workbench with:

- SVG directed graph stage
- Current phase badge, step title, and Korean explanation
- First-pass DFS path and visited state
- Finish order stack
- Reversed graph phase indicator
- Second-pass stack pop and current SCC candidate
- Finalized SCC list
- Condensation summary panel when complete
- Code panel with C, C++, Java, Python, JavaScript tabs
- Previous, Next, Reset, Play/Pause, speed, and step slider controls

Desktop layout MUST keep the interaction stage and code panel visible side by side. The primary Next button MUST remain in the same visible workbench area.

## Trace Contract

The trace generation API MUST expose a pure function equivalent to:

```ts
function generateStronglyConnectedComponentsTrace(
  exampleId?: SccExampleId
): TraceStep<SccTraceState>[];
```

Trace output MUST be deterministic for a given example id.

Each trace step MUST provide:

- Korean `title`
- Korean `description`
- `state.phase`
- `state.motion`
- `state.nodes`
- `state.edges`
- `state.dfs`
- `state.finishStack`
- `state.currentComponent`
- `state.finalizedComponents`
- `state.condensationEdges`
- `state.validation` on complete state
- `codeLineHighlights` for all required code languages

## Algorithm Behavior Contract

- First-pass DFS MUST visit nodes using the curated traversal order.
- First-pass adjacency iteration MUST use the curated outgoing edge order.
- A node MUST be pushed to the finish stack only after all reachable outgoing edges for that DFS frame are handled.
- Reversed graph state MUST be represented before any second-pass DFS starts.
- Second-pass DFS MUST pop candidate roots from the finish stack top.
- If a popped node already belongs to a finalized SCC, the trace MUST explain that it is skipped.
- A second-pass DFS MUST collect exactly the nodes reachable from its root in the reversed graph that are not already assigned to an SCC.
- Finalized SCC groups MUST be disjoint.
- Completion MUST occur only when every graph node appears in exactly one SCC.
- Condensation edges MUST include only edges whose endpoints belong to different SCCs.

## Visual State Contract

SVG node states MUST distinguish:

- unvisited
- first-pass active
- first-pass finished
- stack top
- second-pass active
- current component candidate
- finalized component member
- singleton component

SVG edge states MUST distinguish:

- normal original edge
- active original edge
- skipped original edge
- reversed edge
- active reversed edge
- internal SCC edge
- cross-component condensation edge

The UI MUST not rely on color alone. Labels, badges, row status text, outlines, or icons MUST reinforce active states. Curated coordinates and edge label offsets MUST prevent node/edge/label overlap in the fixed example.

## Code Highlight Contract

Required language tabs:

- C
- C++
- Java
- Python
- JavaScript

Each language MUST support highlight mappings for:

- initialize visited state
- first-pass DFS start
- first-pass node visit
- inspect outgoing edge
- skip already visited edge
- push finish stack
- reverse graph
- second-pass pop stack
- second-pass node visit
- add node to current component
- finalize SCC
- build condensation edges
- complete validation

## Test Contract

Trace tests MUST verify:

- example validity and required SCC shape
- first-pass finish stack contains every node once
- reversed edges invert every original directed edge
- second-pass pop order follows the finish stack
- 3-node SCC, 2-node SCC, and singleton SCC membership are correct
- cross-component one-way edges do not merge SCCs
- condensation edges omit internal SCC edges and collapse duplicates
- final validation covers every node exactly once
- every trace step has Korean title and description
- all-language code highlight coverage

Component tests MUST verify:

- page title and graph stage render
- finish stack and current DFS path render
- controls move forward/back/reset and slider jumps to a step
- code tabs switch visible examples
- current SCC and finalized SCC labels render
- reversed graph phase is visible
- final condensation panel renders on the complete step
