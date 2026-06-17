import type { TraceStep } from "../../shared/types";
import type { CodeLanguage } from "../../sorting/code/types";
import type {
  DpCellRef,
  DpDecision,
  KnapsackDpState,
  KnapsackItem,
} from "../types";

export const KNAPSACK_DEFAULT_ITEMS: KnapsackItem[] = [
  { id: "camera", name: "카메라", weight: 2, value: 6 },
  { id: "book", name: "책", weight: 3, value: 7 },
  { id: "jacket", name: "재킷", weight: 4, value: 9 },
  { id: "laptop", name: "노트북", weight: 5, value: 13 },
  { id: "snack", name: "간식", weight: 6, value: 12 },
];

export const KNAPSACK_DEFAULT_CAPACITY = 10;

export function generateKnapsackTrace(
  items: readonly KnapsackItem[] = KNAPSACK_DEFAULT_ITEMS,
  capacity = KNAPSACK_DEFAULT_CAPACITY,
): TraceStep<KnapsackDpState>[] {
  const normalizedItems = items.map((item) => ({ ...item }));
  const table = createTable(normalizedItems.length + 1, capacity + 1);
  const trace: TraceStep<KnapsackDpState>[] = [];

  trace.push(
    createStep({
      id: "knapsack-init",
      title: "DP 표 초기화",
      description:
        "행은 사용 가능한 물건 수, 열은 배낭 용량입니다. 0행과 0용량은 아무것도 담을 수 없으므로 0에서 시작합니다.",
      capacity,
      items: normalizedItems,
      table,
      decision: "init",
      pseudoCodeLine: 1,
      codeKey: "2",
      note: "기본값 0",
    }),
  );

  for (let row = 1; row <= normalizedItems.length; row += 1) {
    const item = normalizedItems[row - 1]!;
    const itemTopic = withTopicMarker(item.name);
    const itemObject = withObjectMarker(item.name);

    trace.push(
      createStep({
        id: `knapsack-item-${item.id}`,
        title: `${item.name} 고려 시작`,
        description: `${item.name}의 무게는 ${item.weight}, 가치는 ${item.value}입니다. 이 물건을 쓰는 행을 왼쪽부터 채웁니다.`,
        capacity,
        items: normalizedItems,
        table,
        activeRow: row,
        activeItemIndex: row - 1,
        decision: "init",
        pseudoCodeLine: 2,
        codeKey: "3,4",
        note: `${item.name} 행`,
      }),
    );

    for (let col = 0; col <= capacity; col += 1) {
      const above = table[row - 1]![col]!;

      if (item.weight > col) {
        table[row]![col] = above;
        trace.push(
          createStep({
            id: `knapsack-copy-${row}-${col}`,
            title: `용량 ${col}: ${itemTopic} 너무 무거움`,
            description: `${item.weight}kg인 ${itemTopic} 현재 용량 ${col}에 들어가지 않습니다. 바로 위 칸 ${above}를 복사합니다.`,
            capacity,
            items: normalizedItems,
            table,
            activeRow: row,
            activeCol: col,
            activeItemIndex: row - 1,
            compareCells: [{ row: row - 1, col }],
            decision: "copy",
            skipValue: above,
            pseudoCodeLine: 4,
            codeKey: "6,7",
            note: "위 칸 복사",
          }),
        );
        continue;
      }

      const remainingCol = col - item.weight;
      const takeValue = table[row - 1]![remainingCol]! + item.value;
      const skipValue = above;
      const decision: DpDecision = takeValue > skipValue ? "take" : "skip";

      table[row]![col] = Math.max(skipValue, takeValue);
      trace.push(
        createStep({
          id: `knapsack-fill-${row}-${col}`,
          title: `용량 ${col}: 넣기와 빼기 비교`,
          description:
            decision === "take"
              ? `${itemObject} 넣으면 ${takeValue}, 빼면 ${skipValue}입니다. 더 큰 ${takeValue}를 기록합니다.`
              : `${itemObject} 넣으면 ${takeValue}, 빼면 ${skipValue}입니다. 빼는 쪽의 ${skipValue}를 유지합니다.`,
          capacity,
          items: normalizedItems,
          table,
          activeRow: row,
          activeCol: col,
          activeItemIndex: row - 1,
          compareCells: [
            { row: row - 1, col },
            { row: row - 1, col: remainingCol },
          ],
          decision,
          skipValue,
          takeValue,
          pseudoCodeLine: decision === "take" ? 7 : 6,
          codeKey: "9,10,11",
          note: decision === "take" ? "넣기 선택" : "빼기 선택",
        }),
      );
    }
  }

  const selectedItemIndices = backtrackSelectedItems(table, normalizedItems, capacity);
  trace.push(
    createStep({
      id: "knapsack-complete",
      title: "최대 가치 확정",
      description: `마지막 칸 dp[${normalizedItems.length}][${capacity}]가 정답입니다. 선택 물건은 ${formatSelectedItems(normalizedItems, selectedItemIndices)}입니다.`,
      capacity,
      items: normalizedItems,
      table,
      activeRow: normalizedItems.length,
      activeCol: capacity,
      selectedCells: createBacktrackCells(table, normalizedItems, capacity),
      selectedItemIndices,
      decision: "complete",
      pseudoCodeLine: 8,
      codeKey: "15",
      note: `정답 ${table[normalizedItems.length]![capacity]}`,
    }),
  );

  return trace;
}

