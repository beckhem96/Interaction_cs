export const quickSortJava = `class QuickSort {
  static int partition(int[] values, int start, int end) {
    int storeIndex = start;
    int pivot = values[end];
    for (int scan = start; scan < end; scan++) {
      if (values[scan] <= pivot) {
        int temp = values[storeIndex];
        values[storeIndex] = values[scan];
        values[scan] = temp;
        storeIndex++;
      }
    }
    int temp = values[storeIndex];
    values[storeIndex] = values[end];
    values[end] = temp;
    return storeIndex;
  }

  static void quickSort(int[] values, int start, int end) {
    if (start >= end) return;
    int pivotIndex = partition(values, start, end);
    quickSort(values, start, pivotIndex - 1);
    quickSort(values, pivotIndex + 1, end);
  }
}`;
