# Quickstart: DAG Topological Sort Step Workbench

This quickstart is for implementing the DAG topological sort workbench after `/speckit-tasks`.

## Scope Guard

- Implement only the graph domain topological sort slice.
- Do not add tree, TCP, UDP, Redis, DFS topological sort comparison, or editable graph input.
- Keep algorithm decisions outside React components.
- Keep all learner-facing page copy Korean-first.

## Expected Files

```text
src/concepts/graphs/types.ts
src/concepts/graphs/algorithms/topologicalSort.ts
src/concepts/graphs/code/topologicalSortExamples.ts
src/concepts/graphs/components/TopologicalSortPage.tsx
src/concepts/graphs/components/TopologicalSortPage.test.tsx
src/concepts/graphs/tests/topologicalSort.test.ts
src/App.tsx
src/App.test.tsx
src/pages/HomePage.tsx
src/pages/HomePage.test.tsx
src/styles.css
CONCEPT_SPEC.md
```

## Implementation Order

1. Add topological sort types for examples, nodes, edges, in-degree rows, candidate queue, trace state, validation, and render states.
2. Add code examples for C, C++, Java, Python, and JavaScript with line highlight maps.
3. Add trace tests for initial in-degree, queue tie-break, edge processing, candidate opening, completion validation, cycle guard, and highlight coverage.
4. Implement curated DAG data and `generateTopologicalSortTrace`.
5. Build `TopologicalSortPage` from immutable trace state.
6. Add route `/graphs/topological-sort`, Home card/link, and concept documentation reference.
7. Add styles for DAG workbench, candidate queue, in-degree table, result order, and final validation.
8. Run focused tests, full tests, and build.

## Verification Commands

```bash
npm run test -- src/concepts/graphs/tests/topologicalSort.test.ts src/concepts/graphs/components/TopologicalSortPage.test.tsx --run
npm run test -- --run
npm run build
```

## Review Checklist

- Trace generation is pure and deterministic.
- React components do not contain algorithm decisions.
- Every step has Korean title and description.
- Candidate queue, in-degree table, DAG stage, result order, explanation, and code highlight all come from the same trace step.
- Multi-candidate tie behavior is visible and deterministic.
- Final validation proves every edge prerequisite is respected.
- Visual states are distinguishable by more than color.
- Desktop workbench keeps interaction stage and code panel visible together.
