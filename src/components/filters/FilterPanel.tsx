import type {
  FilterGroup,
  FilterGroupKey,
  FilterState,
} from '../../types/filter'

const FILTER_GROUP_NOTES: Record<FilterGroupKey, string> = {
  selectedCaseTypes: '実案件とコンセプト案件で絞り込めます。',
  selectedGenres: '業種や案件領域の近さから一覧を見直したいときの軸です。',
  selectedSiteTypes: 'LP、サービスサイト、コーポレートサイトなどの構造で整理できます。',
  selectedPurposes: '問い合わせ改善、商品訴求、ブランド刷新など依頼目的の軸です。',
  selectedFeatures: 'CMS・アニメーション・フォームなど、実装機能で絞り込めます。',
  selectedBudgetRanges: '想定予算帯で案件規模の目安を絞り込めます。',
  selectedTechTags: '一覧比較向けに整理した実装・連携要素です。機能特徴とは分けて扱います。',
}

interface FilterPanelProps {
  filterGroups: FilterGroup[]
  appliedFilterCount: number
  selectedFilters: FilterState
  onFilterToggle: (groupKey: FilterGroupKey, value: string) => void
  onClearFilters: () => void
}

export function FilterPanel({
  filterGroups,
  appliedFilterCount,
  selectedFilters,
  onFilterToggle,
  onClearFilters,
}: FilterPanelProps) {
  return (
    <section className="control-panel filter-panel" aria-labelledby="filter-panel-title">
      <div className="control-panel__header">
        <div>
          <p className="section-label">Filters</p>
          <h2 id="filter-panel-title">条件から候補を絞る</h2>
        </div>
        <span className="status-badge status-badge--accent">Live</span>
      </div>

      <div className="filter-panel__intro">
        <p className="filter-panel__description">
          案件区分・ジャンル・目的・予算帯など、複数の条件を組み合わせて絞り込めます。
        </p>

        <ul className="chip-list filter-panel__summary" aria-label="Filter panel summary">
          <li>{filterGroups.length} グループ</li>
          <li>複数選択可</li>
          {appliedFilterCount > 0 ? <li>{appliedFilterCount} 項目を選択中</li> : null}
        </ul>
      </div>

      <div className="filter-panel__groups">
        {filterGroups.map((group) => {
          const selectedOptions = selectedFilters[group.key]
          const selectedOptionCount = selectedOptions.length

          return (
            <section className="filter-group" key={group.key}>
              <div className="filter-group__header">
                <div className="filter-group__header-main">
                  <h3>{group.title}</h3>
                  <p>
                    {selectedOptionCount > 0
                      ? `${selectedOptionCount} 項目を選択中`
                      : `${group.options.length} 項目`}
                  </p>
                  <p className="filter-group__caption">{FILTER_GROUP_NOTES[group.key]}</p>
                </div>
                {selectedOptionCount > 0 ? (
                  <span className="filter-group__status">選択中</span>
                ) : null}
              </div>

              <div className="filter-group__options" aria-label={`${group.title} の候補`}>
                {group.options.map((option) => (
                  <button
                    className={`filter-chip${selectedOptions.includes(option.label) ? ' filter-chip--active' : ''}`}
                    type="button"
                    aria-pressed={selectedOptions.includes(option.label)}
                    onClick={() => {
                      onFilterToggle(group.key, option.label)
                    }}
                    key={option.label}
                  >
                    <span className="filter-chip__label">{option.label}</span>
                    <span className="filter-chip__meta">
                      {selectedOptions.includes(option.label) ? (
                        <span className="filter-chip__state">選択中</span>
                      ) : null}
                      <span className="filter-chip__count">{option.count}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <div className="filter-panel__footer">
        <p className="filter-panel__note">
          {appliedFilterCount > 0
            ? `${appliedFilterCount} 項目を選択中`
            : '条件を選ぶと一覧に反映されます'}
        </p>
        <button
          className="card-action card-action--secondary filter-panel__clear"
          type="button"
          onClick={onClearFilters}
          disabled={appliedFilterCount === 0}
        >
          すべて解除
        </button>
      </div>
    </section>
  )
}
