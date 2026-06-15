# AGENTS.md

## Project Overview

This project is an interactive CS concept visualization web app.

The goal is to help learners understand computer science concepts through step-by-step visual execution.

Initial concept domains:

* Sorting algorithms
* SQL query logical execution
* Tree data structures

## Tech Stack

* React
* TypeScript
* Vite
* React Router
* Vitest
* SVG-based visualizations first
* Canvas only when SVG becomes insufficient
* SQL execution engine integration is optional and should be added after the manual SQL trace MVP

## Development Rules

* Do not implement multiple domains in one task.
* Prefer small, reviewable changes.
* Separate algorithm trace generation from UI rendering.
* Do not place algorithm logic inside React components.
* Do not scan or modify unrelated files.
* Use repository-relative paths only.
* Do not read node_modules, dist, build, coverage, .git, lock files, or large log files unless explicitly requested.
* Use Korean All page, except when you need english

## Architecture Rules

Each concept should follow this structure:

* types.ts
* algorithms or engine
* components
* code examples
* tests

Trace generation functions should return a list of steps.

React components should render the current step and should not mutate trace state.

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

