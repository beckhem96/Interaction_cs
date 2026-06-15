export const quickSortCpp = `#include <vector>
using namespace std;

int partition(vector<int>& values, int start, int end) {
  int storeIndex = start;
  int pivot = values[end];
  for (int scan = start; scan < end; scan++) {
    if (values[scan] <= pivot) {
      swap(values[storeIndex], values[scan]);
      storeIndex++;
    }
  }
  swap(values[storeIndex], values[end]);
  return storeIndex;
}

void quickSort(vector<int>& values, int start, int end) {
  if (start >= end) return;
  int pivotIndex = partition(values, start, end);
  quickSort(values, start, pivotIndex - 1);
  quickSort(values, pivotIndex + 1, end);
}`;
