import { quickSortC } from "./quickSort.c";
import { quickSortCpp } from "./quickSort.cpp";
import { quickSortJava } from "./quickSort.java";
import { quickSortJavaScript } from "./quickSort.javascript";
import { quickSortPython } from "./quickSort.python";
import type { SortingCodeExample } from "./types";

export const quickSortCodeExamples: SortingCodeExample[] = [
  {
    language: "C",
    fileName: "quickSort.c",
    code: quickSortC
  },
  {
    language: "Java",
    fileName: "quickSort.java",
    code: quickSortJava
  },
  {
    language: "C++",
    fileName: "quickSort.cpp",
    code: quickSortCpp
  },
  {
    language: "JavaScript",
    fileName: "quickSort.js",
    code: quickSortJavaScript
  },
  {
    language: "Python",
    fileName: "quickSort.py",
    code: quickSortPython
  }
];
