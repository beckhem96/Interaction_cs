import { Link } from "react-router";

type CategoryPlaceholderPageProps = {
  title: string;
  summary: string;
};

export function CategoryPlaceholderPage({
  title,
  summary
}: CategoryPlaceholderPageProps) {
  return (
    <main className="page-shell placeholder-page">
      <Link className="back-link" to="/">
        홈으로
      </Link>
      <section aria-labelledby="category-title">
        <p className="eyebrow">카테고리</p>
        <h1 id="category-title">{title}</h1>
        <p className="intro-copy">{summary}</p>
        <p className="phase-note">Phase 1에서 구현 예정입니다.</p>
      </section>
    </main>
  );
}
