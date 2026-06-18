# CONCEPT_SPEC.md

## 1. Purpose

This document defines the concept-level specification for the CS Visual Lab project.

The app should help users understand computer science concepts through:

* Step-by-step execution
* Visual state changes
* Current operation explanation
* Code examples
* Interactive controls

The concept scope includes:

* Sorting
* Database / SQL
* Trees
* Graphs and search
* Dynamic programming
* Network communication
* Operating system behavior

## 2. Shared Concept Model

All concept visualizations should follow the same interaction model.

### 2.1 Common Page Layout

Each concept page should include:

1. Concept title
2. Short concept summary
3. Input or example configuration
4. Main visualization area
5. Current step explanation
6. Step controls
7. Code, query, protocol, or phase tabs when useful
8. Complexity or key-point summary

### 2.2 Common Controls

Each visualization should support:

* Previous step
* Next step
* Play
* Pause
* Reset
* Speed control, optional
* Input reset, optional

Manual stepping is required. Automatic play and semi-automatic guided progression are allowed when they make the concept easier to follow.

### 2.3 Shared Trace Step Model

Each concept should be represented as a list of trace steps.

```ts
export type TraceStep<TState = unknown> = {
  id: string;
  title: string;
  description: string;
  state: TState;
  highlights?: Record<string, unknown>;
  pseudoCodeLine?: number;
};
```

Rules:

* Trace generation should be pure when possible.
* React components should render trace state only.
* React components should not contain algorithm logic.
* Each algorithm or concept engine should return `TraceStep[]`.
* Every step must be explainable in natural language.
* UI explanations should be Korean-first unless an established English technical term is clearer.

### 2.4 Technology and Engine Rules

The default renderer is SVG because it keeps educational state inspectable. Canvas, WebGL, WebAssembly, parser libraries, SQL engines, network simulators, operating-system simulators, Python helpers, or other external libraries may be introduced when a plan explains why they improve correctness, clarity, performance, or maintainability.

Manual trace generation remains the baseline for new concept lessons. Real engines or simulators should be added after the manual trace MVP is correct and tested.

## 3. Sorting Concepts

### 3.1 Sorting Goal

Sorting visualizations should show how an array changes step by step.

The user should understand:

* Which elements are being compared
* Which elements are being swapped
* Which part of the array is already sorted
* Why the next operation happens
* How the algorithm terminates
* Time complexity and space complexity

### 3.2 Initial Sorting Algorithms

Implement in this order:

1. Bubble Sort
2. Selection Sort
3. Insertion Sort
4. Merge Sort
5. Quick Sort

### 3.3 Sorting State Type

```ts
export type SortingState = {
  array: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  pivotIndex?: number;
  partitionRange?: [number, number];
  mergeRange?: [number, number];
};
```

### 3.4 Sorting Trace Rules

Each sorting algorithm should generate trace steps for:

* Initial array
* Comparison
* Swap or no-swap decision
* Sorted region update
* Final sorted array

Every step should include:

* Step title
* Explanation
* Current array
* Highlighted indices
* Optional pseudo-code line

### 3.5 Bubble Sort MVP

Initial input:

```ts
[5, 3, 8, 4, 2]
```

Expected learning flow:

1. Start with unsorted array.
2. Compare adjacent elements.
3. Swap if left element is greater than right element.
4. Continue until the largest element moves to the end.
5. Repeat for the remaining unsorted range.
6. End when no unsorted range remains.

Required step examples:

```text
Step 1: Compare 5 and 3.
Step 2: Since 5 > 3, swap them.
Step 3: Compare 5 and 8.
Step 4: Since 5 <= 8, keep the order.
Step 5: Continue until the largest value bubbles to the end.
```

Required visual states:

* Comparing bars highlighted
* Swapping bars highlighted
* Sorted region highlighted
* Current step explanation updated

### 3.6 Selection Sort

Expected learning flow:

1. Start at index `i`.
2. Assume `i` is the minimum index.
3. Scan remaining elements.
4. Update minimum index if a smaller element is found.
5. Swap `i` with minimum index.
6. Move sorted boundary one step right.

