import type { CodeLanguage, SortingCodeExample } from "../../sorting/code/types";
import type { SccCodeAction } from "../types";

const sccCodes: Record<CodeLanguage, string> = {
  C: `void kosaraju(Graph graph) {
  bool visited[MAX_NODES] = {false};
  Stack finish = createStack();
  forEachNode(graph, node) {
    if (!visited[node]) dfsFinish(graph, node, visited, finish);
  }

  Graph reversed = reverseGraph(graph);
  clear(visited);
  while (!isEmpty(finish)) {
    Node root = pop(finish);
    if (visited[root]) continue;
    Component component = createComponent(root);
    dfsCollect(reversed, root, visited, component);
    saveComponent(component);
  }

  buildCondensationGraph(graph, components);
}

void dfsFinish(Graph graph, Node node, bool visited[], Stack finish) {
  visited[node] = true;
  forEachOutgoing(graph, node, edge) {
    if (!visited[edge.to]) dfsFinish(graph, edge.to, visited, finish);
  }
  push(finish, node);
}

void dfsCollect(Graph graph, Node node, bool visited[], Component component) {
  visited[node] = true;
  addNode(component, node);
  forEachOutgoing(graph, node, edge) {
    if (!visited[edge.to]) dfsCollect(graph, edge.to, visited, component);
  }
}`,
  "C++": `vector<Component> kosaraju(const Graph& graph) {
  unordered_set<string> visited;
  vector<string> finish;
  for (const string& node : graph.nodes()) {
    if (!visited.contains(node)) dfsFinish(graph, node, visited, finish);
  }

  Graph reversed = graph.reversed();
  visited.clear();
  vector<Component> components;
  while (!finish.empty()) {
    string root = finish.back();
    finish.pop_back();
    if (visited.contains(root)) continue;
    Component component(root);
    dfsCollect(reversed, root, visited, component);
    components.push_back(component);
  }

  buildCondensationGraph(graph, components);
  return components;
}

void dfsFinish(const Graph& graph, string node, Set& visited, vector<string>& finish) {
  visited.insert(node);
  for (const Edge& edge : graph.outgoing(node)) {
    if (!visited.contains(edge.to)) dfsFinish(graph, edge.to, visited, finish);
  }
  finish.push_back(node);
}

void dfsCollect(const Graph& graph, string node, Set& visited, Component& component) {
  visited.insert(node);
  component.add(node);
  for (const Edge& edge : graph.outgoing(node)) {
    if (!visited.contains(edge.to)) dfsCollect(graph, edge.to, visited, component);
  }
}`,
  Java: `List<Component> kosaraju(Graph graph) {
  Set<String> visited = new HashSet<>();
  Deque<String> finish = new ArrayDeque<>();
  for (String node : graph.nodes()) {
    if (!visited.contains(node)) dfsFinish(graph, node, visited, finish);
  }

  Graph reversed = graph.reversed();
  visited.clear();
  List<Component> components = new ArrayList<>();
  while (!finish.isEmpty()) {
    String root = finish.removeLast();
    if (visited.contains(root)) continue;
    Component component = new Component(root);
    dfsCollect(reversed, root, visited, component);
    components.add(component);
  }

  buildCondensationGraph(graph, components);
  return components;
}

void dfsFinish(Graph graph, String node, Set<String> visited, Deque<String> finish) {
  visited.add(node);
  for (Edge edge : graph.outgoing(node)) {
    if (!visited.contains(edge.to())) dfsFinish(graph, edge.to(), visited, finish);
  }
  finish.addLast(node);
}

void dfsCollect(Graph graph, String node, Set<String> visited, Component component) {
  visited.add(node);
  component.add(node);
  for (Edge edge : graph.outgoing(node)) {
    if (!visited.contains(edge.to())) dfsCollect(graph, edge.to(), visited, component);
  }
}`,
  Python: `def kosaraju(graph: Graph) -> list[Component]:
    visited: set[str] = set()
    finish: list[str] = []
    for node in graph.nodes:
        if node not in visited:
            dfs_finish(graph, node, visited, finish)

    reversed_graph = graph.reversed()
    visited.clear()
    components: list[Component] = []
    while finish:
        root = finish.pop()
        if root in visited:
            continue
        component = Component(root)
        dfs_collect(reversed_graph, root, visited, component)
        components.append(component)

    build_condensation_graph(graph, components)
    return components

def dfs_finish(graph: Graph, node: str, visited: set[str], finish: list[str]) -> None:
    visited.add(node)
    for edge in graph.outgoing(node):
        if edge.to_node not in visited:
            dfs_finish(graph, edge.to_node, visited, finish)
    finish.append(node)

def dfs_collect(graph: Graph, node: str, visited: set[str], component: Component) -> None:
    visited.add(node)
    component.add(node)
    for edge in graph.outgoing(node):
        if edge.to_node not in visited:
            dfs_collect(graph, edge.to_node, visited, component)`,
  JavaScript: `function kosaraju(graph) {
  const visited = new Set();
  const finish = [];
  for (const node of graph.nodes) {
    if (!visited.has(node)) dfsFinish(graph, node, visited, finish);
  }

  const reversed = reverseGraph(graph);
  visited.clear();
  const components = [];
  while (finish.length > 0) {
    const root = finish.pop();
    if (visited.has(root)) continue;
    const component = { root, nodes: [] };
    dfsCollect(reversed, root, visited, component);
    components.push(component);
  }

  buildCondensationGraph(graph, components);
  return components;
}

function dfsFinish(graph, node, visited, finish) {
  visited.add(node);
  for (const edge of graph.outgoing(node)) {
    if (!visited.has(edge.to)) dfsFinish(graph, edge.to, visited, finish);
  }
  finish.push(node);
}

function dfsCollect(graph, node, visited, component) {
  visited.add(node);
  component.nodes.push(node);
  for (const edge of graph.outgoing(node)) {
    if (!visited.has(edge.to)) dfsCollect(graph, edge.to, visited, component);
  }
}`
};

export const stronglyConnectedComponentsCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "kosaraju.c",
    code: sccCodes.C
  },
  {
    language: "C++",
    fileName: "kosaraju.cpp",
    code: sccCodes["C++"]
  },
  {
    language: "Java",
    fileName: "Kosaraju.java",
    code: sccCodes.Java
  },
  {
    language: "Python",
    fileName: "kosaraju.py",
    code: sccCodes.Python
  },
  {
    language: "JavaScript",
    fileName: "kosaraju.js",
    code: sccCodes.JavaScript
  }
];

export const stronglyConnectedComponentsLineHighlights: Record<
  SccCodeAction,
  Record<CodeLanguage, number[]>
> = {
  initialize: {
    C: [2, 3],
    "C++": [2, 3],
    Java: [2, 3],
    Python: [2, 3],
    JavaScript: [2, 3]
  },
  "first-pass-start": {
    C: [4, 5],
    "C++": [4, 5],
    Java: [4, 5],
    Python: [4, 5],
    JavaScript: [4, 5]
  },
  "first-pass-visit": {
    C: [20],
    "C++": [24],
    Java: [24],
    Python: [21],
    JavaScript: [23]
  },
  "inspect-edge": {
    C: [21, 22],
    "C++": [25, 26],
    Java: [25, 26],
    Python: [22, 23],
    JavaScript: [24, 25]
  },
  "skip-edge": {
    C: [22],
    "C++": [26],
    Java: [26],
    Python: [23],
    JavaScript: [25]
  },
  "finish-stack-push": {
    C: [24],
    "C++": [28],
    Java: [28],
    Python: [25],
    JavaScript: [27]
  },
  "reverse-graph": {
    C: [8],
    "C++": [8],
    Java: [8],
    Python: [8],
    JavaScript: [8]
  },
  "second-pass-pop": {
    C: [11, 12],
    "C++": [12, 13],
    Java: [12, 13],
    Python: [12],
    JavaScript: [12]
  },
  "second-pass-visit": {
    C: [28],
    "C++": [32],
    Java: [32],
    Python: [28],
    JavaScript: [31]
  },
  "add-to-component": {
    C: [29],
    "C++": [33],
    Java: [33],
    Python: [29],
    JavaScript: [32]
  },
  "finalize-component": {
    C: [16],
    "C++": [17],
    Java: [17],
    Python: [17],
    JavaScript: [17]
  },
  "build-condensation": {
    C: [19],
    "C++": [20],
    Java: [20],
    Python: [19],
    JavaScript: [20]
  },
  complete: {
    C: [19],
    "C++": [21],
    Java: [21],
    Python: [20],
    JavaScript: [21]
  }
};

export function getStronglyConnectedComponentsCodeLineHighlights(
  action: SccCodeAction
): Record<CodeLanguage, number[]> {
  return stronglyConnectedComponentsLineHighlights[action];
}
