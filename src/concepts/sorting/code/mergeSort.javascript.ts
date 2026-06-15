export const mergeSortJavaScript = `export function mergeSort(values, start = 0, end = values.length - 1) {
  const result = [...values];
  if (start >= end) return result;
  const mid = Math.floor((start + end) / 2);
  mergeSort(result, start, mid);
  mergeSort(result, mid + 1, end);
  while (leftIndex <= mid && rightIndex <= end) {
    result[writeIndex++] = leftValue <= rightValue ? leftValue : rightValue;
  }
  copyRemainingValues(result, start, end);
  merge(result, start, mid, end);
  return result;
}`;
