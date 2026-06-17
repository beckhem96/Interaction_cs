import type { CodeLanguage } from "../../sorting/code/types";

export type TreeCodeHighlightMap = Partial<
  Record<string, Partial<Record<CodeLanguage, number[]>>>
>;

export function createTreeCodeHighlights(
  codeLines: number[],
  languageLineMap: TreeCodeHighlightMap = {}
): Record<CodeLanguage, number[]> {
  const baseHighlights: Record<CodeLanguage, number[]> = {
    C: codeLines,
    "C++": codeLines,
    Java: codeLines,
    Python: codeLines,
    JavaScript: codeLines,
  };

  return {
    ...baseHighlights,
    ...languageLineMap[codeLines.join(",")],
  };
}
