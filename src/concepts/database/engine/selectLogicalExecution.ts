import type { TraceStep } from "../../shared/types";
import type {
  DatabaseInputTableState,
  DatabaseRow,
  DatabaseRowMotion,
  DatabaseTraceState
} from "../types";

export const salesRows = [
  { id: 1, region: "서울", product: "노트북", amount: 120, soldAt: "2026-01-03" },
  { id: 2, region: "부산", product: "키보드", amount: 35, soldAt: "2026-01-04" },
  { id: 3, region: "서울", product: "모니터", amount: 80, soldAt: "2026-01-05" },
  { id: 4, region: "제주", product: "마우스", amount: 25, soldAt: "2026-01-06" },
  { id: 5, region: "부산", product: "노트북", amount: 150, soldAt: "2026-01-07" },
  { id: 6, region: "인천", product: "태블릿", amount: 95, soldAt: "2026-01-08" },
  { id: 7, region: "대구", product: "모니터", amount: 70, soldAt: "2026-01-09" },
  { id: 8, region: "서울", product: "키보드", amount: 55, soldAt: "2026-01-10" }
] as const;

export const regionRows = [
  { region: "서울", manager: "민서", zone: "수도권" },
  { region: "부산", manager: "준호", zone: "남부" },
  { region: "제주", manager: "하린", zone: "남부" },
  { region: "인천", manager: "민서", zone: "수도권" },
  { region: "대구", manager: "준호", zone: "남부" }
] as const;

export const onlineSalesRows = [
  { id: "web-1", channel: "온라인", amount: 180, soldAt: "2026-01-03" },
  { id: "web-2", channel: "모바일", amount: 90, soldAt: "2026-01-04" },
  { id: "web-3", channel: "온라인", amount: 40, soldAt: "2026-01-06" },
  { id: "web-4", channel: "파트너", amount: 130, soldAt: "2026-01-08" }
] as const;

export const selectLogicalExecutionQuery = `SELECT r.manager, s.region, SUM(s.amount) AS total_amount, COUNT(*) AS order_count
FROM sales AS s
JOIN regions AS r ON r.region = s.region
WHERE s.amount >= 50
GROUP BY r.manager, s.region
HAVING SUM(s.amount) >= 100
UNION ALL
SELECT '온라인' AS manager, channel AS region, SUM(amount) AS total_amount, COUNT(*) AS order_count
FROM online_sales
WHERE amount >= 50
GROUP BY channel
ORDER BY total_amount DESC
LIMIT 3;`;

