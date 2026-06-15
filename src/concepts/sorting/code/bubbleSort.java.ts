export const bubbleSortJava = `public class BubbleSortExample {
  public static void bubbleSort(int[] values) {
    for (int end = values.length - 1; end > 0; end--) {
      for (int index = 0; index < end; index++) {
        if (values[index] > values[index + 1]) {
          int temp = values[index];
          values[index] = values[index + 1];
          values[index + 1] = temp;
        }
      }
    }
  }
}`;
