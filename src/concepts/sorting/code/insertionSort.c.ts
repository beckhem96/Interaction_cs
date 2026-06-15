export const insertionSortC = `#include <stdio.h>

void insertionSort(int values[], int length) {
  for (int current = 1; current < length; current++) {
    int key = values[current];
    int scan = current - 1;
    while (scan >= 0 && values[scan] > key) {
      values[scan + 1] = values[scan];
      scan--;
    }
    values[scan + 1] = key;
  }
}`;
