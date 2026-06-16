import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import {
  AVL_ROTATION_VALUES,
  generateAvlRotationTrace
} from "../algorithms/avlTree";
import {
  BTREE_INSERT_VALUES,
  BTREE_SEARCH_TARGET,
  generateBTreeTrace
} from "../algorithms/bTree";
import {
  BST_DEFAULT_VALUES,
  BST_SEARCH_TARGET,
  generateBinarySearchTreeTrace
} from "../algorithms/binarySearchTree";
import {
  BST_DELETE_INITIAL_VALUES,
  BST_DELETE_TARGETS,
  generateBinarySearchTreeDeletionTrace
} from "../algorithms/binarySearchTreeDeletion";
import {
  RED_BLACK_INSERT_VALUES,
  generateRedBlackInsertionTrace
} from "../algorithms/redBlackTree";
import {
  HEAP_INSERT_VALUES,
  generateHeapTrace
} from "../algorithms/heapTree";
import {
  SEGMENT_TREE_QUERY_RANGE,
  SEGMENT_TREE_UPDATE,
  SEGMENT_TREE_VALUES,
  generateSegmentTreeTrace
} from "../algorithms/segmentTree";
import {
  TRIE_PREFIX_TARGET,
  TRIE_WORDS,
  generateTrieTrace
} from "../algorithms/trieTree";
import { avlTreeCodeExample } from "../code/avlTreeExample";
import { bTreeCodeExample } from "../code/bTreeExample";
import { binarySearchTreeDeletionCodeExample } from "../code/binarySearchTreeDeletionExample";
import { binarySearchTreeCodeExample } from "../code/binarySearchTreeExample";
import { heapTreeCodeExample } from "../code/heapTreeExample";
import { redBlackTreeCodeExample } from "../code/redBlackTreeExample";
import { segmentTreeCodeExample } from "../code/segmentTreeExample";
import { trieTreeCodeExample } from "../code/trieTreeExample";
import type { TreeEdgeState, TreeNodeState, TreeTraceState } from "../types";

const bstPseudoCode = [
  "빈 트리에 첫 값을 루트로 넣는다.",
  "현재 노드와 삽입할 값을 비교한다.",
  "작으면 왼쪽 서브트리로 내려간다.",
  "크거나 같으면 오른쪽 서브트리로 내려간다.",
  "탐색할 값을 현재 노드와 비교한다.",
  "값이 같으면 탐색을 종료한다.",
  "중위 순회를 시작한다.",
  "왼쪽, 현재, 오른쪽 순서로 방문한다.",
  "방문 결과가 오름차순인지 확인한다."
];

const avlPseudoCode = [
  "빈 AVL 트리에 첫 값을 넣는다.",
  "현재 노드와 삽입할 값을 비교한다.",
  "작으면 왼쪽 서브트리로 내려간다.",
  "크거나 같으면 오른쪽 서브트리로 내려간다.",
  "삽입 후 balance factor를 계산한다.",
  "불균형이면 LL, RR, LR, RL 회전을 적용한다.",
  "회전 후 높이를 다시 갱신한다.",
  "모든 노드가 -1, 0, 1 범위인지 확인한다."
];

const deletePseudoCode = [
  "삭제용 BST를 준비한다.",
  "현재 노드와 삭제할 값을 비교한다.",
  "삭제 대상 노드를 찾는다.",
  "자식이 없으면 부모 연결을 끊는다.",
  "자식이 하나면 그 자식으로 대체한다.",
  "자식이 둘이면 오른쪽 서브트리의 최소값을 찾는다.",
  "successor 값으로 대체하고 원래 successor를 삭제한다.",
  "남은 트리가 BST 규칙을 유지하는지 확인한다."
];

