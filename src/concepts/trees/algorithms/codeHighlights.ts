import type { CodeLanguage } from "../../sorting/code/types";

export function createTreeCodeHighlights(
  codeLines: number[]
): Record<CodeLanguage, number[]> {
  return {
    C: codeLines,
    "C++": codeLines,
    Java: codeLines,
    Python: codeLines,
    JavaScript: codeLines
  };
}
