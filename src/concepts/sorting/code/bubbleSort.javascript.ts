export const bubbleSortJavaScript = `export function bubbleSort(values) {
  const result = [...values];

  for (let end = result.length - 1; end > 0; end -= 1) {
    for (let index = 0; index < end; index += 1) {
      if (result[index] > result[index + 1]) {
        const temp = result[index];
        result[index] = result[index + 1];
        result[index + 1] = temp;
      }
    }
  }

  return result;
}`;
