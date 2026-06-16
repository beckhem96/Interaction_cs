export const graphTraversalCodeExample = {
  language: "TypeScript",
  fileName: "graphTraversal.ts",
  code: `const graph = new Map<string, string[]>([
  ["A", ["B", "C", "D"]],
  ["B", ["A", "E", "F"]],
  ["C", ["A", "G"]],
  ["D", ["A", "H"]],
  ["E", ["B", "I"]],
  ["F", ["B", "I"]],
  ["G", ["C", "H"]],
  ["H", ["D", "G", "I"]],
  ["I", ["E", "F", "H"]]
]);

function bfs(start: string) {
  const queue = [start];
  const discovered = new Set([start]);
  const visited: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    visited.push(node);

    for (const next of graph.get(node) ?? []) {
      if (discovered.has(next)) continue;
      discovered.add(next);
      queue.push(next);
    }
  }

  return visited;
}

function dfs(start: string) {
  const stack = [start];
  const discovered = new Set([start]);
  const visited: string[] = [];

  while (stack.length > 0) {
    const node = stack.pop()!;
    visited.push(node);

    const neighbors = [...(graph.get(node) ?? [])].reverse();
    for (const next of neighbors) {
      if (discovered.has(next)) continue;
      discovered.add(next);
      stack.push(next);
    }
  }

  return visited;
}`
};
