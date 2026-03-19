interface ArchiveStat {
  label: string
  value: string
  supportingText: string
}

interface TaxonomyPreview {
  title: string
  items: string[]
}

interface HeroSectionProps {
  stats: ArchiveStat[]
  taxonomies: TaxonomyPreview[]
}

export function HeroSection({
  stats,
  taxonomies,
}: HeroSectionProps) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__layout">
        <div>
          <img
            className="hero-section__logo"
            src={`${import.meta.env.BASE_URL}assets/images/meta/logo-white.png`}
            alt="Aoki Design Studio"
            width={96}
            height={64}
          />
          <h1 id="hero-title">Works Finder</h1>
          <p className="hero-section__lead">
            制作実績から、ご依頼に近い事例を見つけられます。
            検索・絞り込み・比較で、制作の方向性を具体的にイメージしてみてください。
          </p>

          <div className="hero-section__actions">
            <a className="hero-link" href="#archive">
              作品一覧を見る
            </a>
            <p className="hero-note">
              案件名・要件・予算帯など、複数の条件で探索できます。
            </p>
          </div>
        </div>

        <div className="hero-section__panel">
          <div className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <p className="stat-card__label">{stat.label}</p>
                <p className="stat-card__value">{stat.value}</p>
                <p className="stat-card__supporting">{stat.supportingText}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="taxonomy-grid">
        {taxonomies.map((taxonomy) => (
          <section className="taxonomy-card" key={taxonomy.title}>
            <h3>{taxonomy.title}</h3>
            <ul className="chip-list">
              {taxonomy.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
