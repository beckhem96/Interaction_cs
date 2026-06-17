import type { SortingCodeExample } from "../../sorting/code/types";

export const binarySearchCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "binarySearch.c",
    code: `int binarySearch(int values[], int length, int target) {
  int left = 0;
  int right = length - 1;

  while (left <= right) {
    int mid = left + (right - left) / 2;

    if (values[mid] == target) {
      return mid;
    }

    if (values[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
  },
  {
    language: "C++",
    fileName: "binarySearch.cpp",
    code: `int binarySearch(const vector<int>& values, int target) {
  int left = 0;
  int right = values.size() - 1;

  while (left <= right) {
    int mid = left + (right - left) / 2;

    if (values[mid] == target) {
      return mid;
    }

    if (values[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
  },
  {
    language: "Java",
    fileName: "BinarySearch.java",
    code: `static int binarySearch(int[] values, int target) {
  int left = 0;
  int right = values.length - 1;

  while (left <= right) {
    int mid = left + (right - left) / 2;

    if (values[mid] == target) {
      return mid;
    }

    if (values[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
  },
  {
    language: "Python",
    fileName: "binary_search.py",
    code: `def binary_search(values: list[int], target: int) -> int:
    left = 0
    right = len(values) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if values[mid] == target:
            return mid

        if values[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
  },
  {
    language: "JavaScript",
    fileName: "binarySearch.js",
    code: `function binarySearch(values, target) {
  let left = 0;
  let right = values.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (values[mid] === target) {
      return mid;
    }

    if (values[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
  },
];
