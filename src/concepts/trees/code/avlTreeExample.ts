export const avlTreeCodeExample = {
  language: "TypeScript",
  fileName: "avlTree.ts",
  code: `function insert(node: AvlNode | null, value: number): AvlNode {
  if (node === null) return createNode(value);

  if (value < node.value) {
    node.left = insert(node.left, value);
  } else {
    node.right = insert(node.right, value);
  }

  updateHeight(node);
  const balance = height(node.left) - height(node.right);

  if (balance > 1 && value < node.left.value) return rotateRight(node);
  if (balance < -1 && value > node.right.value) return rotateLeft(node);
  if (balance > 1 && value > node.left.value) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (balance < -1 && value < node.right.value) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }

  return node;
}`
};
