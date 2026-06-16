export const binarySearchTreeCodeExample = {
  language: "TypeScript",
  fileName: "binarySearchTree.ts",
  code: `function insert(node: TreeNode | null, value: number): TreeNode {
  if (node === null) return { value, left: null, right: null };

  if (value < node.value) {
    node.left = insert(node.left, value);
  } else {
    node.right = insert(node.right, value);
  }

  return node;
}

function search(node: TreeNode | null, target: number): TreeNode | null {
  if (node === null) return null;
  if (node.value === target) return node;
  if (target < node.value) return search(node.left, target);
  return search(node.right, target);
}

function inorder(node: TreeNode | null, output: number[]) {
  if (node === null) return;
  inorder(node.left, output);
  output.push(node.value);
  inorder(node.right, output);
}`
};
