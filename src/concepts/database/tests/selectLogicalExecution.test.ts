import { describe, expect, it } from "vitest";

import {
  generateSelectLogicalExecutionTrace,
  selectLogicalExecutionQuery
} from "../engine/selectLogicalExecution";

describe("generateSelectLogicalExecutionTrace", () => {
  it("generates SELECT logical execution steps with intermediate rows", () => {
    const trace = generateSelectLogicalExecutionTrace();

    expect(trace.map((step) => step.state.phase)).toEqual([
      "from",
      "join",
      "where",
      "groupBy",
      "having",
      "select",
      "union",
      "orderBy",
      "limit"
    ]);

    expect(trace[0]).toMatchObject({
      id: "sql-from",
      title: "FROM: 기준 테이블 읽기",
      state: {
        query: selectLogicalExecutionQuery,
        rows: expect.arrayContaining([
          expect.objectContaining({ region: "서울", amount: 120 })
        ])
      },
      pseudoCodeLine: 1
    });

    expect(trace[1]).toMatchObject({
      id: "sql-join",
      title: "JOIN: 지역 담당자 붙이기",
      state: {
        activeQueryLines: [3],
        rows: expect.arrayContaining([
          expect.objectContaining({
            sale_id: 1,
            region: "서울",
            manager: "민서",
            zone: "수도권"
          })
        ])
      },
      pseudoCodeLine: 2
    });

    expect(trace[2]).toMatchObject({
      title: "WHERE: 행 필터링",
      state: {
        activeQueryLines: [4],
        rows: expect.not.arrayContaining([
          expect.objectContaining({ amount: 35 }),
          expect.objectContaining({ amount: 25 })
        ])
      },
      pseudoCodeLine: 3
    });
    expect(trace[2].state.rows).toHaveLength(6);

    expect(trace[3]).toMatchObject({
      title: "GROUP BY: 담당자와 지역으로 묶기",
      state: {
        rows: [
          { manager: "민서", region: "서울", order_count: 3, sum_amount: 255 },
          { manager: "준호", region: "부산", order_count: 1, sum_amount: 150 },
          { manager: "민서", region: "인천", order_count: 1, sum_amount: 95 },
          { manager: "준호", region: "대구", order_count: 1, sum_amount: 70 }
        ]
      },
      pseudoCodeLine: 4
    });

    expect(trace[6]).toMatchObject({
      title: "UNION ALL: 온라인 집계 붙이기",
      state: {
        activeQueryLines: [7, 8, 9, 10, 11],
        rows: expect.arrayContaining([
          { manager: "온라인", region: "온라인", total_amount: 180, order_count: 1 },
          { manager: "온라인", region: "모바일", total_amount: 90, order_count: 1 },
          { manager: "온라인", region: "파트너", total_amount: 130, order_count: 1 }
        ])
      },
      pseudoCodeLine: 7
    });

    expect(trace.at(-1)).toMatchObject({
      title: "LIMIT: 상위 결과만 남기기",
      state: {
        rows: [
          { manager: "민서", region: "서울", total_amount: 255, order_count: 3 },
          { manager: "온라인", region: "온라인", total_amount: 180, order_count: 1 },
          { manager: "준호", region: "부산", total_amount: 150, order_count: 1 }
        ]
      },
      pseudoCodeLine: 9
    });
  });
});
