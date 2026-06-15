export const bubbleSortCpp = `#include <vector>
using namespace std;

void bubbleSort(vector<int>& values) {
  for (int end = values.size() - 1; end > 0; end--) {
    for (int index = 0; index < end; index++) {
      if (values[index] > values[index + 1]) {
        int temp = values[index];
        values[index] = values[index + 1];
        values[index + 1] = temp;
      }
    }
  }
}`;
