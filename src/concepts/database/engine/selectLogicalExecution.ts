import type { TraceStep } from "../../shared/types";
import type {
  DatabaseCellHighlight,
  DatabaseExample,
  DatabaseInputTableState,
  DatabaseRow,
  DatabaseRowMotion,
  DatabaseTraceState,
  SqlLogicalPhase,
} from "../types";

export const joinQuery = [
  "SELECT o.id, o.customer_id, c.name, c.tier, o.total",
  "FROM orders AS o",
  "JOIN customers AS c ON c.id = o.customer_id;",
].join("\n");

export const groupByQuery = [
  "SELECT region, COUNT(*) AS order_count, SUM(total) AS total_sales",
  "FROM orders",
  "GROUP BY region;",
].join("\n");

export const havingQuery = [
  "SELECT department, SUM(amount) AS department_total",
  "FROM department_sales",
  "GROUP BY department",
  "HAVING SUM(amount) >= 300;",
].join("\n");

export const unionQuery = [
  "SELECT email FROM newsletter_signups",
  "UNION",
  "SELECT email FROM purchasers;",
].join("\n");

export const orderLimitQuery = [
  "SELECT product, total_sales",
  "FROM product_sales",
  "ORDER BY total_sales DESC",
  "LIMIT 3;",
].join("\n");

export const subQueryQuery = [
  "SELECT id, name",
  "FROM client",
  "WHERE id IN (",
  "  SELECT d.client_id",
  "  FROM delivery AS d",
  "  JOIN product AS p ON d.product_id = p.id",
  "  WHERE d.status = 'delivered'",
  "    AND p.color = 'blue'",
  ");",
].join("\n");

const joinOrders: DatabaseRow[] = [
  { id: 101, customer_id: 1, region: "Seoul", total: 120 },
  { id: 102, customer_id: 3, region: "Busan", total: 85 },
  { id: 103, customer_id: 2, region: "Seoul", total: 210 },
  { id: 104, customer_id: 4, region: "Daegu", total: 65 },
  { id: 105, customer_id: 1, region: "Seoul", total: 180 },
];

const customers: DatabaseRow[] = [
  { id: 1, name: "Minseo", tier: "Gold" },
  { id: 2, name: "Jisoo", tier: "Silver" },
  { id: 3, name: "Hyun", tier: "Gold" },
  { id: 4, name: "Ara", tier: "Bronze" },
];

const groupOrders: DatabaseRow[] = [
  { id: 201, region: "Seoul", total: 120 },
  { id: 202, region: "Busan", total: 85 },
  { id: 203, region: "Seoul", total: 210 },
  { id: 204, region: "Jeju", total: 95 },
  { id: 205, region: "Busan", total: 160 },
  { id: 206, region: "Seoul", total: 180 },
  { id: 207, region: "Jeju", total: 75 },
];

const departmentSales: DatabaseRow[] = [
  { id: 301, department: "Platform", amount: 180 },
  { id: 302, department: "Platform", amount: 170 },
  { id: 303, department: "Support", amount: 90 },
  { id: 304, department: "Support", amount: 120 },
  { id: 305, department: "Design", amount: 140 },
  { id: 306, department: "Design", amount: 210 },
];

const newsletterSignups: DatabaseRow[] = [
  { email: "minseo@example.com" },
  { email: "hyun@example.com" },
  { email: "ara@example.com" },
  { email: "jisoo@example.com" },
];

const purchasers: DatabaseRow[] = [
  { email: "hyun@example.com" },
  { email: "nari@example.com" },
  { email: "sol@example.com" },
  { email: "minseo@example.com" },
];

const productSales: DatabaseRow[] = [
  { product: "Keyboard", total_sales: 420 },
  { product: "Monitor", total_sales: 860 },
  { product: "Mouse", total_sales: 310 },
  { product: "Laptop Stand", total_sales: 510 },
  { product: "Webcam", total_sales: 290 },
  { product: "Headset", total_sales: 640 },
];

const subQueryClients: DatabaseRow[] = [
  { id: 1, name: "Jisoo", city: "Seoul" },
  { id: 2, name: "Minseo", city: "Busan" },
  { id: 3, name: "Hyun", city: "Daegu" },
  { id: 4, name: "Ara", city: "Jeju" },
  { id: 5, name: "Nari", city: "Incheon" },
];

const subQueryDeliveries: DatabaseRow[] = [
  { id: 501, client_id: 1, product_id: 10, status: "delivered" },
  { id: 502, client_id: 3, product_id: 11, status: "delivered" },
  { id: 503, client_id: 4, product_id: 10, status: "delivered" },
  { id: 504, client_id: 1, product_id: 12, status: "pending" },
  { id: 505, client_id: 5, product_id: 13, status: "canceled" },
];

const subQueryProducts: DatabaseRow[] = [
  { id: 10, product: "Notebook", color: "blue" },
  { id: 11, product: "Marker", color: "red" },
  { id: 12, product: "Binder", color: "red" },
  { id: 13, product: "Pen", color: "green" },
];

const subQueryJoinedRows: DatabaseRow[] = [
  { cid: 1, status: "delivered", color: "blue" },
  { cid: 3, status: "delivered", color: "red" },
  { cid: 4, status: "delivered", color: "blue" },
  { cid: 1, status: "pending", color: "red" },
  { cid: 5, status: "canceled", color: "green" },
];

const subQueryDeliveredRows = subQueryJoinedRows.slice(0, 3);
const subQueryMatchedRows = [subQueryJoinedRows[0]!, subQueryJoinedRows[2]!];
const subQueryFinalClients: DatabaseRow[] = [
  { id: 1, name: "Jisoo" },
  { id: 4, name: "Ara" },
];

const joinResult: DatabaseRow[] = joinOrders.map((order) => {
  const customer = customers.find((row) => row.id === order.customer_id);

  return {
    order_id: order.id,
    customer_id: order.customer_id,
    name: customer?.name ?? "(missing)",
    tier: customer?.tier ?? "-",
    total: order.total,
  };
});

