import type { TraceStep } from "../../shared/types";
import type { SortingState } from "../types";
import { sameLineHighlights } from "./codeLineMaps";

export const BUBBLE_SORT_DEFAULT_INPUT = [
  14, 3, 17, 8, 6, 12, 1, 19, 4, 10
] as const;

const codeLineHighlights = {
  initial: {
    C: [3],
    Java: [2],
    "C++": [4],
    JavaScript: [1, 2],
    Python: [1, 2]
  },
  outerLoop: {
    C: [4],
    Java: [3],
    "C++": [5],
    JavaScript: [4],
    Python: [4]
  },
  compare: {
    C: [6],
    Java: [5],
    "C++": [7],
    JavaScript: [6],
    Python: [6]
  },
  swap: {
    C: [7, 8, 9],
    Java: [6, 7, 8],
    "C++": [8, 9, 10],
    JavaScript: [7, 8, 9],
    Python: [7]
  },
  complete: {
    C: [13],
    Java: [12],
    "C++": [14],
    JavaScript: [14],
    Python: [9]
  }
} satisfies Record<string, Record<string, number[]>>;

const earlyExitCodeLineHighlights = {
  initial: sameLineHighlights(1),
  outerLoop: sameLineHighlights(2, 3),
  compare: sameLineHighlights(5, 6),
  swap: sameLineHighlights(6, 7, 8),
  earlyExit: sameLineHighlights(10),
  complete: sameLineHighlights(11),
};

const cocktailCodeLineHighlights = {
  initial: sameLineHighlights(1, 2),
  forward: sameLineHighlights(4),
  settleRight: sameLineHighlights(5),
  backward: sameLineHighlights(6),
  settleLeft: sameLineHighlights(7),
  complete: sameLineHighlights(8),
};

export function generateBubbleSortTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "bubble-initial",
      title: "초기 배열",
      description: "아직 정렬되지 않은 배열에서 버블 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: []
      },
      pseudoCodeLine: 1,
      codeLineHighlights: codeLineHighlights.initial
    }
  ];

  let stepIndex = 1;

  for (let end = array.length - 1; end > 0; end -= 1) {
    for (let index = 0; index < end; index += 1) {
      const left = array[index];
      const right = array[index + 1];
      const settledIndices = range(end + 1, array.length);

      trace.push({
        id: `bubble-${stepIndex++}-compare-${index}-${index + 1}`,
        title: `${left}와 ${right} 비교`,
        description: `${left}와 ${right}를 비교합니다. 왼쪽 값이 더 크면 두 값을 교환합니다.`,
        state: {
          array: [...array],
          comparingIndices: [index, index + 1],
          sortedIndices: settledIndices
        },
        pseudoCodeLine: 3,
        codeLineHighlights: codeLineHighlights.compare
      });

      if (left > right) {
        array[index] = right;
        array[index + 1] = left;

        trace.push({
          id: `bubble-${stepIndex++}-swap-${index}-${index + 1}`,
          title: `${left}와 ${right} 교환`,
          description: `${left}가 ${right}보다 크므로 두 값을 교환합니다.`,
          state: {
            array: [...array],
            swappingIndices: [index, index + 1],
            sortedIndices: settledIndices
          },
          pseudoCodeLine: 5,
          codeLineHighlights: codeLineHighlights.swap
        });
      } else {
        trace.push({
          id: `bubble-${stepIndex++}-keep-${index}-${index + 1}`,
          title: `${left}와 ${right} 유지`,
          description: `${left}가 ${right}보다 작거나 같으므로 순서를 유지합니다.`,
          state: {
            array: [...array],
            comparingIndices: [index, index + 1],
            sortedIndices: settledIndices
          },
          pseudoCodeLine: 4,
          codeLineHighlights: codeLineHighlights.compare
        });
      }
    }

    trace.push({
      id: `bubble-${stepIndex++}-settled-${end}`,
      title: `${array[end]} 위치 확정`,
      description: `이번 반복에서 가장 큰 값 ${array[end]}가 정렬된 구간에 들어갔습니다.`,
      state: {
        array: [...array],
        sortedIndices: range(end, array.length)
      },
      pseudoCodeLine: 7,
      codeLineHighlights: codeLineHighlights.outerLoop
    });
  }

  trace.push({
    id: "bubble-complete",
    title: "정렬 완료",
    description: "모든 값이 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length)
    },
    pseudoCodeLine: 8,
    codeLineHighlights: codeLineHighlights.complete
  });

  return trace;
}

export function generateBubbleSortEarlyExitTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "bubble-early-initial",
      title: "초기 배열",
      description: "교환이 더 이상 일어나지 않으면 즉시 멈추는 버블 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: [],
      },
      pseudoCodeLine: 1,
      codeLineHighlights: earlyExitCodeLineHighlights.initial,
    },
  ];

  let stepIndex = 1;

  for (let end = array.length - 1; end > 0; end -= 1) {
    let swapped = false;

    trace.push({
      id: `bubble-early-${stepIndex++}-pass-${end}`,
      title: `${end}번까지 새 패스 시작`,
      description: "이번 패스에서 교환이 한 번도 없으면 배열이 이미 정렬된 것으로 판단합니다.",
      state: {
        array: [...array],
        currentIndex: 0,
        sortedIndices: range(end + 1, array.length),
      },
      pseudoCodeLine: 2,
      codeLineHighlights: earlyExitCodeLineHighlights.outerLoop,
    });

    for (let index = 0; index < end; index += 1) {
      const left = array[index]!;
      const right = array[index + 1]!;
      const settledIndices = range(end + 1, array.length);

      trace.push({
        id: `bubble-early-${stepIndex++}-compare-${index}-${index + 1}`,
        title: `${left}와 ${right} 비교`,
        description: "인접한 두 값을 비교하고 필요하면 교환합니다.",
        state: {
          array: [...array],
          comparingIndices: [index, index + 1],
          sortedIndices: settledIndices,
        },
        pseudoCodeLine: 3,
        codeLineHighlights: earlyExitCodeLineHighlights.compare,
      });

      if (left > right) {
        array[index] = right;
        array[index + 1] = left;
        swapped = true;

        trace.push({
          id: `bubble-early-${stepIndex++}-swap-${index}-${index + 1}`,
          title: `${left}와 ${right} 교환`,
          description: "교환이 발생했으므로 다음 패스도 계속 확인해야 합니다.",
          state: {
            array: [...array],
            swappingIndices: [index, index + 1],
            sortedIndices: settledIndices,
          },
          pseudoCodeLine: 5,
          codeLineHighlights: earlyExitCodeLineHighlights.swap,
        });
      }
    }

    trace.push({
      id: `bubble-early-${stepIndex++}-settled-${end}`,
      title: `${array[end]} 위치 확정`,
      description: "이번 패스에서 가장 큰 값이 오른쪽 정렬 완료 구간에 들어갔습니다.",
      state: {
        array: [...array],
        sortedIndices: range(end, array.length),
      },
      pseudoCodeLine: 7,
      codeLineHighlights: earlyExitCodeLineHighlights.outerLoop,
    });

    if (!swapped) {
      trace.push({
        id: `bubble-early-${stepIndex++}-stop-${end}`,
        title: "교환 없음, 조기 종료",
        description: "한 패스 동안 교환이 없었으므로 남은 배열은 이미 정렬되어 있습니다.",
        state: {
          array: [...array],
          sortedIndices: range(0, array.length),
        },
        pseudoCodeLine: 8,
        codeLineHighlights: earlyExitCodeLineHighlights.earlyExit,
      });
      break;
    }
  }

  trace.push({
    id: "bubble-early-complete",
    title: "정렬 완료",
    description: "조기 종료 조건을 이용해 배열 전체가 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length),
    },
    pseudoCodeLine: 8,
    codeLineHighlights: earlyExitCodeLineHighlights.complete,
  });

  return trace;
}

