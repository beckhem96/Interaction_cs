# Quickstart: MST Graph Step Workbench

## Scope

이 quickstart는 `/speckit-tasks` 이후 구현자가 Kruskal MST workbench를 만들고 검증할 때 따른다. 구현 범위는 graph algorithm domain 하나로 제한한다.

## Expected Files

```text
src/concepts/graphs/types.ts
src/concepts/graphs/algorithms/mst.ts
src/concepts/graphs/code/mstExamples.ts
src/concepts/graphs/components/MstPage.tsx
src/concepts/graphs/components/MstPage.test.tsx
src/concepts/graphs/tests/mst.test.ts
src/App.tsx
src/App.test.tsx
src/pages/HomePage.tsx
src/pages/HomePage.test.tsx
src/styles.css
CONCEPT_SPEC.md
```

## Implementation Checklist

1. Add MST-specific exported type declarations for example, node, edge, sorted edge row, component group, candidate decision, result, and trace state in `src/concepts/graphs/types.ts`.
2. Create one fixed connected undirected weighted graph example in `src/concepts/graphs/algorithms/mst.ts`.
3. Implement pure trace generation:
   - initialize each node as its own component
   - sort edges by weight and stable edge label
   - inspect the current candidate edge
   - select edge when endpoints are in different components
   - merge components after selection
   - skip edge when endpoints are already in the same component
   - stop at MST completion and emit final result
4. Add C, C++, Java, Python, and JavaScript Kruskal examples in `src/concepts/graphs/code/mstExamples.ts`.
5. Map every trace step to highlighted lines for all five languages.
6. Build `MstPage.tsx` using `useStepController` and SVG-first rendering.
7. Keep graph visualization, sorted edge list, component summary, current explanation, controls, and code panel visible in one desktop workbench.
8. Add `/graphs/mst` route and Home entry.
9. Add focused trace tests and component tests.

## Verification Commands

Run focused tests while implementing:

```bash
npm run test -- src/concepts/graphs/tests/mst.test.ts src/concepts/graphs/components/MstPage.test.tsx --run
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

1. Open `/graphs/mst`.
2. Confirm page copy is Korean-first.
3. Use `다음`, `이전`, `처음으로`, slider, and `자동 재생`; graph, edge list, component summary, total cost, explanation, and code highlight must stay synchronized.
4. Inspect a candidate edge step; the same edge must be active in the graph and sorted edge list.
5. Inspect a selected edge step; total cost and component grouping must change together.
6. Inspect a skipped cycle step; total cost must remain stable and the Korean explanation must say the endpoints are already connected.
7. Inspect an equal-weight tie step; the edge label order must determine the candidate order and be explained.
8. Inspect the final step; selected edge count must equal `노드 수 - 1`, and total cost must match the selected edge weights.
9. Switch each code language tab and confirm the current step keeps a visible highlighted line.

## Done Criteria

- Trace unit tests pass.
- Component tests pass.
- Full test suite passes.
- Build passes.
- No new dependency is introduced unless a later plan revision explicitly justifies it.