const groupResult: DatabaseRow[] = [
  { region: "Seoul", order_count: 3, total_sales: 510 },
  { region: "Busan", order_count: 2, total_sales: 245 },
  { region: "Jeju", order_count: 2, total_sales: 170 },
];

const havingAggregates: DatabaseRow[] = [
  { department: "Platform", department_total: 350 },
  { department: "Support", department_total: 210 },
  { department: "Design", department_total: 350 },
];

const unionAppendRows: DatabaseRow[] = [
  ...newsletterSignups.map((row) => ({ source: "newsletter_signups", email: row.email })),
  ...purchasers.map((row) => ({ source: "purchasers", email: row.email })),
];

const unionResult: DatabaseRow[] = [
  { email: "minseo@example.com" },
  { email: "hyun@example.com" },
  { email: "ara@example.com" },
  { email: "jisoo@example.com" },
  { email: "nari@example.com" },
  { email: "sol@example.com" },
];

const sortedProductSales: DatabaseRow[] = [...productSales].sort(
  (left, right) => Number(right.total_sales) - Number(left.total_sales),
);

const getDatabaseRowKey = (row: DatabaseRow): string => {
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
};

const createMotionMap = (
  rows: DatabaseRow[],
  motion: DatabaseRowMotion,
  overrideKey?: (row: DatabaseRow) => string,
): Record<string, DatabaseRowMotion> =>
  Object.fromEntries(rows.map((row) => [overrideKey?.(row) ?? getDatabaseRowKey(row), motion]));

const createInputTable = (
  name: string,
  rows: DatabaseRow[],
  activeColumns: string[],
  activeRows: DatabaseRow[] = [],
  rowMotionByKey: Record<string, DatabaseRowMotion> = {},
): DatabaseInputTableState => ({
  name,
  rows,
  activeColumns,
  activeRowKeys: activeRows.map(getDatabaseRowKey),
  rowMotionByKey,
});

const cellHighlight = (
  scope: "input" | "output",
  row: DatabaseRow,
  column: string,
  tone: DatabaseCellHighlight["tone"],
  tableName?: string,
): DatabaseCellHighlight => ({
  scope,
  tableName,
  rowKey: getDatabaseRowKey(row),
  column,
  tone,
});

const createStep = ({
  id,
  title,
  description,
  pseudoCodeLine,
  phase,
  query,
  activeQueryLines,
  inputTables,
  rows,
  activeColumns,
  activeRows = [],
  rowMotionByKey = {},
  cellHighlights = [],
  summaryItems = [],
}: {
  id: string;
  title: string;
  description: string;
  pseudoCodeLine: number;
  phase: SqlLogicalPhase;
  query: string;
  activeQueryLines: number[];
  inputTables?: DatabaseInputTableState[];
  rows: DatabaseRow[];
  activeColumns?: string[];
  activeRows?: DatabaseRow[];
  rowMotionByKey?: Record<string, DatabaseRowMotion>;
  cellHighlights?: DatabaseCellHighlight[];
  summaryItems?: { label: string; value: string }[];
}): TraceStep<DatabaseTraceState> => ({
  id,
  title,
  description,
  pseudoCodeLine,
  state: {
    phase,
    query,
    activeQueryLines,
    inputTables,
    rows,
    activeColumns,
    activeRowKeys: activeRows.map(getDatabaseRowKey),
    rowMotionByKey,
    cellHighlights,
    summaryItems,
  },
});

const withOutputMotion = (
  rows: DatabaseRow[],
  motion: DatabaseRowMotion,
  activeRows: DatabaseRow[] = rows,
) => ({
  rows,
  activeRows,
  rowMotionByKey: createMotionMap(activeRows, motion),
});

