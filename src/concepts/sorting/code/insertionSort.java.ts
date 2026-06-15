export const insertionSortJava = `public class InsertionSortExample {
  public static void insertionSort(int[] values) {
    for (int current = 1; current < values.length; current++) {
      int key = values[current];
      int scan = current - 1;
      while (scan >= 0 && values[scan] > key) {
        values[scan + 1] = values[scan];
        scan--;
      }
      values[scan + 1] = key;
    }
  }
}`;
