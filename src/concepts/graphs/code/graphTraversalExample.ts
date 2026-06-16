import type { SortingCodeExample } from "../../sorting/code/types";

const cLikeBfsDfs = {
  C: `Graph graph = makeExampleGraph();

void reverseNeighbors(NodeList *items) {
  reverse(items);
}

void markDiscovered(Set *discovered, const char *node) {
  setAdd(discovered, node);
}

List bfs(const char *start) {
  Queue queue = queueCreate();
  Set discovered = setCreate();
  queuePush(&queue, start);
  setAdd(&discovered, start);
  List visited = listCreate();
  while (!queueEmpty(&queue)) {
    const char *node = queuePop(&queue);
    listPush(&visited, node);
    NodeList neighbors = graphNeighbors(graph, node);
    forEach(next, neighbors) {
      if (setHas(&discovered, next)) continue;
      markTreeEdge(node, next);
      setAdd(&discovered, next);
      queuePush(&queue, next);
    }
  }
  return visited;
}

List dfs(const char *start) {
  Stack stack = stackCreate();
  stackPush(&stack, start);
  Set discovered = setOf(start);
  List visited = listCreate();
  while (!stackEmpty(&stack)) {
    const char *node = stackPop(&stack);
    listPush(&visited, node);
    NodeList neighbors = reverse(graphNeighbors(graph, node));
    forEach(next, neighbors) {
      if (setHas(&discovered, next)) continue;
      markTreeEdge(node, next);
      setAdd(&discovered, next);
      stackPush(&stack, next);
    }
  }
  return visited;
}`,
  "C++": `Graph graph = makeExampleGraph();

void reverseNeighbors(vector<string>& items) {
  reverse(items.begin(), items.end());
}

void markDiscovered(set<string>& discovered, const string& node) {
  discovered.insert(node);
}

vector<string> bfs(const string& start) {
  queue<string> frontier;
  set<string> discovered;
  frontier.push(start);
  discovered.insert(start);
  vector<string> visited;
  while (!frontier.empty()) {
    string node = frontier.front(); frontier.pop();
    visited.push_back(node);
    vector<string> neighbors = graph.neighbors(node);
    for (const string& next : neighbors) {
      if (discovered.count(next)) continue;
      markTreeEdge(node, next);
      discovered.insert(next);
      frontier.push(next);
    }
  }
  return visited;
}

vector<string> dfs(const string& start) {
  stack<string> frontier;
  frontier.push(start);
  set<string> discovered = {start};
  vector<string> visited;
  while (!frontier.empty()) {
    string node = frontier.top(); frontier.pop();
    visited.push_back(node);
    vector<string> neighbors = graph.neighbors(node);
    reverseNeighbors(neighbors);
    for (const string& next : neighbors) {
      if (discovered.count(next)) continue;
      markTreeEdge(node, next);
      discovered.insert(next);
      frontier.push(next);
    }
  }
  return visited;
}`,
  Java: `Graph graph = Graph.example();

void reverseNeighbors(List<String> items) {
  Collections.reverse(items);
}

void markDiscovered(Set<String> discovered, String node) {
  discovered.add(node);
}

List<String> bfs(String start) {
  Queue<String> queue = new ArrayDeque<>();
  Set<String> discovered = new HashSet<>();
  queue.add(start);
  discovered.add(start);
  List<String> visited = new ArrayList<>();
  while (!queue.isEmpty()) {
    String node = queue.remove();
    visited.add(node);
    List<String> neighbors = graph.neighbors(node);
    for (String next : neighbors) {
      if (discovered.contains(next)) continue;
      markTreeEdge(node, next);
      discovered.add(next);
      queue.add(next);
    }
  }
  return visited;
}

List<String> dfs(String start) {
  Deque<String> stack = new ArrayDeque<>();
  stack.push(start);
  Set<String> discovered = new HashSet<>(List.of(start));
  List<String> visited = new ArrayList<>();
  while (!stack.isEmpty()) {
    String node = stack.pop();
    visited.add(node);
    List<String> neighbors = graph.neighbors(node);
    reverseNeighbors(neighbors);
    for (String next : neighbors) {
      if (discovered.contains(next)) continue;
      markTreeEdge(node, next);
      discovered.add(next);
      stack.push(next);
    }
  }
  return visited;
}`
};

export const graphTraversalCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "graphTraversal.c",
    code: cLikeBfsDfs.C
  },
  {
    language: "C++",
    fileName: "graphTraversal.cpp",
    code: cLikeBfsDfs["C++"]
  },
  {
    language: "Java",
    fileName: "GraphTraversal.java",
    code: cLikeBfsDfs.Java
  },
  {
    language: "Python",
    fileName: "graph_traversal.py",
    code: `graph = make_example_graph()

def reverse_neighbors(items: list[str]) -> list[str]:
    return list(reversed(items))

def mark_discovered(discovered: set[str], node: str) -> None:
    discovered.add(node)

def bfs(start: str) -> list[str]:
    queue = [start]
    discovered = {start}
    visited: list[str] = []
    while queue:
        node = queue.pop(0)
        visited.append(node)
        neighbors = graph.neighbors(node)
        for next_node in neighbors:
            if next_node in discovered: continue
            mark_tree_edge(node, next_node)
            discovered.add(next_node)
            queue.append(next_node)
    return visited

def dfs(start: str) -> list[str]:
    stack = [start]
    discovered = {start}
    visited: list[str] = []
    while stack:
        node = stack.pop()
        visited.append(node)
        neighbors = reverse_neighbors(graph.neighbors(node))
        for next_node in neighbors:
            if next_node in discovered: continue
            mark_tree_edge(node, next_node)
            discovered.add(next_node)
            stack.append(next_node)
    return visited`
  },
  {
    language: "JavaScript",
    fileName: "graphTraversal.js",
    code: `const graph = makeExampleGraph();

function reverseNeighbors(items) {
  return [...items].reverse();
}

function markDiscovered(discovered, node) {
  discovered.add(node);
}

function bfs(start) {
  const queue = [];
  const discovered = new Set();
  queue.push(start);
  discovered.add(start);
  const visited = [];
  while (queue.length > 0) {
    const node = queue.shift();
    visited.push(node);
    const neighbors = graph.neighbors(node);
    for (const next of neighbors) {
      if (discovered.has(next)) continue;
      markTreeEdge(node, next);
      discovered.add(next);
      queue.push(next);
    }
  }
  return visited;
}

function dfs(start) {
  const stack = [];
  stack.push(start);
  const discovered = new Set([start]);
  const visited = [];
  while (stack.length > 0) {
    const node = stack.pop();
    visited.push(node);
    const neighbors = reverseNeighbors(graph.neighbors(node));
    for (const next of neighbors) {
      if (discovered.has(next)) continue;
      markTreeEdge(node, next);
      discovered.add(next);
      stack.push(next);
    }
  }
  return visited;
}`
  }
];
