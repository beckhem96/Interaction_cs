import type { CodeLanguage, SortingCodeExample } from "../../sorting/code/types";
import type { TopologicalSortCodeAction } from "../types";

const topologicalSortCodes: Record<CodeLanguage, string> = {
  C: `int* topologicalSort(Graph graph) {
  int indegree[MAX_NODES] = {0};
  forEachNode(graph, node) indegree[node] = 0;
  forEachEdge(graph, edge) indegree[edge.to]++;
  Queue queue = createQueue();
  forEachNode(graph, node) if (indegree[node] == 0) push(queue, node);
  int count = 0;

  while (!isEmpty(queue)) {
    Node node = pop(queue);
    order[count++] = node;

    forEachOutgoing(graph, node, edge) {
      indegree[edge.to]--;
      if (indegree[edge.to] == 0) {
        push(queue, edge.to);
      }
    }
  }

  if (count != graph.nodeCount) reportCycle();
  return order;
}`,
  "C++": `vector<string> topologicalSort(const Graph& graph) {
  unordered_map<string, int> indegree;
  for (const string& node : graph.nodes()) indegree[node] = 0;
  for (const Edge& edge : graph.edges()) indegree[edge.to]++;
  queue<string> ready;
  for (const string& node : graph.nodes()) if (indegree[node] == 0) ready.push(node);
  vector<string> order;

  while (!ready.empty()) {
    string node = ready.front();
    ready.pop();
    order.push_back(node);

    for (const Edge& edge : graph.outgoing(node)) {
      indegree[edge.to]--;
      if (indegree[edge.to] == 0) {
        ready.push(edge.to);
      }
    }
  }

  if (order.size() != graph.nodes().size()) throw CycleError();
  return order;
}`,
  Java: `List<String> topologicalSort(Graph graph) {
  Map<String, Integer> indegree = new HashMap<>();
  for (String node : graph.nodes()) indegree.put(node, 0);
  for (Edge edge : graph.edges()) indegree.merge(edge.to(), 1, Integer::sum);
  Queue<String> ready = new ArrayDeque<>();
  for (String node : graph.nodes()) if (indegree.get(node) == 0) ready.add(node);
  List<String> order = new ArrayList<>();

  while (!ready.isEmpty()) {
    String node = ready.remove();
    order.add(node);

    for (Edge edge : graph.outgoing(node)) {
      indegree.put(edge.to(), indegree.get(edge.to()) - 1);
      if (indegree.get(edge.to()) == 0) {
        ready.add(edge.to());
      }
    }
  }

  if (order.size() != graph.nodes().size()) throw new CycleException();
  return order;
}`,
  Python: `def topological_sort(graph: Graph) -> list[str]:
    indegree = {node: 0 for node in graph.nodes}
    for edge in graph.edges:
        indegree[edge.to_node] += 1
    ready = deque(node for node in graph.nodes if indegree[node] == 0)
    order: list[str] = []

    while ready:
        node = ready.popleft()
        order.append(node)

        for edge in graph.outgoing(node):
            indegree[edge.to_node] -= 1
            if indegree[edge.to_node] == 0:
                ready.append(edge.to_node)

    if len(order) != len(graph.nodes):
        raise CycleError("topological order is impossible")
    return order`,
  JavaScript: `function topologicalSort(graph) {
  const indegree = new Map();
  for (const node of graph.nodes) indegree.set(node, 0);
  for (const edge of graph.edges) indegree.set(edge.to, indegree.get(edge.to) + 1);
  const ready = graph.nodes.filter((node) => indegree.get(node) === 0);
  const order = [];

  while (ready.length > 0) {
    const node = ready.shift();
    order.push(node);

    for (const edge of graph.outgoing(node)) {
      indegree.set(edge.to, indegree.get(edge.to) - 1);
      if (indegree.get(edge.to) === 0) {
        ready.push(edge.to);
      }
    }
  }

  if (order.length !== graph.nodes.length) throw new Error("cycle");
  return order;
}`
};

export const topologicalSortCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "topologicalSort.c",
    code: topologicalSortCodes.C
  },
  {
    language: "C++",
    fileName: "topologicalSort.cpp",
    code: topologicalSortCodes["C++"]
  },
  {
    language: "Java",
    fileName: "TopologicalSort.java",
    code: topologicalSortCodes.Java
  },
  {
    language: "Python",
    fileName: "topological_sort.py",
    code: topologicalSortCodes.Python
  },
  {
    language: "JavaScript",
    fileName: "topologicalSort.js",
    code: topologicalSortCodes.JavaScript
  }
];

export const topologicalSortLineHighlights: Record<
  TopologicalSortCodeAction,
  Record<CodeLanguage, number[]>
> = {
  "initialize-indegree": {
    C: [2, 3, 4],
    "C++": [2, 3, 4],
    Java: [2, 3, 4],
    Python: [2, 3, 4],
    JavaScript: [2, 3, 4]
  },
  "seed-queue": {
    C: [5, 6],
    "C++": [5, 6],
    Java: [5, 6],
    Python: [5],
    JavaScript: [5]
  },
  "inspect-candidates": {
    C: [9],
    "C++": [9],
    Java: [9],
    Python: [8],
    JavaScript: [8]
  },
  "select-node": {
    C: [10],
    "C++": [10, 11],
    Java: [10],
    Python: [9],
    JavaScript: [9]
  },
  "append-result": {
    C: [11],
    "C++": [12],
    Java: [11],
    Python: [10],
    JavaScript: [10]
  },
  "iterate-edge": {
    C: [13],
    "C++": [14],
    Java: [13],
    Python: [12],
    JavaScript: [12]
  },
  "decrement-indegree": {
    C: [14],
    "C++": [15],
    Java: [14],
    Python: [13],
    JavaScript: [13]
  },
  "enqueue-candidate": {
    C: [15, 16],
    "C++": [16, 17],
    Java: [15, 16],
    Python: [14, 15],
    JavaScript: [14, 15]
  },
  complete: {
    C: [20, 21],
    "C++": [20, 21],
    Java: [20, 21],
    Python: [17, 19],
    JavaScript: [19, 20]
  },
  "cycle-blocked": {
    C: [20],
    "C++": [20],
    Java: [20],
    Python: [17, 18],
    JavaScript: [19]
  }
};

export function getTopologicalSortCodeLineHighlights(
  action: TopologicalSortCodeAction
): Record<CodeLanguage, number[]> {
  return topologicalSortLineHighlights[action];
}
