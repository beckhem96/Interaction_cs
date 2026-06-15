export const selectionSortCpp = `#include <vector>
using namespace std;

void selectionSort(vector<int>& values) {
  for (int current = 0; current < values.size() - 1; current++) {
    int minIndex = current;
    for (int scan = current + 1; scan < values.size(); scan++) {
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
