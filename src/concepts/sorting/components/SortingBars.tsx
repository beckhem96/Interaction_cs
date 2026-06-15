import type { SortingState } from "../types";

type SortingBarsProps = {
  state: SortingState;
};

const chartHeight = 240;
type MotionState =
  | "idle"
  | "scan"
  | "compare"
  | "swap"
  | "shift"
  | "write"
  | "key"
  | "minimum"
  | "pivot"
  | "sorted"
  | "complete";

export function SortingBars({ state }: SortingBarsProps) {
  const maxValue = Math.max(...state.array);
  const barWidth = state.array.length > 8 ? 44 : 58;
  const barGap = state.array.length > 8 ? 10 : 18;
  const chartWidth = state.array.length * barWidth + (state.array.length - 1) * barGap;
  const motionState = getMotionState(state);

  return (
    <figure
      className={`sorting-visual motion-${motionState}`}
      data-motion={motionState}
    >
      <svg
        aria-label="정렬 배열 상태"
        role="img"
        viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
      >
        {state.array.map((value, index) => {
          const height = (value / maxValue) * chartHeight;
          const x = index * (barWidth + barGap);
          const y = chartHeight - height;
          const className = getBarClassName(state, index);

          return (
            <g key={index} transform={`translate(${x} 0)`}>
              <rect
                className={className}
                width={barWidth}
                height={height}
                x={0}
                y={y}
                rx={6}
              />
              <text className="bar-value" x={barWidth / 2} y={y - 10}>
                {value}
              </text>
              <text className="bar-index" x={barWidth / 2} y={chartHeight + 28}>
                {index}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption
        aria-label="배열 인덱스와 값"
        className="sorting-array-cells"
        style={{ gridTemplateColumns: `repeat(${state.array.length}, minmax(34px, 1fr))` }}
      >
        {state.array.map((value, index) => (
          <span
            aria-label={`${index}번 인덱스, 값 ${value}`}
            className={getCellClassName(state, index)}
            key={index}
          >
            <span className="array-cell-index">{index}</span>
            <span className="array-cell-value">{value}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

function getMotionState(state: SortingState): MotionState {
  if (state.swappingIndices?.length) {
    return "swap";
  }

  if (state.shiftedIndices?.length) {
    return "shift";
  }

  if (state.writeIndex !== undefined) {
    return "write";
  }

  if (state.comparingIndices?.length) {
    return "compare";
  }

  if (state.keyIndex !== undefined) {
    return "key";
  }

  if (state.minimumIndex !== undefined) {
    return "minimum";
  }

  if (state.pivotIndex !== undefined) {
    return "pivot";
  }

  if (state.currentIndex !== undefined || state.scanningIndex !== undefined) {
    return "scan";
  }

  if (state.sortedIndices?.length === state.array.length) {
    return "complete";
  }

  if (state.sortedIndices?.length) {
    return "sorted";
  }

  return "idle";
}

function getBarClassName(state: SortingState, index: number): string {
  return ["sorting-bar", ...getStateClassNames(state, index)].join(" ");
}

function getCellClassName(state: SortingState, index: number): string {
  return ["array-cell", ...getStateClassNames(state, index)].join(" ");
}

function getStateClassNames(state: SortingState, index: number): string[] {
  const classNames: string[] = [];

  if (isInRange(state.partitionRange, index)) {
    classNames.push("is-partition-range");
  }

  if (isInRange(state.mergeRange, index)) {
    classNames.push("is-merge-range");
  }

  if (isInRange(state.leftRange, index)) {
    classNames.push("is-left-range");
  }

  if (isInRange(state.rightRange, index)) {
    classNames.push("is-right-range");
  }

  if (state.sortedIndices?.includes(index)) {
    classNames.push("is-sorted");
  }

  if (state.currentIndex === index) {
    classNames.push("is-current");
  }

  if (state.scanningIndex === index) {
    classNames.push("is-scanning");
  }

  if (state.keyIndex === index) {
    classNames.push("is-key");
  }

  if (state.minimumIndex === index) {
    classNames.push("is-minimum");
  }

  if (state.pivotIndex === index) {
    classNames.push("is-pivot");
  }

  if (state.shiftedIndices?.includes(index)) {
    classNames.push("is-shifted");
  }

  if (state.comparingIndices?.includes(index)) {
    classNames.push("is-comparing");
  }

  if (state.swappingIndices?.includes(index)) {
    classNames.push("is-swapping");
  }

  if (state.writeIndex === index) {
    classNames.push("is-write");
  }

  return classNames;
}

function isInRange(range: [number, number] | undefined, index: number): boolean {
  return range !== undefined && index >= range[0] && index <= range[1];
}