Required highlights:

* Current index
* Current minimum index
* Scanning index
* Sorted prefix

### 3.7 Insertion Sort

Expected learning flow:

1. Treat the first element as sorted.
2. Pick the next element as key.
3. Compare key with elements in the sorted region.
4. Shift larger elements to the right.
5. Insert key into the correct position.
6. Repeat until all elements are inserted.

Required highlights:

* Key element
* Compared element
* Shifted elements
* Sorted prefix

### 3.8 Merge Sort

Expected learning flow:

1. Split array into halves.
2. Continue splitting until single-element arrays.
3. Merge sorted subarrays.
4. Compare front elements of each subarray.
5. Append smaller element.
6. Continue until final sorted array.

Required highlights:

* Current split range
* Left subarray
* Right subarray
* Merge range
* Written index

### 3.9 Quick Sort

Expected learning flow:

1. Select pivot.
2. Partition array around pivot.
3. Move smaller elements to the left.
4. Move larger elements to the right.
5. Place pivot in final position.
6. Recursively sort left and right partitions.

Required highlights:

* Pivot
* Left pointer
* Right pointer
* Current partition range
* Pivot final position

### 3.10 Sorting Code Examples

Each sorting algorithm should eventually provide code examples in:

* C
* Java
* C++
* JavaScript
* Python

Code examples are for learning display first.

Initial MVP should not execute C, Java, C++, or Python in the browser.

Code example files should be separated by language.

Example structure:

```text
src/concepts/sorting/code/
├─ bubbleSort.c.ts
├─ bubbleSort.java.ts
├─ bubbleSort.cpp.ts
├─ bubbleSort.javascript.ts
└─ bubbleSort.python.ts
```

Each file should export a string.

Example:

```ts
export const bubbleSortJavaScriptCode = `
function bubbleSort(arr) {
  const result = [...arr];

  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result;
}
`;
```

## 4. Database / SQL Concepts

### 4.1 SQL Visualization Goal

SQL visualizations should show how query results are produced step by step.

The user should understand:

* Which table is used first
* Which rows are filtered
* How grouping works
* How aggregate functions are calculated
* How `HAVING` differs from `WHERE`
* How selected columns become the final result
* How ordering changes the final output

Important note:

The app should initially visualize logical SQL processing order for learning.

It should not claim that the database physically executes the query in the same order.

### 4.2 Initial SQL Logical Order

Use this order for educational visualization:

1. FROM
2. JOIN, when applicable
3. WHERE
4. GROUP BY
5. HAVING
6. SELECT
7. DISTINCT, optional
8. ORDER BY
9. LIMIT / OFFSET

### 4.3 SQL State Type

```ts
export type TableData = {
  name: string;
  columns: string[];
  rows: Array<Record<string, string | number | null>>;
};

export type SqlPhase =
  | "FROM"
  | "JOIN"
  | "WHERE"
  | "GROUP_BY"
  | "HAVING"
  | "SELECT"
  | "DISTINCT"
  | "ORDER_BY"
  | "LIMIT";

export type SqlTraceState = {
  phase: SqlPhase;
  inputTables: TableData[];
  outputTable: TableData;
  explanation: string;
  highlightedRows?: number[];
  highlightedColumns?: string[];
};
```

### 4.4 SQL MVP Example

Initial table:

```text
employees

id | name  | department | salary
1  | Kim   | IT         | 6000
2  | Lee   | IT         | 4000
3  | Park  | HR         | 3500
4  | Choi  | HR         | 5500
5  | Jung  | Sales      | 7000
```

Initial query:

```sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
WHERE salary >= 4000
GROUP BY department
HAVING AVG(salary) >= 5000
ORDER BY avg_salary DESC;
```

### 4.5 Required SQL Trace Steps

#### Step 1. FROM

Explanation:

The query starts by selecting the source table.

Output:

```text
employees 전체 행
```

#### Step 2. WHERE

Condition:

```sql
salary >= 4000
```

Rows removed:

```text
Park | HR | 3500
```

Output:

