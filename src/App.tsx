import { Navigate, Route, Routes } from "react-router";

import { DatabasePage } from "./concepts/database/components/DatabasePage";
import { DynamicProgrammingPage } from "./concepts/dynamic-programming/components/DynamicProgrammingPage";
import { DijkstraPage } from "./concepts/graphs/components/DijkstraPage";
import { GraphPage } from "./concepts/graphs/components/GraphPage";
import { GraphTraversalPage } from "./concepts/graphs/components/GraphTraversalPage";
import { MstPage } from "./concepts/graphs/components/MstPage";
import { StronglyConnectedComponentsPage } from "./concepts/graphs/components/StronglyConnectedComponentsPage";
import { TopologicalSortPage } from "./concepts/graphs/components/TopologicalSortPage";
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
      <Route path="/graphs/dijkstra" element={<DijkstraPage />} />
      <Route path="/graphs/mst" element={<MstPage />} />
      <Route path="/graphs/topological-sort" element={<TopologicalSortPage />} />
      <Route path="/graphs/scc" element={<StronglyConnectedComponentsPage />} />
      <Route path="/binary-search" element={<BinarySearchPage />} />
      <Route path="/dynamic-programming" element={<DynamicProgrammingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
