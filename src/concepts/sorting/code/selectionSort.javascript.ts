export const selectionSortJavaScript = `export function selectionSort(values) {
  const result = [...values];

  for (let current = 0; current < result.length - 1; current += 1) {
    let minIndex = current;
    for (let scan = current + 1; scan < result.length; scan += 1) {
      if (result[scan] < result[minIndex]) {
        minIndex = scan;
      }
    }
    if (minIndex !== current) {
      const temp = result[current];
      result[current] = result[minIndex];
      result[minIndex] = temp;
    }
  }

  return result;
}`;
