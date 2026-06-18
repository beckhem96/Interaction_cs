import type { CodeLanguage, SortingCodeExample } from "../../sorting/code/types";
import type { DijkstraCodeAction } from "../types";

const dijkstraCodes: Record<CodeLanguage, string> = {
  C: `void dijkstra(Graph graph, int start) {
  int dist[MAX_NODES];
  int prev[MAX_NODES];
  bool settled[MAX_NODES] = { false };
  fill(dist, INF);
  fill(prev, -1);
  dist[start] = 0;

  while (hasUnsettledCandidate(dist, settled)) {
    int current = findSmallestUnsettled(dist, settled);

    forEachEdge(graph, current, edge) {
      int next = edge.to;
      int candidate = dist[current] + edge.weight;

      if (!settled[next] && candidate < dist[next]) {
        dist[next] = candidate;
        prev[next] = current;
      } else {
        keepExistingDistance(next);
      }
    }

    settled[current] = true;
  }

  printShortestPaths(dist, prev);
}`,
  "C++": `vector<PathInfo> dijkstra(const Graph& graph, string start) {
  map<string, int> dist;
  map<string, string> prev;
  set<string> settled;
  initializeDistances(graph, dist, prev);
  dist[start] = 0;

  while (hasUnsettledCandidate(dist, settled)) {
    string current = findSmallestUnsettled(dist, settled);

    for (const Edge& edge : graph.neighbors(current)) {
      string next = edge.to;
      int candidate = dist[current] + edge.weight;

      if (!settled.count(next) && candidate < dist[next]) {
        dist[next] = candidate;
        prev[next] = current;
      } else {
        keepExistingDistance(next);
      }
    }

    settled.insert(current);
  }

  return buildShortestPaths(dist, prev);
}`,
  Java: `List<PathInfo> dijkstra(Graph graph, String start) {
  Map<String, Integer> dist = new HashMap<>();
  Map<String, String> prev = new HashMap<>();
  Set<String> settled = new HashSet<>();
  initializeDistances(graph, dist, prev);
  dist.put(start, 0);

  while (hasUnsettledCandidate(dist, settled)) {
    String current = findSmallestUnsettled(dist, settled);

    for (Edge edge : graph.neighbors(current)) {
      String next = edge.to();
      int candidate = dist.get(current) + edge.weight();

      if (!settled.contains(next) && candidate < dist.get(next)) {
        dist.put(next, candidate);
        prev.put(next, current);
      } else {
        keepExistingDistance(next);
      }
    }

    settled.add(current);
  }

  return buildShortestPaths(dist, prev);
}`,
  Python: `def dijkstra(graph: Graph, start: str) -> list[PathInfo]:
    dist = {node: INF for node in graph.nodes}
    prev = {node: None for node in graph.nodes}
    settled: set[str] = set()
    dist[start] = 0

    while has_unsettled_candidate(dist, settled):
        current = find_smallest_unsettled(dist, settled)

        for edge in graph.neighbors(current):
            next_node = edge.to
            candidate = dist[current] + edge.weight

            if next_node not in settled and candidate < dist[next_node]:
                dist[next_node] = candidate
                prev[next_node] = current
            else:
                keep_existing_distance(next_node)

        settled.add(current)

    return build_shortest_paths(dist, prev)`,
  JavaScript: `function dijkstra(graph, start) {
  const dist = new Map();
  const prev = new Map();
  const settled = new Set();
  initializeDistances(graph, dist, prev);
  dist.set(start, 0);

  while (hasUnsettledCandidate(dist, settled)) {
    const current = findSmallestUnsettled(dist, settled);

    for (const edge of graph.neighbors(current)) {
      const next = edge.to;
      const candidate = dist.get(current) + edge.weight;

      if (!settled.has(next) && candidate < dist.get(next)) {
        dist.set(next, candidate);
        prev.set(next, current);
      } else {
        keepExistingDistance(next);
      }
    }

    settled.add(current);
  }

  return buildShortestPaths(dist, prev);
}`
};

export const dijkstraCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "dijkstra.c",
    code: dijkstraCodes.C
  },
  {
    language: "C++",
    fileName: "dijkstra.cpp",
    code: dijkstraCodes["C++"]
  },
  {
    language: "Java",
    fileName: "Dijkstra.java",
    code: dijkstraCodes.Java
  },
  {
    language: "Python",
    fileName: "dijkstra.py",
    code: dijkstraCodes.Python
  },
  {
    language: "JavaScript",
    fileName: "dijkstra.js",
    code: dijkstraCodes.JavaScript
  }
];

const dijkstraLineHighlights: Record<
  DijkstraCodeAction,
  Record<CodeLanguage, number[]>
> = {
  initialize: {
    C: [2, 3, 4, 5, 6, 7],
    "C++": [2, 3, 4, 5, 6],
    Java: [2, 3, 4, 5, 6],
    Python: [2, 3, 4, 5],
    JavaScript: [2, 3, 4, 5, 6]
  },
  "select-current": {
    C: [9, 10],
    "C++": [8, 9],
    Java: [8, 9],
    Python: [7, 8],
    JavaScript: [8, 9]
  },
  "inspect-edge": {
    C: [12, 13, 14],
    "C++": [11, 12, 13],
    Java: [11, 12, 13],
    Python: [10, 11, 12],
    JavaScript: [11, 12, 13]
  },
  relax: {
    C: [16, 17, 18, 19],
    "C++": [15, 16, 17, 18],
    Java: [15, 16, 17, 18],
    Python: [14, 15, 16],
    JavaScript: [15, 16, 17]
  },
  skip: {
    C: [20, 21, 22],
    "C++": [19, 20, 21],
    Java: [19, 20, 21],
    Python: [17, 18],
    JavaScript: [18, 19, 20]
  },
  settle: {
    C: [25],
    "C++": [23],
    Java: [23],
    Python: [20],
    JavaScript: [23]
  },
  complete: {
    C: [28],
    "C++": [26],
    Java: [26],
    Python: [22],
    JavaScript: [26]
  }
};

export function getDijkstraCodeLineHighlights(
  action: DijkstraCodeAction
): Record<CodeLanguage, number[]> {
  return dijkstraLineHighlights[action];
}
