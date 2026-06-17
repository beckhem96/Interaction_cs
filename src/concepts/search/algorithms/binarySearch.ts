import type { TraceStep } from "../../shared/types";
import type { CodeLanguage } from "../../sorting/code/types";
import type { BinarySearchState } from "../types";

export const BINARY_SEARCH_SUCCESS_INPUT = [
  3, 7, 11, 15, 18, 22, 27, 31, 36, 42, 49, 56, 63, 71,
];

export const BINARY_SEARCH_MISSING_INPUT = [
  2, 5, 9, 14, 20, 25, 30, 34, 39, 45, 51, 58, 66, 74,
];

export function generateBinarySearchTrace(
  input: readonly number[] = BINARY_SEARCH_SUCCESS_INPUT,
  target = 42,
): TraceStep<BinarySearchState>[] {
  const values = [...input].sort((first, second) => first - second);
  const trace: TraceStep<BinarySearchState>[] = [];
  let left = 0;
  let right = values.length - 1;

  trace.push(
    createStep({
      id: "binary-search-init",
      title: "정렬된 배열과 target 준비",
      description:
        "이진 탐색은 정렬된 배열에서 시작합니다. left는 첫 칸, right는 마지막 칸을 가리킵니다.",
      values,
      target,
      left,
      right,
      motion: "init",
      pseudoCodeLine: 1,
      codeKey: "2,3",
      note: "초기 범위",
    }),
  );

  while (left <= right) {
    trace.push(
      createStep({
        id: `binary-search-check-${left}-${right}`,
        title: `${left}~${right} 범위 확인`,
        description:
          "left가 right보다 작거나 같으므로 아직 탐색할 후보 구간이 남아 있습니다.",
        values,
        target,
        left,
        right,
        motion: "check-range",
        pseudoCodeLine: 2,
        codeKey: "5",
        note: "후보 있음",
      }),
    );

    const mid = left + Math.floor((right - left) / 2);
    const midValue = values[mid]!;

    trace.push(
      createStep({
        id: `binary-search-mid-${mid}`,
        title: `가운데 인덱스 ${mid} 선택`,
        description: `현재 후보 구간의 가운데 값을 고릅니다. mid = ${mid}, 값은 ${midValue}입니다.`,
        values,
        target,
        left,
        right,
        mid,
        motion: "choose-mid",
        pseudoCodeLine: 3,
        codeKey: "6",
        note: "mid 계산",
      }),
    );

    trace.push(
      createStep({
        id: `binary-search-compare-${mid}`,
        title: `${midValue}와 target ${target} 비교`,
        description:
          midValue === target
            ? "가운데 값이 target과 같습니다."
            : midValue < target
              ? "가운데 값이 target보다 작습니다. target은 오른쪽 절반에만 있을 수 있습니다."
              : "가운데 값이 target보다 큽니다. target은 왼쪽 절반에만 있을 수 있습니다.",
        values,
        target,
        left,
        right,
        mid,
        motion: "compare",
        pseudoCodeLine: 4,
        codeKey: "8",
        note: getComparisonNote(midValue, target),
      }),
    );

    if (midValue === target) {
      trace.push(
        createStep({
          id: `binary-search-found-${mid}`,
          title: `target 발견: 인덱스 ${mid}`,
          description: `values[${mid}]가 ${target}이므로 탐색을 종료하고 인덱스 ${mid}를 반환합니다.`,
          values,
          target,
          left,
          right,
          mid,
          foundIndex: mid,
          motion: "found",
          pseudoCodeLine: 5,
          codeKey: "9",
          note: "찾음",
        }),
      );
      return trace;
    }

    if (midValue < target) {
      left = mid + 1;
      trace.push(
        createStep({
          id: `binary-search-right-${mid}`,
          title: `오른쪽 절반만 남기기`,
          description: `${midValue}보다 작거나 같은 왼쪽 구간은 모두 버리고 left를 ${left}로 옮깁니다.`,
          values,
          target,
          left,
          right,
          mid,
          motion: "move-right",
          pseudoCodeLine: 6,
          codeKey: "12,13",
          note: "왼쪽 제거",
        }),
      );
    } else {
      right = mid - 1;
      trace.push(
        createStep({
          id: `binary-search-left-${mid}`,
          title: `왼쪽 절반만 남기기`,
          description: `${midValue}보다 크거나 같은 오른쪽 구간은 모두 버리고 right를 ${right}로 옮깁니다.`,
          values,
          target,
          left,
          right,
          mid,
          motion: "move-left",
          pseudoCodeLine: 7,
          codeKey: "14,15",
          note: "오른쪽 제거",
        }),
      );
    }
  }

  trace.push(
    createStep({
      id: "binary-search-not-found",
      title: "target 없음",
      description:
        "left가 right보다 커져 후보 구간이 비었습니다. 배열 안에 target이 없으므로 -1을 반환합니다.",
      values,
      target,
      left,
      right,
      motion: "not-found",
      pseudoCodeLine: 8,
      codeKey: "19",
      note: "후보 없음",
    }),
  );

  return trace;
}

