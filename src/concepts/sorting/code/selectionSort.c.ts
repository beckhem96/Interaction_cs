export const selectionSortC = `#include <stdio.h>

void selectionSort(int values[], int length) {
  for (int current = 0; current < length - 1; current++) {
    int minIndex = current;
    for (int scan = current + 1; scan < length; scan++) {
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
}`;
