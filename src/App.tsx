import { Navigate, Route, Routes } from "react-router";

import { DatabasePage } from "./concepts/database/components/DatabasePage";
import { SortingPage } from "./concepts/sorting/components/SortingPage";
import { TreePage } from "./concepts/trees/components/TreePage";
import { HomePage } from "./pages/HomePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sorting" element={<SortingPage />} />
      <Route path="/database" element={<DatabasePage />} />
      <Route path="/trees" element={<TreePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
