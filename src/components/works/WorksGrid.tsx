import { isWorkSelectedForCompare, isCompareAtLimit } from '../../lib/compare'
import type { Work } from '../../types/work'
import { WorkCard } from './WorkCard'

interface WorksGridEmptyState {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

interface WorksGridProps {
  works: Work[]
  totalCount: number
  emptyState?: WorksGridEmptyState
  compareSlugs: string[]
  favoriteIds: string[]
  onToggleCompare: (slug: string) => void
  onToggleFavorite: (workId: string) => void
  onOpenDetail: (slug: string) => void
}

export function WorksGrid({
  works,
  totalCount,
  emptyState,
  compareSlugs,
  favoriteIds,
  onToggleCompare,
  onToggleFavorite,
  onOpenDetail,
}: WorksGridProps) {
  const contextualEmptyTitle =
    emptyState?.title ?? '条件に合う作品が見つかりませんでした'
  const contextualEmptyDescription =
    emptyState?.description
    ?? '検索語や絞り込み条件を少し緩めると、表示できる作品が見つかる可能性があります。'

  if (totalCount === 0) {
    return (
      <section className="archive-section" id="archive" aria-labelledby="works-grid-title">
        <div className="section-heading">
          <div>
            <p className="section-label">Works archive</p>
            <h2 id="works-grid-title">制作実績の準備中です</h2>
          </div>
          <p className="section-heading__note">
            作品が追加され次第、こちらに掲載されます。
          </p>
        </div>

        <div className="works-grid-empty" role="status" aria-live="polite">
          <p className="works-grid-empty__title">Coming soon</p>
          <p className="works-grid-empty__description">
            制作実績を順次追加しています。しばらくお待ちください。
          </p>
        </div>
      </section>
    )
  }

  if (works.length === 0) {
    return (
      <div className="works-grid-empty" role="status" aria-live="polite">
        <p className="works-grid-empty__title">{contextualEmptyTitle}</p>
        <p className="works-grid-empty__description">{contextualEmptyDescription}</p>
        {emptyState?.actionLabel && emptyState.onAction ? (
          <div className="works-grid-empty__actions">
            <button
              className="card-action card-action--secondary works-grid-empty__button"
              type="button"
              onClick={emptyState.onAction}
            >
              {emptyState.actionLabel}
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  const atLimit = isCompareAtLimit(compareSlugs)

  return (
    <ul className="works-grid" aria-label="Works list">
      {works.map((work) => {
        const workId = work.id ?? work.slug
        return (
          <li className="works-grid__item" key={workId}>
            <WorkCard
              work={work}
              isCompared={isWorkSelectedForCompare(compareSlugs, work.slug)}
              isCompareDisabled={atLimit}
              isFavorite={favoriteIds.includes(workId)}
              onToggleCompare={() => { onToggleCompare(work.slug) }}
              onToggleFavorite={() => { onToggleFavorite(workId) }}
              onOpenDetail={() => { onOpenDetail(work.slug) }}
            />
          </li>
        )
      })}
    </ul>
  )
}
