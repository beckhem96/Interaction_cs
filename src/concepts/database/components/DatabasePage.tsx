import { Link } from "react-router";

import { useStepController } from "../../shared/useStepController";
import { generateSelectLogicalExecutionTrace } from "../engine/selectLogicalExecution";
import type { DatabaseCellValue } from "../types";

const trace = generateSelectLogicalExecutionTrace();

const pseudoCode = [
  "FROM 절의 기준 테이블을 읽는다.",
  "조건 amount >= 50을 만족하는 행만 남긴다.",
  "region 값을 기준으로 행을 그룹화한다.",
  "집계 결과에 HAVING 조건을 적용한다.",
  "SELECT 절의 출력 열과 별칭을 만든다.",
  "ORDER BY 기준으로 최종 결과를 정렬한다."
];

export function DatabasePage() {
  const controller = useStepController(trace.length);
  const currentStep = trace[controller.currentIndex];

  return (
    <main className="page-shell learning-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>

      <section className="learning-header" aria-labelledby="database-title">
        <p className="eyebrow">데이터베이스</p>
        <h1 id="database-title">SQL 논리 실행 순서</h1>
        <p className="intro-copy">
          SELECT 문이 작성 순서가 아니라 논리 처리 순서에 따라 중간 결과를
          만들어 가는 과정을 단계별로 확인합니다.
        </p>
      </section>

      <section className="sql-query-section" aria-label="SQL 예제">
        <h2>SQL 예제</h2>
        <pre className="sql-query">
          <code>{currentStep.state.query}</code>
        </pre>
      </section>

      <section className="database-step-layout" aria-label="SQL 실행 단계">
        <div className="database-table-panel">
          <div className="database-table-header">
            <div>
              <p className="eyebrow">현재 논리 단계</p>
              <h2>{currentStep.title}</h2>
            </div>
            <span className={`phase-badge phase-${currentStep.state.phase}`}>
              {currentStep.state.phase}
            </span>
          </div>

          <SqlResultTable rows={currentStep.state.rows} />
        </div>

        <aside className="step-panel" aria-label="현재 SQL 단계 설명">
          <h2>현재 단계</h2>
          <p className="step-count">
            {controller.currentIndex + 1} / {trace.length}
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

        <div className="summary-panel">
          <h2>핵심 요약</h2>
          <dl className="complexity-list">
            <div>
              <dt>주의</dt>
              <dd>논리 실행 순서는 학습용 모델이며 실제 실행 계획은 옵티마이저가 바꿀 수 있습니다.</dd>
            </div>
            <div>
              <dt>핵심</dt>
              <dd>WHERE는 그룹 전 행 필터, HAVING은 그룹 후 집계 필터입니다.</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}

type SqlResultTableProps = {
  rows: Record<string, DatabaseCellValue>[];
};

function SqlResultTable({ rows }: SqlResultTableProps) {
  const columns = rows.length > 0 ? Object.keys(rows[0]!) : [];

  return (
    <div className="sql-table-scroll">
      <table className="sql-result-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${Object.values(row).join("-")}`}>
              {columns.map((column) => (
                <td key={column}>{formatCellValue(row[column])}</td>
              ))}
            </tr>
          ))}
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
