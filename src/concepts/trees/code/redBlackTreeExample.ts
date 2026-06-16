export const redBlackTreeCodeExample = {
  language: "TypeScript",
  fileName: "redBlackTree.ts",
  code: `function insert(root: RBNode | null, value: number): RBNode {
  let node = new RBNode(value, "red");
  root = bstInsert(root, node);
  while (node.parent?.color === "red") {
    const parent = node.parent;
    const grandparent = parent.parent;
    const uncle = siblingOf(parent);
    if (uncle?.color === "red") {
      parent.color = "black";
      uncle.color = "black";
      grandparent.color = "red";
      node = grandparent;
      continue;
    }
    if (isTriangle(node, parent, grandparent)) {
      rotateTowardLine(parent);
    }
    node.parent.color = "black";
    node.parent.parent.color = "red";
    rotateGrandparent(node.parent.parent);
  }
  root.color = "black";
  return root;
}`
};
