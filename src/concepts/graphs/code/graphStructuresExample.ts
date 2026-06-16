export const graphStructuresCodeExample = {
  language: "TypeScript",
  fileName: "graphStructures.ts",
  code: `const graph = new Map<string, string[]>();

function addNode(node: string) {
  graph.set(node, graph.get(node) ?? []);
}

function addUndirectedEdge(a: string, b: string) {
  graph.get(a)!.push(b);
  graph.get(b)!.push(a);
}

function addDirectedEdge(from: string, to: string) {
  graph.get(from)!.push(to);
}

function addWeightedEdge(from: string, to: string, weight: number) {
  graph.get(from)!.push(\`\${to}(\${weight})\`);
}

const left = new Set(["U1", "U2", "U3"]);
const right = new Set(["T1", "T2", "T3"]);
function addBipartiteEdge(leftNode: string, rightNode: string) {
  if (!left.has(leftNode) || !right.has(rightNode)) return;
  graph.get(leftNode)!.push(rightNode);
}

function hasDirectedCycle(order: string[], edges: [string, string][]) {
  const position = new Map(order.map((node, index) => [node, index]));
  return edges.some(([from, to]) => position.get(from)! >= position.get(to)!);
}

function isBipartiteEdge(from: string, to: string) {
  return left.has(from) !== left.has(to);
}`
};
