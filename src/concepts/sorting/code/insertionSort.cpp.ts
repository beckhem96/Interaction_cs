export const insertionSortCpp = `#include <vector>
using namespace std;

void insertionSort(vector<int>& values) {
  for (int current = 1; current < values.size(); current++) {
    int key = values[current];
    int scan = current - 1;
    while (scan >= 0 && values[scan] > key) {
      values[scan + 1] = values[scan];
      scan--;
    }
    values[scan + 1] = key;
  }
}`;
