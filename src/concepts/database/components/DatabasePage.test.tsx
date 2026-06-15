import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { DatabasePage } from "./DatabasePage";

describe("DatabasePage", () => {
  it("renders the SQL logical execution learning surface", () => {
    render(
      <MemoryRouter>
        <DatabasePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "SQL 논리 실행 순서" })
    ).toBeInTheDocument();
    expect(screen.getByText(/SELECT region/)).toBeInTheDocument();
    expect(
      screen.getAllByText("FROM: 기준 테이블 읽기").length
    ).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(screen.getByRole("columnheader", { name: "region" })).toBeInTheDocument();
    expect(screen.getAllByRole("cell", { name: "서울" }).length).toBeGreaterThan(0);
  });

  it("moves through logical phases and highlights pseudo-code", () => {
    render(
      <MemoryRouter>
        <DatabasePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getAllByText("WHERE: 행 필터링").length).toBeGreaterThan(0);
    expect(screen.getByText("조건 amount >= 50을 만족하는 행만 남긴다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(screen.queryByRole("cell", { name: "제주" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(
      screen.getAllByText("GROUP BY: 지역별 그룹 만들기").length
    ).toBeGreaterThan(0);
    expect(screen.getByRole("columnheader", { name: "sum_amount" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "200" })).toBeInTheDocument();
  });
});