const redBlackPseudoCode = [
  "새 노드를 빨간색으로 BST 위치에 삽입한다.",
  "부모가 검정이면 Red-Black 규칙을 만족한다.",
  "부모와 삼촌이 빨강이면 부모와 삼촌을 검정, 조부모를 빨강으로 바꾼다.",
  "조부모로 올라가 같은 규칙을 반복한다.",
  "부모와 새 노드가 꺾인 모양이면 먼저 한 번 회전한다.",
  "부모를 검정, 조부모를 빨강으로 바꾼다.",
  "조부모를 기준으로 회전해 빨간 노드 연속을 제거한다.",
  "루트가 항상 검정인지 확인한다."
];

const bTreePseudoCode = [
  "삽입 전 루트가 가득 찼는지 확인한다.",
  "루트가 가득 찼으면 새 루트를 만들고 기존 루트를 split한다.",
  "리프 노드라면 key를 정렬된 위치에 삽입한다.",
  "내부 노드라면 key가 내려갈 자식 구간을 고른다.",
  "내려갈 자식이 가득 찼으면 먼저 split한다.",
  "승격된 key와 비교해 왼쪽 또는 오른쪽 자식으로 내려간다.",
  "탐색은 현재 노드 key와 target을 비교한다.",
  "target이 없으면 알맞은 자식 구간으로 내려간다."
];

const heapPseudoCode = [
  "새 값을 배열 끝에 넣어 완전 이진트리 모양을 유지한다.",
  "새 값과 부모 값을 비교한다.",
  "부모가 더 크거나 같으면 삽입 복구를 끝낸다.",
  "새 값이 더 크면 부모와 교환하며 위로 올린다.",
  "최대값 삭제는 루트 값을 제거 대상으로 표시한다.",
  "마지막 값을 루트로 옮겨 빈 자리를 메운다.",
  "루트에서 더 큰 자식과 비교하며 아래로 내려보낸다.",
  "모든 부모가 자식보다 크거나 같은지 확인한다."
];

const triePseudoCode = [
  "루트에서 시작해 단어를 한 글자씩 처리한다.",
  "현재 노드에 다음 문자 간선이 있는지 확인한다.",
  "문자 노드가 있으면 그 경로로 내려간다.",
  "문자 노드가 없으면 새 노드를 만들고 연결한다.",
  "마지막 문자 노드를 단어 끝으로 표시한다.",
  "prefix 검색은 prefix 문자를 순서대로 따라간다.",
  "prefix 끝 노드 아래의 단어들을 수집한다.",
  "공유 prefix와 검색 결과를 확인한다."
];

const segmentTreePseudoCode = [
  "배열 전체 범위를 루트 구간으로 둔다.",
  "리프 구간이면 배열 값을 노드 합으로 저장한다.",
  "왼쪽과 오른쪽 자식 합을 더해 부모 구간 합을 만든다.",
  "구간 질의는 현재 노드와 질의 범위의 겹침을 확인한다.",
  "겹치지 않으면 0을 반환한다.",
  "완전히 포함되면 저장된 구간 합을 그대로 사용한다.",
  "부분적으로 겹치면 양쪽 결과를 더한다.",
  "점 갱신은 대상 인덱스가 있는 리프까지 내려간다.",
  "리프 값을 바꾼다.",
  "되돌아오며 부모 구간 합을 다시 계산한다."
];