const buildSubQueryExample = (): DatabaseExample => {
  const pseudoCode = [
    "바깥 쿼리가 client 테이블에서 id와 name을 읽을 준비를 한다.",
    "안쪽 쿼리가 delivery 행을 읽고 client_id, product_id, status를 확인한다.",
    "delivery.product_id와 product.id를 조인해 상품 색상을 붙인다.",
    "status = 'delivered' 조건을 먼저 통과한 행만 남긴다.",
    "color = 'blue' 조건을 적용해 subquery 후보를 좁힌다.",
    "subquery가 client_id 집합 (1, 4)을 반환한다.",
    "바깥 WHERE id IN (...)이 client 행을 필터링하고 id, name만 출력한다.",
  ];

  const firstDelivery = subQueryDeliveries[0]!;
  const firstProduct = subQueryProducts[0]!;
  const redProduct = subQueryProducts[1]!;
  const pendingDelivery = subQueryDeliveries[3]!;
  const firstJoinedRow = subQueryJoinedRows[0]!;
  const redJoinedRow = subQueryJoinedRows[1]!;
  const pendingJoinedRow = subQueryJoinedRows[3]!;

  return {
    id: "sub-query",
    title: "SUB QUERY 실행 흐름",
    tabLabel: "SUB QUERY",
    intro:
      "안쪽 SELECT가 delivery와 product를 조인하고 조건을 통과한 client_id 집합을 만든 뒤, 바깥 SELECT가 client 테이블에서 해당 고객만 남깁니다.",
    query: subQueryQuery,
    pseudoCode,
    trace: [
      createStep({
        id: "subquery-outer-client",
        title: "바깥 client 행 준비",
        description:
          "바깥 SELECT는 client 테이블을 대상으로 하지만, WHERE id IN (...) 안쪽 결과가 나올 때까지 최종 행을 확정하지 않습니다.",
        pseudoCodeLine: 1,
        phase: "from",
        query: subQueryQuery,
        activeQueryLines: [1, 2, 3],
        inputTables: [
          createInputTable(
            "client",
            subQueryClients,
            ["id", "name"],
            subQueryClients.slice(0, 4),
            createMotionMap(subQueryClients.slice(0, 4), "candidate"),
          ),
          createInputTable("delivery", subQueryDeliveries, ["client_id", "product_id", "status"], []),
          createInputTable("product", subQueryProducts, ["id", "color"], []),
        ],
        rows: [],
        activeColumns: ["id", "name"],
        summaryItems: [
          { label: "바깥 테이블", value: "client" },
          { label: "대기 조건", value: "id IN (subquery)" },
        ],
        cellHighlights: [
          ...subQueryClients
            .slice(0, 4)
            .flatMap((row) => [
              cellHighlight("input", row, "id", "active", "client"),
              cellHighlight("input", row, "name", "active", "client"),
            ]),
        ],
      }),
      createStep({
        id: "subquery-scan-delivery",
        title: "안쪽 delivery 스캔",
        description:
          "subquery가 delivery 행을 읽으면서 client_id, product_id, status가 이후 JOIN과 WHERE에서 쓰일 값임을 표시합니다.",
        pseudoCodeLine: 2,
        phase: "from",
        query: subQueryQuery,
        activeQueryLines: [4, 5],
        inputTables: [
          createInputTable("client", subQueryClients, ["id"], []),
          createInputTable(
            "delivery",
            subQueryDeliveries,
            ["client_id", "product_id", "status"],
            subQueryDeliveries.slice(0, 4),
            createMotionMap(subQueryDeliveries.slice(0, 4), "source"),
          ),
          createInputTable("product", subQueryProducts, ["id", "color"], []),
        ],
        rows: subQueryDeliveries.slice(0, 4).map((row) => ({
          cid: row.client_id,
          status: row.status,
          product_id: row.product_id,
        })),
        activeColumns: ["cid", "status", "product_id"],
        activeRows: [{ cid: 1, status: "delivered", product_id: 10 }],
        rowMotionByKey: { "1:delivered:10": "source" },
        summaryItems: [
          { label: "읽는 행", value: "delivery.id 501-504" },
          { label: "다음 동작", value: "product와 JOIN" },
        ],
        cellHighlights: [
          cellHighlight("input", firstDelivery, "client_id", "active", "delivery"),
          cellHighlight("input", firstDelivery, "product_id", "join", "delivery"),
          cellHighlight("input", firstDelivery, "status", "active", "delivery"),
        ],
      }),
      createStep({
        id: "subquery-join-product",
        title: "product 색상 조인",
        description:
          "delivery.product_id와 product.id가 같은 행을 찾아 중간 결과에 color 열을 붙입니다.",
        pseudoCodeLine: 3,
        phase: "join",
        query: subQueryQuery,
        activeQueryLines: [6],
        inputTables: [
          createInputTable("client", subQueryClients, ["id"], []),
          createInputTable(
            "delivery",
            subQueryDeliveries,
            ["client_id", "product_id"],
            [firstDelivery, subQueryDeliveries[1]!, subQueryDeliveries[2]!, pendingDelivery],
            createMotionMap([firstDelivery, subQueryDeliveries[1]!, subQueryDeliveries[2]!, pendingDelivery], "joined"),
          ),
          createInputTable(
            "product",
            subQueryProducts,
            ["id", "color"],
            [firstProduct, redProduct],
            createMotionMap([firstProduct, redProduct], "matched"),
          ),
        ],
        rows: subQueryJoinedRows.slice(0, 4),
        activeColumns: ["cid", "status", "color"],
        activeRows: [firstJoinedRow],
        rowMotionByKey: createMotionMap(subQueryJoinedRows.slice(0, 4), "joined"),
        summaryItems: [
          { label: "JOIN 기준", value: "d.product_id = p.id" },
          { label: "중간 결과", value: "cid / status / color" },
        ],
        cellHighlights: [
          cellHighlight("input", firstDelivery, "product_id", "join", "delivery"),
          cellHighlight("input", firstProduct, "id", "join", "product"),
          cellHighlight("input", firstProduct, "color", "match", "product"),
          cellHighlight("output", firstJoinedRow, "color", "join"),
        ],
      }),
      createStep({
        id: "subquery-filter-status",
        title: "delivered 조건 적용",
        description:
          "WHERE d.status = 'delivered'를 평가해 delivered 행은 통과시키고 pending 행은 제외 후보로 표시합니다.",
        pseudoCodeLine: 4,
        phase: "where",
        query: subQueryQuery,
        activeQueryLines: [7],
        inputTables: [
          createInputTable("client", subQueryClients, ["id"], []),
          createInputTable(
            "delivery",
            subQueryDeliveries,
            ["status"],
            [firstDelivery, subQueryDeliveries[1]!, subQueryDeliveries[2]!, pendingDelivery],
            {
              ...createMotionMap(subQueryDeliveries.slice(0, 3), "matched"),
              [getDatabaseRowKey(pendingDelivery)]: "rejected",
            },
          ),
          createInputTable("product", subQueryProducts, ["color"], [firstProduct, redProduct]),
        ],
        rows: subQueryJoinedRows.slice(0, 4),
        activeColumns: ["status"],
        activeRows: subQueryDeliveredRows,
        rowMotionByKey: {
          ...createMotionMap(subQueryDeliveredRows, "filtered"),
          [getDatabaseRowKey(pendingJoinedRow)]: "rejected",
        },
        summaryItems: [
          { label: "통과", value: "3 delivered rows" },
          { label: "제외", value: "pending row" },
        ],
        cellHighlights: [
          ...subQueryDeliveredRows.map((row) => cellHighlight("output", row, "status", "match")),
          cellHighlight("output", pendingJoinedRow, "status", "reject"),
          cellHighlight("input", pendingDelivery, "status", "reject", "delivery"),
        ],
      }),
      createStep({
        id: "subquery-filter-color",
        title: "blue 색상 조건 적용",
        description:
          "AND p.color = 'blue'를 평가해 red 상품과 연결된 행을 제외하고 blue 행만 subquery 결과 후보로 남깁니다.",
        pseudoCodeLine: 5,
        phase: "where",
        query: subQueryQuery,
        activeQueryLines: [8],
        inputTables: [
          createInputTable("client", subQueryClients, ["id"], []),
          createInputTable(
            "delivery",
            subQueryDeliveries,
            ["client_id", "product_id"],
            [firstDelivery, subQueryDeliveries[1]!, subQueryDeliveries[2]!],
            createMotionMap([firstDelivery, subQueryDeliveries[1]!, subQueryDeliveries[2]!], "candidate"),
          ),
          createInputTable(
            "product",
            subQueryProducts,
            ["color"],
            [firstProduct, redProduct],
            {
              [getDatabaseRowKey(firstProduct)]: "matched",
              [getDatabaseRowKey(redProduct)]: "rejected",
            },
          ),
        ],
        rows: subQueryDeliveredRows,
        activeColumns: ["cid", "color"],
        activeRows: subQueryMatchedRows,
        rowMotionByKey: {
          ...createMotionMap(subQueryMatchedRows, "filtered"),
          [getDatabaseRowKey(redJoinedRow)]: "rejected",
        },
        summaryItems: [
          { label: "blue 통과", value: "cid 1, 4" },
          { label: "red 제외", value: "cid 3" },
        ],
        cellHighlights: [
          ...subQueryMatchedRows.map((row) => cellHighlight("output", row, "color", "match")),
          cellHighlight("output", redJoinedRow, "color", "reject"),
          cellHighlight("input", firstProduct, "color", "match", "product"),
          cellHighlight("input", redProduct, "color", "reject", "product"),
        ],
      }),
      createStep({
        id: "subquery-id-set",
        title: "subquery id 집합 반환",
        description:
          "안쪽 SELECT d.client_id가 조건을 통과한 client_id만 모아 바깥 WHERE에 넘깁니다.",
        pseudoCodeLine: 6,
        phase: "select",
        query: subQueryQuery,
        activeQueryLines: [4, 9],
        inputTables: [
          createInputTable("client", subQueryClients, ["id"], []),
          createInputTable(
            "delivery",
            subQueryDeliveries,
            ["client_id"],
            [firstDelivery, subQueryDeliveries[2]!],
            createMotionMap([firstDelivery, subQueryDeliveries[2]!], "projected"),
          ),
          createInputTable("product", subQueryProducts, ["color"], [firstProduct], createMotionMap([firstProduct], "matched")),
        ],
        rows: [{ client_id: 1 }, { client_id: 4 }],
        activeColumns: ["client_id"],
        activeRows: [{ client_id: 1 }, { client_id: 4 }],
        rowMotionByKey: {
          "1": "projected",
          "4": "projected",
        },
        summaryItems: [{ label: "subquery 결과", value: "client_id IN (1, 4)" }],
        cellHighlights: [
          cellHighlight("output", { client_id: 1 }, "client_id", "output"),
          cellHighlight("output", { client_id: 4 }, "client_id", "output"),
        ],
      }),
      createStep({
        id: "subquery-outer-filter",
        title: "바깥 WHERE로 client 필터링",
        description:
          "client.id가 subquery 결과 집합에 포함된 행만 남기고 SELECT id, name으로 최종 결과를 출력합니다.",
        pseudoCodeLine: 7,
        phase: "where",
        query: subQueryQuery,
        activeQueryLines: [1, 3],
        inputTables: [
          createInputTable(
            "client",
            subQueryClients,
            ["id", "name"],
            [subQueryClients[0]!, subQueryClients[3]!],
            {
              [getDatabaseRowKey(subQueryClients[0]!)]: "matched",
              [getDatabaseRowKey(subQueryClients[1]!)]: "rejected",
              [getDatabaseRowKey(subQueryClients[2]!)]: "rejected",
              [getDatabaseRowKey(subQueryClients[3]!)]: "matched",
              [getDatabaseRowKey(subQueryClients[4]!)]: "rejected",
            },
          ),
          createInputTable("delivery", subQueryDeliveries, ["client_id", "status"], [firstDelivery, subQueryDeliveries[2]!]),
          createInputTable("product", subQueryProducts, ["id", "color"], [firstProduct]),
        ],
        ...withOutputMotion(subQueryFinalClients, "projected"),
        activeColumns: ["id", "name"],
        summaryItems: [
          { label: "IN 집합", value: "1, 4" },
          { label: "최종 결과", value: "2 clients" },
        ],
        cellHighlights: [
          cellHighlight("input", subQueryClients[0]!, "id", "match", "client"),
          cellHighlight("input", subQueryClients[0]!, "name", "output", "client"),
          cellHighlight("input", subQueryClients[3]!, "id", "match", "client"),
          cellHighlight("input", subQueryClients[3]!, "name", "output", "client"),
          cellHighlight("input", subQueryClients[2]!, "id", "reject", "client"),
          ...subQueryFinalClients.flatMap((row) => [
            cellHighlight("output", row, "id", "output"),
            cellHighlight("output", row, "name", "output"),
          ]),
        ],
      }),
    ],
  };
};

