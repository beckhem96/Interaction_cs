import type { SortingCodeExample } from "./types";

export type CodeTokenType =
  | "plain"
  | "keyword"
  | "builtin"
  | "string"
  | "number"
  | "comment"
  | "operator";

export type CodeToken = {
  text: string;
  type: CodeTokenType;
};

const cLikeKeywords = new Set([
  "class",
  "const",
  "else",
  "export",
  "for",
  "function",
  "if",
  "include",
  "int",
  "let",
  "return",
  "static",
  "using",
  "void",
  "while"
]);

const pythonKeywords = new Set([
  "def",
  "else",
  "for",
  "if",
  "in",
  "is",
  "None",
  "return",
  "while"
]);

const builtinsByLanguage: Record<SortingCodeExample["language"], Set<string>> = {
  C: new Set(["printf", "scanf"]),
  Java: new Set(["System", "Math"]),
  "C++": new Set(["vector", "swap"]),
  JavaScript: new Set(["Math", "floor", "length"]),
  Python: new Set(["len", "list", "range"])
};

export function tokenizeCodeLine(
  language: SortingCodeExample["language"],
  line: string
): CodeToken[] {
  const tokens: CodeToken[] = [];
  let index = 0;

  while (index < line.length) {
    const rest = line.slice(index);

    if (language === "Python" && rest.startsWith("#")) {
      tokens.push({ text: rest, type: "comment" });
      break;
    }

    if (language !== "Python" && rest.startsWith("//")) {
      tokens.push({ text: rest, type: "comment" });
      break;
    }

    if (language !== "Python" && rest.startsWith("#include")) {
      tokens.push({ text: "#include", type: "keyword" });
      index += "#include".length;
      continue;
    }

    const stringMatch = rest.match(/^(['"])(?:\\.|(?!\1).)*\1/);
    if (stringMatch?.[0]) {
      tokens.push({ text: stringMatch[0], type: "string" });
      index += stringMatch[0].length;
      continue;
    }

    const numberMatch = rest.match(/^\d+/);
    if (numberMatch?.[0]) {
      tokens.push({ text: numberMatch[0], type: "number" });
      index += numberMatch[0].length;
      continue;
    }

    const wordMatch = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (wordMatch?.[0]) {
      const word = wordMatch[0];
      tokens.push({
        text: word,
        type: getWordTokenType(language, word)
      });
      index += word.length;
      continue;
    }

    const operatorMatch = rest.match(/^(<=|>=|==|!=|\+\+|--|\+=|-=|&&|\|\||[+\-*/%=<>!&|[\]{}().,:;])/);
    if (operatorMatch?.[0]) {
      tokens.push({ text: operatorMatch[0], type: "operator" });
      index += operatorMatch[0].length;
      continue;
    }

    tokens.push({ text: line[index]!, type: "plain" });
    index += 1;
  }

  return tokens.length > 0 ? tokens : [{ text: " ", type: "plain" }];
}

function getWordTokenType(
  language: SortingCodeExample["language"],
  word: string
): CodeTokenType {
  if (builtinsByLanguage[language].has(word)) {
    return "builtin";
  }

  if (language === "Python") {
    return pythonKeywords.has(word) ? "keyword" : "plain";
  }

  return cLikeKeywords.has(word) ? "keyword" : "plain";
}
