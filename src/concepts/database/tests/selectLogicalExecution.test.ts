import { describe, expect, it } from "vitest";

import {
  generateSqlOperationExamples,
  sqlTopicCategories,
} from "../engine/selectLogicalExecution";
import type { DatabaseRow } from "../types";

const getDatabaseRowKey = (row: DatabaseRow): string => {
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
};

describe("generateSqlOperationExamples", () => {
  const examples = generateSqlOperationExamples();

  it("returns independent operation examples with separate queries", () => {
    expect(examples.map((example) => example.id)).toEqual([
      "sub-query",
      "join",
      "group-by",
      "having",
      "union",
      "union-all",
      "order-limit",
      "window-rank",
    ]);

    expect(new Set(examples.map((example) => example.query)).size).toBe(examples.length);
    expect(examples.find((example) => example.id === "sub-query")?.query).toContain("WHERE id IN");
    expect(examples.find((example) => example.id === "join")?.query).toContain("JOIN customers");
    expect(examples.find((example) => example.id === "group-by")?.query).not.toContain("JOIN");
    expect(examples.find((example) => example.id === "having")?.query).toContain("HAVING");
    expect(examples.find((example) => example.id === "union")?.query).toContain("UNION");
    expect(examples.find((example) => example.id === "union-all")?.query).toContain("UNION ALL");
    expect(examples.find((example) => example.id === "order-limit")?.query).toContain("LIMIT 3");
    expect(examples.find((example) => example.id === "window-rank")?.query).toContain("RANK() OVER");
  });

  it("returns the 8 required SQL/DATABASE categories in the planned order", () => {
    expect(examples.map((example) => example.tabLabel)).toEqual([
      "SUB QUERY",
      "JOIN",
      "GROUP BY",
      "HAVING",
      "UNION",
      "UNION ALL",
      "ORDER/LIMIT",
      "WINDOW RANK",
    ]);
    expect(sqlTopicCategories.map((category) => category.id)).toEqual(
      examples.map((example) => example.id),
    );
    expect(sqlTopicCategories.every((category) => category.isInteractive)).toBe(true);
  });

  it("keeps every trace multi-step and query line highlights in range", () => {
    for (const example of examples) {
      const queryLineCount = example.query.split("\n").length;

      expect(example.trace.length).toBeGreaterThanOrEqual(4);

      for (const step of example.trace) {
        expect(step.state.query).toBe(example.query);
        expect(step.pseudoCodeLine).toBeGreaterThanOrEqual(1);
        expect(step.pseudoCodeLine).toBeLessThanOrEqual(example.pseudoCode.length);

        for (const line of step.state.activeQueryLines) {
          expect(line).toBeGreaterThanOrEqual(1);
          expect(line).toBeLessThanOrEqual(queryLineCount);
        }
      }
    }
  });

  it("keeps SQL cell highlights pointed at real rows and columns", () => {
    for (const example of examples) {
      for (const step of example.trace) {
        for (const highlight of step.state.cellHighlights ?? []) {
          const rows =
            highlight.scope === "input"
              ? (step.state.inputTables ?? []).find((table) => table.name === highlight.tableName)
                  ?.rows ?? []
              : step.state.rows;
          const columns = rows.length > 0 ? Object.keys(rows[0]!) : [];
          const rowKeys = new Set(rows.map(getDatabaseRowKey));

          expect(columns, `${step.id} has column ${highlight.column}`).toContain(highlight.column);
          expect(rowKeys, `${step.id} has row ${highlight.rowKey}`).toContain(highlight.rowKey);
        }
      }
    }
  });

  it("shows SUB QUERY with three inputs, cell highlights, and final client rows", () => {
    const subQuery = examples.find((example) => example.id === "sub-query");

    expect(subQuery).toBeDefined();
    expect(subQuery?.trace).toHaveLength(7);
    expect(subQuery?.trace[0].state.inputTables?.map((table) => table.name)).toEqual([
      "client",
      "delivery",
      "product",
    ]);

    const statusStep = subQuery?.trace.find((step) => step.id === "subquery-filter-status");
    const colorStep = subQuery?.trace.find((step) => step.id === "subquery-filter-color");
    const finalStep = subQuery?.trace.find((step) => step.id === "subquery-outer-filter");

    expect(statusStep?.state.cellHighlights?.some((highlight) => highlight.tone === "match")).toBe(true);
    expect(colorStep?.state.cellHighlights?.some((highlight) => highlight.tone === "reject")).toBe(true);
    expect(finalStep?.state.cellHighlights?.some((highlight) => highlight.scope === "output")).toBe(true);
    expect(finalStep?.state.rows).toEqual([
      { id: 1, name: "Jisoo" },
      { id: 4, name: "Ara" },
    ]);
  });

  it("shows JOIN with two input tables and joined rows", () => {
    const join = examples.find((example) => example.id === "join");

    expect(join).toBeDefined();
    expect(join?.trace[0].state.inputTables).toHaveLength(2);

    const joinedStep = join?.trace.find((step) => step.id === "join-output-row");
    expect(joinedStep?.state.rows).toEqual([
      expect.objectContaining({
        order_id: 101,
        name: "Minseo",
        tier: "Gold",
        total: 120,
      }),
    ]);
    expect(Object.values(joinedStep?.state.rowMotionByKey ?? {})).toContain("joined");
  });

  it("shows UNION with two inputs and duplicate removal", () => {
    const union = examples.find((example) => example.id === "union");

    expect(union).toBeDefined();
    expect(union?.trace[0].state.inputTables).toHaveLength(2);

    const appendStep = union?.trace.find((step) => step.id === "union-append");
    const dedupeStep = union?.trace.find((step) => step.id === "union-deduplicate");
    const finalEmails = dedupeStep?.state.rows.map((row) => row.email);

    expect(appendStep?.state.rows).toHaveLength(8);
    expect(dedupeStep?.state.rows).toHaveLength(new Set(finalEmails).size);
    expect(Object.values(dedupeStep?.state.rowMotionByKey ?? {})).toContain("deduped");
  });

  it("shows UNION ALL with retained duplicate rows", () => {
    const unionAll = examples.find((example) => example.id === "union-all");

    expect(unionAll).toBeDefined();
    expect(unionAll?.trace[0].state.inputTables).toHaveLength(2);

    const appendStep = unionAll?.trace.find((step) => step.id === "union-all-append");
    const finalStep = unionAll?.trace.find((step) => step.id === "union-all-output");
    const finalEmails = finalStep?.state.rows.map((row) => row.email);

    expect(appendStep?.state.rows).toHaveLength(8);
    expect(finalStep?.state.rows).toHaveLength(8);
    expect(finalEmails?.filter((email) => email === "hyun@example.com")).toHaveLength(2);
    expect(finalEmails?.filter((email) => email === "minseo@example.com")).toHaveLength(2);
    expect(Object.values(finalStep?.state.rowMotionByKey ?? {})).toContain("retainedDuplicate");
    expect(finalStep?.state.cellHighlights?.some((highlight) => highlight.tone === "duplicate")).toBe(true);
  });

  it("marks ORDER/LIMIT cutoff rows and keeps only the top three at the end", () => {
    const orderLimit = examples.find((example) => example.id === "order-limit");

    expect(orderLimit).toBeDefined();

    const cutoffStep = orderLimit?.trace.find((step) => step.id === "order-limit-cutoff");
    const finalStep = orderLimit?.trace.at(-1);

    expect(Object.values(cutoffStep?.state.rowMotionByKey ?? {})).toContain("cutoff");
    expect(finalStep?.state.rows).toEqual([
      { product: "Monitor", total_sales: 860 },
      { product: "Headset", total_sales: 640 },
      { product: "Laptop Stand", total_sales: 510 },
    ]);
  });

  it("shows WINDOW RANK tie rows and rank gaps", () => {
    const windowRank = examples.find((example) => example.id === "window-rank");

    expect(windowRank).toBeDefined();

    const tieStep = windowRank?.trace.find((step) => step.id === "rank-tie-detected");
    const finalStep = windowRank?.trace.find((step) => step.id === "rank-output");

    expect(Object.values(tieStep?.state.rowMotionByKey ?? {})).toContain("tie");
    expect(tieStep?.state.cellHighlights?.some((highlight) => highlight.tone === "tie")).toBe(true);
    expect(finalStep?.state.rows).toEqual([
      expect.objectContaining({ student: "Mina", score: 98, rank: 1 }),
      expect.objectContaining({ student: "Joon", score: 92, rank: 2 }),
      expect.objectContaining({ student: "Ara", score: 92, rank: 2 }),
      expect.objectContaining({ student: "Sol", score: 87, rank: 4 }),
      expect.objectContaining({ student: "Hyun", score: 81, rank: 5 }),
    ]);
    expect(Object.values(finalStep?.state.rowMotionByKey ?? {})).toContain("ranked");
  });
});
