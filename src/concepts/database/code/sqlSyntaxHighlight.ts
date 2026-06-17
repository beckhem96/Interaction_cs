export type SqlTokenType =
  | "plain"
  | "keyword"
  | "function"
  | "string"
  | "number"
  | "identifier"
  | "operator";

export type SqlToken = {
  text: string;
  type: SqlTokenType;
};

const keywords = new Set([
  "AND",
  "AS",
  "ASC",
  "BY",
  "DESC",
  "FROM",
  "GROUP",
  "HAVING",
  "IN",
  "JOIN",
  "LIMIT",
  "ON",
  "ORDER",
  "SELECT",
  "UNION",
  "WHERE",
]);

const functions = new Set(["AVG", "COUNT", "MAX", "MIN", "SUM"]);

const operatorPattern = /^[=<>!+\-*/.,();]$/;

export const tokenizeSqlLine = (line: string): SqlToken[] => {
  const tokens: SqlToken[] = [];
  let index = 0;

  while (index < line.length) {
    const char = line[index];

    if (/\s/.test(char)) {
      const start = index;
      while (index < line.length && /\s/.test(line[index])) {
        index += 1;
      }
      tokens.push({ text: line.slice(start, index), type: "plain" });
      continue;
    }

    if (char === "'") {
      const start = index;
      index += 1;
      while (index < line.length && line[index] !== "'") {
        index += 1;
      }
      if (index < line.length) {
        index += 1;
      }
      tokens.push({ text: line.slice(start, index), type: "string" });
      continue;
    }

    if (/\d/.test(char)) {
      const start = index;
      while (index < line.length && /[\d.]/.test(line[index])) {
        index += 1;
      }
      tokens.push({ text: line.slice(start, index), type: "number" });
      continue;
    }

    if (operatorPattern.test(char)) {
      const next = line[index + 1];
      const maybeDoubleOperator = next && ["=", ">"].includes(next) ? `${char}${next}` : char;
      const isDoubleOperator = ["<=", ">=", "!=", "<>"].includes(maybeDoubleOperator);
      tokens.push({ text: isDoubleOperator ? maybeDoubleOperator : char, type: "operator" });
      index += isDoubleOperator ? 2 : 1;
      continue;
    }

    const start = index;
    while (index < line.length && /[\w$]/.test(line[index])) {
      index += 1;
    }

    if (start === index) {
      tokens.push({ text: char, type: "plain" });
      index += 1;
      continue;
    }

    const word = line.slice(start, index);
    const normalized = word.toUpperCase();

    if (keywords.has(normalized)) {
      tokens.push({ text: word, type: "keyword" });
    } else if (functions.has(normalized)) {
      tokens.push({ text: word, type: "function" });
    } else {
      tokens.push({ text: word, type: "identifier" });
    }
  }

  return tokens;
};
