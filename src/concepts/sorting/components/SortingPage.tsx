import { type CSSProperties, useMemo, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import type { SortingState } from "../types";
import {
  BUBBLE_SORT_DEFAULT_INPUT,
  generateBubbleSortEarlyExitTrace,
  generateBubbleSortTrace
} from "../algorithms/bubbleSort";
import { generateCocktailSortTrace } from "../algorithms/bubbleSort";
import {
  HEAP_SORT_DEFAULT_INPUT,
  generateHeapSortTrace
} from "../algorithms/heapSort";
import {
  INSERTION_SORT_DEFAULT_INPUT,
  generateBinaryInsertionSortTrace,
  generateInsertionSortTrace
} from "../algorithms/insertionSort";
import {
  MERGE_SORT_DEFAULT_INPUT,
  generateMergeSortBottomUpTrace,
  generateMergeSortTrace
} from "../algorithms/mergeSort";
import {
  QUICK_SORT_DEFAULT_INPUT,
  generateQuickSortTrace
} from "../algorithms/quickSort";
import {
  SELECTION_SORT_DEFAULT_INPUT,
  generateSelectionSortBidirectionalTrace,
  generateSelectionSortMaxTrace,
  generateSelectionSortTrace
} from "../algorithms/selectionSort";
import { bubbleSortCodeExamples } from "../code/bubbleSortExamples";
import { insertionSortCodeExamples } from "../code/insertionSortExamples";
import { mergeSortCodeExamples } from "../code/mergeSortExamples";
import { quickSortCodeExamples } from "../code/quickSortExamples";
import { selectionSortCodeExamples } from "../code/selectionSortExamples";
import {
  binaryInsertionSortCodeExamples,
  bubbleSortEarlyExitCodeExamples,
  cocktailSortCodeExamples,
  heapSortFloydCodeExamples,
  heapSortInsertionBuildCodeExamples,
  mergeSortBottomUpCodeExamples,
  quickSortFirstPivotCodeExamples,
  quickSortMedianPivotCodeExamples,
  selectionSortBidirectionalCodeExamples,
  selectionSortMaxCodeExamples
} from "../code/sortingVariantExamples";
import { tokenizeCodeLine } from "../code/syntaxHighlight";
import type { SortingCodeExample } from "../code/types";
import { SortingBars } from "./SortingBars";

type SortingTraceGenerator = (input: readonly number[]) => ReturnType<typeof generateBubbleSortTrace>;

type SortingVariant = {
  id: string;
  label: string;
  summary: string;
  generateTrace: SortingTraceGenerator;
  codeExamples: SortingCodeExample[];
  timeComplexity: string;
  spaceComplexity: string;
  pseudoCode: string[];
  observation: string;
};

type SortingAlgorithmBase = Omit<SortingVariant, "label"> & {
  defaultInput: readonly number[];
  title: string;
};

type SortingAlgorithm = SortingAlgorithmBase & {
  variants: SortingVariant[];
};

const baseSortingAlgorithms: SortingAlgorithmBase[] = [
  {
    id: "bubble",
    title: "버블 정렬",
    summary:
      "인접한 두 값을 비교하고 필요한 경우 교환하면서 큰 값을 오른쪽으로 밀어내는 정렬 방식입니다.",
    defaultInput: BUBBLE_SORT_DEFAULT_INPUT,
    generateTrace: generateBubbleSortTrace,
    codeExamples: bubbleSortCodeExamples,
    timeComplexity: "시간 복잡도 O(n²)",
    spaceComplexity: "공간 복잡도 O(1)",
    pseudoCode: [
      "배열을 준비한다.",
      "끝 위치를 왼쪽으로 줄이며 반복한다.",
      "인접한 두 값을 비교한다.",
      "왼쪽 값이 작거나 같으면 유지한다.",
      "왼쪽 값이 크면 교환한다.",
      "다음 인접 쌍으로 이동한다.",
      "가장 큰 값의 위치를 확정한다.",
      "모든 위치가 확정되면 종료한다."
    ],
    observation: "비교, 교환, 정렬 완료 구간이 어떻게 바뀌는지 확인합니다."
  },
  {
    id: "selection",
    title: "선택 정렬",
    summary:
      "정렬되지 않은 구간에서 가장 작은 값을 찾아 현재 위치로 옮기는 정렬 방식입니다.",
    defaultInput: SELECTION_SORT_DEFAULT_INPUT,
    generateTrace: generateSelectionSortTrace,
    codeExamples: selectionSortCodeExamples,
    timeComplexity: "시간 복잡도 O(n²)",
    spaceComplexity: "공간 복잡도 O(1)",
    pseudoCode: [
      "배열을 준비한다.",
      "현재 위치를 최소값 위치로 가정한다.",
      "남은 구간을 왼쪽에서 오른쪽으로 훑는다.",
      "남은 구간에서 더 작은 값을 찾는다.",
      "더 작은 값이면 최소값 위치를 갱신한다.",
      "현재 위치와 최소값 위치를 교환한다.",
      "현재 위치를 정렬 완료 구간에 포함한다.",
      "모든 위치가 확정되면 종료한다."
    ],
    observation: "현재 위치, 최소값 위치, 탐색 위치가 어떻게 바뀌는지 확인합니다."
  },
  {
    id: "insertion",
    title: "삽입 정렬",
    summary:
      "왼쪽의 정렬된 구간에 key 값을 알맞은 위치로 끼워 넣는 정렬 방식입니다.",
    defaultInput: INSERTION_SORT_DEFAULT_INPUT,
    generateTrace: generateInsertionSortTrace,
    codeExamples: insertionSortCodeExamples,
    timeComplexity: "시간 복잡도 최선 O(n), 평균/최악 O(n²)",
    spaceComplexity: "공간 복잡도 O(1)",
    pseudoCode: [
      "첫 번째 값을 정렬된 구간으로 둔다.",
      "다음 값을 key로 선택한다.",
      "key 왼쪽의 정렬된 구간을 거꾸로 훑는다.",
      "정렬된 구간에서 key보다 큰 값을 찾는다.",
      "key보다 큰 값을 오른쪽으로 이동한다.",
      "빈 위치에 key를 삽입한다.",
      "정렬된 구간을 한 칸 넓힌다.",
      "모든 값을 삽입하면 종료한다."
    ],
    observation: "key 값, 비교 위치, 오른쪽으로 밀린 값이 어떻게 바뀌는지 확인합니다."
  },
  {
    id: "merge",
    title: "병합 정렬",
    summary:
      "배열을 절반으로 나눈 뒤 정렬된 부분 배열을 다시 합치며 정렬하는 방식입니다.",
    defaultInput: MERGE_SORT_DEFAULT_INPUT,
    generateTrace: generateMergeSortTrace,
    codeExamples: mergeSortCodeExamples,
    timeComplexity: "시간 복잡도 O(n log n)",
    spaceComplexity: "공간 복잡도 O(n)",
    pseudoCode: [
      "배열을 준비한다.",
      "배열을 절반으로 나눈다.",
      "한 칸짜리 구간이 될 때까지 분할한다.",
      "두 정렬된 구간의 앞 값을 비교한다.",
      "더 작은 값을 결과 위치에 기록한다.",
      "남은 값을 순서대로 기록한다.",
      "병합된 구간을 확정한다.",
      "전체 구간이 병합되면 종료한다."
    ],
    observation: "분할 구간, 좌우 부분 배열, 기록 위치가 어떻게 바뀌는지 확인합니다."
  },
  {
    id: "quick",
    title: "퀵 정렬",
    summary:
      "피벗을 기준으로 작은 값과 큰 값을 나누고, 각 구간을 재귀적으로 정렬하는 방식입니다.",
    defaultInput: QUICK_SORT_DEFAULT_INPUT,
    generateTrace: generateQuickSortTrace,
    codeExamples: quickSortCodeExamples,
    timeComplexity: "시간 복잡도 평균 O(n log n), 최악 O(n²)",
    spaceComplexity: "공간 복잡도 평균 O(log n)",
    pseudoCode: [
      "배열을 준비한다.",
      "구간의 마지막 값을 피벗으로 선택한다.",
      "피벗보다 작은 값이 들어갈 경계를 둔다.",
      "현재 값을 피벗과 비교한다.",
      "피벗보다 작거나 같으면 왼쪽 구간으로 옮긴다.",
      "피벗을 경계 위치에 배치한다.",
      "피벗 양쪽 구간을 재귀적으로 정렬한다.",
      "모든 피벗 위치가 확정되면 종료한다."
    ],
    observation: "피벗, 파티션 구간, 작은 값 경계가 어떻게 이동하는지 확인합니다."
  }
];

const sortingAlgorithms: SortingAlgorithm[] = [
  ...baseSortingAlgorithms.map((algorithm): SortingAlgorithm => {
    if (algorithm.id === "bubble") {
      return {
        ...algorithm,
        variants: [
          createVariant(algorithm, {
            id: "basic",
            label: "기본",
          }),
          createVariant(algorithm, {
            id: "early-exit",
            label: "조기 종료",
            summary:
              "한 패스 동안 교환이 한 번도 없으면 남은 배열이 이미 정렬되었다고 보고 멈춥니다.",
            generateTrace: generateBubbleSortEarlyExitTrace,
            codeExamples: bubbleSortEarlyExitCodeExamples,
            pseudoCode: [
              "배열을 준비한다.",
              "오른쪽 끝을 줄이며 패스를 시작한다.",
              "인접한 두 값을 비교한다.",
              "순서가 맞으면 그대로 둔다.",
              "순서가 틀리면 교환하고 swapped를 표시한다.",
              "패스가 끝나면 가장 큰 값의 위치를 확정한다.",
              "교환이 없으면 조기 종료한다.",
              "모든 위치가 정렬되면 종료한다."
            ],
            observation: "교환이 사라지는 순간과 조기 종료 시점이 어떻게 연결되는지 확인합니다."
          }),
          createVariant(algorithm, {
            id: "cocktail",
            label: "칵테일",
            summary:
              "왼쪽에서 오른쪽, 오른쪽에서 왼쪽으로 번갈아 훑어 양쪽 끝을 함께 확정합니다.",
            generateTrace: generateCocktailSortTrace,
            codeExamples: cocktailSortCodeExamples,
            pseudoCode: [
              "배열을 준비한다.",
              "왼쪽 경계와 오른쪽 경계를 둔다.",
              "왼쪽에서 오른쪽으로 비교하며 큰 값을 보낸다.",
              "오른쪽 끝 값을 확정한다.",
              "오른쪽에서 왼쪽으로 비교하며 작은 값을 보낸다.",
              "왼쪽 끝 값을 확정한다.",
              "양쪽 경계를 좁힌다.",
              "모든 위치가 정렬되면 종료한다."
            ],
            observation: "큰 값과 작은 값이 한 라운드에서 양쪽 끝으로 움직이는 과정을 확인합니다."
          })
        ]
      };
    }

    if (algorithm.id === "selection") {
      return {
        ...algorithm,
        variants: [
          createVariant(algorithm, {
            id: "minimum",
            label: "최소값",
          }),
          createVariant(algorithm, {
            id: "maximum",
            label: "최대값",
            summary:
              "남은 구간에서 가장 큰 값을 찾아 오른쪽 끝부터 정렬 완료 구간을 만듭니다.",
            generateTrace: generateSelectionSortMaxTrace,
            codeExamples: selectionSortMaxCodeExamples,
            pseudoCode: [
              "배열을 준비한다.",
              "정렬되지 않은 구간의 오른쪽 끝을 목표로 둔다.",
              "구간 안에서 최대값 후보를 잡는다.",
              "탐색 위치의 값과 현재 최대값을 비교한다.",
              "더 큰 값을 찾으면 최대값 위치를 갱신한다.",
              "최대값을 오른쪽 끝과 교환한다.",
              "오른쪽 정렬 완료 구간을 넓힌다.",
              "모든 위치가 정렬되면 종료한다."
            ],
            observation: "최소값 선택과 반대로 오른쪽에서 정렬 완료 구간이 커지는 모습을 확인합니다."
          }),
          createVariant(algorithm, {
            id: "bidirectional",
            label: "양방향",
            summary:
              "한 패스에서 최소값과 최대값을 모두 찾아 왼쪽과 오른쪽 끝을 동시에 확정합니다.",
            generateTrace: generateSelectionSortBidirectionalTrace,
            codeExamples: selectionSortBidirectionalCodeExamples,
            pseudoCode: [
              "배열을 준비한다.",
              "남은 구간의 왼쪽과 오른쪽 경계를 둔다.",
              "구간을 훑으며 최소값과 최대값 후보를 함께 갱신한다.",
              "최소값을 왼쪽 경계와 교환한다.",
              "최대값을 오른쪽 경계와 교환한다.",
              "양쪽 정렬 완료 구간을 넓힌다."
            ],
            observation: "한 번의 탐색으로 양쪽 끝이 동시에 확정되는 흐름을 확인합니다."
          })
        ]
      };
    }

    if (algorithm.id === "insertion") {
      return {
        ...algorithm,
        variants: [
          createVariant(algorithm, {
            id: "linear",
            label: "선형",
          }),
          createVariant(algorithm, {
            id: "binary",
            label: "이진 삽입",
            summary:
              "왼쪽 정렬 구간에서 삽입 위치를 이진 탐색으로 찾은 뒤 값을 오른쪽으로 밀어 넣습니다.",
            generateTrace: generateBinaryInsertionSortTrace,
            codeExamples: binaryInsertionSortCodeExamples,
            pseudoCode: [
              "첫 번째 값을 정렬된 구간으로 둔다.",
              "다음 값을 key로 선택한다.",
              "정렬된 구간에서 이진 탐색으로 삽입 위치를 찾는다.",
              "탐색 구간을 절반으로 줄인다.",
              "삽입 위치를 비우기 위해 값을 오른쪽으로 이동한다.",
              "빈 위치에 key를 넣는다.",
              "모든 값을 삽입하면 종료한다."
            ],
            observation: "비교 위치가 절반씩 줄어들고, 실제 이동은 삽입 시점에 몰아서 일어나는 점을 확인합니다."
          })
        ]
      };
    }

    if (algorithm.id === "merge") {
      return {
        ...algorithm,
        variants: [
          createVariant(algorithm, {
            id: "top-down",
            label: "Top-down",
          }),
          createVariant(algorithm, {
            id: "bottom-up",
            label: "Bottom-up",
            summary:
              "한 칸짜리 구간부터 시작해 병합 폭을 1, 2, 4처럼 키우는 반복형 병합 정렬입니다.",
            generateTrace: generateMergeSortBottomUpTrace,
            codeExamples: mergeSortBottomUpCodeExamples,
            pseudoCode: [
              "배열을 한 칸짜리 정렬 구간으로 본다.",
              "현재 병합 폭을 정한다.",
              "인접한 두 구간을 선택한다.",
              "두 구간의 앞 값을 비교한다.",
              "작은 값을 결과 위치에 기록한다.",
              "선택한 두 구간의 병합을 완료한다.",
              "폭이 배열 전체를 덮으면 종료한다."
            ],
            observation: "재귀 호출 없이 병합 폭이 커지는 순서를 확인합니다."
          })
        ]
      };
    }

    if (algorithm.id === "quick") {
      return {
        ...algorithm,
        variants: [
          createVariant(algorithm, {
            id: "last-pivot",
            label: "마지막 피벗",
          }),
          createVariant(algorithm, {
            id: "first-pivot",
            label: "첫 피벗",
            summary:
              "구간의 첫 번째 값을 피벗으로 고른 뒤 파티션 끝으로 옮겨 같은 Lomuto 흐름으로 나눕니다.",
            generateTrace: (input) => generateQuickSortTrace(input, "first"),
            codeExamples: quickSortFirstPivotCodeExamples,
            pseudoCode: [
              "배열을 준비한다.",
              "구간의 첫 값을 피벗으로 선택한다.",
              "피벗보다 작은 값이 들어갈 경계를 둔다.",
              "현재 값을 피벗과 비교한다.",
              "피벗보다 작거나 같으면 왼쪽 구간으로 옮긴다.",
              "피벗을 경계 위치에 배치한다.",
              "피벗 양쪽 구간을 재귀적으로 정렬한다.",
              "모든 피벗 위치가 확정되면 종료한다."
            ],
            observation: "첫 값이 이미 작거나 큰 입력에서 파티션 균형이 어떻게 달라지는지 확인합니다."
          }),
          createVariant(algorithm, {
            id: "median-pivot",
            label: "중앙값 피벗",
            summary:
              "구간의 첫 값, 가운데 값, 마지막 값 중 중앙값을 피벗으로 골라 극단적인 분할을 줄입니다.",
            generateTrace: (input) => generateQuickSortTrace(input, "median"),
            codeExamples: quickSortMedianPivotCodeExamples,
            pseudoCode: [
              "배열을 준비한다.",
              "첫 값, 가운데 값, 마지막 값 중 중앙값을 피벗으로 선택한다.",
              "피벗보다 작은 값이 들어갈 경계를 둔다.",
              "현재 값을 피벗과 비교한다.",
              "피벗보다 작거나 같으면 왼쪽 구간으로 옮긴다.",
              "피벗을 경계 위치에 배치한다.",
              "피벗 양쪽 구간을 재귀적으로 정렬한다.",
              "모든 피벗 위치가 확정되면 종료한다."
            ],
            observation: "세 후보를 비교해 피벗을 고르는 과정과 분할 균형을 확인합니다."
          })
        ]
      };
    }

    return {
      ...algorithm,
      variants: [createVariant(algorithm, { id: "basic", label: "기본" })]
    };
  }),
  createHeapSortAlgorithm()
];

function createVariant(
  algorithm: SortingAlgorithmBase,
  overrides: Partial<SortingVariant> & Pick<SortingVariant, "id" | "label">
): SortingVariant {
  return {
    id: overrides.id,
    label: overrides.label,
    summary: overrides.summary ?? algorithm.summary,
    generateTrace: overrides.generateTrace ?? algorithm.generateTrace,
    codeExamples: overrides.codeExamples ?? algorithm.codeExamples,
    timeComplexity: overrides.timeComplexity ?? algorithm.timeComplexity,
    spaceComplexity: overrides.spaceComplexity ?? algorithm.spaceComplexity,
    pseudoCode: overrides.pseudoCode ?? algorithm.pseudoCode,
    observation: overrides.observation ?? algorithm.observation
  };
}

function createHeapSortAlgorithm(): SortingAlgorithm {
  const base: SortingAlgorithmBase = {
    id: "heap",
    title: "힙 정렬",
    summary:
      "배열을 max heap으로 만든 뒤 루트의 최대값을 뒤쪽 정렬 완료 구간으로 반복해서 보내는 정렬 방식입니다.",
    defaultInput: HEAP_SORT_DEFAULT_INPUT,
    generateTrace: (input) => generateHeapSortTrace(input, "floyd"),
    codeExamples: heapSortFloydCodeExamples,
    timeComplexity: "시간 복잡도 O(n log n)",
    spaceComplexity: "공간 복잡도 O(1)",
    pseudoCode: [
      "배열을 준비한다.",
      "배열을 max heap으로 만든다.",
      "루트에 최대값이 있는지 확인한다.",
      "루트와 heap 끝 값을 교환한다.",
      "줄어든 heap에서 sift down을 수행한다.",
      "모든 값이 정렬 완료 구간에 들어가면 종료한다."
    ],
    observation: "heap 구간, 루트 최대값, 정렬 완료 구간이 어떻게 바뀌는지 확인합니다."
  };

  return {
    ...base,
    variants: [
      createVariant(base, {
        id: "floyd",
        label: "Floyd heapify"
      }),
      createVariant(base, {
        id: "insertion-build",
        label: "삽입식 build",
        summary:
          "값을 하나씩 heap에 삽입하듯 sift up으로 올려 max heap을 만든 뒤 정렬합니다.",
        generateTrace: (input) => generateHeapSortTrace(input, "insertion"),
        codeExamples: heapSortInsertionBuildCodeExamples,
        observation: "bottom-up heapify와 달리 새 값이 부모를 따라 위로 올라가는 build 과정을 확인합니다."
      })
    ]
  };
}

const visualLegend = [
  { className: "is-comparing", label: "비교" },
  { className: "is-swapping", label: "교환" },
  { className: "is-current", label: "현재" },
  { className: "is-scanning", label: "탐색" },
  { className: "is-key", label: "key" },
  { className: "is-minimum", label: "최소" },
  { className: "is-pivot", label: "피벗" },
  { className: "is-write", label: "기록" },
  { className: "is-sorted", label: "완료" }
];

const minimumArraySize = 2;
const maximumArraySize = 16;
const minimumValue = 1;
const maximumValue = 99;

export function SortingPage() {
  const [activeAlgorithmIndex, setActiveAlgorithmIndex] = useState(0);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [playDelayMs, setPlayDelayMs] = useState(900);
  const activeAlgorithm = sortingAlgorithms[activeAlgorithmIndex];
  const activeVariant = activeAlgorithm.variants[activeVariantIndex];
  const [inputArray, setInputArray] = useState<number[]>([
    ...BUBBLE_SORT_DEFAULT_INPUT
  ]);
  const [newValue, setNewValue] = useState("");
  const [arraySize, setArraySize] = useState(String(BUBBLE_SORT_DEFAULT_INPUT.length));
  const trace = useMemo(
    () => activeVariant.generateTrace(inputArray),
    [activeVariant, inputArray]
  );
  const controller = useStepController(trace.length, playDelayMs);
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const activeCodeExample = activeVariant.codeExamples[activeCodeIndex];
  const activeCodeLines =
    currentStep.codeLineHighlights?.[activeCodeExample.language] ?? [];
  const stageStateItems = getStateSummaryItems(currentStep.state);
  const progressPercent =
    trace.length <= 1
      ? 100
      : (currentIndex / (trace.length - 1)) * 100;

  function selectAlgorithm(index: number) {
    setActiveAlgorithmIndex(index);
    setActiveVariantIndex(0);
    setActiveCodeIndex(0);
    controller.reset();
  }

  function selectVariant(index: number) {
    setActiveVariantIndex(index);
    setActiveCodeIndex(0);
    controller.reset();
  }

  function updateInputArray(nextArray: number[]) {
    const normalizedArray = nextArray
      .map((value) => clampInteger(value, minimumValue, maximumValue))
      .slice(0, maximumArraySize);

    if (normalizedArray.length < minimumArraySize) {
      return;
    }

    setInputArray(normalizedArray);
    setArraySize(String(normalizedArray.length));
    controller.reset();
  }

  function addValue() {
    const value = Number(newValue);

    if (!Number.isFinite(value) || inputArray.length >= maximumArraySize) {
      return;
    }

    updateInputArray([...inputArray, value]);
    setNewValue("");
  }

  function deleteValue(indexToDelete: number) {
    updateInputArray(inputArray.filter((_, index) => index !== indexToDelete));
  }

  function resetData() {
    updateInputArray([...activeAlgorithm.defaultInput]);
    setNewValue("");
  }

  function generateRandomData() {
    const size = clampInteger(Number(arraySize), minimumArraySize, maximumArraySize);

    updateInputArray(createRandomArray(size));
  }

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="sorting-title">
        <p className="eyebrow">정렬 알고리즘</p>
        <h1 id="sorting-title">{activeAlgorithm.title}</h1>
        <p className="intro-copy">{activeAlgorithm.summary}</p>
        <div
          className="algorithm-tabs"
          role="tablist"
          aria-label="정렬 알고리즘 선택"
        >
          {sortingAlgorithms.map((algorithm, index) => (
            <button
              aria-selected={activeAlgorithmIndex === index}
              className="algorithm-tab"
              key={algorithm.id}
              onClick={() => selectAlgorithm(index)}
              role="tab"
              type="button"
            >
              {algorithm.title}
            </button>
          ))}
        </div>
        <div
          className="variant-tabs"
          role="tablist"
          aria-label="정렬 변형 선택"
        >
          {activeAlgorithm.variants.map((variant, index) => (
            <button
              aria-selected={activeVariantIndex === index}
              className="variant-tab"
              key={variant.id}
              onClick={() => selectVariant(index)}
              role="tab"
              type="button"
            >
              {variant.label}
            </button>
          ))}
        </div>
        <p className="variant-summary">
          <strong>{activeVariant.label}</strong> {activeVariant.summary}
        </p>
        <p className="input-summary">입력 배열: {formatArray(inputArray)}</p>
      </section>

      <section className="data-editor-panel" aria-label="배열 데이터 편집">
        <div className="data-editor-header">
          <div>
            <h2>배열 데이터</h2>
            <p>값을 직접 추가하거나 크기를 지정해 랜덤 배열을 만들 수 있습니다.</p>
          </div>
          <button type="button" onClick={resetData}>
            기본값
          </button>
        </div>

        <div className="data-control-grid">
          <label className="data-field" htmlFor="sorting-new-value">
            <span>추가할 값</span>
            <input
              id="sorting-new-value"
              type="number"
              min={minimumValue}
              max={maximumValue}
              value={newValue}
              onChange={(event) => setNewValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addValue();
                }
              }}
            />
          </label>
          <button
            type="button"
            onClick={addValue}
            disabled={inputArray.length >= maximumArraySize}
          >
            값 추가
          </button>

          <label className="data-field" htmlFor="sorting-array-size">
            <span>배열 크기</span>
            <input
              id="sorting-array-size"
              type="number"
              min={minimumArraySize}
              max={maximumArraySize}
              value={arraySize}
              onChange={(event) => setArraySize(event.currentTarget.value)}
            />
          </label>
          <button type="button" onClick={generateRandomData}>
            랜덤 생성
          </button>
        </div>

        <div className="editable-array" aria-label="현재 배열 값 목록">
          {inputArray.map((value, index) => (
            <span className="editable-array-item" key={`${index}-${value}`}>
              <span>
                <strong>{index}</strong>
                {value}
              </span>
              <button
                aria-label={`${index}번 값 ${value} 삭제`}
                type="button"
                onClick={() => deleteValue(index)}
                disabled={inputArray.length <= minimumArraySize}
              >
                x
              </button>
            </span>
          ))}
        </div>
      </section>

      <section className="sorting-workbench" aria-label="정렬 실습 작업 영역">
        <section
          className="visualization-layout"
          aria-label={`${activeAlgorithm.title} 도표`}
        >
          <div className="visualization-panel cinematic-panel">
            <div className="stage-header">
              <div>
                <p className="eyebrow">인터랙션 스테이지</p>
                <h2>스테이지: {currentStep.title}</h2>
              </div>
              <span className="stage-counter">
                {currentIndex + 1} / {trace.length}
              </span>
            </div>

            <SortingBars state={currentStep.state} />

            <div className="stage-state-list" aria-label="현재 단계 상태">
              {stageStateItems.map((item) => (
                <div className="stage-state-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="stage-legend" aria-label="상태 범례">
              <span className="legend-title">상태 범례</span>
              {visualLegend.map((item) => (
                <span className="legend-item" key={item.label}>
                  <span className={`legend-swatch ${item.className}`} />
                  {item.label}
                </span>
              ))}
            </div>

            <div className="timeline-controls" aria-label="시각화 재생 컨트롤">
              <div className="timeline-row">
                <button
                  type="button"
                  onClick={controller.goPrevious}
                  disabled={controller.isFirstStep}
                >
                  도표 이전
                </button>
                <button
                  className="primary-control"
                  type="button"
                  onClick={controller.togglePlay}
                  disabled={controller.isLastStep}
                >
                  {controller.isPlaying ? "일시정지" : "자동 재생"}
                </button>
                <button
                  aria-label="도표 다음"
                  disabled={controller.isLastStep}
                  onClick={controller.goNext}
                  type="button"
                >
                  다음
                </button>
              </div>

              <label className="timeline-slider-label" htmlFor="sorting-step-slider">
                <span>수동 단계 이동</span>
                <input
                  id="sorting-step-slider"
                  type="range"
                  min="0"
                  max={trace.length - 1}
                  value={currentIndex}
                  onChange={(event) =>
                    controller.goToStep(Number(event.currentTarget.value))
                  }
                  aria-label="정렬 단계 슬라이더"
                  style={{ "--progress": `${progressPercent}%` } as CSSProperties}
                />
              </label>

              <label className="speed-control" htmlFor="sorting-speed">
                <span>속도</span>
                <select
                  id="sorting-speed"
                  value={playDelayMs}
                  onChange={(event) => setPlayDelayMs(Number(event.currentTarget.value))}
                >
                  <option value="1300">느리게</option>
                  <option value="900">보통</option>
                  <option value="500">빠르게</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <section
          className="code-example-section"
          aria-label={`${activeAlgorithm.title} 코드`}
        >
          <div className="code-example-header">
            <div>
              <h2 id="code-title">코드 예제</h2>
              <p>단계가 바뀌면 관련 코드 줄도 함께 표시됩니다.</p>
            </div>
            <span className="code-file-name">{activeCodeExample.fileName}</span>
          </div>

          <div className="code-tabs" role="tablist" aria-label="코드 언어">
            {activeVariant.codeExamples.map((example, index) => (
              <button
                aria-controls="bubble-sort-code-panel"
                aria-selected={activeCodeIndex === index}
                className="code-tab"
                key={example.language}
                onClick={() => setActiveCodeIndex(index)}
                role="tab"
                type="button"
              >
                {example.language}
              </button>
            ))}
          </div>

          <div className="code-panel" id="bubble-sort-code-panel" role="tabpanel">
            <ol className="code-lines">
              {activeCodeExample.code.split("\n").map((line, index) => {
                const lineNumber = index + 1;
                const isActive = activeCodeLines.includes(lineNumber);

                return (
                  <li
                    aria-label={
                      isActive
                        ? `현재 코드 ${lineNumber}: ${line.trim()}`
                        : `코드 ${lineNumber}: ${line.trim()}`
                    }
                    className={isActive ? "code-line is-active" : "code-line"}
                    key={`${activeAlgorithm.id}-${activeVariant.id}-${activeCodeExample.language}-${lineNumber}`}
                  >
                    <span className="code-line-number">{lineNumber}</span>
                    <code className="code-line-text">
                      {tokenizeCodeLine(activeCodeExample.language, line).map(
                        (token, tokenIndex) => (
                          <span
                            className={`token-${token.type}`}
                            key={`${activeAlgorithm.id}-${activeVariant.id}-${activeCodeExample.language}-${lineNumber}-${tokenIndex}`}
                          >
                            {token.text}
                          </span>
                        )
                      )}
                    </code>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </section>

      <section className="step-pseudo-layout" aria-label="단계와 의사 코드">
        <div className="pseudo-panel">
          <h2>의사 코드</h2>
          <ol className="pseudo-code">
            {activeVariant.pseudoCode.map((line, index) => (
              <li
                className={
                  currentStep.pseudoCodeLine === index + 1 ? "is-active" : ""
                }
                aria-current={
                  currentStep.pseudoCodeLine === index + 1 ? "step" : undefined
                }
                key={line}
              >
                {line}
              </li>
            ))}
          </ol>
        </div>

        <aside className="step-panel" aria-label="현재 단계 설명">
          <h2>현재 단계</h2>
          <p className="step-count">
            {currentIndex + 1} / {trace.length}
          </p>
          <h3>{currentStep.title}</h3>
          <p>{currentStep.description}</p>

          <div className="step-controls" aria-label="단계 컨트롤">
            <button
              type="button"
              onClick={controller.goPrevious}
              disabled={controller.isFirstStep}
            >
              이전
            </button>
            <button
              type="button"
              onClick={controller.goNext}
              disabled={controller.isLastStep}
            >
              다음
            </button>
            <button
              type="button"
              onClick={controller.togglePlay}
              disabled={controller.isLastStep}
            >
              {controller.isPlaying ? "정지" : "재생"}
            </button>
            <button type="button" onClick={controller.reset}>
              초기화
            </button>
          </div>
        </aside>
      </section>

      <section className="summary-section" aria-label="핵심 요약">
        <div className="summary-panel">
          <h2>핵심 요약</h2>
          <dl className="complexity-list">
            <div>
              <dt>시간 복잡도</dt>
              <dd>{activeVariant.timeComplexity}</dd>
            </div>
            <div>
              <dt>공간 복잡도</dt>
              <dd>{activeVariant.spaceComplexity}</dd>
            </div>
            <div>
              <dt>관찰 포인트</dt>
              <dd>{activeVariant.observation}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}

function formatArray(input: readonly number[]): string {
  return `[${input.join(", ")}]`;
}

function getStateSummaryItems(state: SortingState) {
  const items: { label: string; value: string }[] = [];

  if (state.partitionRange !== undefined) {
    items.push({ label: "파티션 구간", value: formatRange(state.partitionRange) });
  }

  if (state.heapRange !== undefined) {
    items.push({ label: "heap 구간", value: formatRange(state.heapRange) });
  }

  if (state.mergeRange !== undefined) {
    items.push({ label: "병합 구간", value: formatRange(state.mergeRange) });
  }

  if (state.searchRange !== undefined) {
    items.push({ label: "탐색 구간", value: formatRange(state.searchRange) });
  }

  if (state.leftRange !== undefined) {
    items.push({ label: "왼쪽 구간", value: formatRange(state.leftRange) });
  }

  if (state.rightRange !== undefined) {
    items.push({ label: "오른쪽 구간", value: formatRange(state.rightRange) });
  }

  if (state.currentIndex !== undefined) {
    items.push({ label: "현재 위치", value: formatIndex(state.currentIndex) });
  }

  if (state.scanningIndex !== undefined) {
    items.push({ label: "탐색 위치", value: formatIndex(state.scanningIndex) });
  }

  if (state.keyIndex !== undefined) {
    items.push({ label: "key 위치", value: formatIndex(state.keyIndex) });
  }

  if (state.minimumIndex !== undefined) {
    items.push({ label: "최소값 위치", value: formatIndex(state.minimumIndex) });
  }

  if (state.maximumIndex !== undefined) {
    items.push({ label: "최대값 위치", value: formatIndex(state.maximumIndex) });
  }

  if (state.pivotIndex !== undefined) {
    items.push({ label: "피벗 위치", value: formatIndex(state.pivotIndex) });
  }

  if (state.writeIndex !== undefined) {
    items.push({ label: "기록 위치", value: formatIndex(state.writeIndex) });
  }

  if (state.comparingIndices?.length) {
    items.push({ label: "비교", value: formatIndices(state.comparingIndices) });
  }

  if (state.swappingIndices?.length) {
    items.push({ label: "교환", value: formatIndices(state.swappingIndices) });
  }

  if (state.shiftedIndices?.length) {
    items.push({ label: "이동", value: formatIndices(state.shiftedIndices) });
  }

  if (state.sortedIndices?.length) {
    items.push({ label: "정렬 완료", value: formatIndices(state.sortedIndices) });
  }

  return items.length > 0 ? items : [{ label: "상태", value: "초기 배열 확인" }];
}

function formatIndex(index: number): string {
  return `${index}번`;
}

function formatIndices(indices: readonly number[]): string {
  return indices.map(formatIndex).join(", ");
}

function formatRange(range: [number, number]): string {
  return `${range[0]}~${range[1]}번`;
}

function createRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => {
    return randomInteger(minimumValue, maximumValue);
  });
}

function randomInteger(minimum: number, maximum: number): number {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function clampInteger(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(Math.max(Math.round(value), minimum), maximum);
}