```text
id | name | department | salary
1  | Kim  | IT         | 6000
2  | Lee  | IT         | 4000
4  | Choi | HR         | 5500
5  | Jung | Sales      | 7000
```

#### Step 3. GROUP BY

Grouping key:

```sql
department
```

Groups:

```text
IT: Kim, Lee
HR: Choi
Sales: Jung
```

#### Step 4. HAVING

Condition:

```sql
AVG(salary) >= 5000
```

Group averages:

```text
IT: (6000 + 4000) / 2 = 5000
HR: 5500
Sales: 7000
```

All groups remain in this example.

#### Step 5. SELECT

Selected columns:

```text
department
AVG(salary) AS avg_salary
```

Output:

```text
department | avg_salary
IT         | 5000
HR         | 5500
Sales      | 7000
```

#### Step 6. ORDER BY

Condition:

```sql
ORDER BY avg_salary DESC
```

Final output:

```text
department | avg_salary
Sales      | 7000
HR         | 5500
IT         | 5000
```

### 4.6 Additional SQL Examples

Add these after the MVP:

1. WHERE only
2. GROUP BY + COUNT
3. INNER JOIN
4. LEFT JOIN
5. DISTINCT
6. UNION
7. LIMIT
8. Subquery, optional
9. Index scan vs full scan, advanced

### 4.7 SQL Implementation Rules

MVP should use manual trace generation.

Do not implement a full SQL parser in the MVP.

Do not allow arbitrary SQL visualization until the fixed examples are stable.

Later extension may use SQLite WASM or sql.js to execute real queries in the browser.

## 5. Tree Concepts

### 5.1 Tree Visualization Goal

Tree visualizations should show how tree operations change structure.

The user should understand:

* Root node
* Left and right child rules
* Search path
* Insert position
* Delete case
* Height
* Balance factor
* AVL rotation

### 5.2 Initial Tree Topics

Implement in this order:

1. Binary Search Tree insertion
2. Binary Search Tree search
3. Binary Search Tree deletion
4. AVL insertion
5. AVL rotations
6. AVL deletion, optional

### 5.3 Tree State Type

```ts
export type TreeNode = {
  id: string;
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  height?: number;
  balanceFactor?: number;
};

export type TreeTraceState = {
  root: TreeNode | null;
  activeNodeId?: string;
  comparedNodeId?: string;
  insertedNodeId?: string;
  deletedNodeId?: string;
  rotation?: "LL" | "RR" | "LR" | "RL";
  message: string;
};
```

### 5.4 BST Insertion MVP

Initial input:

```ts
[30, 20, 40, 10, 25, 35, 50]
```

Expected learning flow:

1. Insert 30 as root.
2. Insert 20.

   * Compare 20 with 30.
   * Since 20 < 30, move left.
   * Insert 20 as left child of 30.
3. Insert 40.

   * Compare 40 with 30.
   * Since 40 > 30, move right.
   * Insert 40 as right child of 30.
4. Insert 10.

   * Compare 10 with 30.
   * Move left.
   * Compare 10 with 20.
   * Move left.
   * Insert 10 as left child of 20.

Required highlights:

* Current inserted value
* Compared node
* Direction decision
* Final inserted node

### 5.5 BST Search

Expected learning flow:

1. Start at root.
2. Compare target with current node.
3. If target is smaller, move left.
4. If target is greater, move right.
5. If equal, search succeeds.
6. If null is reached, search fails.

Required examples:

```text
Search target: 25
Tree input: [30, 20, 40, 10, 25, 35, 50]
Expected path: 30 → 20 → 25
```

### 5.6 BST Deletion

Show three deletion cases:

1. Leaf node deletion
2. Node with one child
3. Node with two children

For two-child deletion, use inorder successor by default.

Required explanation:

* Find target node.
* If target has two children, find inorder successor.
* Replace target value with successor value.
* Delete successor node from original location.

### 5.7 AVL Insertion

AVL visualization should show both BST insertion and balancing.

Expected learning flow:

1. Insert like BST.
2. Update height.
3. Calculate balance factor.
4. Detect imbalance.
5. Classify rotation type.
6. Perform rotation.
7. Show balanced tree.

