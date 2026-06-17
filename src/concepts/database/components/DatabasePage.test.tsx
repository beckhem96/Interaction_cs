import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { DatabasePage } from "./DatabasePage";

const renderDatabasePage = () =>
  render(
    <MemoryRouter>
      <DatabasePage />
    </MemoryRouter>,
  );

describe("DatabasePage", () => {
  it("renders SQL operation tabs with the table stage and query side by side", () => {
    const { container } = renderDatabasePage();

    expect(screen.getByRole("heading", { level: 1, name: "SUB QUERY 실행 흐름" })).toBeInTheDocument();
    for (const tab of ["SUB QUERY", "JOIN", "GROUP BY", "HAVING", "UNION", "ORDER/LIMIT"]) {
      expect(screen.getByRole("tab", { name: tab })).toBeInTheDocument();
    }

    expect(screen.getByRole("heading", { name: "SQL 쿼리" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "SQL 입력 테이블" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "SQL 결과 테이블" })).toBeInTheDocument();
    expect(screen.getAllByText("client").length).toBeGreaterThan(0);
    expect(container.querySelector(".database-workbench")).not.toBeNull();
    expect(container.querySelector(".database-cinematic-page")).not.toBeNull();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "SQL 다음 단계" })).toBeEnabled();
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 1: SELECT id, name",
      }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("changes the rendered SUB QUERY stage and keeps the active SQL line marked", () => {
    const { container } = renderDatabasePage();
    const stageHeading = () => container.querySelector(".database-table-header h2")?.textContent;
    const firstHeading = stageHeading();

    fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));

    expect(stageHeading()).not.toBe(firstHeading);
    expect(container.querySelector(".sql-query-line.is-active")).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 4: SELECT d.client_id",
      }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("renders SQL token color classes and cell highlight classes", () => {
    const { container } = renderDatabasePage();

    expect(container.querySelector(".sql-token-keyword")).not.toBeNull();
    expect(container.querySelector(".sql-token-identifier")).not.toBeNull();
    expect(container.querySelector(".sql-token-operator")).not.toBeNull();
    expect(container.querySelector(".sql-query-line.is-active")).toHaveAttribute(
      "aria-current",
      "step",
    );

    for (let index = 0; index < 4; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));
    }

    expect(container.querySelector('td[data-cell-highlight="match"]')).not.toBeNull();
    expect(container.querySelector('td[data-cell-highlight="reject"]')).not.toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "GROUP BY" }));

    expect(container.querySelector(".sql-token-function")).not.toBeNull();
  });

  it("shows SUB QUERY final output after stepping through the operation", () => {
    renderDatabasePage();

    for (let index = 0; index < 6; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));
    }

    const outputSection = screen.getByRole("region", { name: "SQL 결과 테이블" });
    expect(within(outputSection).getByRole("cell", { name: "1" })).toBeInTheDocument();
    expect(within(outputSection).getByRole("cell", { name: "Jisoo" })).toBeInTheDocument();
    expect(within(outputSection).getByRole("cell", { name: "4" })).toBeInTheDocument();
    expect(within(outputSection).getByRole("cell", { name: "Ara" })).toBeInTheDocument();
    expect(within(outputSection).queryByRole("cell", { name: "Hyun" })).not.toBeInTheDocument();
  });

  it("uses independent queries for GROUP BY and HAVING tabs", () => {
    const { container } = renderDatabasePage();

    fireEvent.click(screen.getByRole("tab", { name: "GROUP BY" }));
    expect(screen.getByRole("heading", { level: 1, name: "GROUP BY 실행 흐름" })).toBeInTheDocument();
    expect(container.querySelector(".sql-query")?.textContent).toContain("GROUP BY region;");
    expect(container.querySelector(".sql-query")?.textContent).not.toContain("JOIN customers");

    fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));
    expect(container.querySelector(".database-table-header h2")?.textContent).toContain("bucket");

    fireEvent.click(screen.getByRole("tab", { name: "HAVING" }));
    expect(screen.getByRole("heading", { level: 1, name: "HAVING 실행 흐름" })).toBeInTheDocument();
    expect(container.querySelector(".sql-query")?.textContent).toContain("HAVING SUM(amount) >= 300;");
    expect(container.querySelector(".sql-query")?.textContent).not.toContain("UNION");
  });

  it("shows UNION duplicate removal with two input tables", () => {
    const { container } = renderDatabasePage();

    fireEvent.click(screen.getByRole("tab", { name: "UNION" }));

    expect(screen.getAllByText("newsletter_signups").length).toBeGreaterThan(0);
    expect(screen.getAllByText("purchasers").length).toBeGreaterThan(0);

    for (let index = 0; index < 4; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));
    }

    expect(container.querySelector(".database-table-header h2")?.textContent).toContain("duplicate");
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 2: UNION",
      }),
    ).toHaveAttribute("aria-current", "step");
    expect(container.querySelectorAll('tbody tr[data-motion="deduped"]').length).toBeGreaterThan(0);
  });

  it("shows ORDER/LIMIT cutoff and final top three output", () => {
    const { container } = renderDatabasePage();

    fireEvent.click(screen.getByRole("tab", { name: "ORDER/LIMIT" }));
    for (let index = 0; index < 3; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));
    }

    expect(container.querySelector(".database-table-header h2")?.textContent).toContain("LIMIT cutoff");
    expect(container.querySelectorAll('tbody tr[data-motion="cutoff"]').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "SQL 다음 단계" }));

    const outputSection = screen.getByRole("region", { name: "SQL 결과 테이블" });
    expect(within(outputSection).getByRole("cell", { name: "Monitor" })).toBeInTheDocument();
    expect(within(outputSection).getByRole("cell", { name: "Headset" })).toBeInTheDocument();
    expect(within(outputSection).getByRole("cell", { name: "Laptop Stand" })).toBeInTheDocument();
    expect(within(outputSection).queryByRole("cell", { name: "Keyboard" })).not.toBeInTheDocument();
  });
});