function createStep({
  codeKey,
  description,
  foundIndex,
  id,
  left,
  mid,
  motion,
  note,
  pseudoCodeLine,
  right,
  target,
  title,
  values,
}: {
  codeKey: string;
  description: string;
  foundIndex?: number;
  id: string;
  left: number;
  mid?: number;
  motion: BinarySearchState["motion"];
  note: string;
  pseudoCodeLine: number;
  right: number;
  target: number;
  title: string;
  values: readonly number[];
}): TraceStep<BinarySearchState> {
  const activeRange: [number, number] | undefined =
    left <= right ? [left, right] : undefined;
  const discardedIndices = values
    .map((_, index) => index)
    .filter((index) => index < left || index > right);
  const candidateCount = activeRange === undefined ? 0 : right - left + 1;

  return {
    id,
    title,
    description,
    state: {
      values: [...values],
      target,
      left,
      right,
      mid,
      foundIndex,
      discardedIndices,
      activeRange,
      motion,
      summaryItems: [
        { label: "target", value: String(target) },
        { label: "left", value: formatPointer(left, values.length) },
        { label: "mid", value: mid === undefined ? "-" : `${mid}번 (${values[mid]})` },
        { label: "right", value: formatPointer(right, values.length) },
        { label: "후보", value: `${candidateCount}개` },
        { label: "판정", value: note },
      ],
    },
    pseudoCodeLine,
    codeLineHighlights: createLanguageHighlights(codeKey),
  };
}

function formatPointer(index: number, length: number): string {
  if (index < 0 || index >= length) {
    return "범위 밖";
  }

  return `${index}번`;
}

function getComparisonNote(value: number, target: number): string {
  if (value === target) {
    return "같음";
  }

  return value < target ? "작음" : "큼";
}

const highlightByCodeKey: Record<string, Record<CodeLanguage, number[]>> = {
  "2,3": sameLines(2, 3),
  "5": sameLines(5),
  "6": sameLines(6),
  "8": sameLines(8),
  "9": sameLines(9),
  "12,13": {
    C: [12, 13],
    "C++": [12, 13],
    Java: [12, 13],
    Python: [11, 12],
    JavaScript: [12, 13],
  },
  "14,15": {
    C: [14, 15],
    "C++": [14, 15],
    Java: [14, 15],
    Python: [13, 14],
    JavaScript: [14, 15],
  },
  "19": {
    C: [19],
    "C++": [19],
    Java: [19],
    Python: [16],
    JavaScript: [19],
  },
};

function createLanguageHighlights(codeKey: string): Record<CodeLanguage, number[]> {
  return highlightByCodeKey[codeKey] ?? sameLines(1);
}

function sameLines(...lines: number[]): Record<CodeLanguage, number[]> {
  return {
    C: lines,
    "C++": lines,
    Java: lines,
    Python: lines,
    JavaScript: lines,
  };
}
