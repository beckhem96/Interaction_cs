export type CodeLanguage = "C" | "C++" | "Java" | "Python" | "JavaScript";

export type SortingCodeExample = {
  language: CodeLanguage;
  fileName: string;
  code: string;
};

export type BubbleSortCodeExample = SortingCodeExample;
