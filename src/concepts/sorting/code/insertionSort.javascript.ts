export const insertionSortJavaScript = `export function insertionSort(values) {
  const result = [...values];

  for (let current = 1; current < result.length; current += 1) {
    const key = result[current];
    let scan = current - 1;
    while (scan >= 0 && result[scan] > key) {
      result[scan + 1] = result[scan];
      scan -= 1;
    }
    result[scan + 1] = key;
  }

  return result;
}`;
