export const mergeSortCpp = `#include <vector>
using namespace std;

void mergeSort(vector<int>& values, int start, int end) {
  int mid = (start + end) / 2;
  if (start >= end) return;
  mergeSort(values, start, mid);
  mergeSort(values, mid + 1, end);
  while (leftIndex <= mid && rightIndex <= end) {
    result[writeIndex++] = leftValue <= rightValue ? leftValue : rightValue;
  }
  copyRemainingValues(values, result, start, end);
  merge(values, result, start, mid, end);
}`;
