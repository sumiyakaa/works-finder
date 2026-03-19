interface SearchPanelProps {
  query: string
  totalCount: number
  visibleCount: number
  popularTags?: string[]
  onQueryChange: (value: string) => void
  onApplyPopularTag?: (tag: string) => void
}

export function SearchPanel({
  query,
  totalCount,
  visibleCount,
  popularTags,
  onQueryChange,
  onApplyPopularTag,
}: SearchPanelProps) {
  const hasSearchTerm = query.trim().length > 0

  return (
    <section className="control-panel search-panel" aria-labelledby="search-panel-title">
      <div className="control-panel__header">
        <div>
          <p className="section-label">Search</p>
          <h2 id="search-panel-title">キーワードで探す</h2>
        </div>
      </div>

      <div className="search-panel__form">
        <label className="search-panel__field" htmlFor="search-panel-input">
          <span className="search-panel__label">検索キーワード</span>
          <input
            id="search-panel-input"
            className="search-panel__input"
            type="search"
            placeholder="例: 実案件、CMS、ラグジュアリー、予約導線"
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value)
            }}
          />
        </label>
      </div>

      {popularTags != null && popularTags.length > 0 ? (
        <div className="search-panel__tags">
          <p className="search-panel__tags-label">人気タグ</p>
          <div className="chip-list" aria-live="polite">
            {popularTags.map((tag) => (
              <button
                key={tag}
                className={`chip-list__item${query === tag ? ' chip-list__item--active' : ''}`}
                type="button"
                aria-pressed={query === tag}
                onClick={() => { onApplyPopularTag?.(tag) }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="search-panel__note">
        {hasSearchTerm
          ? `「${query}」に一致する ${visibleCount} 件を表示中`
          : `全 ${totalCount} 件から検索できます`}
      </p>
    </section>
  )
}
