import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { DatabasePage } from "./DatabasePage";

describe("DatabasePage", () => {
  it("renders operation tabs with SQL and table stage side by side", () => {
    const { container } = render(
      <MemoryRouter>
        <DatabasePage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "SQL: JOIN" })).toBeInTheDocument();
    for (const tab of ["JOIN", "GROUP BY", "HAVING", "UNION", "ORDER/LIMIT"]) {
      expect(screen.getByRole("tab", { name: tab })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "SQL 쿼리" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "SQL 입력 테이블" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "SQL 결과 테이블" })).toBeInTheDocument();
    expect(screen.getAllByText("sales").length).toBeGreaterThan(0);
    expect(container.querySelector(".database-workbench")).not.toBeNull();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "SQL 다음 단계" })).toBeEnabled();
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 2: FROM sales AS s"
      })
    ).toHaveAttribute("aria-current", "step");
  });

  it("shows both source tables and joined columns during JOIN", () => {
    const { container } = render(
      <MemoryRouter>
        <DatabasePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));

    expect(screen.getAllByText("JOIN: 지역 담당자 붙이기").length).toBeGreaterThan(0);
    expect(screen.getByText("regions")).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 3: JOIN regions AS r ON r.region = s.region"
      })
    ).toHaveAttribute("aria-current", "step");
    expect(screen.getAllByRole("columnheader", { name: "manager" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("cell", { name: "민서" }).length).toBeGreaterThan(0);
    expect(container.querySelectorAll('tbody tr[data-motion="joined"]')).toHaveLength(8);
    expect(container.querySelectorAll('tbody tr[data-active-row="true"]').length).toBeGreaterThan(0);
  });

  it("separates GROUP BY into its own example", () => {
    const { container } = render(
      <MemoryRouter>
        <DatabasePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "GROUP BY" }));

    expect(screen.getByRole("heading", { name: "SQL: GROUP BY" })).toBeInTheDocument();
    expect(screen.getAllByText("WHERE: 행 필터링").length).toBeGreaterThan(0);
    expect(screen.getByText("JOIN 결과")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));

    expect(
      screen.getAllByText("GROUP BY: 담당자와 지역으로 묶기").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("WHERE 결과")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader", { name: "sum_amount" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("cell", { name: "255" })).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr[data-motion="grouped"]')).toHaveLength(4);
  });

  it("separates UNION ALL and shows online_sales as the second input", () => {
    const { container } = render(
      <MemoryRouter>
        <DatabasePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "UNION" }));
    fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));

    expect(screen.getAllByText("UNION ALL: 온라인 집계 붙이기").length).toBeGreaterThan(0);
    expect(screen.getByText("첫 번째 SELECT 결과")).toBeInTheDocument();
    expect(screen.getByText("online_sales")).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 7: UNION ALL"
      })
    ).toHaveAttribute("aria-current", "step");
    expect(screen.getAllByRole("cell", { name: "온라인" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("cell", { name: "180" }).length).toBeGreaterThan(0);
    expect(container.querySelectorAll('tbody tr[data-motion="unioned"]')).toHaveLength(5);
  });

  it("separates ORDER BY and LIMIT into a focused example", () => {
    const { container } = render(
      <MemoryRouter>
        <DatabasePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "ORDER/LIMIT" }));

    expect(screen.getByRole("heading", { name: "SQL: ORDER BY / LIMIT" })).toBeInTheDocument();
    expect(screen.getAllByText("ORDER BY: 합계 기준 정렬").length).toBeGreaterThan(0);
    expect(container.querySelectorAll('tbody tr[data-motion="sorted"]')).toHaveLength(5);

    fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));

    expect(screen.getAllByText("LIMIT: 상위 결과만 남기기").length).toBeGreaterThan(0);
    expect(container.querySelectorAll('tbody tr[data-motion="limited"]')).toHaveLength(3);
    const outputTable = screen.getByRole("region", { name: "SQL 결과 테이블" });
    expect(within(outputTable).queryByRole("cell", { name: "모바일" })).not.toBeInTheDocument();
  });
});
