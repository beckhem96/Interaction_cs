# Contract: MST Workbench

## Route Contract

- Path: `/graphs/mst`
- Entry point: Home page graph category card area and graph learning navigation should expose the route with Korean copy.
- Page title: `최소 신장 트리: Kruskal`
- Primary learner task: fixed weighted undirected graph에서 Kruskal이 간선을 weight 순서로 검사하고, component 관계에 따라 선택하거나 cycle로 건너뛰는 흐름을 단계별로 확인한다.

## Example Contract

- The first version exposes one fixed connected undirected weighted graph example.
- The example MUST include:
  - at least 5 nodes
  - at least 7 weighted edges
  - at least one selected edge
  - at least one skipped cycle edge
  - at least one equal-weight tie resolved by stable edge label order
- The graph MUST be laid out so nodes, edge lines, and weight labels do not overlap in a way that hides the learning state.

## Step Control Contract

- Visible controls in the main workbench:
  - `이전`
  - `다음`
  - `처음으로` or reset-equivalent control
  - `자동 재생` / `정지`
  - step slider
- `다음` remains in the same visible workbench area as the graph stage and code panel.
- First step disables `이전`.
- Last step disables `다음` and stops autoplay.
- Manual slider movement stops autoplay and updates graph, sorted edge list, component summary, explanation, total cost, and code highlight from the same trace step.

## Trace State Contract

Every generated step MUST provide enough state for all learner-visible panels:

```ts
type MstTraceStep = {
  id: string;
  title: string;
  description: string;
  pseudoCodeLine: number;
  codeLineHighlights: Record<"C" | "C++" | "Java" | "Python" | "JavaScript", number[]>;
  state: {
    exampleId: "kruskal-basic";
    motion:
      | "initialize"
      | "sort-edges"
      | "inspect-edge"
      | "select-edge"
      | "skip-cycle"
      | "complete";
    nodes: MstNodeRenderState[];
    edges: MstEdgeRenderState[];
    sortedEdges: MstSortedEdgeRow[];
    components: MstComponentGroup[];
    candidateDecision?: MstCandidateDecision;
    selectedEdgeIds: string[];
    skippedEdgeIds: string[];
    totalCost: number;
    selectedEdgeCount: number;
    result?: MstResult;
  };
};
```

## Visual State Contract

- Graph states MUST distinguish at least:
  - pending edge
  - current candidate edge
  - selected MST edge
  - skipped cycle edge
  - component merged this step
  - final MST complete
- The same state MUST also appear as text, label, aria label, table status, or explanatory copy; color alone is not sufficient.
- Weighted edges MUST show their numeric weight.
- Undirected edges MUST not display direction arrows.
- The final state MUST visually emphasize the selected MST edges and still allow skipped/non-selected edges to be understood as excluded.

## Sorted Edge List Contract

The edge list MUST include columns equivalent to:

- order
- edge label
- weight
- status
- decision reason or component relation when meaningful

Edge list behavior:

- Initial step shows all edges sorted by weight and tie-break order.
- Candidate step highlights exactly one row as the current edge.
- Selected step marks the row as selected and increases total cost.
- Skipped cycle step marks the row as skipped and keeps total cost unchanged.
- Complete step shows selected rows, skipped rows, and remaining rows that are no longer needed after MST completion.

## Component Summary Contract

- Component summary MUST show which nodes currently belong together.
- When an edge is selected, the two endpoint components merge in the next visible state.
- When an edge is skipped, component summary remains stable and the explanation states that the endpoints were already connected.
- Component labels MUST be readable without relying on graph color alone.

## Final Result Contract

- Complete state MUST show:
  - selected edge count
  - expected count `노드 수 - 1`
  - selected edge order
  - total cost
  - cost formula from selected edge weights
  - covered node labels
- Complete state MUST not claim support for disconnected graph MST. If disconnected inputs are ever introduced later, they must be labeled as minimum spanning forest.

## Code Panel Contract

- Language tabs MUST exist for:
  - C
  - C++
  - Java
  - Python
  - JavaScript
- The selected language tab MUST keep labels readable.
- Every trace step MUST highlight at least one corresponding code line or range in the selected language.
- Changing the step MUST update highlighted code lines without changing the selected language.

## Test Contract

Trace tests MUST verify:

- MST example generates a non-empty complete trace
- sorted edge order is weight ascending and equal weight is resolved by edge label order
- selected edges always connect different components at decision time
- skipped edges connect nodes already in the same component
- skipped steps do not change total cost
- complete step selects exactly `node count - 1` edges
- complete total cost equals the selected edge weight sum
- every step has Korean title/description and code highlights for all five languages

Component tests MUST verify:

- route/page renders Korean title and graph workbench
- graph stage, sorted edge list, component summary, explanation, code tabs, and primary Next control render together
- manual next/previous/reset/slider update the visible step
- selected and skipped states appear as visible text labels, not color-only states
- code language tab switch preserves current step highlight
- final result shows selected edge count, expected count, total cost, and selected order