const treeConcepts = [
  {
    id: "bst",
    title: "BST 삽입과 탐색",
    eyebrow: "이진 탐색 트리",
    intro:
      "이진 탐색 트리가 값을 비교하며 내려가고, 새 노드를 붙이고, 탐색 경로와 중위 순회 결과를 만드는 과정을 단계별로 확인합니다.",
    inputSummary: `삽입 값: [${BST_DEFAULT_VALUES.join(", ")}] · 탐색 값: ${BST_SEARCH_TARGET}`,
    diagramLabel: "BST 트리 상태",
    trace: generateBinarySearchTreeTrace(),
    pseudoCode: bstPseudoCode,
    codeExample: binarySearchTreeCodeExample
  },
  {
    id: "avl",
    title: "AVL 회전",
    eyebrow: "균형 이진 탐색 트리",
    intro:
      "AVL 트리가 삽입 후 balance factor를 확인하고 LL, RR, RL 회전으로 높이 균형을 회복하는 과정을 단계별로 확인합니다.",
    inputSummary: `삽입 값: [${AVL_ROTATION_VALUES.join(", ")}] · 포함 회전: LL, RR, RL`,
    diagramLabel: "AVL 트리 상태",
    trace: generateAvlRotationTrace(),
    pseudoCode: avlPseudoCode,
    codeExample: avlTreeCodeExample
  },
  {
    id: "red-black",
    title: "Red-Black 삽입",
    eyebrow: "균형 이진 탐색 트리",
    intro:
      "Red-Black 트리가 새 노드를 빨간색으로 넣은 뒤 재색칠과 회전으로 균형 규칙을 회복하는 과정을 단계별로 확인합니다.",
    inputSummary: `삽입 값: [${RED_BLACK_INSERT_VALUES.join(", ")}] · 포함 복구: 재색칠, LL, LR`,
    diagramLabel: "Red-Black 트리 상태",
    trace: generateRedBlackInsertionTrace(),
    pseudoCode: redBlackPseudoCode,
    codeExample: redBlackTreeCodeExample
  },
  {
    id: "btree",
    title: "B-Tree",
    eyebrow: "다중 key 탐색 트리",
    intro:
      "B-Tree가 한 노드에 여러 key를 보관하고, 가득 찬 노드를 split하며, key 구간에 맞는 자식으로 탐색하는 과정을 확인합니다.",
    inputSummary: `삽입 key: [${BTREE_INSERT_VALUES.join(", ")}] · 탐색 key: ${BTREE_SEARCH_TARGET} · 최대 key 수: 3`,
    diagramLabel: "B-Tree 상태",
    trace: generateBTreeTrace(),
    pseudoCode: bTreePseudoCode,
    codeExample: bTreeCodeExample
  },
  {
    id: "heap",
    title: "최대 힙",
    eyebrow: "완전 이진트리",
    intro:
      "최대 힙이 배열 끝에 값을 넣고 bubble-up으로 부모와 교환한 뒤, 루트 삭제 후 heapify-down으로 힙 속성을 회복하는 과정을 확인합니다.",
    inputSummary: `삽입 값: [${HEAP_INSERT_VALUES.join(", ")}] · 삭제: extractMax`,
    diagramLabel: "최대 힙 트리 상태",
    trace: generateHeapTrace(),
    pseudoCode: heapPseudoCode,
    codeExample: heapTreeCodeExample
  },
  {
    id: "trie",
    title: "트라이",
    eyebrow: "문자열 트리",
    intro:
      "트라이가 문자열을 한 글자씩 공유 경로에 저장하고, prefix 검색으로 해당 경로 아래 단어를 모으는 과정을 확인합니다.",
    inputSummary: `삽입 단어: [${TRIE_WORDS.join(", ")}] · prefix 검색: ${TRIE_PREFIX_TARGET}`,
    diagramLabel: "트라이 상태",
    trace: generateTrieTrace(),
    pseudoCode: triePseudoCode,
    codeExample: trieTreeCodeExample
  },
  {
    id: "segment-tree",
    title: "세그먼트 트리",
    eyebrow: "구간 합 트리",
    intro:
      "세그먼트 트리가 배열을 구간 합 노드로 나누고, range query와 point update를 O(log n) 경로로 처리하는 과정을 확인합니다.",
    inputSummary: `배열: [${SEGMENT_TREE_VALUES.join(", ")}] · query: [${SEGMENT_TREE_QUERY_RANGE.join(", ")}] · update: index ${SEGMENT_TREE_UPDATE.index} = ${SEGMENT_TREE_UPDATE.value}`,
    diagramLabel: "세그먼트 트리 상태",
    trace: generateSegmentTreeTrace(),
    pseudoCode: segmentTreePseudoCode,
    codeExample: segmentTreeCodeExample
  },
  {
    id: "delete",
    title: "BST 삭제",
    eyebrow: "이진 탐색 트리",
    intro:
      "BST에서 리프 노드, 자식이 하나인 노드, 자식이 둘인 노드를 삭제할 때 연결이 어떻게 바뀌는지 단계별로 확인합니다.",
    inputSummary: `초기 값: [${BST_DELETE_INITIAL_VALUES.join(", ")}] · 삭제 값: [${BST_DELETE_TARGETS.join(", ")}]`,
    diagramLabel: "BST 삭제 트리 상태",
    trace: generateBinarySearchTreeDeletionTrace(),
    pseudoCode: deletePseudoCode,
    codeExample: binarySearchTreeDeletionCodeExample
  }
] as const;

