export const binarySearchTreeDeletionCodeExample = {
  language: "TypeScript",
  fileName: "binarySearchTreeDeletion.ts",
  code: `function remove(node: TreeNode | null, target: number): TreeNode | null {
  if (node === null) return null;
  if (target < node.value) {
    node.left = remove(node.left, target);
    return node;
  }
  if (target > node.value) {
    node.right = remove(node.right, target);
    return node;
  }
  if (node.left === null && node.right === null) return null;
  if (node.left === null) return node.right;
  if (node.right === null) return node.left;
  const successor = findMin(node.right);
  node.value = successor.value;
  node.right = remove(node.right, successor.value);
  return node;
}

function findMin(node: TreeNode): TreeNode {
  while (node.left !== null) node = node.left;
  return node;
}`
};
