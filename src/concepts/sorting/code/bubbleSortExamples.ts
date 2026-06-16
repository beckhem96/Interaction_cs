import { bubbleSortC } from "./bubbleSort.c";
import { bubbleSortCpp } from "./bubbleSort.cpp";
import { bubbleSortJava } from "./bubbleSort.java";
import { bubbleSortJavaScript } from "./bubbleSort.javascript";
import { bubbleSortPython } from "./bubbleSort.python";
import type { BubbleSortCodeExample } from "./types";

export const bubbleSortCodeExamples: BubbleSortCodeExample[] = [
  {
    language: "C",
    fileName: "bubbleSort.c",
    code: bubbleSortC
  },
  {
    language: "C++",
    fileName: "bubbleSort.cpp",
    code: bubbleSortCpp
  },
  {
    language: "Java",
    fileName: "bubbleSort.java",
    code: bubbleSortJava
  },
  {
    language: "Python",
    fileName: "bubbleSort.py",
    code: bubbleSortPython
  },
  {
    language: "JavaScript",
    fileName: "bubbleSort.js",
    code: bubbleSortJavaScript
  }
];
