import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { generateSelectLogicalExecutionTrace } from "../engine/selectLogicalExecution";
import type {
  DatabaseCellValue,
  DatabaseInputTableState,
  DatabaseRow,
  DatabaseRowMotion,
  SqlLogicalPhase
} from "../types";

const fullTrace = generateSelectLogicalExecutionTrace();

const sqlExamples = [
  {
    id: "join",
    title: "SQL: JOIN",
    tabLabel: "JOIN",
    intro: "sales와 regions 두 테이블의 region 열을 맞춰 주문 행에 담당자 정보를 붙입니다.",
    trace: fullTrace.slice(0, 2)
  },
  {
    id: "group-by",
    title: "SQL: GROUP BY",
    tabLabel: "GROUP BY",
    intro: "조건을 통과한 행을 manager와 region으로 묶고 합계와 개수를 계산합니다.",
    trace: fullTrace.slice(2, 4)
  },
  {
    id: "having-select",
    title: "SQL: HAVING / SELECT",
    tabLabel: "HAVING",
    intro: "집계된 그룹에 HAVING 조건을 적용하고 최종 출력 열과 별칭을 만듭니다.",
    trace: fullTrace.slice(4, 6)
  },
  {
    id: "union",
    title: "SQL: UNION ALL",
    tabLabel: "UNION",
    intro: "첫 번째 SELECT 결과와 online_sales 집계 결과를 같은 열 구조로 아래에 붙입니다.",
    trace: fullTrace.slice(5, 7)
  },
  {
    id: "order-limit",
    title: "SQL: ORDER BY / LIMIT",
    tabLabel: "ORDER/LIMIT",
    intro: "UNION 결과를 total_amount 기준으로 정렬하고 상위 행만 남깁니다.",
    trace: fullTrace.slice(7, 9)
  }
] as const;

const pseudoCode = [
  "FROM 절의 기준 테이블을 읽는다.",
  "JOIN 조건으로 관련 테이블의 열을 붙인다.",
  "조건 amount >= 50을 만족하는 행만 남긴다.",
  "담당자와 지역 값을 기준으로 행을 그룹화한다.",
  "집계 결과에 HAVING 조건을 적용한다.",
  "SELECT 절의 출력 열과 별칭을 만든다.",
  "UNION ALL로 같은 형태의 결과를 이어 붙인다.",
  "ORDER BY 기준으로 최종 결과를 정렬한다.",
  "LIMIT으로 반환할 행 수를 제한한다."
];

const phaseLabels: Record<SqlLogicalPhase, string> = {
  from: "FROM",
  join: "JOIN",
  where: "WHERE",
  groupBy: "GROUP BY",
  having: "HAVING",
  select: "SELECT",
  union: "UNION ALL",
  orderBy: "ORDER BY",
  limit: "LIMIT"
};

