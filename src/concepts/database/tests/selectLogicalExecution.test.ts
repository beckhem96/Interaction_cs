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
      "where",
      "groupBy",
      "having",
      "select",
      "orderBy"
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
      title: "WHERE: 행 필터링",
      state: {
        rows: [
          { id: 1, region: "서울", product: "노트북", amount: 120, soldAt: "2026-01-03" },
          { id: 3, region: "서울", product: "모니터", amount: 80, soldAt: "2026-01-05" },
          { id: 5, region: "부산", product: "노트북", amount: 150, soldAt: "2026-01-07" }
        ]
      },
      pseudoCodeLine: 2
    });

    expect(trace[2]).toMatchObject({
      title: "GROUP BY: 지역별 그룹 만들기",
      state: {
        rows: [
          { region: "서울", row_count: 2, sum_amount: 200 },
          { region: "부산", row_count: 1, sum_amount: 150 }
        ]
      },
      pseudoCodeLine: 3
    });

    expect(trace.at(-1)).toMatchObject({
      title: "ORDER BY: 최종 결과 정렬",
      state: {
        rows: [
          { region: "서울", total_amount: 200 },
          { region: "부산", total_amount: 150 }
        ]
      },
      pseudoCodeLine: 6
    });
  });
});
