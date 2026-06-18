# PROJECT_PLAN.md

## Project Name

CS Visual Lab

## Goal

Build an interactive Korean-first web app that visualizes how core computer science concepts work step by step.

The app should support:

* Sorting algorithm animation
* SQL query logical execution visualization
* Tree data structure operation visualization
* Graph, search, and dynamic programming visualization
* Network communication flow visualization
* Operating system behavior visualization
* Code examples in C, Java, C++, JavaScript, and Python where useful

## Target Users

* 공기업/금융권 IT 필기 준비자
* CS 개념을 시각적으로 이해하고 싶은 개발자
* 알고리즘과 데이터베이스 동작 과정을 단계별로 학습하려는 사람

## Core Interaction Pattern

Each concept page should provide:

1. Concept explanation
2. Example input
3. Step-by-step visualization
4. Previous / Next / Play / Reset controls
5. Current step explanation
6. Code, query, protocol, or phase panel
7. Complexity or key concept summary

Manual stepping is the baseline. Automatic and semi-automatic guided modes may be added when they make the learning flow smoother.

## Technology Policy

The current app uses React, TypeScript, Vite, React Router, Vitest, and SVG-first visualization. These defaults do not block future use of Python helpers, JavaScript libraries, parser/engine integrations, Canvas, WebGL, WebAssembly, SQL engines, network simulators, or operating-system simulators when the feature plan justifies the learning value and keeps trace generation testable.

## Initial Scope

### Sorting

Initial algorithms:

* Bubble Sort
* Selection Sort
* Insertion Sort
* Merge Sort
* Quick Sort

Each sorting page should show:

* Array state
* Compared indices
* Swapped indices
* Sorted region
* Current pseudo-code line
* Language-specific code examples

### Database

Initial SQL topics:

* SELECT logical execution order
* WHERE filtering
* GROUP BY grouping
* HAVING filtering
* ORDER BY sorting
* JOIN basics
* UNION basics
* LIMIT result restriction

Each SQL page should show:

* Input tables relevant to the query
* SQL query
* Current logical phase
* Intermediate table
* Final result table
* Explanation of the current phase

Important distinction:

* Logical SQL processing order is for learning.
* Actual database execution plan can differ because of optimizer behavior.

### Trees

Initial tree topics:

* Binary Search Tree insertion
* Binary Search Tree search
* Binary Search Tree deletion
* AVL insertion
* AVL rotations: LL, RR, LR, RL

Each tree page should show:

* Current tree
* Active node
* Compared node
* Inserted or deleted node
* Rotation type when applicable
* Explanation of why the next operation occurs

## Expanded Learning Backlog

### Trees

Additional tree topics:

* Red-Black Tree insertion and recoloring
* B-Tree / B+Tree search and split
* Heap insertion and deletion
* Trie insertion and prefix search
* Segment Tree range query and update

### Graph Data Structures

Graph representations and properties:

* Directed and undirected graph
* Weighted graph
* DAG (Directed Acyclic Graph)
* Bipartite graph

### Graph Algorithms

Traversal and optimization algorithms:

* DFS
* BFS
* Dijkstra
* Bellman-Ford
* Floyd-Warshall
* Kruskal
* Prim
* Topological Sort
* Tarjan / Kosaraju

### Coding Test Essentials

Core algorithm topics:

* Heap Sort
* Binary Search
* Dynamic Programming
* Greedy
* Backtracking
* KMP string matching

### Network Communication

Network topics:

* HTTP request/response flow
* DNS lookup flow
* TCP three-way handshake and teardown
* TLS handshake overview
* Packet routing and latency basics

### Operating Systems

Operating system topics:

* Process and thread lifecycle
* CPU scheduling
* Context switching
* Memory paging and page faults
* Deadlock conditions and avoidance
* File system read/write flow

## Out of Scope for MVP

* User login
* Backend server
* Real code execution for C, Java, C++, or Python
* Full SQL parser
* Arbitrary SQL visualization
* Mobile-perfect layout
* Advanced graph layout engine

## MVP Definition

MVP is complete when:

* The app runs locally
* Bubble Sort is fully interactive
* One SQL example is visualized step by step
* BST insertion is visualized step by step
* Shared StepController is reused across all three domains
* Build and tests pass
