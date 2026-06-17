const supportedLanguages = ["C", "C++", "Java", "Python", "JavaScript"] as const;

export const sameLineHighlights = (...lines: number[]): Record<string, number[]> =>
  Object.fromEntries(supportedLanguages.map((language) => [language, lines]));
