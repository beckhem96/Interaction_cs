import { mergeSortC } from "./mergeSort.c";
import { mergeSortCpp } from "./mergeSort.cpp";
import { mergeSortJava } from "./mergeSort.java";
import { mergeSortJavaScript } from "./mergeSort.javascript";
import { mergeSortPython } from "./mergeSort.python";
import type { SortingCodeExample } from "./types";

export const mergeSortCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "mergeSort.c",
    code: mergeSortC
  },
  {
    language: "C++",
    fileName: "mergeSort.cpp",
    code: mergeSortCpp
  },
  {
    language: "Java",
    fileName: "mergeSort.java",
    code: mergeSortJava
  },
  {
    language: "Python",
    fileName: "mergeSort.py",
    code: mergeSortPython
  },
  {
    language: "JavaScript",
    fileName: "mergeSort.js",
    code: mergeSortJavaScript
  }
];
