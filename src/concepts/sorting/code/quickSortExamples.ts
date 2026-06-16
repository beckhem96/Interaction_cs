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
    language: "C++",
    fileName: "quickSort.cpp",
    code: quickSortCpp
  },
  {
    language: "Java",
    fileName: "quickSort.java",
    code: quickSortJava
  },
  {
    language: "Python",
    fileName: "quickSort.py",
    code: quickSortPython
  },
  {
    language: "JavaScript",
    fileName: "quickSort.js",
    code: quickSortJavaScript
  }
];