const buildJoinExample = (): DatabaseExample => {
  const pseudoCode = [
    "orders에서 기준 행을 하나 읽는다.",
    "customers에서 customer_id와 같은 id를 찾는다.",
    "ON 조건이 참이면 양쪽 행을 하나로 결합한다.",
    "모든 주문 행에 같은 과정을 반복한다.",
    "SELECT 목록에 맞춰 최종 열을 출력한다.",
  ];

  const firstOrder = joinOrders[0];
  const firstCustomer = customers[0];
  const secondOrder = joinOrders[1];
  const secondCustomer = customers[2];

  return {
    id: "join",
    title: "JOIN 실행 흐름",
    tabLabel: "JOIN",
    intro: "orders 행마다 customers에서 같은 customer_id를 가진 행을 찾아 결과 행을 만든다.",
    query: joinQuery,
    pseudoCode,
    trace: [
      createStep({
        id: "join-left-row",
        title: "왼쪽 테이블 행 선택",
        description: "orders에서 첫 번째 주문 행을 읽고 조인 기준이 되는 customer_id 열을 표시한다.",
        pseudoCodeLine: 1,
        phase: "from",
        query: joinQuery,
        activeQueryLines: [2],
        inputTables: [
          createInputTable(
            "orders",
            joinOrders,
            ["id", "customer_id", "total"],
            [firstOrder],
            createMotionMap([firstOrder], "source"),
          ),
          createInputTable("customers", customers, ["id"], []),
        ],
        rows: [{ order_id: 101, customer_id: 1, total: 120 }],
        activeColumns: ["order_id", "customer_id", "total"],
        activeRows: [{ order_id: 101, customer_id: 1, total: 120 }],
        rowMotionByKey: { "101": "source" },
        summaryItems: [
          { label: "기준 행", value: "orders.id = 101" },
          { label: "조인 키", value: "customer_id = 1" },
        ],
      }),
      createStep({
        id: "join-match-row",
        title: "오른쪽 테이블 매칭 탐색",
        description: "customers.id가 orders.customer_id와 같은 행을 찾는다.",
        pseudoCodeLine: 2,
        phase: "join",
        query: joinQuery,
        activeQueryLines: [3],
        inputTables: [
          createInputTable("orders", joinOrders, ["customer_id"], [firstOrder], createMotionMap([firstOrder], "source")),
          createInputTable(
            "customers",
            customers,
            ["id", "name", "tier"],
            [firstCustomer],
            createMotionMap([firstCustomer], "matched"),
          ),
        ],
        rows: [{ order_id: 101, customer_id: 1, name: "Minseo", tier: "Gold", total: 120 }],
        activeColumns: ["customer_id", "name", "tier"],
        activeRows: [{ order_id: 101, customer_id: 1, name: "Minseo", tier: "Gold", total: 120 }],
        rowMotionByKey: { "101": "matched" },
        summaryItems: [
          { label: "ON 조건", value: "c.id = 1" },
          { label: "결과", value: "매칭 성공" },
        ],
      }),
      createStep({
        id: "join-output-row",
        title: "joined row 생성",
        description: "orders와 customers의 필요한 열을 합쳐 첫 번째 결과 행을 만든다.",
        pseudoCodeLine: 3,
        phase: "join",
        query: joinQuery,
        activeQueryLines: [1, 3],
        inputTables: [
          createInputTable("orders", joinOrders, ["id", "customer_id", "total"], [firstOrder], createMotionMap([firstOrder], "source")),
          createInputTable("customers", customers, ["id", "name", "tier"], [firstCustomer], createMotionMap([firstCustomer], "matched")),
        ],
        ...withOutputMotion([joinResult[0]], "joined"),
        activeColumns: ["order_id", "name", "tier", "total"],
        summaryItems: [{ label: "생성 행", value: "101 / Minseo / Gold / 120" }],
      }),
      createStep({
        id: "join-repeat",
        title: "다음 행 반복",
        description: "다음 orders 행도 같은 ON 조건으로 customers에서 매칭 행을 찾고 결과에 추가한다.",
        pseudoCodeLine: 4,
        phase: "join",
        query: joinQuery,
        activeQueryLines: [3],
        inputTables: [
          createInputTable("orders", joinOrders, ["id", "customer_id"], [secondOrder], createMotionMap([secondOrder], "source")),
          createInputTable("customers", customers, ["id", "name", "tier"], [secondCustomer], createMotionMap([secondCustomer], "matched")),
        ],
        ...withOutputMotion(joinResult.slice(0, 2), "joined", [joinResult[1]]),
        activeColumns: ["order_id", "name", "tier"],
        summaryItems: [{ label: "누적 결과", value: "2 rows" }],
      }),
      createStep({
        id: "join-complete",
        title: "JOIN 결과 완료",
        description: "모든 orders 행을 처리하고 SELECT에 필요한 열만 최종 결과로 남긴다.",
        pseudoCodeLine: 5,
        phase: "select",
        query: joinQuery,
        activeQueryLines: [1],
        inputTables: [
          createInputTable("orders", joinOrders, ["id", "customer_id", "total"], joinOrders, createMotionMap(joinOrders, "source")),
          createInputTable("customers", customers, ["id", "name", "tier"], customers, createMotionMap(customers, "matched")),
        ],
        ...withOutputMotion(joinResult, "projected"),
        activeColumns: ["order_id", "name", "tier", "total"],
        summaryItems: [{ label: "최종 결과", value: `${joinResult.length} rows` }],
      }),
    ],
  };
};

