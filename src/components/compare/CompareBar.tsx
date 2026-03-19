import { getCompareSummary } from '../../lib/compare'
import type { Work } from '../../types/work'

interface CompareBarProps {
  works: Work[]
  onRemove: (slug: string) => void
  onClearAll: () => void
  onOpenPanel: () => void
}

export function CompareBar({
  works,
  onRemove,
  onClearAll,
  onOpenPanel,
}: CompareBarProps) {
  const summary = getCompareSummary(works.map((w) => w.slug))

  return (
    <div className="compare-bar" role="region" aria-label="比較バー">
      <div className="compare-bar__summary">
        <span className="compare-bar__count">
          {summary.label}
        </span>
        <span className="compare-bar__note">
          {summary.note}
        </span>
      </div>

      <ul className="compare-bar__slots" aria-label="比較対象">
        {works.map((work) => (
          <li className="compare-slot compare-slot--filled" key={work.slug}>
            <span className="compare-slot__title">{work.title}</span>
            <button
              type="button"
              className="compare-slot__remove"
              onClick={() => { onRemove(work.slug) }}
              aria-label={`${work.title} を比較から外す`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="compare-bar__actions">
        <button
          type="button"
          className="card-action card-action--secondary compare-bar__clear"
          onClick={onClearAll}
        >
          比較をクリア
        </button>
        <button
          type="button"
          className="card-action card-action--primary compare-bar__open"
          disabled={!summary.canOpenPanel}
          onClick={onOpenPanel}
        >
          比較を見る
        </button>
      </div>
    </div>
  )
}
