import { describe, expect, it } from "vitest";

import type { TraceStep } from "./types";
import type { CodeLanguage, SortingCodeExample } from "../sorting/code/types";
import {
  generateBubbleSortEarlyExitTrace,
  generateBubbleSortTrace,
  generateCocktailSortTrace,
} from "../sorting/algorithms/bubbleSort";
import { generateHeapSortTrace } from "../sorting/algorithms/heapSort";
import {
  generateBinaryInsertionSortTrace,
  generateInsertionSortTrace,
} from "../sorting/algorithms/insertionSort";
import {
  generateMergeSortBottomUpTrace,
  generateMergeSortTrace,
} from "../sorting/algorithms/mergeSort";
import { generateQuickSortTrace } from "../sorting/algorithms/quickSort";
import {
  generateSelectionSortBidirectionalTrace,
  generateSelectionSortMaxTrace,
  generateSelectionSortTrace,
} from "../sorting/algorithms/selectionSort";
import { bubbleSortCodeExamples } from "../sorting/code/bubbleSortExamples";
import { insertionSortCodeExamples } from "../sorting/code/insertionSortExamples";
import { mergeSortCodeExamples } from "../sorting/code/mergeSortExamples";
import { quickSortCodeExamples } from "../sorting/code/quickSortExamples";
import { selectionSortCodeExamples } from "../sorting/code/selectionSortExamples";
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
  selectionSortMaxCodeExamples,
} from "../sorting/code/sortingVariantExamples";
import {
  GRAPH_STRUCTURE_KINDS,
  generateGraphStructureTrace,
} from "../graphs/algorithms/graphStructures";
import {
  GRAPH_TRAVERSAL_MODES,
  generateGraphTraversalTrace,
} from "../graphs/algorithms/graphTraversal";
import { graphStructureCodeExamples } from "../graphs/code/graphStructuresExample";
import { graphTraversalCodeExamples } from "../graphs/code/graphTraversalExample";
import { generateKnapsackTrace } from "../dynamic-programming/algorithms/knapsack";
import { knapsackCodeExamples } from "../dynamic-programming/code/knapsackExamples";
import { generateBinarySearchTrace } from "../search/algorithms/binarySearch";
import { binarySearchCodeExamples } from "../search/code/binarySearchExamples";
import { generateAvlRotationTrace } from "../trees/algorithms/avlTree";
import { generateBPlusTreeTrace } from "../trees/algorithms/bPlusTree";
import { generateBTreeTrace } from "../trees/algorithms/bTree";
import { generateBinarySearchTreeTrace } from "../trees/algorithms/binarySearchTree";
import { generateBinarySearchTreeDeletionTrace } from "../trees/algorithms/binarySearchTreeDeletion";
import { generateHeapTrace } from "../trees/algorithms/heapTree";
import { generateRedBlackInsertionTrace } from "../trees/algorithms/redBlackTree";
import { generateSegmentTreeTrace } from "../trees/algorithms/segmentTree";
import { generateTrieTrace } from "../trees/algorithms/trieTree";
import {
  avlTreeCodeExamples,
  bPlusTreeCodeExamples,
  bTreeCodeExamples,
  binarySearchTreeCodeExamples,
  binarySearchTreeDeletionCodeExamples,
  heapTreeCodeExamples,
  redBlackTreeCodeExamples,
  segmentTreeCodeExamples,
  trieTreeCodeExamples,
} from "../trees/code/treeCodeExamples";

const requiredLanguages: CodeLanguage[] = ["C", "C++", "Java", "Python", "JavaScript"];
const sortingInput = [5, 3, 8, 4, 2];

type HighlightSubject = {
  codeExamples: SortingCodeExample[];
  name: string;
  trace: TraceStep[];
};

