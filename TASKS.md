# PROJECT_PLAN.md

## Project Name

CS Visual Lab

## Goal

Build an interactive web app that visualizes how core computer science concepts work step by step.

The app should support:

* Sorting algorithm animation
* SQL query logical execution visualization
* Tree data structure operation visualization
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
6. Code tab area
7. Complexity or key concept summary

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

Each SQL page should show:

* Input table
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

