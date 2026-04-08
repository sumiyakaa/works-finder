import type { SortOrder } from '../../types/filter'

export type ViewMode = 'grid' | 'list' | 'thumbnail'

interface ToolbarProps {
  query: string
  visibleCount: number
  viewMode: ViewMode
  sortOrder: SortOrder
  isCompareMode: boolean
  onQueryChange: (value: string) => void
  onViewModeChange: (mode: ViewMode) => void
  onSortChange: (sort: SortOrder) => void
  onToggleCompareMode: () => void
  onOpenSidebar: () => void
}

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'year-desc', label: '新着順' },
  { value: 'recommended', label: 'Tier順' },
  { value: 'title-asc', label: 'タイトル順' },
]

export function Toolbar({
  query,
  visibleCount,
  viewMode,
  sortOrder,
  isCompareMode,
  onQueryChange,
  onViewModeChange,
  onSortChange,
  onToggleCompareMode,
  onOpenSidebar,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      {/* SP: フィルター開閉ボタン */}
      <button
        type="button"
        className="toolbar__filter-btn"
        onClick={onOpenSidebar}
        aria-label="フィルターを開く"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 12h10M4 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        絞り込み
      </button>

      {/* 検索バー */}
      <div className="toolbar__search">
        <svg className="toolbar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="search"
          className="toolbar__search-input"
          placeholder="キーワードで検索..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      {/* 表示切替 */}
      <div className="toolbar__view-toggle" role="group" aria-label="表示切替">
        <button
          type="button"
          className={`toolbar__view-btn${viewMode === 'grid' ? ' toolbar__view-btn--active' : ''}`}
          onClick={() => onViewModeChange('grid')}
          aria-label="グリッド表示"
          title="グリッド表示"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="9.5" y="1" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="1" y="9.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
        <button
          type="button"
          className={`toolbar__view-btn${viewMode === 'list' ? ' toolbar__view-btn--active' : ''}`}
          onClick={() => onViewModeChange('list')}
          aria-label="リスト表示"
          title="リスト表示"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="14" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="1" y="6.75" width="14" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="1" y="11.5" width="14" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
        <button
          type="button"
          className={`toolbar__view-btn${viewMode === 'thumbnail' ? ' toolbar__view-btn--active' : ''}`}
          onClick={() => onViewModeChange('thumbnail')}
          aria-label="サムネのみ"
          title="サムネのみ"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="6.25" y="1" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="11.5" y="1" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="1" y="6.25" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="6.25" y="6.25" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="11.5" y="6.25" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="1" y="11.5" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="6.25" y="11.5" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="11.5" y="11.5" width="3.5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>

      {/* 並び替え */}
      <select
        className="toolbar__sort"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value as SortOrder)}
        aria-label="並び替え"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* 結果件数 */}
      <span className="toolbar__count">{visibleCount}件</span>

      {/* 比較モード */}
      <button
        type="button"
        className={`toolbar__compare-btn${isCompareMode ? ' toolbar__compare-btn--active' : ''}`}
        onClick={onToggleCompareMode}
      >
        {isCompareMode ? '比較OFF' : '比較ON'}
      </button>
    </div>
  )
}
