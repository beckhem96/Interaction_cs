import { selectionSortC } from "./selectionSort.c";
import { selectionSortCpp } from "./selectionSort.cpp";
import { selectionSortJava } from "./selectionSort.java";
import { selectionSortJavaScript } from "./selectionSort.javascript";
import { selectionSortPython } from "./selectionSort.python";
import type { SortingCodeExample } from "./types";

export const selectionSortCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "selectionSort.c",
    code: selectionSortC
  },
  {
    language: "Java",
    fileName: "selectionSort.java",
    code: selectionSortJava
  },
  {
    language: "C++",
    fileName: "selectionSort.cpp",
    code: selectionSortCpp
  },
  {
    language: "JavaScript",
    fileName: "selectionSort.js",
    code: selectionSortJavaScript
  },
  {
    language: "Python",
    fileName: "selectionSort.py",
    code: selectionSortPython
  }
];
