# AGENTS.md

## Project Overview

This project is an interactive CS concept visualization web app.

The goal is to help learners understand computer science concepts through step-by-step visual execution.

Concept domains include:

* Sorting algorithms
* SQL query logical execution
* Tree data structures
* Graphs, search, and dynamic programming
* Network communication concepts
* Operating system behavior concepts

## Tech Stack

Current implementation defaults:

* React
* TypeScript
* Vite
* React Router
* Vitest
* SVG-based visualizations first
* Canvas, WebGL, Python helpers, parser/simulator libraries, SQL engines, or other external libraries may be used when the plan justifies the learning value and keeps trace generation testable.
* SQL execution engine integration is optional and should be added after the manual SQL trace MVP

## Development Rules

* Do not implement multiple domains in one task.
* Prefer small, reviewable changes.
* Separate algorithm trace generation from UI rendering.
* Do not place algorithm logic inside React components.
* Do not scan or modify unrelated files.
* Use repository-relative paths only.
* Do not read node_modules, dist, build, coverage, .git, lock files, or large log files unless explicitly requested.
* Use Korean All page, except when you need english.

## Architecture Rules

Each concept should follow this structure:

* types.ts
* algorithms or engine
* components
* code examples
* tests

Trace generation functions should return a list of steps.

React components should render the current step and should not mutate trace state.

## Visualization and Code Presentation Rules

* Algorithm and data-structure code examples must provide these languages: C, C++, Java, Python, and JavaScript.
* Code language tabs must keep language labels readable and visually distinct.
* When a step changes, the code line for the current step must be highlighted in the selected language.
* The interaction stage and the code panel must be visible side by side on desktop layouts.
* The primary Next button must remain in the same visible workbench area as the interaction stage and code panel.
* Keep legends minimal. Show only states that are meaningful for the current visualization.
* Do not use visually similar colors for different active states in the same visualization.
* SQL pages must keep the active SQL query and table changes visible in one workbench.
* SQL examples should be separated by operation such as JOIN, GROUP BY, UNION, ORDER BY, and LIMIT when those operations are taught.
* SQL table visualizations should show all relevant input tables at the same time and indicate which rows and columns are being used by the active query step.

## Testing Rules

* Add unit tests for trace generation.
* Build must pass before completing a task.
* Prefer testing algorithm steps over visual snapshots.
* For visual components, test that controls and key labels render.

## Commands

Use these commands when applicable:

```bash
npm install
npm run dev
npm run build
npm run test
```

## Done Means

A task is done only when:

* The requested feature works
* The scope did not expand unexpectedly
* Build passes
* Relevant tests are added or updated
* The final response summarizes changed files, commands run, and remaining risks

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/004-topological-sort-steps/plan.md
<!-- SPECKIT END -->
