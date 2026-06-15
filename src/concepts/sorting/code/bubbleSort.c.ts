export const bubbleSortC = `#include <stdio.h>

void bubbleSort(int values[], int length) {
  for (int end = length - 1; end > 0; end--) {
    for (int index = 0; index < end; index++) {
      if (values[index] > values[index + 1]) {
        int temp = values[index];
        values[index] = values[index + 1];
        values[index + 1] = temp;
      }
    }
  }
}`;
