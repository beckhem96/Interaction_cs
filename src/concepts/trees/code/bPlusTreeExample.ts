export const bPlusTreeCodeExample = {
  language: "TypeScript",
  fileName: "bPlusTree.ts",
  code: `const MAX_KEYS = 3;

function insert(root: BPlusNode, key: number) {
  const split = insertRecursive(root, key);
  if (split) {
    const newRoot = new BPlusNode(false);
    newRoot.keys = [split.separator];
    newRoot.children = [root, split.right];
    root = newRoot;
  }
  return root;
}

function insertRecursive(node: BPlusNode, key: number) {
  if (node.leaf) {
    insertSorted(node.keys, key);
    if (node.keys.length <= MAX_KEYS) return null;
    return splitLeaf(node);
  }
  const index = findChildIndex(node.keys, key);
  const split = insertRecursive(node.children[index], key);
  if (!split) return null;
  node.keys.splice(index, 0, split.separator);
  node.children.splice(index + 1, 0, split.right);
  if (node.keys.length <= MAX_KEYS) return null;
  return splitInternal(node);
}

function splitLeaf(leaf: BPlusNode) {
  const right = new BPlusNode(true);
  right.keys = leaf.keys.splice(Math.ceil(leaf.keys.length / 2));
  right.next = leaf.next;
  leaf.next = right;
  return { separator: right.keys[0], right };
}

function rangeScan(root: BPlusNode, start: number, end: number) {
  let leaf = findLeaf(root, start);
  const result: number[] = [];
  while (leaf) {
    result.push(...leaf.keys.filter((key) => start <= key && key <= end));
    if (leaf.keys.some((key) => key > end)) break;
    leaf = leaf.next;
  }
  return result;
}`
};
