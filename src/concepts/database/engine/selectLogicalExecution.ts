import type { TraceStep } from "../../shared/types";
import type { DatabaseTraceState } from "../types";

export const salesRows = [
  { id: 1, region: "서울", product: "노트북", amount: 120, soldAt: "2026-01-03" },
  { id: 2, region: "부산", product: "키보드", amount: 35, soldAt: "2026-01-04" },
  { id: 3, region: "서울", product: "모니터", amount: 80, soldAt: "2026-01-05" },
  { id: 4, region: "제주", product: "마우스", amount: 25, soldAt: "2026-01-06" },
  { id: 5, region: "부산", product: "노트북", amount: 150, soldAt: "2026-01-07" }
] as const;

export const selectLogicalExecutionQuery = `SELECT region, SUM(amount) AS total_amount
FROM sales
WHERE amount >= 50
GROUP BY region
HAVING SUM(amount) >= 100
ORDER BY total_amount DESC;`;

export function generateSelectLogicalExecutionTrace(): TraceStep<DatabaseTraceState>[] {
  const fromRows = salesRows.map((row) => ({ ...row }));
  const whereRows = fromRows.filter((row) => row.amount >= 50);
  const groupRows = groupByRegion(whereRows);
  const havingRows = groupRows.filter((row) => row.sum_amount >= 100);
  const selectRows = havingRows.map((row) => ({
    region: row.region,
    total_amount: row.sum_amount
  }));
  const orderByRows = [...selectRows].sort(
    (left, right) => right.total_amount - left.total_amount
  );

  return [
    {
      id: "sql-from",
      title: "FROM: 기준 테이블 읽기",
      description: "논리 실행은 먼저 FROM 절의 sales 테이블을 기준 데이터로 읽는 것부터 시작합니다.",
      state: {
        phase: "from",
        query: selectLogicalExecutionQuery,
        rows: fromRows
      },
      pseudoCodeLine: 1
    },
    {
      id: "sql-where",
      title: "WHERE: 행 필터링",
      description: "WHERE 절은 그룹을 만들기 전에 원본 행을 먼저 걸러냅니다. amount가 50 이상인 주문만 남깁니다.",
      state: {
        phase: "where",
        query: selectLogicalExecutionQuery,
        rows: whereRows
      },
      pseudoCodeLine: 2
    },
    {
      id: "sql-group-by",
      title: "GROUP BY: 지역별 그룹 만들기",
      description: "WHERE를 통과한 행을 region 값으로 묶고, 각 그룹의 행 수와 amount 합계를 계산합니다.",
      state: {
        phase: "groupBy",
        query: selectLogicalExecutionQuery,
        rows: groupRows
      },
      pseudoCodeLine: 3
    },
    {
      id: "sql-having",
      title: "HAVING: 그룹 필터링",
      description: "HAVING 절은 집계가 끝난 그룹에 조건을 적용합니다. 합계가 100 이상인 그룹만 남깁니다.",
      state: {
        phase: "having",
        query: selectLogicalExecutionQuery,
        rows: havingRows
      },
      pseudoCodeLine: 4
    },
    {
      id: "sql-select",
      title: "SELECT: 출력 열 만들기",
      description: "SELECT 절에서 사용자에게 보여 줄 열 이름과 집계 결과 모양을 만듭니다.",
      state: {
        phase: "select",
        query: selectLogicalExecutionQuery,
        rows: selectRows
      },
      pseudoCodeLine: 5
    },
    {
      id: "sql-order-by",
      title: "ORDER BY: 최종 결과 정렬",
      description: "마지막으로 ORDER BY 절을 적용해 total_amount가 큰 지역부터 결과를 정렬합니다.",
      state: {
        phase: "orderBy",
        query: selectLogicalExecutionQuery,
        rows: orderByRows
      },
      pseudoCodeLine: 6
    }
  ];
}

type SalesRow = (typeof salesRows)[number];

function groupByRegion(rows: SalesRow[]) {
  const groups = new Map<string, { region: string; row_count: number; sum_amount: number }>();

  for (const row of rows) {
    const group = groups.get(row.region) ?? {
      region: row.region,
      row_count: 0,
      sum_amount: 0
    };

    group.row_count += 1;
    group.sum_amount += row.amount;
    groups.set(row.region, group);
  }

  return [...groups.values()];
}
