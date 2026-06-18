import { type CSSProperties, useState } from "react";
import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { tokenizeSqlLine } from "../code/sqlSyntaxHighlight";
import { generateSqlOperationExamples } from "../engine/selectLogicalExecution";
import type {
  DatabaseCellHighlight,
  DatabaseCellValue,
  DatabaseInputTableState,
  DatabaseRow,
  DatabaseRowMotion,
  SqlLogicalPhase,
} from "../types";

const sqlExamples = generateSqlOperationExamples();

const phaseLabels: Record<SqlLogicalPhase, string> = {
  from: "FROM",
  join: "JOIN",
  where: "WHERE",
  groupBy: "GROUP BY",
  having: "HAVING",
  select: "SELECT",
  union: "UNION",
  window: "WINDOW",
  orderBy: "ORDER BY",
  limit: "LIMIT",
};

export function DatabasePage() {
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const activeExample = sqlExamples[activeExampleIndex]!;
  const controller = useStepController(activeExample.trace.length, 900);
  const currentIndex = Math.min(controller.currentIndex, activeExample.trace.length - 1);
  const currentStep = activeExample.trace[currentIndex]!;
  const cellHighlights = currentStep.state.cellHighlights ?? [];
  const progressPercent =
    activeExample.trace.length <= 1
      ? 100
      : (currentIndex / (activeExample.trace.length - 1)) * 100;

  function selectExample(index: number) {
    setActiveExampleIndex(index);
    controller.reset();
  }

  return (
    <main className="page-shell learning-page database-cinematic-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="database-title">
        <p className="eyebrow">데이터베이스</p>
        <h1 id="database-title">{activeExample.title}</h1>
        <p className="intro-copy">{activeExample.intro}</p>
        <p className="database-helper-copy">
          이 워크벤치는 임의 SQL 입력이 아니라 검증된 고정 예제를 단계별로 추적합니다.
        </p>
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
                type="button"
                onClick={controller.togglePlay}
                disabled={controller.isLastStep}
              >
                {controller.isPlaying ? "정지" : "자동 재생"}
              </button>
              <button
                aria-label="SQL 다음 단계"
                className="primary-control"
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

          <SqlInputTables
            cellHighlights={cellHighlights}
            tables={currentStep.state.inputTables ?? []}
          />

          <section className="sql-output-section" aria-label="SQL 결과 테이블">
            <h3>결과 테이블</h3>
            <SqlDataTable
              activeColumns={currentStep.state.activeColumns ?? []}
              activeRowKeys={currentStep.state.activeRowKeys ?? []}
              ariaLabel="SQL 중간 결과 테이블"
              cellHighlights={cellHighlights.filter((highlight) => highlight.scope === "output")}
              emptyMessage="이 단계에서는 아직 결과 행이 없습니다."
              rowMotionByKey={currentStep.state.rowMotionByKey ?? {}}
              rows={currentStep.state.rows}
            />
          </section>
        </section>

        <section className="sql-query-section" aria-label="SQL 쿼리">
          <div className="code-example-header">
            <div>
              <h2>SQL 쿼리</h2>
              <p>현재 단계에 해당하는 쿼리 라인을 강조합니다.</p>
            </div>
            <span className="code-file-name">query.sql</span>
          </div>
          <SqlQueryBlock
            activeLines={currentStep.state.activeQueryLines}
            query={currentStep.state.query}
          />

          <div className="pseudo-panel sql-pseudo-panel">
            <h2>논리 처리 순서</h2>
            <ol className="pseudo-code">
              {activeExample.pseudoCode.map((line, index) => (
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
        </section>
      </section>

      <aside className="step-panel sql-step-panel" aria-label="현재 SQL 단계 설명">
        <h2>현재 단계</h2>
        <p className="step-count">
          {currentIndex + 1} / {activeExample.trace.length}
        </p>
        <h3>{currentStep.title}</h3>
        <p>{currentStep.description}</p>
      </aside>
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
              <code>
                {tokenizeSqlLine(line).map((token, tokenIndex) => (
                  <span
                    className={`sql-token-${token.type}`}
                    key={`${token.text}-${tokenIndex}`}
                  >
                    {token.text}
                  </span>
                ))}
              </code>
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

type SqlInputTablesProps = {
  cellHighlights: DatabaseCellHighlight[];
  tables: DatabaseInputTableState[];
};

function SqlInputTables({ cellHighlights, tables }: SqlInputTablesProps) {
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
              cellHighlights={cellHighlights.filter(
                (highlight) =>
                  highlight.scope === "input" && highlight.tableName === table.name,
              )}
              emptyMessage={`${table.name}에서 표시할 행이 없습니다.`}
              rowMotionByKey={table.rowMotionByKey ?? {}}
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
  cellHighlights?: DatabaseCellHighlight[];
  emptyMessage?: string;
  rowMotionByKey?: Record<string, DatabaseRowMotion>;
  rows: DatabaseRow[];
};

function SqlDataTable({
  activeColumns,
  activeRowKeys = [],
  ariaLabel,
  cellHighlights = [],
  emptyMessage = "표시할 행이 없습니다.",
  rowMotionByKey = {},
  rows,
}: SqlDataTableProps) {
  const columns = rows.length > 0 ? Object.keys(rows[0]!).filter((column) => !column.startsWith("__")) : [];
  const activeRowKeySet = new Set(activeRowKeys);
  const highlightByCell = new Map(
    cellHighlights.map((highlight) => [
      `${highlight.rowKey}:${highlight.column}`,
      highlight,
    ]),
  );

  return (
    <div className="sql-table-scroll">
      {rows.length === 0 ? (
        <p className="sql-empty-state" role="status">
          {emptyMessage}
        </p>
      ) : null}
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
                {columns.map((column) => {
                  const highlight = highlightByCell.get(`${rowKey}:${column}`);
                  const className = [
                    activeColumns.includes(column) ? "is-active-column" : "",
                    highlight ? `sql-cell-highlight-${highlight.tone}` : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <td
                      className={className}
                      data-cell-highlight={highlight?.tone}
                      key={column}
                    >
                      {formatCellValue(row[column])}
                    </td>
                  );
                })}
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
  if (row.__rowKey !== undefined) {
    return String(row.__rowKey);
  }

  if (row.cid !== undefined && row.status !== undefined && row.color !== undefined) {
    return `${row.cid}:${row.status}:${row.color}`;
  }

  if (row.cid !== undefined && row.status !== undefined && row.product_id !== undefined) {
    return `${row.cid}:${row.status}:${row.product_id}`;
  }

  if (row.source !== undefined && row.email !== undefined) {
    return `${row.source}:${row.email}`;
  }

  return String(
    row.order_id ??
      row.id ??
      row.client_id ??
      row.email ??
      row.product ??
      row.region ??
      row.department ??
      JSON.stringify(row),
  );
}