export function DatabasePage() {
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const activeExample = sqlExamples[activeExampleIndex];
  const controller = useStepController(activeExample.trace.length, 900);
  const currentIndex = Math.min(controller.currentIndex, activeExample.trace.length - 1);
  const currentStep = activeExample.trace[currentIndex];
  const progressPercent =
    activeExample.trace.length <= 1
      ? 100
      : (currentIndex / (activeExample.trace.length - 1)) * 100;

  function selectExample(index: number) {
    setActiveExampleIndex(index);
    controller.reset();
  }

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="database-title">
        <p className="eyebrow">데이터베이스</p>
        <h1 id="database-title">{activeExample.title}</h1>
        <p className="intro-copy">{activeExample.intro}</p>
        <div className="algorithm-tabs" role="tablist" aria-label="SQL 동작 선택">
          {sqlExamples.map((example, index) => (
            <button
              aria-selected={activeExampleIndex === index}
              className="algorithm-tab"
              key={example.id}
              onClick={() => selectExample(index)}
              role="tab"
              type="button"
            >
              {example.tabLabel}
            </button>
          ))}
        </div>
      </section>

      <section className="database-workbench" aria-label="SQL 실행 작업 영역">
        <section className="database-table-panel" aria-label="SQL 테이블 변화">
          <div className="database-table-header">
            <div>
              <p className="eyebrow">인터랙션 스테이지</p>
              <h2>{currentStep.title}</h2>
            </div>
            <span className={`phase-badge phase-${currentStep.state.phase}`}>
              {phaseLabels[currentStep.state.phase]}
            </span>
          </div>

          <SqlStageSummary items={currentStep.state.summaryItems ?? []} />

          <SqlInputTables tables={currentStep.state.inputTables ?? []} />

          <section className="sql-output-section" aria-label="SQL 결과 테이블">
            <h3>결과 테이블</h3>
            <SqlDataTable
              activeColumns={currentStep.state.activeColumns ?? []}
              ariaLabel="SQL 중간 결과 테이블"
              rowMotionByKey={currentStep.state.rowMotionByKey ?? {}}
              rows={currentStep.state.rows}
            />
          </section>

          <div className="timeline-controls" aria-label="SQL 단계 재생 컨트롤">
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
                aria-label="SQL 다음 단계"
                type="button"
                onClick={controller.goNext}
                disabled={controller.isLastStep}
              >
                다음
              </button>
            </div>

            <label className="timeline-slider-label" htmlFor="sql-step-slider">
              <span>수동 단계 이동</span>
              <input
                id="sql-step-slider"
                type="range"
                min="0"
                max={activeExample.trace.length - 1}
                value={currentIndex}
                onChange={(event) =>
                  controller.goToStep(Number(event.currentTarget.value))
                }
                aria-label="SQL 단계 슬라이더"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
              />
            </label>
          </div>
        </section>

        <section className="sql-query-section" aria-label="SQL 쿼리">
          <div className="code-example-header">
            <div>
              <h2>SQL 쿼리</h2>
              <p>현재 단계에 해당하는 쿼리 라인이 강조됩니다.</p>
            </div>
            <span className="code-file-name">query.sql</span>
          </div>
          <SqlQueryBlock
            activeLines={currentStep.state.activeQueryLines}
            query={currentStep.state.query}
          />
        </section>
      </section>

      <section className="step-pseudo-layout" aria-label="SQL 의사 코드와 요약">
        <div className="pseudo-panel">
          <h2>논리 처리 순서</h2>
          <ol className="pseudo-code">
            {pseudoCode.map((line, index) => (
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

        <aside className="step-panel" aria-label="현재 SQL 단계 설명">
          <h2>현재 단계</h2>
          <p className="step-count">
            {currentIndex + 1} / {activeExample.trace.length}
          </p>
          <h3>{currentStep.title}</h3>
          <p>{currentStep.description}</p>
        </aside>
      </section>
    </main>
  );
}

type SqlQueryBlockProps = {
  activeLines: number[];
  query: string;
};

function SqlQueryBlock({ activeLines, query }: SqlQueryBlockProps) {
  return (
    <pre className="sql-query">
      <ol className="sql-query-lines" aria-label="실행 중인 SQL 쿼리">
        {query.split("\n").map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLines.includes(lineNumber);

          return (
            <li
              aria-current={isActive ? "step" : undefined}
              aria-label={
                isActive
                  ? `현재 쿼리 ${lineNumber}: ${line}`
                  : `쿼리 ${lineNumber}: ${line}`
              }
              className={isActive ? "sql-query-line is-active" : "sql-query-line"}
              key={`${lineNumber}-${line}`}
            >
              <span className="sql-query-line-number">{lineNumber}</span>
              <code>{line}</code>
            </li>
          );
        })}
      </ol>
    </pre>
  );
}

type SqlStageSummaryProps = {
  items: { label: string; value: string }[];
};

function SqlStageSummary({ items }: SqlStageSummaryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <dl className="sql-stage-summary" aria-label="현재 SQL 단계 요약">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SqlInputTables({ tables }: { tables: DatabaseInputTableState[] }) {
  if (tables.length === 0) {
    return null;
  }

  return (
    <section className="sql-input-section" aria-label="SQL 입력 테이블">
      <h3>입력 테이블</h3>
      <div className="sql-input-grid">
        {tables.map((table) => (
          <div className="sql-input-card" key={table.name}>
            <h4>{table.name}</h4>
            <SqlDataTable
              activeColumns={table.activeColumns ?? []}
              activeRowKeys={table.activeRowKeys ?? []}
              ariaLabel={`${table.name} 입력 테이블`}
              rows={table.rows}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

type SqlDataTableProps = {
  activeColumns: string[];
  activeRowKeys?: string[];
  ariaLabel: string;
  rowMotionByKey?: Record<string, DatabaseRowMotion>;
  rows: DatabaseRow[];
};

function SqlDataTable({
  activeColumns,
  activeRowKeys = [],
  ariaLabel,
  rowMotionByKey = {},
  rows
}: SqlDataTableProps) {
  const columns = rows.length > 0 ? Object.keys(rows[0]!) : [];
  const activeRowKeySet = new Set(activeRowKeys);

  return (
    <div className="sql-table-scroll">
      <table className="sql-result-table" aria-label={ariaLabel}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={activeColumns.includes(column) ? "is-active-column" : ""}
                key={column}
                scope="col"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const rowKey = getDatabaseRowKey(row);
            const motion = rowMotionByKey[rowKey];
            const isActiveRow = activeRowKeySet.has(rowKey);

            return (
              <tr
                className={motion ? `sql-row-motion-${motion}` : ""}
                data-motion={motion}
                data-active-row={isActiveRow ? "true" : undefined}
                key={`${rowIndex}-${rowKey}`}
              >
                {columns.map((column) => (
                  <td
                    className={activeColumns.includes(column) ? "is-active-column" : ""}
                    key={column}
                  >
                    {formatCellValue(row[column])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatCellValue(value: DatabaseCellValue): string {
  if (value === null) {
    return "NULL";
  }

  return String(value);
}

function getDatabaseRowKey(row: DatabaseRow): string {
  return Object.entries(row)
    .map(([key, value]) => `${key}:${String(value)}`)
    .join("|");
}
