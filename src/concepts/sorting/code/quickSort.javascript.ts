export const quickSortJavaScript = `export function quickSort(values) {
  const result = [...values];
  sortRange(result, 0, result.length - 1);
  return result;
}

function sortRange(result, start, end) {
  if (start >= end) return result;
  const pivot = result[end];
  let storeIndex = start;
  for (let scan = start; scan < end; scan++) {
    if (result[scan] <= pivot) {
      [result[storeIndex], result[scan]] = [result[scan], result[storeIndex]];
      storeIndex++;
    }
  }
  [result[storeIndex], result[end]] = [result[end], result[storeIndex]];
  sortRange(result, start, storeIndex - 1);
  sortRange(result, storeIndex + 1, end);
}`;