export function generateCocktailSortTrace(
  input: readonly number[]
): TraceStep<SortingState>[] {
  const array = [...input];
  const trace: TraceStep<SortingState>[] = [
    {
      id: "cocktail-initial",
      title: "초기 배열",
      description: "왼쪽에서 오른쪽, 오른쪽에서 왼쪽으로 번갈아 훑는 칵테일 셰이커 정렬을 시작합니다.",
      state: {
        array: [...array],
        sortedIndices: [],
      },
      pseudoCodeLine: 1,
      codeLineHighlights: cocktailCodeLineHighlights.initial,
    },
  ];

  let start = 0;
  let end = array.length - 1;
  let stepIndex = 1;

  while (start < end) {
    for (let index = start; index < end; index += 1) {
      const left = array[index]!;
      const right = array[index + 1]!;

      trace.push({
        id: `cocktail-${stepIndex++}-forward-compare-${index}`,
        title: `오른쪽 방향: ${left}와 ${right} 비교`,
        description: "왼쪽에서 오른쪽으로 진행하며 큰 값을 오른쪽 끝으로 밀어냅니다.",
        state: {
          array: [...array],
          comparingIndices: [index, index + 1],
          currentIndex: index,
          sortedIndices: [...range(0, start), ...range(end + 1, array.length)],
        },
        pseudoCodeLine: 3,
        codeLineHighlights: cocktailCodeLineHighlights.forward,
      });

      if (left > right) {
        array[index] = right;
        array[index + 1] = left;
        trace.push({
          id: `cocktail-${stepIndex++}-forward-swap-${index}`,
          title: `${left}와 ${right} 교환`,
          description: "큰 값이 오른쪽으로 이동합니다.",
          state: {
            array: [...array],
            swappingIndices: [index, index + 1],
            sortedIndices: [...range(0, start), ...range(end + 1, array.length)],
          },
          pseudoCodeLine: 3,
          codeLineHighlights: cocktailCodeLineHighlights.forward,
        });
      }
    }

    trace.push({
      id: `cocktail-${stepIndex++}-settle-right-${end}`,
      title: `${array[end]} 오른쪽 위치 확정`,
      description: "오른쪽 방향 패스가 끝나 가장 큰 값이 오른쪽에 확정됩니다.",
      state: {
        array: [...array],
        sortedIndices: [...range(0, start), ...range(end, array.length)],
      },
      pseudoCodeLine: 4,
      codeLineHighlights: cocktailCodeLineHighlights.settleRight,
    });
    end -= 1;

    for (let index = end; index > start; index -= 1) {
      const left = array[index - 1]!;
      const right = array[index]!;

      trace.push({
        id: `cocktail-${stepIndex++}-backward-compare-${index}`,
        title: `왼쪽 방향: ${left}와 ${right} 비교`,
        description: "오른쪽에서 왼쪽으로 진행하며 작은 값을 왼쪽 끝으로 밀어냅니다.",
        state: {
          array: [...array],
          comparingIndices: [index - 1, index],
          currentIndex: index,
          sortedIndices: [...range(0, start), ...range(end + 1, array.length)],
        },
        pseudoCodeLine: 5,
        codeLineHighlights: cocktailCodeLineHighlights.backward,
      });

      if (left > right) {
        array[index - 1] = right;
        array[index] = left;
        trace.push({
          id: `cocktail-${stepIndex++}-backward-swap-${index}`,
          title: `${left}와 ${right} 교환`,
          description: "작은 값이 왼쪽으로 이동합니다.",
          state: {
            array: [...array],
            swappingIndices: [index - 1, index],
            sortedIndices: [...range(0, start), ...range(end + 1, array.length)],
          },
          pseudoCodeLine: 5,
          codeLineHighlights: cocktailCodeLineHighlights.backward,
        });
      }
    }

    trace.push({
      id: `cocktail-${stepIndex++}-settle-left-${start}`,
      title: `${array[start]} 왼쪽 위치 확정`,
      description: "왼쪽 방향 패스가 끝나 가장 작은 값이 왼쪽에 확정됩니다.",
      state: {
        array: [...array],
        sortedIndices: [...range(0, start + 1), ...range(end + 1, array.length)],
      },
      pseudoCodeLine: 6,
      codeLineHighlights: cocktailCodeLineHighlights.settleLeft,
    });
    start += 1;
  }

  trace.push({
    id: "cocktail-complete",
    title: "정렬 완료",
    description: "양방향 패스를 반복해 배열 전체가 오름차순으로 정렬되었습니다.",
    state: {
      array: [...array],
      sortedIndices: range(0, array.length),
    },
    pseudoCodeLine: 8,
    codeLineHighlights: cocktailCodeLineHighlights.complete,
  });

  return trace;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start, 0) }, (_, index) => {
    return start + index;
  });
}
