export const selectionSortJava = `public class SelectionSortExample {
  public static void selectionSort(int[] values) {
    for (int current = 0; current < values.length - 1; current++) {
      int minIndex = current;
      for (int scan = current + 1; scan < values.length; scan++) {
        if (values[scan] < values[minIndex]) {
          minIndex = scan;
        }
      }
      if (minIndex != current) {
        int temp = values[current];
        values[current] = values[minIndex];
        values[minIndex] = temp;
      }
    }
  }
}`;