const subjects: HighlightSubject[] = [
  {
    name: "sorting:bubble",
    trace: generateBubbleSortTrace(sortingInput),
    codeExamples: bubbleSortCodeExamples,
  },
  {
    name: "sorting:bubble:early-exit",
    trace: generateBubbleSortEarlyExitTrace(sortingInput),
    codeExamples: bubbleSortEarlyExitCodeExamples,
  },
  {
    name: "sorting:bubble:cocktail",
    trace: generateCocktailSortTrace(sortingInput),
    codeExamples: cocktailSortCodeExamples,
  },
  {
    name: "sorting:selection",
    trace: generateSelectionSortTrace(sortingInput),
    codeExamples: selectionSortCodeExamples,
  },
  {
    name: "sorting:selection:max",
    trace: generateSelectionSortMaxTrace(sortingInput),
    codeExamples: selectionSortMaxCodeExamples,
  },
  {
    name: "sorting:selection:bidirectional",
    trace: generateSelectionSortBidirectionalTrace(sortingInput),
    codeExamples: selectionSortBidirectionalCodeExamples,
  },
  {
    name: "sorting:insertion",
    trace: generateInsertionSortTrace(sortingInput),
    codeExamples: insertionSortCodeExamples,
  },
  {
    name: "sorting:insertion:binary",
    trace: generateBinaryInsertionSortTrace(sortingInput),
    codeExamples: binaryInsertionSortCodeExamples,
  },
  {
    name: "sorting:merge",
    trace: generateMergeSortTrace(sortingInput),
    codeExamples: mergeSortCodeExamples,
  },
  {
    name: "sorting:merge:bottom-up",
    trace: generateMergeSortBottomUpTrace(sortingInput),
    codeExamples: mergeSortBottomUpCodeExamples,
  },
  {
    name: "sorting:quick",
    trace: generateQuickSortTrace(sortingInput),
    codeExamples: quickSortCodeExamples,
  },
  {
    name: "sorting:quick:first-pivot",
    trace: generateQuickSortTrace(sortingInput, "first"),
    codeExamples: quickSortFirstPivotCodeExamples,
  },
  {
    name: "sorting:quick:median-pivot",
    trace: generateQuickSortTrace(sortingInput, "median"),
    codeExamples: quickSortMedianPivotCodeExamples,
  },
  {
    name: "sorting:heap:floyd",
    trace: generateHeapSortTrace(sortingInput, "floyd"),
    codeExamples: heapSortFloydCodeExamples,
  },
  {
    name: "sorting:heap:insertion-build",
    trace: generateHeapSortTrace(sortingInput, "insertion"),
    codeExamples: heapSortInsertionBuildCodeExamples,
  },
  ...GRAPH_STRUCTURE_KINDS.map((kind) => ({
    name: `graph:structure:${kind}`,
    trace: generateGraphStructureTrace(kind),
    codeExamples: graphStructureCodeExamples,
  })),
  ...GRAPH_TRAVERSAL_MODES.map((mode) => ({
    name: `graph:traversal:${mode}`,
    trace: generateGraphTraversalTrace(mode),
    codeExamples: graphTraversalCodeExamples,
  })),
  {
    name: "search:binary",
    trace: generateBinarySearchTrace(),
    codeExamples: binarySearchCodeExamples,
  },
  {
    name: "dynamic-programming:knapsack",
    trace: generateKnapsackTrace(),
    codeExamples: knapsackCodeExamples,
  },
  {
    name: "tree:bst",
    trace: generateBinarySearchTreeTrace(),
    codeExamples: binarySearchTreeCodeExamples,
  },
  {
    name: "tree:avl",
    trace: generateAvlRotationTrace(),
    codeExamples: avlTreeCodeExamples,
  },
  {
    name: "tree:red-black",
    trace: generateRedBlackInsertionTrace(),
    codeExamples: redBlackTreeCodeExamples,
  },
  {
    name: "tree:b-tree",
    trace: generateBTreeTrace(),
    codeExamples: bTreeCodeExamples,
  },
  {
    name: "tree:b-plus-tree",
    trace: generateBPlusTreeTrace(),
    codeExamples: bPlusTreeCodeExamples,
  },
  {
    name: "tree:heap",
    trace: generateHeapTrace(),
    codeExamples: heapTreeCodeExamples,
  },
  {
    name: "tree:trie",
    trace: generateTrieTrace(),
    codeExamples: trieTreeCodeExamples,
  },
  {
    name: "tree:segment",
    trace: generateSegmentTreeTrace(),
    codeExamples: segmentTreeCodeExamples,
  },
  {
    name: "tree:bst-delete",
    trace: generateBinarySearchTreeDeletionTrace(),
    codeExamples: binarySearchTreeDeletionCodeExamples,
  },
];

