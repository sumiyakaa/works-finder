import type { SyntheticEvent } from 'react'
import { getWorkNavigationConfig } from '../../lib/detail'
import { formatTags, getWorkImagePath } from '../../lib/works'
import type { Work } from '../../types/work'

interface WorkCardProps {
  work: Work
  isCompared: boolean
  isCompareDisabled: boolean
  isFavorite: boolean
  onToggleCompare: () => void
  onToggleFavorite: () => void
  onOpenDetail: () => void
}

interface WorkCardMetaItem {
  label: string
  value: string
  isWide?: boolean
}

const createMetaItems = (work: Work): WorkCardMetaItem[] => [
  {
    label: 'カテゴリ',
    value: work.category ?? `${work.genre} / ${work.siteType}`,
    isWide: true,
  },
  {
    label: '目的',
    value: work.purpose,
  },
  {
    label: '予算帯',
    value: work.budgetRange ?? '個別見積',
  },
  {
    label: '期間',
    value: work.durationRange ?? '要件に応じて調整',
  },
  {
    label: '規模',
    value:
      work.scale ?? (typeof work.pageCount === 'number' ? `${work.pageCount}ページ` : '案件ごとに調整'),
  },
]

/**
 * WorkCard の導線設計:
 *
 *   ┌─────────────────────────────────┐
 *   │  サムネイル + バッジ群           │
 *   │  (Featured / Concept / 年 /     │
 *   │   Case Study)                   │
 *   ├─────────────────────────────────┤
 *   │  kicker / タイトル / summary    │
 *   │  メタ情報 / タグ                │
 *   ├─────────────────────────────────┤
 *   │  [概要を見る]  ← 主導線        │  Tab 順: 1
 *   │  [比較に追加]  ← 補助操作      │  Tab 順: 2
 *   │  ケーススタディあり (テキスト)  │  ← detailUrl がある場合のみ
 *   └─────────────────────────────────┘
 *
 * - 主導線「概要を見る」: 全作品共通。DetailModal を開く。
 * - 補助操作「比較に追加」: 全作品共通。compare state をトグル。
 * - ケーススタディ直リンクはカードに置かない。
 *   モーダル footer に集約して CTA 競合を防ぐ。
 * - Case Study バッジ + 案内テキストで「概要から進める」ことを示唆する。
 */
export function WorkCard({
  work,
  isCompared,
  isCompareDisabled,
  isFavorite,
  onToggleCompare,
  onToggleFavorite,
  onOpenDetail,
}: WorkCardProps) {
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget
    const fallbackSource = getWorkImagePath(work, true)

    if (image.src.endsWith(fallbackSource)) {
      image.onerror = null
      return
    }

    image.onerror = null
    image.src = fallbackSource
  }

  const tagItems = formatTags(work.tags)
  const metaItems = createMetaItems(work)
  const navConfig = getWorkNavigationConfig(work)
  const cardClassParts = ['work-card']
  if (isCompared) cardClassParts.push('work-card--compared')
  if (isFavorite) cardClassParts.push('work-card--favorited')
  const cardClassName = cardClassParts.join(' ')

  return (
    <article className={cardClassName}>
      {/* ---- サムネイル + バッジ ---- */}
      <div className="work-card__media">
        <img
          className="work-card__image"
          src={getWorkImagePath(work)}
          alt={`${work.title} のサムネイル`}
          loading="lazy"
          onError={handleImageError}
        />

        <div className="work-card__badges">
          {work.isFeatured ? (
            <span className="status-badge status-badge--accent">Featured</span>
          ) : null}
          {work.isConcept ? (
            <span className="status-badge">Concept</span>
          ) : null}
          {typeof work.year === 'number' ? (
            <span className="status-badge">{work.year}</span>
          ) : null}
          {navConfig.showCaseStudyBadge ? (
            <span className="status-badge status-badge--case-study">Case Study</span>
          ) : null}
        </div>
      </div>

      {/* ---- カード本体 ---- */}
      <div className="work-card__body">
        <header className="work-card__header">
          <div>
            <p className="work-card__kicker">
              {work.genre} / {work.siteType}
            </p>
            <h3 className="work-card__title">{work.title}</h3>
          </div>
        </header>

        <p className="work-card__summary">{work.summary}</p>

        <dl className="work-card__meta">
          {metaItems.map((item) => (
            <div
              className={`work-card__meta-item${item.isWide ? ' work-card__meta-item--wide' : ''}`}
              key={`${item.label}-${item.value}`}
            >
              <dt className="work-card__meta-label">{item.label}</dt>
              <dd className="work-card__meta-value">{item.value}</dd>
            </div>
          ))}
        </dl>

        {tagItems.length > 0 ? (
          <ul className="work-card__tags" aria-label={`${work.title} のタグ`}>
            {tagItems.map((tag) => (
              <li className="work-card__tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {/* ---- 導線エリア ---- */}
        <div className="work-card__utility">
          {/* 主導線 — 全作品共通でモーダルを開く（Tab 順 1） */}
          <button
            className="card-action card-action--primary work-card__detail-action"
            type="button"
            onClick={onOpenDetail}
          >
            {navConfig.cardActionLabel}
          </button>

          {/* 補助操作 — 比較トグル（Tab 順 2） */}
          <button
            className={`card-action work-card__compare-action${isCompared ? ' card-action--primary' : ' card-action--secondary'}`}
            type="button"
            disabled={isCompareDisabled && !isCompared}
            onClick={onToggleCompare}
            aria-pressed={isCompared}
          >
            {isCompared ? '比較から外す' : '比較に追加'}
          </button>

          {/* 補助操作 — お気に入りトグル（Tab 順 3） */}
          <button
            className={`card-action work-card__favorite-action${isFavorite ? ' card-action--primary' : ' card-action--secondary'}`}
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
          >
            {isFavorite ? '保存済み' : '保存'}
          </button>

          {/* 案内テキスト — detailUrl がある作品のみ表示。
              ケーススタディへのリンクはモーダル footer に集約し、
              カードではテキストで示唆するに留める。 */}
          {navConfig.hasCaseStudy ? (
            <p className="work-card__utility-note">
              概要からケーススタディへ進めます
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
