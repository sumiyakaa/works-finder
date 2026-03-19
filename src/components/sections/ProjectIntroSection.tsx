export function ProjectIntroSection() {
  return (
    <section className="archive-section project-intro-section" aria-labelledby="project-intro-title">
      <div className="section-heading">
        <div>
          <p className="section-label">About</p>
          <h2 id="project-intro-title">このサイトでできること</h2>
        </div>
        <p className="section-heading__note">
          制作実績を多角的に確認できます。
        </p>
      </div>

      <div className="project-intro-grid">
        <article className="project-intro-card">
          <p className="project-intro-card__label">Data</p>
          <h3>全 17 件の制作実績</h3>
          <p>要件・規模・技術スタックなど、案件ごとの詳細を掲載しています。</p>
        </article>

        <article className="project-intro-card">
          <p className="project-intro-card__label">Explore</p>
          <h3>検索・フィルター・比較</h3>
          <p>キーワード検索やカテゴリ絞り込みで、ご依頼に近い案件をすぐに見つけられます。</p>
        </article>

        <article className="project-intro-card">
          <p className="project-intro-card__label">Detail</p>
          <h3>概要とケーススタディ</h3>
          <p>各作品の設計背景や実装の詳細を確認し、ケーススタディもご覧いただけます。</p>
        </article>
      </div>
    </section>
  )
}
