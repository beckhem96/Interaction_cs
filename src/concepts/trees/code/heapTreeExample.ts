export const heapTreeCodeExample = {
  language: "TypeScript",
  fileName: "maxHeap.ts",
  code: `function pushMaxHeap(heap: number[], value: number) {
  heap.push(value);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (heap[parent] >= heap[index]) break;
    swap(heap, parent, index);
    index = parent;
  }
}

function extractMax(heap: number[]): number {
  const max = heap[0];
  heap[0] = heap.pop()!;
  let index = 0;
  while (hasChild(heap, index)) {
    const child = largerChildIndex(heap, index);
    if (heap[index] >= heap[child]) break;
    swap(heap, index, child);
    index = child;
  }
  return max;
}`
};
