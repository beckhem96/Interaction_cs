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
    expect(
      screen.getByText("입력 배열: [14, 3, 17, 8, 6, 12, 1, 19, 4, 10]")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "재생" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "초기화" })).toBeInTheDocument();
    expect(screen.getByText("초기 배열")).toBeInTheDocument();
    expect(screen.getByText("시간 복잡도 O(n²)")).toBeInTheDocument();
    expect(screen.getByLabelText("9번 인덱스, 값 10")).toBeInTheDocument();
    expect(screen.getByText("상태 범례")).toBeInTheDocument();
  });

  it("moves through trace steps with the next and reset controls", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByText("14와 3 비교")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "초기화" }));

    expect(screen.getByText("초기 배열")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전" })).toBeDisabled();
  });

  it("also advances with the next button beside the chart", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "도표 다음" }));

    expect(screen.getByText("14와 3 비교")).toBeInTheDocument();
  });

  it("supports manual timeline scrubbing and playback speed selection", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    const slider = screen.getByRole("slider", { name: "정렬 단계 슬라이더" });
    fireEvent.change(slider, { target: { value: "2" } });

    expect(screen.getByText("14와 3 교환")).toBeInTheDocument();
    expect(slider).toHaveValue("2");

    fireEvent.change(screen.getByLabelText("속도"), { target: { value: "500" } });

    expect(screen.getByLabelText("속도")).toHaveValue("500");
    expect(
      screen.getByRole("button", { name: "자동 재생" })
    ).toBeInTheDocument();
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
    expect(
      screen.getByRole("listitem", { name: /void bubbleSort/ })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(screen.getByRole("tab", { name: "Python" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("bubbleSort.py")).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", { name: /def bubble_sort/ })
    ).toBeInTheDocument();
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

    expect(screen.getByText("3과 현재 최소값 14 비교")).toBeInTheDocument();
    expect(screen.getByText("남은 구간에서 더 작은 값을 찾는다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
  });

  it("switches to Insertion Sort with synchronized code highlighting", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "삽입 정렬" }));

    expect(
      screen.getByRole("heading", { name: "삽입 정렬" })
    ).toBeInTheDocument();
    expect(screen.getByText("초기 배열")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByText("3을 삽입할 위치 찾기")).toBeInTheDocument();
    expect(screen.getByText("insertionSort.c")).toBeInTheDocument();
    expect(screen.getByText("다음 값을 key로 선택한다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(
      screen.getByRole("listitem", { name: /현재 코드 5/ })
    ).toHaveTextContent("int key = values[current];");

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    expect(screen.getByText("14와 key 3 비교")).toBeInTheDocument();
    expect(screen.getByText("정렬된 구간에서 key보다 큰 값을 찾는다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
  });

  it("switches to Merge Sort with synchronized code highlighting", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "병합 정렬" }));

    expect(
      screen.getByRole("heading", { name: "병합 정렬" })
    ).toBeInTheDocument();
    expect(screen.getByText("초기 배열")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "도표 다음" }));

    expect(screen.getByText("0~9 구간 분할")).toBeInTheDocument();
    expect(screen.getByText("mergeSort.c")).toBeInTheDocument();
    expect(screen.getByText("배열을 절반으로 나눈다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(
      screen.getByRole("listitem", { name: /현재 코드 4/ })
    ).toHaveTextContent("int mid =");
  });

  it("switches to Quick Sort with synchronized code highlighting", () => {
    render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("tab", { name: "퀵 정렬" }));

    expect(screen.getByRole("heading", { name: "퀵 정렬" })).toBeInTheDocument();
    expect(screen.getByText("초기 배열")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "도표 다음" }));

    expect(screen.getByText("0~9 구간 피벗 선택")).toBeInTheDocument();
    expect(screen.getByText("quickSort.c")).toBeInTheDocument();
    expect(screen.getByText("구간의 마지막 값을 피벗으로 선택한다.")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(
      screen.getByRole("listitem", { name: /현재 코드 5/ })
    ).toHaveTextContent("int pivot =");
  });

  it("renders code with language-aware syntax colors", () => {
    const { container } = render(
      <MemoryRouter>
        <SortingPage />
      </MemoryRouter>
    );

    expect(screen.getByText("void")).toHaveClass("token-keyword");
    expect(container.querySelector(".token-number")).not.toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "Python" }));

    expect(screen.getByText("def")).toHaveClass("token-keyword");
    expect(screen.getAllByText("range")[0]).toHaveClass("token-builtin");
  });
});