const buildGroupByExample = (): DatabaseExample => {
  const pseudoCode = [
    "orders 행을 하나씩 읽는다.",
    "GROUP BY region으로 bucket 키를 계산한다.",
    "새 region이면 bucket을 만들고, 이미 있으면 집계를 갱신한다.",
    "COUNT와 SUM을 누적한다.",
    "bucket별 집계 결과를 출력한다.",
  ];

  return {
    id: "group-by",
    title: "GROUP BY 실행 흐름",
    tabLabel: "GROUP BY",
    intro: "orders를 region별 bucket으로 나누고 각 bucket에서 COUNT와 SUM을 누적한다.",
    query: groupByQuery,
    pseudoCode,
    trace: [
      createStep({
        id: "group-scan-row",
        title: "행 읽기",
        description: "orders에서 첫 행을 읽고 group key가 될 region 열을 표시한다.",
        pseudoCodeLine: 1,
        phase: "from",
        query: groupByQuery,
        activeQueryLines: [2],
        inputTables: [
          createInputTable("orders", groupOrders, ["region", "total"], [groupOrders[0]], createMotionMap([groupOrders[0]], "source")),
        ],
        rows: [{ region: "Seoul", order_count: 0, total_sales: 0 }],
        activeColumns: ["region"],
        activeRows: [{ region: "Seoul", order_count: 0, total_sales: 0 }],
        rowMotionByKey: { Seoul: "candidate" },
        summaryItems: [{ label: "읽은 행", value: "orders.id = 201" }],
      }),
      createStep({
        id: "group-create-bucket",
        title: "새 bucket 생성",
        description: "region = Seoul인 bucket이 아직 없으므로 새 그룹을 만들고 첫 값을 넣는다.",
        pseudoCodeLine: 2,
        phase: "groupBy",
        query: groupByQuery,
        activeQueryLines: [3],
        inputTables: [
          createInputTable("orders", groupOrders, ["region", "total"], [groupOrders[0]], createMotionMap([groupOrders[0]], "grouped")),
        ],
        rows: [{ region: "Seoul", order_count: 1, total_sales: 120 }],
        activeColumns: ["region", "order_count", "total_sales"],
        activeRows: [{ region: "Seoul", order_count: 1, total_sales: 120 }],
        rowMotionByKey: { Seoul: "grouped" },
        summaryItems: [{ label: "bucket", value: "Seoul 생성" }],
      }),
      createStep({
        id: "group-update-existing",
        title: "기존 bucket 갱신",
        description: "다음 Seoul 행을 만나 기존 bucket의 COUNT와 SUM을 갱신한다.",
        pseudoCodeLine: 3,
        phase: "groupBy",
        query: groupByQuery,
        activeQueryLines: [3],
        inputTables: [
          createInputTable(
            "orders",
            groupOrders,
            ["region", "total"],
            [groupOrders[2]],
            createMotionMap([groupOrders[0], groupOrders[2]], "grouped"),
          ),
        ],
        rows: [
          { region: "Seoul", order_count: 2, total_sales: 330 },
          { region: "Busan", order_count: 1, total_sales: 85 },
        ],
        activeColumns: ["order_count", "total_sales"],
        activeRows: [{ region: "Seoul", order_count: 2, total_sales: 330 }],
        rowMotionByKey: { Seoul: "aggregated" },
        summaryItems: [{ label: "Seoul", value: "COUNT 2, SUM 330" }],
      }),
      createStep({
        id: "group-aggregate-many",
        title: "다른 bucket도 누적",
        description: "Busan과 Jeju 행도 같은 방식으로 bucket을 만들거나 갱신한다.",
        pseudoCodeLine: 4,
        phase: "groupBy",
        query: groupByQuery,
        activeQueryLines: [1, 3],
        inputTables: [
          createInputTable("orders", groupOrders, ["region", "total"], groupOrders.slice(0, 5), createMotionMap(groupOrders.slice(0, 5), "grouped")),
        ],
        rows: [
          { region: "Seoul", order_count: 2, total_sales: 330 },
          { region: "Busan", order_count: 2, total_sales: 245 },
          { region: "Jeju", order_count: 1, total_sales: 95 },
        ],
        activeColumns: ["region", "order_count", "total_sales"],
        activeRows: [{ region: "Busan", order_count: 2, total_sales: 245 }],
        rowMotionByKey: { Busan: "aggregated" },
        summaryItems: [{ label: "갱신 bucket", value: "Busan" }],
      }),
      createStep({
        id: "group-complete",
        title: "집계 결과 출력",
        description: "모든 행을 처리한 뒤 region별 COUNT와 SUM만 결과 테이블로 출력한다.",
        pseudoCodeLine: 5,
        phase: "select",
        query: groupByQuery,
        activeQueryLines: [1],
        inputTables: [
          createInputTable("orders", groupOrders, ["region", "total"], groupOrders, createMotionMap(groupOrders, "grouped")),
        ],
        ...withOutputMotion(groupResult, "projected"),
        activeColumns: ["region", "order_count", "total_sales"],
        summaryItems: [{ label: "최종 그룹", value: `${groupResult.length} groups` }],
      }),
    ],
  };
};