export function generateSelectLogicalExecutionTrace(): TraceStep<DatabaseTraceState>[] {
  const fromRows = salesRows.map((row) => ({ ...row }));
  const joinRows = joinSalesWithRegions(fromRows);
  const whereRows = joinRows.filter((row) => row.amount >= 50);
  const groupRows = groupJoinedSales(whereRows);
  const havingRows = groupRows.filter((row) => row.sum_amount >= 100);
  const selectRows = havingRows.map((row) => ({
    manager: row.manager,
    region: row.region,
    total_amount: row.sum_amount,
    order_count: row.order_count
  }));
  const onlineRows = groupOnlineSales(
    onlineSalesRows.filter((row) => row.amount >= 50)
  );
  const unionRows = [...selectRows, ...onlineRows];
  const orderByRows = [...unionRows].sort(
    (left, right) => right.total_amount - left.total_amount
  );
  const limitRows = orderByRows.slice(0, 3);

  return [
    {
      id: "sql-from",
      title: "FROM: 기준 테이블 읽기",
      description: "논리 실행은 먼저 FROM 절의 sales 테이블을 읽어 기준 행 집합을 만듭니다.",
      state: {
        phase: "from",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [2],
        inputTables: [
          createInputTable("sales", fromRows, ["id", "region", "product", "amount"], fromRows)
        ],
        activeColumns: ["id", "region", "product", "amount"],
        rows: fromRows,
        rowMotionByKey: toMotionMap(fromRows, "source"),
        summaryItems: [
          { label: "입력 테이블", value: "sales" },
          { label: "읽은 행", value: `${fromRows.length}개` }
        ]
      },
      pseudoCodeLine: 1
    },
    {
      id: "sql-join",
      title: "JOIN: 지역 담당자 붙이기",
      description: "sales.region과 regions.region을 맞춰 각 주문에 담당자와 권역 정보를 붙입니다.",
      state: {
        phase: "join",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [3],
        inputTables: [
          createInputTable("sales", fromRows, ["region"], fromRows),
          createInputTable("regions", regionRows, ["region", "manager", "zone"], regionRows)
        ],
        activeColumns: ["region", "manager", "zone"],
        rows: joinRows,
        rowMotionByKey: toMotionMap(joinRows, "joined"),
        summaryItems: [
          { label: "조인 키", value: "region" },
          { label: "결과 행", value: `${joinRows.length}개` }
        ]
      },
      pseudoCodeLine: 2
    },
    {
      id: "sql-where",
      title: "WHERE: 행 필터링",
      description: "WHERE 절은 그룹을 만들기 전에 원본 행을 먼저 걸러냅니다. amount가 50 이상인 주문만 남깁니다.",
      state: {
        phase: "where",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [4],
        inputTables: [
          createInputTable("JOIN 결과", joinRows, ["amount"], whereRows)
        ],
        activeColumns: ["amount"],
        rows: whereRows,
        rowMotionByKey: toMotionMap(whereRows, "filtered"),
        summaryItems: [
          { label: "조건", value: "amount >= 50" },
          { label: "남은 행", value: `${whereRows.length}/${joinRows.length}개` }
        ]
      },
      pseudoCodeLine: 3
    },
    {
      id: "sql-group-by",
      title: "GROUP BY: 담당자와 지역으로 묶기",
      description: "WHERE를 통과한 행을 manager와 region 값으로 묶고, 각 그룹의 주문 수와 amount 합계를 계산합니다.",
      state: {
        phase: "groupBy",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [5],
        inputTables: [
          createInputTable("WHERE 결과", whereRows, ["manager", "region", "amount"], whereRows)
        ],
        activeColumns: ["manager", "region", "sum_amount", "order_count"],
        rows: groupRows,
        rowMotionByKey: toMotionMap(groupRows, "grouped"),
        summaryItems: [
          { label: "그룹 기준", value: "manager, region" },
          { label: "그룹 수", value: `${groupRows.length}개` }
        ]
      },
      pseudoCodeLine: 4
    },
    {
      id: "sql-having",
      title: "HAVING: 그룹 필터링",
      description: "HAVING 절은 집계가 끝난 그룹에 조건을 적용합니다. 합계가 100 이상인 그룹만 남깁니다.",
      state: {
        phase: "having",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [6],
        inputTables: [
          createInputTable("GROUP BY 결과", groupRows, ["sum_amount"], havingRows)
        ],
        activeColumns: ["sum_amount"],
        rows: havingRows,
        rowMotionByKey: toMotionMap(havingRows, "filtered"),
        summaryItems: [
          { label: "조건", value: "SUM(amount) >= 100" },
          { label: "남은 그룹", value: `${havingRows.length}/${groupRows.length}개` }
        ]
      },
      pseudoCodeLine: 5
    },
    {
      id: "sql-select",
      title: "SELECT: 출력 열 만들기",
      description: "SELECT 절에서 사용자에게 보여 줄 열 이름과 집계 결과 모양을 만듭니다.",
      state: {
        phase: "select",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [1],
        inputTables: [
          createInputTable("HAVING 결과", havingRows, ["manager", "region", "sum_amount", "order_count"], havingRows)
        ],
        activeColumns: ["manager", "region", "total_amount", "order_count"],
        rows: selectRows,
        rowMotionByKey: toMotionMap(selectRows, "projected"),
        summaryItems: [
          { label: "출력 열", value: "4개" },
          { label: "별칭", value: "total_amount" }
        ]
      },
      pseudoCodeLine: 6
    },
    {
      id: "sql-union",
      title: "UNION ALL: 온라인 집계 붙이기",
      description: "두 번째 SELECT가 online_sales를 같은 열 구조로 집계한 뒤 기존 결과 아래에 이어 붙입니다.",
      state: {
        phase: "union",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [7, 8, 9, 10, 11],
        inputTables: [
          createInputTable("첫 번째 SELECT 결과", selectRows, ["manager", "region", "total_amount", "order_count"], selectRows),
          createInputTable("online_sales", onlineSalesRows, ["channel", "amount"], onlineSalesRows.filter((row) => row.amount >= 50))
        ],
        activeColumns: ["manager", "region", "total_amount", "order_count"],
        rows: unionRows,
        rowMotionByKey: toMotionMap(unionRows, "unioned"),
        summaryItems: [
          { label: "결합 방식", value: "UNION ALL" },
          { label: "추가 행", value: `${onlineRows.length}개` }
        ]
      },
      pseudoCodeLine: 7
    },
    {
      id: "sql-order-by",
      title: "ORDER BY: 합계 기준 정렬",
      description: "ORDER BY 절을 적용해 total_amount가 큰 행부터 결과를 정렬합니다.",
      state: {
        phase: "orderBy",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [12],
        inputTables: [
          createInputTable("UNION ALL 결과", unionRows, ["total_amount"], unionRows)
        ],
        activeColumns: ["total_amount"],
        rows: orderByRows,
        rowMotionByKey: toMotionMap(orderByRows, "sorted"),
        summaryItems: [
          { label: "정렬 기준", value: "total_amount DESC" },
          { label: "정렬 행", value: `${orderByRows.length}개` }
        ]
      },
      pseudoCodeLine: 8
    },
    {
      id: "sql-limit",
      title: "LIMIT: 상위 결과만 남기기",
      description: "마지막으로 LIMIT 3을 적용해 정렬된 결과에서 상위 세 행만 반환합니다.",
      state: {
        phase: "limit",
        query: selectLogicalExecutionQuery,
        activeQueryLines: [13],
        inputTables: [
          createInputTable("ORDER BY 결과", orderByRows, ["manager", "region", "total_amount"], limitRows)
        ],
        activeColumns: ["manager", "region", "total_amount"],
        rows: limitRows,
        rowMotionByKey: toMotionMap(limitRows, "limited"),
        summaryItems: [
          { label: "제한", value: "3행" },
          { label: "최종 행", value: `${limitRows.length}개` }
        ]
      },
      pseudoCodeLine: 9
    }
  ];
}

