import type { SortingState } from "../types";

type SortingBarsProps = {
  state: SortingState;
};

const chartHeight = 220;
const barWidth = 58;
const barGap = 18;

export function SortingBars({ state }: SortingBarsProps) {
  const maxValue = Math.max(...state.array);
  const chartWidth = state.array.length * barWidth + (state.array.length - 1) * barGap;

  return (
    <figure className="sorting-visual">
      <svg
        aria-label="버블 정렬 배열 상태"
        role="img"
        viewBox={`0 0 ${chartWidth} ${chartHeight + 34}`}
      >
        {state.array.map((value, index) => {
          const height = (value / maxValue) * chartHeight;
          const x = index * (barWidth + barGap);
          const y = chartHeight - height;
          const className = getBarClassName(state, index);

          return (
            <g key={`${index}-${value}`} transform={`translate(${x} 0)`}>
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
              <text className="bar-index" x={barWidth / 2} y={chartHeight + 26}>
                {index}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

function getBarClassName(state: SortingState, index: number): string {
  const classNames = ["sorting-bar"];

  if (state.sortedIndices?.includes(index)) {
    classNames.push("is-sorted");
  }

  if (state.currentIndex === index) {
    classNames.push("is-current");
  }

  if (state.scanningIndex === index) {
    classNames.push("is-scanning");
  }

  if (state.minimumIndex === index) {
    classNames.push("is-minimum");
  }

  if (state.comparingIndices?.includes(index)) {
    classNames.push("is-comparing");
  }

  if (state.swappingIndices?.includes(index)) {
    classNames.push("is-swapping");
  }

  return classNames.join(" ");
}