const buildHavingExample = (): DatabaseExample => {
  const pseudoCode = [
    "department별 매출을 먼저 집계한다.",
    "집계된 그룹마다 SUM(amount)를 읽는다.",
    "HAVING 조건을 평가한다.",
    "조건을 만족한 그룹은 keep, 아니면 reject로 표시한다.",
    "남은 그룹만 결과로 출력한다.",
  ];

  return {
    id: "having",
    title: "HAVING 실행 흐름",
    tabLabel: "HAVING",
    intro: "department별 집계 후 SUM(amount) >= 300 조건을 만족하는 그룹만 남긴다.",
    query: havingQuery,
    pseudoCode,
    trace: [
      createStep({
        id: "having-aggregate-input",
        title: "집계 입력 표시",
        description: "department_sales를 department별로 묶고 SUM(amount)를 계산할 준비를 한다.",
        pseudoCodeLine: 1,
        phase: "groupBy",
        query: havingQuery,
        activeQueryLines: [2, 3],
        inputTables: [
          createInputTable("department_sales", departmentSales, ["department", "amount"], departmentSales.slice(0, 2), createMotionMap(departmentSales.slice(0, 2), "grouped")),
        ],
        rows: havingAggregates,
        activeColumns: ["department", "department_total"],
        activeRows: [havingAggregates[0]],
        rowMotionByKey: { Platform: "aggregated" },
        summaryItems: [{ label: "집계 대상", value: "department" }],
      }),
      createStep({
        id: "having-keep-platform",
        title: "조건 평가: keep",
        description: "Platform 그룹의 SUM(amount)는 350이므로 HAVING 조건을 만족한다.",
        pseudoCodeLine: 2,
        phase: "having",
        query: havingQuery,
        activeQueryLines: [4],
        inputTables: [
          createInputTable("department_sales", departmentSales, ["department", "amount"], departmentSales.slice(0, 2), createMotionMap(departmentSales.slice(0, 2), "grouped")),
        ],
        rows: havingAggregates,
        activeColumns: ["department_total"],
        activeRows: [havingAggregates[0]],
        rowMotionByKey: { Platform: "matched" },
        summaryItems: [{ label: "350 >= 300", value: "keep" }],
      }),
      createStep({
        id: "having-reject-support",
        title: "조건 평가: reject",
        description: "Support 그룹의 SUM(amount)는 210이라서 HAVING 조건을 통과하지 못한다.",
        pseudoCodeLine: 3,
        phase: "having",
        query: havingQuery,
        activeQueryLines: [4],
        inputTables: [
          createInputTable("department_sales", departmentSales, ["department", "amount"], departmentSales.slice(2, 4), createMotionMap(departmentSales.slice(2, 4), "grouped")),
        ],
        rows: havingAggregates,
        activeColumns: ["department_total"],
        activeRows: [havingAggregates[1]],
        rowMotionByKey: { Support: "rejected" },
        summaryItems: [{ label: "210 >= 300", value: "reject" }],
      }),
      createStep({
        id: "having-keep-design",
        title: "다음 그룹 평가",
        description: "Design 그룹도 350으로 조건을 만족하므로 결과 후보로 유지한다.",
        pseudoCodeLine: 4,
        phase: "having",
        query: havingQuery,
        activeQueryLines: [4],
        inputTables: [
          createInputTable("department_sales", departmentSales, ["department", "amount"], departmentSales.slice(4), createMotionMap(departmentSales.slice(4), "grouped")),
        ],
        rows: havingAggregates,
        activeColumns: ["department_total"],
        activeRows: [havingAggregates[2]],
        rowMotionByKey: { Design: "matched", Support: "rejected" },
        summaryItems: [{ label: "350 >= 300", value: "keep" }],
      }),
      createStep({
        id: "having-output",
        title: "필터 결과 출력",
        description: "HAVING을 통과한 Platform과 Design 그룹만 최종 결과에 남긴다.",
        pseudoCodeLine: 5,
        phase: "select",
        query: havingQuery,
        activeQueryLines: [1, 4],
        inputTables: [
          createInputTable("department_sales", departmentSales, ["department", "amount"], departmentSales, createMotionMap(departmentSales, "grouped")),
        ],
        ...withOutputMotion([havingAggregates[0], havingAggregates[2]], "filtered"),
        activeColumns: ["department", "department_total"],
        summaryItems: [{ label: "남은 그룹", value: "2 groups" }],
      }),
    ],
  };
};

