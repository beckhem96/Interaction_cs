export const bTreeCodeExample = {
  language: "TypeScript",
  fileName: "bTree.ts",
  code: `const MAX_KEYS = 3;

function insert(root: BTreeNode, key: number) {
  if (root.keys.length === MAX_KEYS) {
    const newRoot = new BTreeNode(false);
    newRoot.children.push(root);
    splitChild(newRoot, 0);
    root = newRoot;
  }
  insertNonFull(root, key);
  return root;
}

function splitChild(parent: BTreeNode, index: number) {
  const child = parent.children[index];
  const median = child.keys[1];
  const right = new BTreeNode(child.leaf);
  right.keys = child.keys.splice(2);
  child.keys.pop();
  parent.keys.splice(index, 0, median);
  parent.children.splice(index + 1, 0, right);
}

function insertNonFull(node: BTreeNode, key: number) {
  if (node.leaf) {
    insertSorted(node.keys, key);
    return;
  }
  let index = findChildIndex(node.keys, key);
  if (node.children[index].keys.length === MAX_KEYS) {
    splitChild(node, index);
    if (key > node.keys[index]) index++;
  }
  insertNonFull(node.children[index], key);
}

function search(node: BTreeNode, key: number) {
  const index = lowerBound(node.keys, key);
  if (node.keys[index] === key) return node;
  if (node.leaf) return null;
  return search(node.children[index], key);
}`
};