const operationLabels = {
  insert: "삽입",
  search: "탐색",
  traversal: "순회",
  rebalance: "균형",
  delete: "삭제"
} as const;

export function TreePage() {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const activeConcept = treeConcepts[activeConceptIndex];
  const trace = activeConcept.trace;
  const controller = useStepController(trace.length, 900);
  const currentIndex = Math.min(controller.currentIndex, trace.length - 1);
  const currentStep = trace[currentIndex];
  const progressPercent =
    trace.length <= 1
      ? 100
      : (currentIndex / (trace.length - 1)) * 100;

  function selectConcept(index: number) {
    setActiveConceptIndex(index);
    controller.reset();
  }

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="tree-title">
        <p className="eyebrow">트리 자료구조</p>
        <h1 id="tree-title">{activeConcept.title}</h1>
        <p className="intro-copy">{activeConcept.intro}</p>
        <div
          className="algorithm-tabs"
          role="tablist"
          aria-label="트리 실습 선택"
        >
          {treeConcepts.map((concept, index) => (
            <button
              aria-selected={activeConceptIndex === index}
              className="algorithm-tab"
              key={concept.id}
              onClick={() => selectConcept(index)}
              role="tab"
              type="button"
            >
              {concept.title}
            </button>
          ))}
        </div>
        <p className="input-summary">{activeConcept.inputSummary}</p>
      </section>

      <section className="tree-workbench" aria-label="트리 실습 작업 영역">
        <section
          className="visualization-layout"
          aria-label={`${activeConcept.title} 도표`}
        >
          <div className="visualization-panel cinematic-panel tree-stage-panel">
            <div className="stage-header">
              <div>
                <p className="eyebrow">
                  {activeConcept.eyebrow} · {operationLabels[currentStep.state.operation]} 단계
                </p>
                <h2>스테이지: {currentStep.title}</h2>
              </div>
              <span className="stage-counter">
                {currentIndex + 1} / {trace.length}
              </span>
            </div>

            <TreeDiagram
              label={activeConcept.diagramLabel}
              state={currentStep.state}
            />

            <HeapArrayStrip state={currentStep.state} />
            <SegmentArrayStrip state={currentStep.state} />

            <div className="stage-state-list" aria-label="현재 트리 단계 요약">
              {(currentStep.state.summaryItems ?? []).map((item) => (
                <div className="stage-state-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="stage-legend" aria-label="트리 상태 범례">
              <span className="legend-title">상태 범례</span>
              <span className="legend-item">
                <span className="legend-swatch is-current" />
                현재
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-comparing" />
                비교
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-write" />
                삽입
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-rotated" />
                회전
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-swapping" />
                교환
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-red-node" />
                빨강
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-black-node" />
                검정
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-recolored" />
                색 변경
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-removing" />
                삭제
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-successor" />
                successor
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-terminal" />
                단어 끝
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-range" />
                구간
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-updated" />
                갱신
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-sorted" />
                방문
              </span>
            </div>

            <div className="timeline-controls" aria-label="트리 단계 재생 컨트롤">
              <div className="timeline-row">
                <button
                  type="button"
                  onClick={controller.goPrevious}
                  disabled={controller.isFirstStep}
                >
                  이전
                </button>
                <button
                  className="primary-control"
                  type="button"
                  onClick={controller.togglePlay}
                  disabled={controller.isLastStep}
                >
                  {controller.isPlaying ? "정지" : "자동 재생"}
                </button>
                <button
                  aria-label="트리 다음 단계"
                  disabled={controller.isLastStep}
                  onClick={controller.goNext}
                  type="button"
                >
                  다음
                </button>
              </div>

              <label className="timeline-slider-label" htmlFor="tree-step-slider">
                <span>수동 단계 이동</span>
                <input
                  id="tree-step-slider"
                  type="range"
                  min="0"
                  max={trace.length - 1}
                  value={currentIndex}
                  onChange={(event) =>
                    controller.goToStep(Number(event.currentTarget.value))
                  }
                  aria-label="트리 단계 슬라이더"
                  style={{ "--progress": `${progressPercent}%` } as CSSProperties}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="code-example-section" aria-label={`${activeConcept.title} 코드`}>
          <div className="code-example-header">
            <div>
              <h2>코드 예제</h2>
              <p>단계가 바뀌면 비교, 재귀 이동, 방문 코드가 함께 강조됩니다.</p>
            </div>
            <span className="code-file-name">{activeConcept.codeExample.fileName}</span>
          </div>

          <div className="code-panel" role="tabpanel">
            <ol className="code-lines">
              {activeConcept.codeExample.code.split("\n").map((line, index) => {
                const lineNumber = index + 1;
                const activeLines =
                  currentStep.codeLineHighlights?.[
                    activeConcept.codeExample.language
                  ] ?? [];
                const isActive = activeLines.includes(lineNumber);

                return (
                  <li
                    aria-label={
                      isActive
                        ? `현재 코드 ${lineNumber}: ${line.trim()}`
                        : `코드 ${lineNumber}: ${line.trim()}`
                    }
                    className={isActive ? "code-line is-active" : "code-line"}
                    key={lineNumber}
                  >
                    <span className="code-line-number">{lineNumber}</span>
                    <code className="code-line-text">{line}</code>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </section>

      <section className="step-pseudo-layout" aria-label="트리 의사 코드와 요약">
        <div className="pseudo-panel">
          <h2>트리 처리 순서</h2>
          <ol className="pseudo-code">
            {activeConcept.pseudoCode.map((line, index) => (
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

        <aside className="step-panel" aria-label="현재 트리 단계 설명">
          <h2>현재 단계</h2>
          <p className="step-count">
            {currentIndex + 1} / {trace.length}
          </p>
          <h3>{currentStep.title}</h3>
          <p>{currentStep.description}</p>
          {currentStep.state.traversalValues?.length ? (
            <p className="tree-traversal-output">
              순회 결과: {currentStep.state.traversalValues.join(" → ")}
            </p>
          ) : null}
          {currentStep.state.wordResults?.length ? (
            <p className="tree-traversal-output">
              검색 결과: {currentStep.state.wordResults.join(", ")}
            </p>
          ) : null}
          {currentStep.state.segmentResult !== undefined ? (
            <p className="tree-traversal-output">
              구간 합 결과: {currentStep.state.segmentResult}
            </p>
          ) : null}

          <div className="step-controls" aria-label="트리 단계 컨트롤">
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
    </main>
  );
}

type TreeDiagramProps = {
  label: string;
  state: TreeTraceState;
};

function TreeDiagram({ label, state }: TreeDiagramProps) {
  return (
    <div className="tree-visual-scroll">
      <svg
        aria-label={label}
        className={`tree-visual motion-${state.motion}`}
        role="img"
        viewBox={`0 0 ${state.viewport.width} ${state.viewport.height}`}
      >
        <g className="tree-edges">
          {state.edges.map((edge) => (
            <line
              className={getEdgeClassName(edge, state)}
              key={edge.id}
              x1={edge.fromX}
              y1={edge.fromY}
              x2={edge.toX}
              y2={edge.toY}
            />
          ))}
        </g>
        <g className="tree-nodes">
          {state.nodes.map((node) => (
            <g
              aria-label={getNodeAriaLabel(node)}
              className={getNodeClassName(node, state)}
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
            >
              {node.shape === "key-list" ? (
                <KeyListNode node={node} />
              ) : (
                <>
                  <circle r="23" />
                  <text dy="6">{node.label ?? node.value}</text>
                  {state.balanceFactors?.[node.id] !== undefined ? (
                    <text className="tree-balance-label" dy="39">
                      BF {state.balanceFactors[node.id]}
                    </text>
                  ) : null}
                  {node.subLabel !== undefined ? (
                    <text className="tree-node-note" dy="39">
                      {node.subLabel}
                    </text>
                  ) : null}
                </>
              )}
            </g>
          ))}
        </g>
        {state.nodes.length === 0 ? (
          <text className="tree-empty-label" x="50%" y="50%">
            빈 트리
          </text>
        ) : null}
      </svg>
    </div>
  );
}

function KeyListNode({ node }: { node: TreeNodeState }) {
  const keys = node.keyValues ?? [];
  const width = node.width ?? Math.max(86, keys.length * 42 + 24);
  const cellCount = Math.max(keys.length, 1);
  const cellWidth = width / cellCount;

  return (
    <>
      <rect
        className="tree-key-box"
        height="46"
        rx="8"
        width={width}
        x={-width / 2}
        y="-23"
      />
      {keys.length === 0 ? (
        <text dy="6">빈</text>
      ) : (
        keys.map((key, index) => (
          <text
            className="tree-key-text"
            dy="6"
            key={`${node.id}-${key}`}
            x={-width / 2 + cellWidth * index + cellWidth / 2}
          >
            {key}
          </text>
        ))
      )}
      {keys.slice(1).map((key, index) => {
        const x = -width / 2 + cellWidth * (index + 1);

        return (
          <line
            className="tree-key-divider"
            key={`${node.id}-divider-${key}`}
            x1={x}
            x2={x}
            y1="-18"
            y2="18"
          />
        );
      })}
      {node.subLabel !== undefined ? (
        <text className="tree-node-note" dy="43">
          {node.subLabel}
        </text>
      ) : null}
    </>
  );
}

function getNodeClassName(node: TreeNodeState, state: TreeTraceState): string {
  const classNames = ["tree-node"];

  if (node.color === "red") {
    classNames.push("is-red");
  }

  if (node.color === "black") {
    classNames.push("is-black");
  }

  if (node.depth === 0) {
    classNames.push("is-root");
  }

  if (state.pathNodeIds?.includes(node.id)) {
    classNames.push("is-path");
  }

  if (state.visitedNodeIds?.includes(node.id)) {
    classNames.push("is-visited");
  }

  if (state.activeNodeId === node.id) {
    classNames.push("is-active");
  }

  if (state.comparedNodeId === node.id) {
    classNames.push("is-compared");
  }

  if (state.insertedNodeId === node.id) {
    classNames.push("is-inserted");
  }

  if (state.foundNodeId === node.id) {
    classNames.push("is-found");
  }

  if (state.removedNodeId === node.id) {
    classNames.push("is-removing");
  }

  if (state.successorNodeId === node.id) {
    classNames.push("is-successor");
  }

  if (state.recoloredNodeIds?.includes(node.id)) {
    classNames.push("is-recolored");
  }

  if (state.swappedNodeIds?.includes(node.id)) {
    classNames.push("is-swapping");
  }

  if (state.terminalNodeIds?.includes(node.id)) {
    classNames.push("is-terminal");
  }

  if (state.rotatedNodeIds?.includes(node.id)) {
    classNames.push("is-rotated");
  }

  return classNames.join(" ");
}

function HeapArrayStrip({ state }: { state: TreeTraceState }) {
  if (state.heapArrayValues === undefined) {
    return null;
  }

  return (
    <div className="heap-array-strip" aria-label="힙 배열 상태">
      <span className="heap-array-title">배열</span>
      <div className="heap-array-cells">
        {state.heapArrayValues.map((value, index) => {
          const nodeId = `heap-index-${index}`;

          return (
            <span
              className={getHeapArrayCellClassName(nodeId, state)}
              key={`${nodeId}-${value}`}
            >
              <strong>{index}</strong>
              <span>{value}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function SegmentArrayStrip({ state }: { state: TreeTraceState }) {
  if (state.segmentArrayValues === undefined) {
    return null;
  }

  return (
    <div className="segment-array-strip" aria-label="세그먼트 배열 상태">
      <span className="segment-array-title">원본 배열</span>
      <div className="segment-array-cells">
        {state.segmentArrayValues.map((value, index) => (
          <span
            className={getSegmentArrayCellClassName(index, state)}
            key={`segment-array-${index}`}
          >
            <strong>{index}</strong>
            <span>{value}</span>
          </span>
        ))}
      </div>
      {state.segmentQueryRange !== undefined ? (
        <span className="segment-array-note">
          query [{state.segmentQueryRange.join(", ")}]
        </span>
      ) : null}
      {state.segmentUpdate !== undefined ? (
        <span className="segment-array-note">
          update index {state.segmentUpdate.index} = {state.segmentUpdate.value}
        </span>
      ) : null}
    </div>
  );
}

function getHeapArrayCellClassName(
  nodeId: string,
  state: TreeTraceState
): string {
  const classNames = ["heap-array-cell"];

  if (state.activeNodeId === nodeId) {
    classNames.push("is-active");
  }

  if (state.comparedNodeId === nodeId) {
    classNames.push("is-compared");
  }

  if (state.insertedNodeId === nodeId) {
    classNames.push("is-inserted");
  }

  if (state.removedNodeId === nodeId) {
    classNames.push("is-removing");
  }

  if (state.swappedNodeIds?.includes(nodeId)) {
    classNames.push("is-swapping");
  }

  return classNames.join(" ");
}

function getSegmentArrayCellClassName(
  index: number,
  state: TreeTraceState
): string {
  const classNames = ["segment-array-cell"];
  const [queryLeft, queryRight] = state.segmentQueryRange ?? [-1, -1];

  if (queryLeft <= index && index <= queryRight) {
    classNames.push("is-query");
  }

  if (state.activeArrayIndices?.includes(index)) {
    classNames.push("is-active");
  }

  if (state.segmentUpdate?.index === index) {
    classNames.push("is-updated");
  }

  return classNames.join(" ");
}

function getNodeAriaLabel(node: TreeNodeState): string {
  if (node.keyValues !== undefined) {
    const keys = node.keyValues.length ? node.keyValues.join(", ") : "빈";

    return `키 ${keys} ${node.subLabel ?? ""} 노드`.trim();
  }

  if (node.label !== undefined) {
    return `${node.label} 노드`;
  }

  if (node.subLabel !== undefined) {
    return `${node.value} ${node.subLabel} 노드`;
  }

  if (node.color === "red") {
    return `${node.value} 빨간 노드`;
  }

  if (node.color === "black") {
    return `${node.value} 검정 노드`;
  }

  return `${node.value} 노드`;
}

function getEdgeClassName(edge: TreeEdgeState, state: TreeTraceState): string {
  const classNames = ["tree-edge"];
  const path = state.pathNodeIds ?? [];

  if (path.includes(edge.fromId) && path.includes(edge.toId)) {
    classNames.push("is-path");
  }

  return classNames.join(" ");
}
