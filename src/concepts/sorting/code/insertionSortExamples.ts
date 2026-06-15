import { insertionSortC } from "./insertionSort.c";
import { insertionSortCpp } from "./insertionSort.cpp";
import { insertionSortJava } from "./insertionSort.java";
import { insertionSortJavaScript } from "./insertionSort.javascript";
import { insertionSortPython } from "./insertionSort.python";
import type { SortingCodeExample } from "./types";

export const insertionSortCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "insertionSort.c",
    code: insertionSortC
  },
  {
    language: "Java",
    fileName: "insertionSort.java",
    code: insertionSortJava
  },
  {
    language: "C++",
    fileName: "insertionSort.cpp",
    code: insertionSortCpp
  },
  {
    language: "JavaScript",
    fileName: "insertionSort.js",
    code: insertionSortJavaScript
  },
  {
    language: "Python",
    fileName: "insertionSort.py",
    code: insertionSortPython
  }
];
