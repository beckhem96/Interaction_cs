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