describe("code line highlight audit", () => {
  it("uses only the supported languages for every highlighted step", () => {
    for (const subject of subjects) {
      for (const step of subject.trace) {
        expect(step.codeLineHighlights, `${subject.name}:${step.id}`).toBeDefined();
        expect(Object.keys(step.codeLineHighlights ?? {}).sort()).toEqual(
          [...requiredLanguages].sort(),
        );
      }
    }
  });

  it("keeps every highlighted line inside the displayed code range", () => {
    for (const subject of subjects) {
      const examplesByLanguage = new Map(
        subject.codeExamples.map((example) => [example.language, example]),
      );

      expect([...examplesByLanguage.keys()].sort()).toEqual([...requiredLanguages].sort());

      for (const step of subject.trace) {
        for (const language of requiredLanguages) {
          const example = examplesByLanguage.get(language);
          const highlightedLines = step.codeLineHighlights?.[language] ?? [];
          const codeLines = example?.code.split("\n") ?? [];

          expect(highlightedLines.length, `${subject.name}:${step.id}:${language}`).toBeGreaterThan(0);

          for (const lineNumber of highlightedLines) {
            expect(lineNumber, `${subject.name}:${step.id}:${language}`).toBeGreaterThanOrEqual(1);
            expect(lineNumber, `${subject.name}:${step.id}:${language}`).toBeLessThanOrEqual(
              codeLines.length,
            );
            expect(
              codeLines[lineNumber - 1].trim(),
              `${subject.name}:${step.id}:${language}:${lineNumber}`,
            ).not.toBe("");
          }
        }
      }
    }
  });

  it("matches representative highlighted lines to the step meaning", () => {
    expectHighlightedText({
      codeExamples: bubbleSortCodeExamples,
      language: "Python",
      matcher: /result\[index\], result\[index \+ 1\]/,
      step: generateBubbleSortTrace(sortingInput).find((traceStep) =>
        traceStep.id.includes("swap"),
      ),
    });

    expectHighlightedText({
      codeExamples: graphTraversalCodeExamples,
      language: "Python",
      matcher: /queue\.append\(next_node\)/,
      step: generateGraphTraversalTrace("bfs").find(
        (traceStep) => traceStep.id === "bfs-discover-B-from-A",
      ),
    });

    expectHighlightedText({
      codeExamples: binarySearchCodeExamples,
      language: "Python",
      matcher: /mid = left \+ \(right - left\) \/\/ 2/,
      step: generateBinarySearchTrace().find(
        (traceStep) => traceStep.id === "binary-search-mid-6",
      ),
    });

    expectHighlightedText({
      codeExamples: knapsackCodeExamples,
      language: "Python",
      matcher: /dp\[i\]\[w\] = max\(skip, take\)/,
      step: generateKnapsackTrace().find(
        (traceStep) => traceStep.id === "knapsack-fill-1-2",
      ),
    });

    expectHighlightedText({
      codeExamples: graphStructureCodeExamples,
      language: "Python",
      matcher: /append\(f"\{to_node\}\(\{weight\}\)"\)/,
      step: generateGraphStructureTrace("weighted").find(
        (traceStep) => traceStep.id === "weighted-edge-S-A",
      ),
    });

    expectHighlightedText({
      codeExamples: binarySearchTreeCodeExamples,
      language: "Python",
      matcher: /if value < node\.value/,
      step: generateBinarySearchTreeTrace().find(
        (traceStep) => traceStep.id === "bst-compare-23-42",
      ),
    });

    expectHighlightedText({
      codeExamples: trieTreeCodeExamples,
      language: "Python",
      matcher: /collect_words\(node, prefix\)/,
      step: generateTrieTrace().find((traceStep) => traceStep.id === "trie-prefix-found-car"),
    });
  });
});

function expectHighlightedText({
  codeExamples,
  language,
  matcher,
  step,
}: {
  codeExamples: SortingCodeExample[];
  language: CodeLanguage;
  matcher: RegExp;
  step: TraceStep | undefined;
}) {
  expect(step).toBeDefined();

  const codeExample = codeExamples.find((example) => example.language === language);
  const codeLines = codeExample?.code.split("\n") ?? [];
  const highlightedText = (step?.codeLineHighlights?.[language] ?? [])
    .map((lineNumber) => codeLines[lineNumber - 1].trim())
    .join("\n");

  expect(highlightedText).toMatch(matcher);
}
