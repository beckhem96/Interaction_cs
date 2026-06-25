# Quickstart: SCC Graph Step Workbench

This quickstart is for implementing the SCC graph workbench after `/speckit-tasks`.

## Scope Guard

- Implement only the graph domain SCC slice.
- Do not add tree, TCP, UDP, Redis, Tarjan/Gabow comparison, shortest-path expansion, or editable graph input.
- Keep algorithm decisions outside React components.
- Keep all learner-facing page copy Korean-first.
- Keep the fixed graph layout clear of node, edge, label, and component badge overlap.

## Expected Files

```text
src/concepts/graphs/types.ts
src/concepts/graphs/algorithms/stronglyConnectedComponents.ts
src/concepts/graphs/code/stronglyConnectedComponentsExamples.ts
src/concepts/graphs/components/StronglyConnectedComponentsPage.tsx
src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx
src/concepts/graphs/tests/stronglyConnectedComponents.test.ts
src/App.tsx
src/App.test.tsx
src/pages/HomePage.tsx
src/pages/HomePage.test.tsx
src/styles.css
CONCEPT_SPEC.md
```

## Implementation Order

1. Add SCC types for examples, nodes, edges, DFS pass state, finish stack, SCC groups, condensation edges, validation, render states, and trace state.
2. Add code examples for C, C++, Java, Python, and JavaScript with line highlight maps.
3. Add trace tests for example validity, finish order, reversed edges, second-pass grouping, singleton component, cross-component edges, condensation summary, final validation, and highlight coverage.
4. Implement curated directed graph data and `generateStronglyConnectedComponentsTrace`.
5. Build `StronglyConnectedComponentsPage` from immutable trace state.
6. Add route `/graphs/scc`, Home card/link, and concept documentation reference.
7. Add styles for SCC workbench, directed graph states, finish stack, component panels, condensation summary, and code highlights.
8. Run focused tests, full tests, and build.

## Verification Commands

```bash
npm run test -- src/concepts/graphs/tests/stronglyConnectedComponents.test.ts src/concepts/graphs/components/StronglyConnectedComponentsPage.test.tsx --run
npm run test -- --run
npm run build
```

## Review Checklist

- Trace generation is pure and deterministic.
- React components do not contain algorithm decisions.
- Every step has Korean title and description.
- Graph state, finish stack, current component, finalized SCC list, condensation panel, explanation, and code highlight all come from the same trace step.
- First-pass finish order and second-pass pop order are visible and deterministic.
- Final validation proves every node belongs to exactly one SCC.
- Cross-component one-way edges do not merge SCCs.
- Visual states are distinguishable by more than color.
- SVG nodes, edges, labels, and component badges do not overlap in the fixed example.
- Desktop workbench keeps interaction stage and code panel visible together.
