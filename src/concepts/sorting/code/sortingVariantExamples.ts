import type { CodeLanguage, SortingCodeExample } from "./types";

const extensions: Record<CodeLanguage, string> = {
  C: "c",
  "C++": "cpp",
  Java: "java",
  Python: "py",
  JavaScript: "js",
};

function examples(
  fileBase: string,
  codeByLanguage: Record<CodeLanguage, string>,
): SortingCodeExample[] {
  return (["C", "C++", "Java", "Python", "JavaScript"] as const).map((language) => ({
    language,
    fileName: `${fileBase}.${extensions[language]}`,
    code: codeByLanguage[language],
  }));
}

const earlyExit = {
  C: `void bubbleSortEarlyExit(int values[], int length) {
  for (int end = length - 1; end > 0; end--) {
    int swapped = 0;
    for (int index = 0; index < end; index++) {
      if (values[index] > values[index + 1]) {
        swap(values, index, index + 1);
        swapped = 1;
      }
    }
    if (!swapped) break;
  }
}`,
  "C++": `void bubbleSortEarlyExit(vector<int>& values) {
  for (int end = values.size() - 1; end > 0; end--) {
    bool swapped = false;
    for (int index = 0; index < end; index++) {
      if (values[index] > values[index + 1]) {
        swap(values[index], values[index + 1]);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  Java: `static void bubbleSortEarlyExit(int[] values) {
  for (int end = values.length - 1; end > 0; end--) {
    boolean swapped = false;
    for (int index = 0; index < end; index++) {
      if (values[index] > values[index + 1]) {
        swap(values, index, index + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  Python: `def bubble_sort_early_exit(values):
    result = values[:]
    for end in range(len(result) - 1, 0, -1):
        swapped = False
        for index in range(end):
            if result[index] > result[index + 1]:
                result[index], result[index + 1] = result[index + 1], result[index]
                swapped = True
        if not swapped:
            break
    return result`,
  JavaScript: `export function bubbleSortEarlyExit(values) {
  const result = [...values];
  for (let end = result.length - 1; end > 0; end -= 1) {
    let swapped = false;
    for (let index = 0; index < end; index += 1) {
      if (result[index] > result[index + 1]) {
        [result[index], result[index + 1]] = [result[index + 1], result[index]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return result;
}`,
};

const cocktail = {
  C: `void cocktailSort(int values[], int length) {
  int start = 0, end = length - 1;
  while (start < end) {
    for (int i = start; i < end; i++) compareAndSwap(values, i, i + 1);
    end--;
    for (int i = end; i > start; i--) compareAndSwap(values, i - 1, i);
    start++;
  }
}`,
  "C++": `void cocktailSort(vector<int>& values) {
  int start = 0, end = values.size() - 1;
  while (start < end) {
    for (int i = start; i < end; i++) compareAndSwap(values, i, i + 1);
    end--;
    for (int i = end; i > start; i--) compareAndSwap(values, i - 1, i);
    start++;
  }
}`,
  Java: `static void cocktailSort(int[] values) {
  int start = 0, end = values.length - 1;
  while (start < end) {
    for (int i = start; i < end; i++) compareAndSwap(values, i, i + 1);
    end--;
    for (int i = end; i > start; i--) compareAndSwap(values, i - 1, i);
    start++;
  }
}`,
  Python: `def cocktail_sort(values):
    result = values[:]
    start, end = 0, len(result) - 1
    while start < end:
        for index in range(start, end):
            compare_and_swap(result, index, index + 1)
        end -= 1
        for index in range(end, start, -1):
            compare_and_swap(result, index - 1, index)
        start += 1
    return result`,
  JavaScript: `export function cocktailSort(values) {
  const result = [...values];
  let start = 0;
  let end = result.length - 1;
  while (start < end) {
    for (let index = start; index < end; index += 1) compareAndSwap(result, index, index + 1);
    end -= 1;
    for (let index = end; index > start; index -= 1) compareAndSwap(result, index - 1, index);
    start += 1;
  }
  return result;
}`,
};

const selectionMax = {
  C: `void selectionSortMax(int values[], int length) {
  for (int end = length - 1; end > 0; end--) {
    int maxIndex = 0;
    for (int scan = 1; scan <= end; scan++) {
      if (values[scan] > values[maxIndex]) maxIndex = scan;
    }
    swap(values, maxIndex, end);
  }
}`,
  "C++": `void selectionSortMax(vector<int>& values) {
  for (int end = values.size() - 1; end > 0; end--) {
    int maxIndex = 0;
    for (int scan = 1; scan <= end; scan++) {
      if (values[scan] > values[maxIndex]) maxIndex = scan;
    }
    swap(values[maxIndex], values[end]);
  }
}`,
  Java: `static void selectionSortMax(int[] values) {
  for (int end = values.length - 1; end > 0; end--) {
    int maxIndex = 0;
    for (int scan = 1; scan <= end; scan++) {
      if (values[scan] > values[maxIndex]) maxIndex = scan;
    }
    swap(values, maxIndex, end);
  }
}`,
  Python: `def selection_sort_max(values):
    result = values[:]
    for end in range(len(result) - 1, 0, -1):
        max_index = 0
        for scan in range(1, end + 1):
            if result[scan] > result[max_index]:
                max_index = scan
        result[max_index], result[end] = result[end], result[max_index]
    return result`,
  JavaScript: `export function selectionSortMax(values) {
  const result = [...values];
  for (let end = result.length - 1; end > 0; end -= 1) {
    let maxIndex = 0;
    for (let scan = 1; scan <= end; scan += 1) {
      if (result[scan] > result[maxIndex]) maxIndex = scan;
    }
    [result[maxIndex], result[end]] = [result[end], result[maxIndex]];
  }
  return result;
}`,
};

const selectionBidirectional = {
  C: `void selectionSortMinMax(int values[], int length) {
  int start = 0, end = length - 1;
  while (start < end) {
    int minIndex = start, maxIndex = start;
    for (int scan = start; scan <= end; scan++) updateMinMax(values, scan, &minIndex, &maxIndex);
    swap(values, start, minIndex);
    if (maxIndex == start) maxIndex = minIndex;
    swap(values, end, maxIndex);
    start++;
    end--;
  }
}`,
  "C++": `void selectionSortMinMax(vector<int>& values) {
  int start = 0, end = values.size() - 1;
  while (start < end) {
    int minIndex = start, maxIndex = start;
    for (int scan = start; scan <= end; scan++) updateMinMax(values, scan, minIndex, maxIndex);
    swap(values[start], values[minIndex]);
    if (maxIndex == start) maxIndex = minIndex;
    swap(values[end], values[maxIndex]);
    start++;
    end--;
  }
}`,
  Java: `static void selectionSortMinMax(int[] values) {
  int start = 0, end = values.length - 1;
  while (start < end) {
    int minIndex = start, maxIndex = start;
    for (int scan = start; scan <= end; scan++) updateMinMax(values, scan, minIndex, maxIndex);
    swap(values, start, minIndex);
    if (maxIndex == start) maxIndex = minIndex;
    swap(values, end, maxIndex);
    start++;
    end--;
  }
}`,
  Python: `def selection_sort_min_max(values):
    result = values[:]
    start, end = 0, len(result) - 1
    while start < end:
        min_index = max_index = start
        for scan in range(start, end + 1):
            min_index, max_index = update_min_max(result, scan, min_index, max_index)
        result[start], result[min_index] = result[min_index], result[start]
        if max_index == start:
            max_index = min_index
        result[end], result[max_index] = result[max_index], result[end]
        start += 1
        end -= 1
    return result`,
  JavaScript: `export function selectionSortMinMax(values) {
  const result = [...values];
  let start = 0;
  let end = result.length - 1;
  while (start < end) {
    let minIndex = start;
    let maxIndex = start;
    for (let scan = start; scan <= end; scan += 1) [minIndex, maxIndex] = updateMinMax(result, scan, minIndex, maxIndex);
    [result[start], result[minIndex]] = [result[minIndex], result[start]];
    if (maxIndex === start) maxIndex = minIndex;
    [result[end], result[maxIndex]] = [result[maxIndex], result[end]];
    start += 1;
    end -= 1;
  }
  return result;
}`,
};

const binaryInsertion = {
  C: `void binaryInsertionSort(int values[], int length) {
  for (int current = 1; current < length; current++) {
    int key = values[current];
    int left = 0, right = current;
    while (left < right) {
      int mid = (left + right) / 2;
      if (values[mid] <= key) left = mid + 1;
      else right = mid;
    }
    shiftRight(values, left, current);
    values[left] = key;
  }
}`,
  "C++": `void binaryInsertionSort(vector<int>& values) {
  for (int current = 1; current < values.size(); current++) {
    int key = values[current];
    int left = 0, right = current;
    while (left < right) {
      int mid = (left + right) / 2;
      if (values[mid] <= key) left = mid + 1;
      else right = mid;
    }
    shiftRight(values, left, current);
    values[left] = key;
  }
}`,
  Java: `static void binaryInsertionSort(int[] values) {
  for (int current = 1; current < values.length; current++) {
    int key = values[current];
    int left = 0, right = current;
    while (left < right) {
      int mid = (left + right) / 2;
      if (values[mid] <= key) left = mid + 1;
      else right = mid;
    }
    shiftRight(values, left, current);
    values[left] = key;
  }
}`,
  Python: `def binary_insertion_sort(values):
    result = values[:]
    for current in range(1, len(result)):
        key = result[current]
        left, right = 0, current
        while left < right:
            mid = (left + right) // 2
            if result[mid] <= key:
                left = mid + 1
            else:
                right = mid
        shift_right(result, left, current)
        result[left] = key
    return result`,
  JavaScript: `export function binaryInsertionSort(values) {
  const result = [...values];
  for (let current = 1; current < result.length; current += 1) {
    const key = result[current];
    let left = 0;
    let right = current;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (result[mid] <= key) left = mid + 1;
      else right = mid;
    }
    shiftRight(result, left, current);
    result[left] = key;
  }
  return result;
}`,
};

const mergeBottomUp = {
  C: `void mergeSortBottomUp(int values[], int length) {
  for (int width = 1; width < length; width *= 2) {
    for (int start = 0; start < length; start += width * 2) {
      int mid = min(start + width - 1, length - 1);
      int end = min(start + width * 2 - 1, length - 1);
      merge(values, start, mid, end);
    }
  }
}`,
  "C++": `void mergeSortBottomUp(vector<int>& values) {
  for (int width = 1; width < values.size(); width *= 2) {
    for (int start = 0; start < values.size(); start += width * 2) {
      int mid = min(start + width - 1, (int)values.size() - 1);
      int end = min(start + width * 2 - 1, (int)values.size() - 1);
      merge(values, start, mid, end);
    }
  }
}`,
  Java: `static void mergeSortBottomUp(int[] values) {
  for (int width = 1; width < values.length; width *= 2) {
    for (int start = 0; start < values.length; start += width * 2) {
      int mid = Math.min(start + width - 1, values.length - 1);
      int end = Math.min(start + width * 2 - 1, values.length - 1);
      merge(values, start, mid, end);
    }
  }
}`,
  Python: `def merge_sort_bottom_up(values):
    result = values[:]
    width = 1
    while width < len(result):
        for start in range(0, len(result), width * 2):
            mid = min(start + width - 1, len(result) - 1)
            end = min(start + width * 2 - 1, len(result) - 1)
            merge(result, start, mid, end)
        width *= 2
    return result`,
  JavaScript: `export function mergeSortBottomUp(values) {
  const result = [...values];
  for (let width = 1; width < result.length; width *= 2) {
    for (let start = 0; start < result.length; start += width * 2) {
      const mid = Math.min(start + width - 1, result.length - 1);
      const end = Math.min(start + width * 2 - 1, result.length - 1);
      merge(result, start, mid, end);
    }
  }
  return result;
}`,
};

const quickFirst = {
  C: `int partitionFirstPivot(int values[], int start, int end) {
  int pivotIndex = start;
  swap(values, pivotIndex, end);
  int pivot = values[end];
  int boundary = start;
  for (int scan = start; scan < end; scan++) {
    if (values[scan] <= pivot) swap(values, boundary++, scan);
  }
  swap(values, boundary, end);
  return boundary;
}`,
  "C++": `int partitionFirstPivot(vector<int>& values, int start, int end) {
  int pivotIndex = start;
  swap(values[pivotIndex], values[end]);
  int pivot = values[end];
  int boundary = start;
  for (int scan = start; scan < end; scan++) {
    if (values[scan] <= pivot) swap(values[boundary++], values[scan]);
  }
  swap(values[boundary], values[end]);
  return boundary;
}`,
  Java: `static int partitionFirstPivot(int[] values, int start, int end) {
  int pivotIndex = start;
  swap(values, pivotIndex, end);
  int pivot = values[end];
  int boundary = start;
  for (int scan = start; scan < end; scan++) {
    if (values[scan] <= pivot) swap(values, boundary++, scan);
  }
  swap(values, boundary, end);
  return boundary;
}`,
  Python: `def partition_first_pivot(result, start, end):
    pivot_index = start
    result[pivot_index], result[end] = result[end], result[pivot_index]
    pivot = result[end]
    boundary = start
    for scan in range(start, end):
        if result[scan] <= pivot:
            result[boundary], result[scan] = result[scan], result[boundary]
            boundary += 1
    result[boundary], result[end] = result[end], result[boundary]
    return boundary`,
  JavaScript: `function partitionFirstPivot(result, start, end) {
  const pivotIndex = start;
  [result[pivotIndex], result[end]] = [result[end], result[pivotIndex]];
  const pivot = result[end];
  let boundary = start;
  for (let scan = start; scan < end; scan += 1) {
    if (result[scan] <= pivot) {
      [result[boundary], result[scan]] = [result[scan], result[boundary]];
      boundary += 1;
    }
  }
  [result[boundary], result[end]] = [result[end], result[boundary]];
  return boundary;
}`,
};

const quickMedian = {
  C: `int partitionMedianPivot(int values[], int start, int end) {
  int middle = (start + end) / 2;
  int pivotIndex = medianIndex(values, start, middle, end);
  swap(values, pivotIndex, end);
  int pivot = values[end];
  int boundary = start;
  for (int scan = start; scan < end; scan++) {
    if (values[scan] <= pivot) swap(values, boundary++, scan);
  }
  swap(values, boundary, end);
  return boundary;
}`,
  "C++": `int partitionMedianPivot(vector<int>& values, int start, int end) {
  int middle = (start + end) / 2;
  int pivotIndex = medianIndex(values, start, middle, end);
  swap(values[pivotIndex], values[end]);
  int pivot = values[end];
  int boundary = start;
  for (int scan = start; scan < end; scan++) {
    if (values[scan] <= pivot) swap(values[boundary++], values[scan]);
  }
  swap(values[boundary], values[end]);
  return boundary;
}`,
  Java: `static int partitionMedianPivot(int[] values, int start, int end) {
  int middle = (start + end) / 2;
  int pivotIndex = medianIndex(values, start, middle, end);
  swap(values, pivotIndex, end);
  int pivot = values[end];
  int boundary = start;
  for (int scan = start; scan < end; scan++) {
    if (values[scan] <= pivot) swap(values, boundary++, scan);
  }
  swap(values, boundary, end);
  return boundary;
}`,
  Python: `def partition_median_pivot(result, start, end):
    middle = (start + end) // 2
    pivot_index = median_index(result, start, middle, end)
    result[pivot_index], result[end] = result[end], result[pivot_index]
    pivot = result[end]
    boundary = start
    for scan in range(start, end):
        if result[scan] <= pivot:
            result[boundary], result[scan] = result[scan], result[boundary]
            boundary += 1
    result[boundary], result[end] = result[end], result[boundary]
    return boundary`,
  JavaScript: `function partitionMedianPivot(result, start, end) {
  const middle = Math.floor((start + end) / 2);
  const pivotIndex = medianIndex(result, start, middle, end);
  [result[pivotIndex], result[end]] = [result[end], result[pivotIndex]];
  const pivot = result[end];
  let boundary = start;
  for (let scan = start; scan < end; scan += 1) {
    if (result[scan] <= pivot) {
      [result[boundary], result[scan]] = [result[scan], result[boundary]];
      boundary += 1;
    }
  }
  [result[boundary], result[end]] = [result[end], result[boundary]];
  return boundary;
}`,
};

const heapFloyd = {
  C: `void heapSortFloyd(int values[], int length) {
  for (int root = length / 2 - 1; root >= 0; root--) siftDown(values, root, length);
  for (int end = length - 1; end > 0; end--) {
    swap(values, 0, end);
    siftDown(values, 0, end);
  }
}`,
  "C++": `void heapSortFloyd(vector<int>& values) {
  for (int root = values.size() / 2 - 1; root >= 0; root--) siftDown(values, root, values.size());
  for (int end = values.size() - 1; end > 0; end--) {
    swap(values[0], values[end]);
    siftDown(values, 0, end);
  }
}`,
  Java: `static void heapSortFloyd(int[] values) {
  for (int root = values.length / 2 - 1; root >= 0; root--) siftDown(values, root, values.length);
  for (int end = values.length - 1; end > 0; end--) {
    swap(values, 0, end);
    siftDown(values, 0, end);
  }
}`,
  Python: `def heap_sort_floyd(values):
    result = values[:]
    for root in range(len(result) // 2 - 1, -1, -1):
        sift_down(result, root, len(result))
    for end in range(len(result) - 1, 0, -1):
        result[0], result[end] = result[end], result[0]
        sift_down(result, 0, end)
    return result`,
  JavaScript: `export function heapSortFloyd(values) {
  const result = [...values];
  for (let root = Math.floor(result.length / 2) - 1; root >= 0; root -= 1) siftDown(result, root, result.length);
  for (let end = result.length - 1; end > 0; end -= 1) {
    [result[0], result[end]] = [result[end], result[0]];
    siftDown(result, 0, end);
  }
  return result;
}`,
};

const heapInsertion = {
  C: `void heapSortInsertionBuild(int values[], int length) {
  for (int index = 1; index < length; index++) siftUp(values, index);
  for (int end = length - 1; end > 0; end--) {
    swap(values, 0, end);
    siftDown(values, 0, end);
  }
}`,
  "C++": `void heapSortInsertionBuild(vector<int>& values) {
  for (int index = 1; index < values.size(); index++) siftUp(values, index);
  for (int end = values.size() - 1; end > 0; end--) {
    swap(values[0], values[end]);
    siftDown(values, 0, end);
  }
}`,
  Java: `static void heapSortInsertionBuild(int[] values) {
  for (int index = 1; index < values.length; index++) siftUp(values, index);
  for (int end = values.length - 1; end > 0; end--) {
    swap(values, 0, end);
    siftDown(values, 0, end);
  }
}`,
  Python: `def heap_sort_insertion_build(values):
    result = values[:]
    for index in range(1, len(result)):
        sift_up(result, index)
    for end in range(len(result) - 1, 0, -1):
        result[0], result[end] = result[end], result[0]
        sift_down(result, 0, end)
    return result`,
  JavaScript: `export function heapSortInsertionBuild(values) {
  const result = [...values];
  for (let index = 1; index < result.length; index += 1) siftUp(result, index);
  for (let end = result.length - 1; end > 0; end -= 1) {
    [result[0], result[end]] = [result[end], result[0]];
    siftDown(result, 0, end);
  }
  return result;
}`,
};

export const bubbleSortEarlyExitCodeExamples = examples("bubbleSortEarlyExit", earlyExit);
export const cocktailSortCodeExamples = examples("cocktailSort", cocktail);
export const selectionSortMaxCodeExamples = examples("selectionSortMax", selectionMax);
export const selectionSortBidirectionalCodeExamples = examples(
  "selectionSortMinMax",
  selectionBidirectional,
);
export const binaryInsertionSortCodeExamples = examples("binaryInsertionSort", binaryInsertion);
export const mergeSortBottomUpCodeExamples = examples("mergeSortBottomUp", mergeBottomUp);
export const quickSortFirstPivotCodeExamples = examples("quickSortFirstPivot", quickFirst);
export const quickSortMedianPivotCodeExamples = examples("quickSortMedianPivot", quickMedian);
export const heapSortFloydCodeExamples = examples("heapSortFloyd", heapFloyd);
export const heapSortInsertionBuildCodeExamples = examples(
  "heapSortInsertionBuild",
  heapInsertion,
);
