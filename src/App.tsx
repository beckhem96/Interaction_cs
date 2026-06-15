import { Navigate, Route, Routes } from "react-router";

import { SortingPage } from "./concepts/sorting/components/SortingPage";
import { CategoryPlaceholderPage } from "./pages/CategoryPlaceholderPage";
import { HomePage } from "./pages/HomePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sorting" element={<SortingPage />} />
      <Route
        path="/database"
        element={
          <CategoryPlaceholderPage
            title="데이터베이스"
            summary="SQL 쿼리의 논리적 실행 순서를 단계별 테이블 변화로 학습합니다."
          />
        }
      />
      <Route
        path="/trees"
        element={
          <CategoryPlaceholderPage
            title="트리 자료구조"
            summary="노드 탐색, 삽입, 회전 같은 트리 연산의 흐름을 시각화합니다."
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
