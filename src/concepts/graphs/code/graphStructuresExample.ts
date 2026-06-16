import type { SortingCodeExample } from "../../sorting/code/types";

export const graphStructureCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "graphStructures.c",
    code: `typedef struct Graph Graph;

void addNode(Graph *graph, const char *node) {
  graphAddNode(graph, node);
}

void addUndirectedEdge(Graph *graph, const char *a, const char *b) {
  graphAddEdge(graph, a, b, 0);
  graphAddEdge(graph, b, a, 0);
}

void addDirectedEdge(Graph *graph, const char *from, const char *to) {
  graphAddEdge(graph, from, to, 1);
}

void addWeightedEdge(Graph *graph, const char *from, const char *to, int weight) {
  graphAddWeightedEdge(graph, from, to, weight);
}

const char *left[] = {"U1", "U2", "U3"};
const char *right[] = {"T1", "T2", "T3"};
void addBipartiteEdge(Graph *graph, const char *leftNode, const char *rightNode) {
  if (!isLeft(leftNode) || !isRight(rightNode)) return;
  graphAddEdge(graph, leftNode, rightNode, 0);
}

int hasDirectedCycle(const char **order, Edge *edges) {
  int *position = buildPosition(order);
  return edgeBreaksOrder(position, edges);
}

int isBipartiteEdge(const char *from, const char *to) {
  return isLeft(from) != isLeft(to);
}`
  },
  {
    language: "C++",
    fileName: "graphStructures.cpp",
    code: `using Graph = unordered_map<string, vector<string>>;

void addNode(Graph& graph, const string& node) {
  graph.try_emplace(node);
}

void addUndirectedEdge(Graph& graph, const string& a, const string& b) {
  graph[a].push_back(b);
  graph[b].push_back(a);
}

void addDirectedEdge(Graph& graph, const string& from, const string& to) {
  graph[from].push_back(to);
}

void addWeightedEdge(Graph& graph, const string& from, const string& to, int weight) {
  graph[from].push_back(to + "(" + to_string(weight) + ")");
}

set<string> left = {"U1", "U2", "U3"};
set<string> right = {"T1", "T2", "T3"};
void addBipartiteEdge(Graph& graph, const string& leftNode, const string& rightNode) {
  if (!left.count(leftNode) || !right.count(rightNode)) return;
  graph[leftNode].push_back(rightNode);
}

bool hasDirectedCycle(vector<string> order, vector<pair<string, string>> edges) {
  auto position = buildPosition(order);
  return anyEdgeBreaksOrder(position, edges);
}

bool isBipartiteEdge(const string& from, const string& to) {
  return left.count(from) != left.count(to);
}`
  },
  {
    language: "Java",
    fileName: "GraphStructures.java",
    code: `Map<String, List<String>> graph = new HashMap<>();

void addNode(String node) {
  graph.putIfAbsent(node, new ArrayList<>());
}

void addUndirectedEdge(String a, String b) {
  graph.get(a).add(b);
  graph.get(b).add(a);
}

void addDirectedEdge(String from, String to) {
  graph.get(from).add(to);
}

void addWeightedEdge(String from, String to, int weight) {
  graph.get(from).add(to + "(" + weight + ")");
}

Set<String> left = Set.of("U1", "U2", "U3");
Set<String> right = Set.of("T1", "T2", "T3");
void addBipartiteEdge(String leftNode, String rightNode) {
  if (!left.contains(leftNode) || !right.contains(rightNode)) return;
  graph.get(leftNode).add(rightNode);
}

boolean hasDirectedCycle(List<String> order, List<Edge> edges) {
  Map<String, Integer> position = buildPosition(order);
  return edges.stream().anyMatch(edge -> breaksOrder(position, edge));
}

boolean isBipartiteEdge(String from, String to) {
  return left.contains(from) != left.contains(to);
}`
  },
  {
    language: "Python",
    fileName: "graph_structures.py",
    code: `graph: dict[str, list[str]] = {}

def add_node(node: str) -> None:
    graph.setdefault(node, [])

def add_undirected_edge(a: str, b: str) -> None:
    graph[a].append(b)
    graph[b].append(a)

def add_directed_edge(from_node: str, to_node: str) -> None:
    graph[from_node].append(to_node)

def add_weighted_edge(from_node: str, to_node: str, weight: int) -> None:
    graph[from_node].append(f"{to_node}({weight})")

left = {"U1", "U2", "U3"}
right = {"T1", "T2", "T3"}
def add_bipartite_edge(left_node: str, right_node: str) -> None:
    if left_node not in left or right_node not in right: return
    graph[left_node].append(right_node)

def has_directed_cycle(order: list[str], edges: list[tuple[str, str]]) -> bool:
    position = {node: index for index, node in enumerate(order)}
    return any(position[a] >= position[b] for a, b in edges)

def is_bipartite_edge(from_node: str, to_node: str) -> bool:
    return (from_node in left) != (to_node in left)`
  },
  {
    language: "JavaScript",
    fileName: "graphStructures.js",
    code: `const graph = new Map();

function addNode(node) {
  graph.set(node, graph.get(node) ?? []);
}

function addUndirectedEdge(a, b) {
  graph.get(a).push(b);
  graph.get(b).push(a);
}

function addDirectedEdge(from, to) {
  graph.get(from).push(to);
}

function addWeightedEdge(from, to, weight) {
  graph.get(from).push(\`\${to}(\${weight})\`);
}

const left = new Set(["U1", "U2", "U3"]);
const right = new Set(["T1", "T2", "T3"]);
function addBipartiteEdge(leftNode, rightNode) {
  if (!left.has(leftNode) || !right.has(rightNode)) return;
  graph.get(leftNode).push(rightNode);
}

function hasDirectedCycle(order, edges) {
  const position = new Map(order.map((node, index) => [node, index]));
  return edges.some(([from, to]) => position.get(from) >= position.get(to));
}

function isBipartiteEdge(from, to) {
  return left.has(from) !== left.has(to);
}`
  }
];
