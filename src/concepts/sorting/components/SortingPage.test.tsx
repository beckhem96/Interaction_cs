import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { SortingPage } from "./SortingPage";

describe("SortingPage", () => {
  it("renders the Bubble Sort learning surface and controls", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "버블 정렬" })
    ).toBeInTheDocument();
    expect(screen.getByText("입력 배열: [5, 3, 8, 4, 2]")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "재생" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "초기화" })).toBeInTheDocument();
    expect(screen.getByText("초기 배열")).toBeInTheDocument();
    expect(screen.getByText("시간 복잡도 O(n²)")).toBeInTheDocument();
  });

  it("moves through trace steps with the next and reset controls", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByText("5와 3 비교")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "초기화" }));

    expect(screen.getByText("초기 배열")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
  });

  it("shows language code tabs without executing code", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "코드 예제" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("bubbleSort.c")).toBeInTheDocument();
    expect(screen.getByText(/void bubbleSort/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(screen.getByRole("tab", { name: "Python" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("bubbleSort.py")).toBeInTheDocument();
    expect(screen.getByText(/def bubble_sort/)).toBeInTheDocument();
  });

  it("highlights pseudo-code and selected language code for the current step", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByText("인접한 두 값을 비교한다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(
      screen.getByRole("listitem", { name: /현재 코드 6/ })
    ).toHaveTextContent("if (values[index] > values[index + 1])");

    fireEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(
      screen.getByRole("listitem", { name: /현재 코드 6/ })
    ).toHaveTextContent("if result[index] > result[index + 1]");
  });

  it("places chart, code, pseudo-code with step, and summary in the requested order", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    const chart = screen.getByLabelText("버블 정렬 도표");
    const code = screen.getByLabelText("버블 정렬 코드");
    const pseudoAndStep = screen.getByLabelText("단계와 의사 코드");
    const summary = screen.getByLabelText("핵심 요약");

    expect(chart.compareDocumentPosition(code)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(code.compareDocumentPosition(pseudoAndStep)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(pseudoAndStep.compareDocumentPosition(summary)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(pseudoAndStep).toContainElement(
      screen.getByRole("heading", { name: "현재 단계" })
    );
    expect(pseudoAndStep).toContainElement(
      screen.getByRole("heading", { name: "의사 코드" })
    );
  });

  it("switches to Selection Sort with synchronized code highlighting", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "선택 정렬" }));

    expect(
      screen.getByRole("heading", { name: "선택 정렬" })
    ).toBeInTheDocument();
    expect(screen.getByText("초기 배열")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByText("0번 위치에서 최소값 탐색 시작")).toBeInTheDocument();
    expect(screen.getByText("selectionSort.c")).toBeInTheDocument();
    expect(screen.getByText("현재 위치를 최소값 위치로 가정한다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(
      screen.getByRole("listitem", { name: /현재 코드 5/ })
    ).toHaveTextContent("int minIndex = current;");

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByText("3과 현재 최소값 5 비교")).toBeInTheDocument();
    expect(screen.getByText("남은 구간에서 더 작은 값을 찾는다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
  });
});