type SalesRow = (typeof salesRows)[number];
type OnlineSalesRow = (typeof onlineSalesRows)[number];

type JoinedSalesRow = {
  sale_id: number;
  region: string;
  manager: string;
  zone: string;
  product: string;
  amount: number;
  soldAt: string;
};

type GroupedSalesRow = {
  manager: string;
  region: string;
  order_count: number;
  sum_amount: number;
};

function joinSalesWithRegions(rows: SalesRow[]): JoinedSalesRow[] {
  return rows.map((row) => {
    const region = regionRows.find((item) => item.region === row.region);

    return {
      sale_id: row.id,
      region: row.region,
      manager: region?.manager ?? "미지정",
      zone: region?.zone ?? "미지정",
      product: row.product,
      amount: row.amount,
      soldAt: row.soldAt
    };
  });
}

function groupJoinedSales(rows: JoinedSalesRow[]): GroupedSalesRow[] {
  const groups = new Map<string, GroupedSalesRow>();

  for (const row of rows) {
    const key = `${row.manager}|${row.region}`;
    const group = groups.get(key) ?? {
      manager: row.manager,
      region: row.region,
      order_count: 0,
      sum_amount: 0
    };

    group.order_count += 1;
    group.sum_amount += row.amount;
    groups.set(key, group);
  }

  return [...groups.values()];
}

function groupOnlineSales(rows: OnlineSalesRow[]) {
  const groups = new Map<
    string,
    { manager: string; region: string; total_amount: number; order_count: number }
  >();

  for (const row of rows) {
    const group = groups.get(row.channel) ?? {
      manager: "온라인",
      region: row.channel,
      total_amount: 0,
      order_count: 0
    };

    group.order_count += 1;
    group.total_amount += row.amount;
    groups.set(row.channel, group);
  }

  return [...groups.values()];
}

function toMotionMap(
  rows: readonly DatabaseRow[],
  motion: DatabaseRowMotion
): Record<string, DatabaseRowMotion> {
  return Object.fromEntries(rows.map((row) => [getDatabaseRowKey(row), motion]));
}

function createInputTable(
  name: string,
  rows: readonly DatabaseRow[],
  activeColumns: string[],
  activeRows: readonly DatabaseRow[]
): DatabaseInputTableState {
  return {
    name,
    rows: rows.map((row) => ({ ...row })),
    activeColumns,
    activeRowKeys: activeRows.map(getDatabaseRowKey)
  };
}

function getDatabaseRowKey(row: DatabaseRow): string {
  return Object.entries(row)
    .map(([key, value]) => `${key}:${String(value)}`)
    .join("|");
}
