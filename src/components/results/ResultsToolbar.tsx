import { ActiveFilterChips } from './ActiveFilterChips'
import { SORT_OPTIONS } from '../../types/filter'
import type {
  ActiveFilterChipAction,
  ExploreUiState,
  SortOrder,
} from '../../types/filter'

interface ResultsToolbarProps {
  exploreState: ExploreUiState
  onSortChange: (sortOrder: SortOrder) => void
  onRemoveChip: (action: ActiveFilterChipAction) => void
}

export function ResultsToolbar({
  exploreState,
  onSortChange,
  onRemoveChip,
}: ResultsToolbarProps) {
  return (
    <section className="results-toolbar" aria-labelledby="results-toolbar-title">
      <div className="results-toolbar__summary">
        <p className="section-label">Results</p>
        <h2 id="results-toolbar-title">
          制作実績 <span className="results-toolbar__count">{exploreState.visibleCount}件</span>
        </h2>
        <p className="results-toolbar__note" aria-live="polite">
          {exploreState.summaryText}
        </p>
        <ActiveFilterChips
          chips={exploreState.activeFilterChips}
          onRemove={onRemoveChip}
        />
      </div>

      <div className="results-toolbar__meta">
        <div className="results-toolbar__stat">
          <span className="results-toolbar__stat-label">現在の探索状態</span>
          <strong className="results-toolbar__status-text" aria-live="polite">
            {exploreState.statusText}
          </strong>
        </div>

        <div className="results-toolbar__sort">
          <span className="results-toolbar__stat-label">並び替え</span>
          <strong className="results-toolbar__sort-label">{exploreState.sortLabel}</strong>
          <label className="results-toolbar__sort-control">
            <span className="sr-only">並び替えを選択</span>
            <select
              className="results-toolbar__select"
              value={exploreState.sortOrder}
              onChange={(event) => {
                onSortChange(event.target.value as SortOrder)
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  )
}
