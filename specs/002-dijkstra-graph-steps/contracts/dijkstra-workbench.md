# Contract: Dijkstra Workbench

## Route Contract

- Path: `/graphs/dijkstra`
- Entry point: Home page category card and graph learning navigation should expose the route with Korean copy.
- Page title: `다익스트라 최단 경로`
- Primary learner task: fixed weighted graph examples에서 단계별로 현재 노드 선택, edge inspection, relaxation, distance table update, final path reconstruction을 확인한다.

## Example Selection Contract

- The workbench MUST expose two example tabs:
  - `무방향 그래프`
  - `방향 그래프`
- Switching example MUST:
  - reset current step to index `0`
  - stop autoplay
  - reset selected code language to the default first tab unless implementation keeps language selection without breaking highlight sync
  - clearly identify the active example and direction mode

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
- Manual slider movement stops autoplay and updates graph/table/explanation/code highlight from the same trace step.

## Trace State Contract

Every generated step MUST provide enough state for all learner-visible panels:

```ts
type DijkstraTraceStep = {
  id: string;
  title: string;
  description: string;
  pseudoCodeLine: number;
  codeLineHighlights: Record<"C" | "C++" | "Java" | "Python" | "JavaScript", number[]>;
  state: {
    exampleId: "undirected" | "directed";
    directionMode: "undirected" | "directed";
    motion:
      | "initialize"
      | "select-current"
      | "inspect-edge"
      | "relax"
      | "skip"
      | "settle"
      | "complete";
    nodes: DijkstraNodeRenderState[];
    edges: DijkstraEdgeRenderState[];
    distanceRows: DijkstraDistanceRow[];
    frontierCandidates: DijkstraFrontierCandidate[];
    currentNodeId?: string;
    inspectedEdgeId?: string;
    comparison?: DijkstraDistanceComparison;
    finalPathNodeIds?: string[];
  };
};
```

## Visual State Contract

- Graph states MUST distinguish at least:
  - start
  - current
  - frontier candidate
  - inspected edge
  - relaxed/updated node
  - skipped/no-update edge or node
  - settled
  - final path
- The same state MUST also appear as text, label, aria label, table status, or explanatory copy; color alone is not sufficient.
- Weighted edges MUST show their numeric weight.
- Directed graph edges MUST show direction.

## Distance Table Contract

The table MUST include columns equivalent to:

- node label
- current best distance
- previous node
- status
- candidate distance or comparison result when meaningful

Distance table behavior:

- Initial step shows start distance `0` and other nodes as infinity/unreached.
- Relax step shows previous value and updated value.
- No-update step keeps value stable and explains why.
- Settled rows remain settled in later steps.
- Complete step shows all reachable final distances and marks unreachable nodes as unreachable when present.

## Final Path Contract

- On complete/final result state, learner can choose a reachable destination node.
- Changing destination updates:
  - path node sequence from start to destination
  - total cost
  - final path highlight on graph
- If implementation exposes unreachable nodes in the selector, choosing one MUST show `도달 불가` and no path sequence.
- Start equals destination displays distance `0` and a one-node path.

## Code Panel Contract

- Language tabs MUST exist for:
  - C
  - C++
  - Java
  - Python
  - JavaScript
- The selected language tab MUST keep labels readable.
- Every trace step MUST highlight at least one corresponding code line or range in the selected language.
- Changing the step MUST update highlighted code lines without changing the selected language unless the selected example changes by design.

## Test Contract

Trace tests MUST verify:

- undirected and directed examples both generate non-empty complete traces
- final distances match the curated graphs
- predecessor chain reconstructs the expected path
- no-update steps do not mutate distance rows
- settled nodes do not return to frontier/current
- equal tentative distances select the alphabetically first node label
- every step has Korean title/description and code highlights for all five languages

Component tests MUST verify:

- route/page renders Korean title and both example tabs
- graph stage, distance table, explanation, code tabs, and primary Next control render together
- manual next/previous/reset/slider update the visible step
- code language tab switch preserves current step highlight
- final destination selection updates path sequence and total cost