const buildUnionExample = (): DatabaseExample => {
  const pseudoCode = [
    "첫 번째 SELECT 결과를 만든다.",
    "두 번째 SELECT 결과를 만든다.",
    "두 결과의 열 구조를 email 하나로 맞춘다.",
    "행을 이어 붙인다.",
    "UNION 규칙에 따라 중복 email을 제거한다.",
  ];

  return {
    id: "union",
    title: "UNION 실행 흐름",
    tabLabel: "UNION",
    intro: "newsletter_signups와 purchasers의 email을 합치되 UNION이 중복 email을 한 번만 남긴다.",
    query: unionQuery,
    pseudoCode,
    trace: [
      createStep({
        id: "union-first-select",
        title: "첫 번째 결과 준비",
        description: "newsletter_signups에서 email 열만 선택해 첫 번째 결과 집합을 만든다.",
        pseudoCodeLine: 1,
        phase: "select",
        query: unionQuery,
        activeQueryLines: [1],
        inputTables: [
          createInputTable("newsletter_signups", newsletterSignups, ["email"], newsletterSignups, createMotionMap(newsletterSignups, "projected")),
          createInputTable("purchasers", purchasers, ["email"], []),
        ],
        ...withOutputMotion(newsletterSignups, "projected"),
        activeColumns: ["email"],
        summaryItems: [{ label: "왼쪽 결과", value: `${newsletterSignups.length} rows` }],
      }),
      createStep({
        id: "union-second-select",
        title: "두 번째 결과 준비",
        description: "purchasers에서도 같은 email 열만 선택해 두 번째 결과 집합을 만든다.",
        pseudoCodeLine: 2,
        phase: "select",
        query: unionQuery,
        activeQueryLines: [3],
        inputTables: [
          createInputTable("newsletter_signups", newsletterSignups, ["email"], newsletterSignups, createMotionMap(newsletterSignups, "projected")),
          createInputTable("purchasers", purchasers, ["email"], purchasers, createMotionMap(purchasers, "projected")),
        ],
        ...withOutputMotion(purchasers, "projected"),
        activeColumns: ["email"],
        summaryItems: [{ label: "오른쪽 결과", value: `${purchasers.length} rows` }],
      }),
      createStep({
        id: "union-align-columns",
        title: "열 구조 정렬",
        description: "UNION은 양쪽 SELECT의 열 개수와 의미가 같아야 하므로 email 열끼리 맞춘다.",
        pseudoCodeLine: 3,
        phase: "union",
        query: unionQuery,
        activeQueryLines: [1, 3],
        inputTables: [
          createInputTable("newsletter_signups", newsletterSignups, ["email"], newsletterSignups, createMotionMap(newsletterSignups, "candidate")),
          createInputTable("purchasers", purchasers, ["email"], purchasers, createMotionMap(purchasers, "candidate")),
        ],
        rows: unionAppendRows,
        activeColumns: ["email"],
        activeRows: unionAppendRows.slice(0, 4),
        rowMotionByKey: createMotionMap(unionAppendRows.slice(0, 4), "candidate", (row) => `${row.source}:${row.email}`),
        summaryItems: [{ label: "열 구조", value: "email" }],
      }),
      createStep({
        id: "union-append",
        title: "append",
        description: "두 결과를 순서대로 이어 붙인다. 아직 중복 email은 그대로 보인다.",
        pseudoCodeLine: 4,
        phase: "union",
        query: unionQuery,
        activeQueryLines: [2],
        inputTables: [
          createInputTable("newsletter_signups", newsletterSignups, ["email"], newsletterSignups, createMotionMap(newsletterSignups, "unioned")),
          createInputTable("purchasers", purchasers, ["email"], purchasers, createMotionMap(purchasers, "unioned")),
        ],
        rows: unionAppendRows,
        activeColumns: ["email"],
        activeRows: unionAppendRows,
        rowMotionByKey: createMotionMap(unionAppendRows, "unioned", (row) => `${row.source}:${row.email}`),
        summaryItems: [{ label: "append 결과", value: `${unionAppendRows.length} rows` }],
      }),
      createStep({
        id: "union-deduplicate",
        title: "duplicate 제거",
        description: "UNION은 기본적으로 DISTINCT이므로 이미 나온 email은 제거하고 고유 email만 남긴다.",
        pseudoCodeLine: 5,
        phase: "union",
        query: unionQuery,
        activeQueryLines: [2],
        inputTables: [
          createInputTable("newsletter_signups", newsletterSignups, ["email"], newsletterSignups, createMotionMap(newsletterSignups, "unioned")),
          createInputTable("purchasers", purchasers, ["email"], purchasers, {
            "hyun@example.com": "deduped",
            "nari@example.com": "unioned",
            "sol@example.com": "unioned",
            "minseo@example.com": "deduped",
          }),
        ],
        ...withOutputMotion(unionResult, "deduped"),
        activeColumns: ["email"],
        summaryItems: [
          { label: "제거", value: "hyun@example.com, minseo@example.com" },
          { label: "최종", value: `${unionResult.length} unique emails` },
        ],
      }),
    ],
  };
};