### 5.8 AVL Balance Factor

Use this definition:

```text
balanceFactor = height(left subtree) - height(right subtree)
```

Rules:

```text
balanceFactor > 1: left-heavy
balanceFactor < -1: right-heavy
-1 <= balanceFactor <= 1: balanced
```

### 5.9 AVL Rotation Cases

#### LL Rotation

Occurs when:

```text
Node is left-heavy and inserted value is in left subtree of left child.
```

Fix:

```text
Right rotation
```

Example input:

```ts
[30, 20, 10]
```

#### RR Rotation

Occurs when:

```text
Node is right-heavy and inserted value is in right subtree of right child.
```

Fix:

```text
Left rotation
```

Example input:

```ts
[10, 20, 30]
```

#### LR Rotation

Occurs when:

```text
Node is left-heavy and inserted value is in right subtree of left child.
```

Fix:

```text
Left rotation on left child, then right rotation on node
```

Example input:

```ts
[30, 10, 20]
```

#### RL Rotation

Occurs when:

```text
Node is right-heavy and inserted value is in left subtree of right child.
```

Fix:

```text
Right rotation on right child, then left rotation on node
```

Example input:

```ts
[10, 30, 20]
```

### 5.10 Tree Rendering Rules

Use SVG for initial tree rendering.

Each node should display:

* Value
* Height, optional
* Balance factor, optional

Each edge should connect parent to child.

Tree layout should be deterministic.

For MVP, a simple recursive x/y position algorithm is acceptable.

Do not introduce a complex graph layout library until the MVP is stable.

## 6. Additional Concepts for Later

### 6.1 Data Structures

* Stack
* Queue
* Circular Queue
* Deque
* Heap
* Priority Queue
* Hash Table
* Graph BFS
* Graph DFS
* Dijkstra

### 6.2 Operating Systems

* Process scheduling
* FCFS
* SJF
* Round Robin
* Priority scheduling
* Page replacement
* FIFO page replacement
* LRU page replacement
* Optimal page replacement
* Deadlock
* Mutex
* Semaphore

### 6.3 Database Advanced

* B+ Tree index
* Full table scan
* Index scan
* Nested loop join
* Hash join
* Merge join
* Transaction isolation
* Locking
* MVCC

### 6.4 Network

* TCP 3-way handshake
* TCP 4-way termination
* DNS lookup
* HTTP request and response
* TLS handshake
* Congestion control

### 6.5 Cross-Domain Interaction Requirements

Network and operating-system lessons should follow the same trace-first model as algorithms, SQL, and trees. Each lesson should identify actors or resources, show the active state transition, and explain why the next message, scheduling decision, memory event, or resource change occurs.

Manual mode is required for every concept. Automatic and semi-automatic guided modes may be added when they make longer flows easier to follow without hiding intermediate states.

## 7. Implementation Priorities

Build in this order:

1. Shared trace model
2. Shared step controller
3. Bubble Sort MVP
4. Bubble Sort code tabs
5. Selection Sort
6. Insertion Sort
7. SQL fixed example MVP
8. BST insertion MVP
9. AVL insertion and rotation
10. Merge Sort
11. Quick Sort
12. Additional SQL examples

## 8. Codex Work Rules for This Specification

When implementing this project with Codex:

* Do not implement all concepts at once.
* Start with one domain and one concept.
* Prefer trace generation tests before UI expansion.
* Keep algorithm logic outside React components.
* Use repository-relative paths.
* Do not use absolute paths in patches.
* Do not modify unrelated files.
* Do not read large generated folders.
* Always run build after meaningful changes.
* Summarize changed files at the end of each task.

## 9. First MVP Target

The first complete MVP should be:

```text
Bubble Sort interactive page
```

It should include:

* Input array
* Step-by-step animation
* Previous / Next / Play / Pause / Reset
* Current step explanation
* Compared index highlight
* Swap highlight
* Sorted region highlight
* JavaScript code tab
* Unit test for trace generation

After this is stable, add other languages and other concepts.

