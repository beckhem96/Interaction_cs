import { Link } from "react-router";

type CategoryCard = {
  title: string;
  description: string;
  href: string;
  status: string;
};

const categories: CategoryCard[] = [
  {
    title: "정렬 알고리즘",
    description: "버블 정렬의 비교, 교환, 정렬 완료 구간을 단계별로 관찰합니다.",
    href: "/sorting",
    status: "버블 정렬"
  },
  {
    title: "데이터베이스",
    description: "SELECT 쿼리의 논리적 처리 순서와 중간 결과를 따라갑니다.",
    href: "/database",
    status: "SELECT 실행 순서"
  },
  {
    title: "트리 자료구조",
    description: "탐색 경로와 노드 변화로 BST와 AVL 연산을 이해합니다.",
    href: "/trees",
    status: "BST 삽입과 탐색"
  },
  {
    title: "그래프 자료구조",
    description: "방향, 가중치, DAG, 이분 그래프의 구조 차이를 시각적으로 비교합니다.",
    href: "/graphs",
    status: "그래프 기초"
  },
  {
    title: "그래프 탐색",
    description: "DFS와 BFS가 스택과 큐로 방문 순서를 만드는 과정을 비교합니다.",
    href: "/graphs/traversal",
    status: "DFS와 BFS"
  },
  {
    title: "이진 탐색",
    description: "정렬된 배열에서 후보 구간을 절반씩 줄이며 target을 찾는 과정을 단계별로 관찰합니다.",
    href: "/binary-search",
    status: "O(log n) 탐색"
  },
  {
    title: "동적 계획법",
    description: "0/1 배낭 DP 표를 채우며 작은 상태를 재사용하는 점화식 흐름을 관찰합니다.",
    href: "/dynamic-programming",
    status: "0/1 배낭 DP"
  }
];

export function HomePage() {
  return (
    <main className="page-shell">
      <section className="intro-section" aria-labelledby="home-title">
        <p className="eyebrow">컴퓨터 과학 개념 시각화</p>
        <h1 id="home-title">CS Visual Lab</h1>
        <p className="intro-copy">
          정렬, SQL 실행 순서, 트리와 그래프 자료구조를 단계별 상태 변화로 학습하는
          인터랙티브 실습 공간입니다.
        </p>
      </section>

      <section className="category-grid" aria-label="학습 카테고리">
        {categories.map((category) => (
          <Link className="category-card" key={category.href} to={category.href}>
            <span className="category-status">{category.status}</span>
            <h2>{category.title}</h2>
            <p>{category.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
