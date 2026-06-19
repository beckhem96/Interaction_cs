import type { CodeLanguage, SortingCodeExample } from "../../sorting/code/types";
import type { MstCodeAction } from "../types";

const mstCodes: Record<CodeLanguage, string> = {
  C: `void kruskal(Graph graph) {
  Edge edges[MAX_EDGES];
  int parent[MAX_NODES];
  int rank[MAX_NODES];
  makeSet(parent, rank, graph.nodes);
  sortEdgesByWeightThenLabel(edges);
  int totalCost = 0;
  int selectedCount = 0;

  forEachEdge(edges, edge) {
    int rootA = find(parent, edge.from);
    int rootB = find(parent, edge.to);

    if (rootA != rootB) {
      selectEdge(edge);
      totalCost += edge.weight;
      unionSets(parent, rank, rootA, rootB);
      selectedCount++;
    } else {
      skipCycleEdge(edge);
    }

    if (selectedCount == graph.nodeCount - 1) {
      break;
    }
  }

  printMst(totalCost);
}`,
  "C++": `vector<Edge> kruskal(const Graph& graph) {
  vector<Edge> edges = graph.edges();
  DisjointSet components(graph.nodes());
  vector<Edge> selected;
  int totalCost = 0;
  sortEdgesByWeightThenLabel(edges);

  for (const Edge& edge : edges) {
    string rootA = components.find(edge.from);
    string rootB = components.find(edge.to);

    if (rootA != rootB) {
      selected.push_back(edge);
      totalCost += edge.weight;
      components.unite(rootA, rootB);
    } else {
      skipCycleEdge(edge);
    }

    if (selected.size() == graph.nodeCount() - 1) {
      break;
    }
  }

  return selected;
}`,
  Java: `List<Edge> kruskal(Graph graph) {
  List<Edge> edges = new ArrayList<>(graph.edges());
  DisjointSet components = new DisjointSet(graph.nodes());
  List<Edge> selected = new ArrayList<>();
  int totalCost = 0;
  sortEdgesByWeightThenLabel(edges);

  for (Edge edge : edges) {
    String rootA = components.find(edge.from());
    String rootB = components.find(edge.to());

    if (!rootA.equals(rootB)) {
      selected.add(edge);
      totalCost += edge.weight();
      components.union(rootA, rootB);
    } else {
      skipCycleEdge(edge);
    }

    if (selected.size() == graph.nodeCount() - 1) {
      break;
    }
  }

  return selected;
}`,
  Python: `def kruskal(graph: Graph) -> tuple[list[Edge], int]:
    parent, rank = make_sets(graph.nodes)
    edges = sorted(graph.edges, key=lambda edge: (edge.weight, edge.label))
    total_cost = 0
    selected: list[Edge] = []

    for edge in edges:
        root_a = find(parent, edge.from_node)
        root_b = find(parent, edge.to_node)

        if root_a != root_b:
            selected.append(edge)
            total_cost += edge.weight
            union(parent, rank, root_a, root_b)
        else:
            skip_cycle_edge(edge)

        if len(selected) == len(graph.nodes) - 1:
            break

    return selected, total_cost`,
  JavaScript: `function kruskal(graph) {
  const edges = [...graph.edges];
  const components = new DisjointSet(graph.nodes);
  const selected = [];
  let totalCost = 0;
  sortEdgesByWeightThenLabel(edges);

  for (const edge of edges) {
    const rootA = components.find(edge.from);
    const rootB = components.find(edge.to);

    if (rootA !== rootB) {
      selected.push(edge);
      totalCost += edge.weight;
      components.union(rootA, rootB);
    } else {
      skipCycleEdge(edge);
    }

    if (selected.length === graph.nodes.length - 1) {
      break;
    }
  }

  return { selected, totalCost };
}`
};

export const mstCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "kruskal.c",
    code: mstCodes.C
  },
  {
    language: "C++",
    fileName: "kruskal.cpp",
    code: mstCodes["C++"]
  },
  {
    language: "Java",
    fileName: "Kruskal.java",
    code: mstCodes.Java
  },
  {
    language: "Python",
    fileName: "kruskal.py",
    code: mstCodes.Python
  },
  {
    language: "JavaScript",
    fileName: "kruskal.js",
    code: mstCodes.JavaScript
  }
];

const mstLineHighlights: Record<
  MstCodeAction,
  Record<CodeLanguage, number[]>
> = {
  initialize: {
    C: [3, 4, 5],
    "C++": [3],
    Java: [3],
    Python: [2],
    JavaScript: [3]
  },
  "sort-edges": {
    C: [6],
    "C++": [6],
    Java: [6],
    Python: [3],
    JavaScript: [6]
  },
  "inspect-edge": {
    C: [10, 11, 12],
    "C++": [8, 9, 10],
    Java: [8, 9, 10],
    Python: [7, 8, 9],
    JavaScript: [8, 9, 10]
  },
  "select-edge": {
    C: [14, 15, 16, 17, 18],
    "C++": [12, 13, 14, 15],
    Java: [12, 13, 14, 15],
    Python: [11, 12, 13, 14],
    JavaScript: [12, 13, 14, 15]
  },
  "skip-cycle": {
    C: [19, 20],
    "C++": [16, 17],
    Java: [16, 17],
    Python: [15, 16],
    JavaScript: [16, 17]
  },
  complete: {
    C: [23, 24, 28],
    "C++": [20, 21, 25],
    Java: [20, 21, 25],
    Python: [18, 19, 21],
    JavaScript: [20, 21, 25]
  }
};

export function getMstCodeLineHighlights(
  action: MstCodeAction
): Record<CodeLanguage, number[]> {
  return mstLineHighlights[action];
}
