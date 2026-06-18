# Quickstart: Dijkstra Graph Step Workbench

## Scope

이 quickstart는 `/speckit-tasks` 이후 구현자가 다익스트라 workbench를 만들고 검증할 때 따른다. 구현 범위는 graph algorithm domain 하나로 제한한다.

## Expected Files

```text
src/concepts/graphs/types.ts
src/concepts/graphs/algorithms/dijkstra.ts
src/concepts/graphs/code/dijkstraExamples.ts
src/concepts/graphs/components/DijkstraPage.tsx
src/concepts/graphs/components/DijkstraPage.test.tsx
src/concepts/graphs/tests/dijkstra.test.ts
src/App.tsx
src/pages/HomePage.tsx
src/styles.css
```

## Implementation Checklist

1. Add Dijkstra-specific graph, edge, distance row, frontier, trace, and result types in `src/concepts/graphs/types.ts`.
2. Create fixed undirected and directed weighted graph examples in `src/concepts/graphs/algorithms/dijkstra.ts`.
3. Implement pure trace generation:
   - initialize distances
   - select unsettled minimum-distance node
   - resolve equal distance by node label alphabetical order
   - inspect each outgoing edge
   - emit relax and skip/no-update steps
   - settle nodes
   - emit final complete step with final distances and predecessors
4. Add C, C++, Java, Python, JavaScript examples in `src/concepts/graphs/code/dijkstraExamples.ts`.
5. Map every trace step to highlighted lines for all five languages.
6. Build `DijkstraPage.tsx` using `useStepController` and SVG-first rendering.
7. Keep graph visualization, distance table, current explanation, controls, and code panel visible in one desktop workbench.
8. Add final destination selector for reachable destination paths.
9. Add `/graphs/dijkstra` route and Home entry.
10. Add focused trace tests and component tests.

## Verification Commands

Run focused tests while implementing:

```bash
npm run test -- src/concepts/graphs/tests/dijkstra.test.ts src/concepts/graphs/components/DijkstraPage.test.tsx --run
```

Run the full suite before completion:

```bash
npm run test -- --run
```

Run the production build:

```bash
npm run build
```

## Manual QA

1. Open `/graphs/dijkstra`.
2. Confirm page copy is Korean-first.
3. Switch between `무방향 그래프` and `방향 그래프`; each switch resets to the first step.
4. Use `다음`, `이전`, `처음으로`, slider, and `자동 재생`; graph, distance table, explanation, and code highlight must stay synchronized.
5. Inspect a relaxation step; previous distance, candidate distance, updated value, active edge, and highlighted code line must match.
6. Inspect a no-update step; table values must remain stable and the Korean explanation must say why.
7. Inspect a tie-break step; the alphabetically first node label must be selected and explained.
8. On the final step, change the destination node and confirm path sequence, total cost, and final path highlight update.
9. Switch each code language tab and confirm the current step keeps a visible highlighted line.

## Done Criteria

- Trace unit tests pass.
- Component tests pass.
- Full test suite passes.
- Build passes.
- No new dependency is introduced unless a later plan revision explicitly justifies it.