function createStep({
  activeCol,
  activeItemIndex,
  activeRow,
  capacity,
  codeKey,
  compareCells,
  decision,
  description,
  id,
  items,
  note,
  pseudoCodeLine,
  selectedCells,
  selectedItemIndices,
  skipValue,
  table,
  takeValue,
  title,
}: {
  activeCol?: number;
  activeItemIndex?: number;
  activeRow?: number;
  capacity: number;
  codeKey: string;
  compareCells?: DpCellRef[];
  decision: DpDecision;
  description: string;
  id: string;
  items: readonly KnapsackItem[];
  note: string;
  pseudoCodeLine: number;
  selectedCells?: DpCellRef[];
  selectedItemIndices?: number[];
  skipValue?: number;
  table: readonly number[][];
  takeValue?: number;
  title: string;
}): TraceStep<KnapsackDpState> {
  const activeValue =
    activeRow !== undefined && activeCol !== undefined
      ? table[activeRow]?.[activeCol]
      : undefined;
  const selectedNames =
    selectedItemIndices === undefined
      ? "-"
      : selectedItemIndices.map((index) => items[index]?.name).join(", ");

  return {
    id,
    title,
    description,
    state: {
      capacity,
      items: items.map((item) => ({ ...item })),
      table: table.map((row) => [...row]),
      activeCol,
      activeItemIndex,
      activeRow,
      compareCells,
      selectedCells,
      selectedItemIndices,
      skippedItemIndices:
        decision === "skip" && activeItemIndex !== undefined
          ? [activeItemIndex]
          : undefined,
      decision,
      skipValue,
      takeValue,
      summaryItems: [
        { label: "물건", value: activeItemIndex === undefined ? "-" : items[activeItemIndex]!.name },
        { label: "용량", value: activeCol === undefined ? "-" : String(activeCol) },
        { label: "넣기", value: takeValue === undefined ? "-" : String(takeValue) },
        { label: "빼기", value: skipValue === undefined ? "-" : String(skipValue) },
        { label: "기록", value: activeValue === undefined ? "-" : String(activeValue) },
        { label: "판정", value: note },
        { label: "선택", value: selectedNames || "-" },
      ],
    },
    pseudoCodeLine,
    codeLineHighlights: createLanguageHighlights(codeKey),
  };
}

function createTable(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

function backtrackSelectedItems(
  table: readonly number[][],
  items: readonly KnapsackItem[],
  capacity: number,
): number[] {
  const selected: number[] = [];
  let col = capacity;

  for (let row = items.length; row >= 1; row -= 1) {
    if (table[row]?.[col] !== table[row - 1]?.[col]) {
      selected.push(row - 1);
      col -= items[row - 1]!.weight;
    }
  }

  return selected.reverse();
}

function createBacktrackCells(
  table: readonly number[][],
  items: readonly KnapsackItem[],
  capacity: number,
): DpCellRef[] {
  const cells: DpCellRef[] = [];
  let col = capacity;

  for (let row = items.length; row >= 1; row -= 1) {
    cells.push({ row, col });

    if (table[row]?.[col] !== table[row - 1]?.[col]) {
      col -= items[row - 1]!.weight;
    }
  }

  cells.push({ row: 0, col });
  return cells;
}

function formatSelectedItems(
  items: readonly KnapsackItem[],
  selectedItemIndices: readonly number[],
): string {
  return selectedItemIndices.length === 0
    ? "없음"
    : selectedItemIndices.map((index) => items[index]!.name).join(", ");
}

function withTopicMarker(text: string): string {
  return `${text}${hasFinalConsonant(text) ? "은" : "는"}`;
}

function withObjectMarker(text: string): string {
  return `${text}${hasFinalConsonant(text) ? "을" : "를"}`;
}

function hasFinalConsonant(text: string): boolean {
  const lastCode = text.charCodeAt(text.length - 1);

  if (lastCode < 0xac00 || lastCode > 0xd7a3) {
    return false;
  }

  return (lastCode - 0xac00) % 28 !== 0;
}

const highlightByCodeKey: Record<string, Record<CodeLanguage, number[]>> = {
  "2": sameLines(2),
  "3,4": {
    C: [3, 4],
    "C++": [3, 4],
    Java: [3, 4],
    Python: [3, 4],
    JavaScript: [3, 4],
  },
  "6,7": {
    C: [6, 7],
    "C++": [6, 7],
    Java: [6, 7],
    Python: [6, 7],
    JavaScript: [6, 7],
  },
  "9,10,11": {
    C: [9, 10, 11],
    "C++": [9, 10, 11],
    Java: [9, 10, 11],
    Python: [9, 10, 11],
    JavaScript: [9, 10, 11],
  },
  "15": {
    C: [15],
    "C++": [15],
    Java: [15],
    Python: [13],
    JavaScript: [15],
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
