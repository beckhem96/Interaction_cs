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
    expect(screen.getByText(/SELECT r.manager/)).toBeInTheDocument();
    expect(
      screen.getAllByText("FROM: 기준 테이블 읽기").length
    ).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 2: FROM sales AS s"
      })
    ).toHaveAttribute("aria-current", "step");
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

    expect(screen.getAllByText("JOIN: 지역 담당자 붙이기").length).toBeGreaterThan(0);
    expect(screen.getByText("JOIN 조건으로 관련 테이블의 열을 붙인다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 3: JOIN regions AS r ON r.region = s.region"
      })
    ).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("columnheader", { name: "manager" })).toBeInTheDocument();
    expect(screen.getAllByRole("cell", { name: "민서" }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getAllByText("WHERE: 행 필터링").length).toBeGreaterThan(0);
    expect(screen.getByText("조건 amount >= 50을 만족하는 행만 남긴다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(screen.queryByRole("cell", { name: "제주" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(
      screen.getAllByText("GROUP BY: 담당자와 지역으로 묶기").length
    ).toBeGreaterThan(0);
    expect(screen.getByRole("columnheader", { name: "sum_amount" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "255" })).toBeInTheDocument();
  });

  it("marks table row motions and active query lines through union and limit", () => {
    const { container } = render(
      <MemoryRouter>
        <DatabasePage />
      </MemoryRouter>
    );

    expect(container.querySelectorAll('tbody tr[data-motion="source"]')).toHaveLength(8);

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(container.querySelectorAll('tbody tr[data-motion="joined"]')).toHaveLength(8);

    for (let step = 0; step < 5; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "다음" }));
    }

    expect(screen.getAllByText("UNION ALL: 온라인 집계 붙이기").length).toBeGreaterThan(0);
    expect(container.querySelectorAll('tbody tr[data-motion="unioned"]')).toHaveLength(5);
    expect(
      screen.getByRole("listitem", {
        name: "현재 쿼리 7: UNION ALL"
      })
    ).toHaveAttribute("aria-current", "step");
    expect(screen.getAllByRole("cell", { name: "온라인" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("cell", { name: "180" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getAllByText("ORDER BY: 합계 기준 정렬").length).toBeGreaterThan(0);
    expect(container.querySelectorAll('tbody tr[data-motion="sorted"]')).toHaveLength(5);

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getAllByText("LIMIT: 상위 결과만 남기기").length).toBeGreaterThan(0);
    expect(container.querySelectorAll('tbody tr[data-motion="limited"]')).toHaveLength(3);
    expect(screen.queryByRole("cell", { name: "모바일" })).not.toBeInTheDocument();
  });
});
