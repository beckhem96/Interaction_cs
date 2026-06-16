export const segmentTreeCodeExample = {
  language: "TypeScript",
  fileName: "segmentTree.ts",
  code: `function build(node: number, left: number, right: number) {
  if (left === right) {
    tree[node] = values[left];
    return tree[node];
  }
  const mid = Math.floor((left + right) / 2);
  tree[node] = build(node * 2, left, mid)
    + build(node * 2 + 1, mid + 1, right);
  return tree[node];
}

function query(node: number, left: number, right: number, ql: number, qr: number) {
  if (qr < left || right < ql) return 0;
  if (ql <= left && right <= qr) return tree[node];
  const mid = Math.floor((left + right) / 2);
  return query(node * 2, left, mid, ql, qr)
    + query(node * 2 + 1, mid + 1, right, ql, qr);
}

function update(node: number, left: number, right: number, index: number, value: number) {
  if (left === right) {
    tree[node] = value;
    return tree[node];
  }
  const mid = Math.floor((left + right) / 2);
  if (index <= mid) update(node * 2, left, mid, index, value);
  else update(node * 2 + 1, mid + 1, right, index, value);
  tree[node] = tree[node * 2] + tree[node * 2 + 1];
  return tree[node];
}`
};