const buildOrderLimitExample = (): DatabaseExample => {
  const pseudoCode = [
    "product_sales에서 product와 total_sales를 읽는다.",
    "ORDER BY total_sales DESC 정렬 키를 계산한다.",
    "매출 내림차순으로 중간 결과를 재배치한다.",
    "LIMIT 3의 cutoff 위치를 표시한다.",
    "상위 3개 행만 최종 결과로 출력한다.",
  ];

  return {
    id: "order-limit",
    title: "ORDER/LIMIT 실행 흐름",
    tabLabel: "ORDER/LIMIT",
    intro: "product_sales를 total_sales 내림차순으로 정렬한 뒤 LIMIT 3으로 상위 3개만 남긴다.",
    query: orderLimitQuery,
    pseudoCode,
    trace: [
      createStep({
        id: "order-read-rows",
        title: "정렬 전 행 강조",
        description: "product_sales의 원래 행 순서를 읽고 SELECT 대상 열을 표시한다.",
        pseudoCodeLine: 1,
        phase: "from",
        query: orderLimitQuery,
        activeQueryLines: [2],
        inputTables: [
          createInputTable("product_sales", productSales, ["product", "total_sales"], productSales.slice(0, 3), createMotionMap(productSales.slice(0, 3), "source")),
        ],
        rows: productSales,
        activeColumns: ["product", "total_sales"],
        activeRows: productSales.slice(0, 3),
        rowMotionByKey: createMotionMap(productSales.slice(0, 3), "source"),
        summaryItems: [{ label: "입력", value: `${productSales.length} products` }],
      }),
      createStep({
        id: "order-sort-key",
        title: "정렬 key 표시",
        description: "ORDER BY total_sales DESC가 각 행의 total_sales 값을 비교 키로 사용한다.",
        pseudoCodeLine: 2,
        phase: "orderBy",
        query: orderLimitQuery,
        activeQueryLines: [3],
        inputTables: [
          createInputTable("product_sales", productSales, ["total_sales"], productSales, createMotionMap(productSales, "candidate")),
        ],
        rows: productSales,
        activeColumns: ["total_sales"],
        activeRows: productSales,
        rowMotionByKey: createMotionMap(productSales, "candidate"),
        summaryItems: [{ label: "정렬 기준", value: "total_sales DESC" }],
      }),
      createStep({
        id: "order-sorted-result",
        title: "정렬된 중간 결과",
        description: "매출이 큰 행부터 내려오도록 중간 결과를 재배치한다.",
        pseudoCodeLine: 3,
        phase: "orderBy",
        query: orderLimitQuery,
        activeQueryLines: [3],
        inputTables: [
          createInputTable("product_sales", productSales, ["total_sales"], productSales, createMotionMap(productSales, "sorted")),
        ],
        ...withOutputMotion(sortedProductSales, "sorted"),
        activeColumns: ["product", "total_sales"],
        summaryItems: [{ label: "1위", value: "Monitor 860" }],
      }),
      createStep({
        id: "order-limit-cutoff",
        title: "LIMIT cutoff 표시",
        description: "정렬 결과에서 3번째 행 뒤를 cutoff로 표시하고 아래 행은 제외 후보가 된다.",
        pseudoCodeLine: 4,
        phase: "limit",
        query: orderLimitQuery,
        activeQueryLines: [4],
        inputTables: [
          createInputTable("product_sales", productSales, ["product", "total_sales"], productSales, createMotionMap(productSales, "sorted")),
        ],
        rows: sortedProductSales,
        activeColumns: ["product", "total_sales"],
        activeRows: sortedProductSales.slice(0, 3),
        rowMotionByKey: {
          ...createMotionMap(sortedProductSales.slice(0, 3), "limited"),
          ...createMotionMap(sortedProductSales.slice(3), "cutoff"),
        },
        summaryItems: [{ label: "LIMIT", value: "3 rows" }],
      }),
      createStep({
        id: "order-output-top-three",
        title: "최종 3행 출력",
        description: "cutoff 아래 행을 제거하고 상위 3개 상품만 최종 결과로 출력한다.",
        pseudoCodeLine: 5,
        phase: "select",
        query: orderLimitQuery,
        activeQueryLines: [1, 4],
        inputTables: [
          createInputTable("product_sales", productSales, ["product", "total_sales"], sortedProductSales.slice(0, 3), createMotionMap(sortedProductSales.slice(0, 3), "limited")),
        ],
        ...withOutputMotion(sortedProductSales.slice(0, 3), "limited"),
        activeColumns: ["product", "total_sales"],
        summaryItems: [{ label: "최종 결과", value: "Top 3 products" }],
      }),
    ],
  };
};

export const generateSqlOperationExamples = (): DatabaseExample[] => [
  buildSubQueryExample(),
  buildJoinExample(),
  buildGroupByExample(),
  buildHavingExample(),
  buildUnionExample(),
  buildOrderLimitExample(),
];

export const generateSelectLogicalExecutionTrace = (): TraceStep<DatabaseTraceState>[] =>
  generateSqlOperationExamples().flatMap((example) => example.trace);
