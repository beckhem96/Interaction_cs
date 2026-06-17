import { Navigate, Route, Routes } from "react-router";

import { DatabasePage } from "./concepts/database/components/DatabasePage";
import { DynamicProgrammingPage } from "./concepts/dynamic-programming/components/DynamicProgrammingPage";
import { GraphPage } from "./concepts/graphs/components/GraphPage";
import { GraphTraversalPage } from "./concepts/graphs/components/GraphTraversalPage";
import { BinarySearchPage } from "./concepts/search/components/BinarySearchPage";
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
      <Route path="/graphs" element={<GraphPage />} />
      <Route path="/graphs/traversal" element={<GraphTraversalPage />} />
      <Route path="/binary-search" element={<BinarySearchPage />} />
      <Route path="/dynamic-programming" element={<DynamicProgrammingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
