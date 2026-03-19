import type { MouseEvent } from 'react'
import { useCallback } from 'react'
import { getCompareFieldRows } from '../../lib/compare'
import { getDetailLinkMeta } from '../../lib/detail'
import { getWorkImagePath } from '../../lib/works'
import { useModalDialog } from '../../hooks/useModalDialog'
import type { CompareFieldKey } from '../../types/compare'
import type { Work } from '../../types/work'

/**
 * パネルに表示する行キー。
 * genre / siteType はヘッダ kicker で既に見えるため除外。
 */
const PANEL_ROW_KEYS: readonly CompareFieldKey[] = [
  'purpose',
  'year',
  'budgetRange',
  'durationRange',
  'pageScale',
  'features',
  'techStack',
  'techTags',
  'booleanFlags',
  'designTone',
  'caseStudy',
]

const panelRows = getCompareFieldRows(PANEL_ROW_KEYS)

const HEADING_ID = 'compare-panel-title'

interface ComparePanelProps {
  works: Work[]
  onClose: () => void
  onRemove: (slug: string) => void
}

/**
 * 比較パネル（モーダルダイアログ）。
 *
 * モーダル操作の責務（scroll lock, focus trap, Escape close, focus restore）は
 * useModalDialog hook に委譲する。
 * ComparePanel は dialog の UI 構造と比較データの描画だけを担う。
 */
export function ComparePanel({
  works,
  onClose,
  onRemove,
}: ComparePanelProps) {
  // -----------------------------------------------------------------------
  // Modal behavior — useModalDialog が以下を一括管理:
  //   body scroll lock / focus trap / initial focus / focus restore / Escape
  // -----------------------------------------------------------------------
  const { overlayRef, closeButtonRef } = useModalDialog({ onClose })

  // -----------------------------------------------------------------------
  // Overlay click close — パネル外（背景）クリックで閉じる
  // -----------------------------------------------------------------------
  const handleOverlayClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="compare-panel-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={HEADING_ID}
      onClick={handleOverlayClick}
    >
      <div className="compare-panel">
        <header className="compare-panel__header">
          <div>
            <p className="section-label">Compare</p>
            <h2 id={HEADING_ID}>選択した案件を比較</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="card-action card-action--secondary compare-panel__close"
            onClick={onClose}
            aria-label="比較パネルを閉じる"
          >
            閉じる
          </button>
        </header>

        <div className="compare-panel__body">
          <div
            className="compare-table"
            style={{ '--compare-columns': works.length } as React.CSSProperties}
          >
            {/* Column headers — thumbnail + title */}
            <div className="compare-table__row compare-table__row--header">
              <div className="compare-table__cell compare-table__cell--label" />
              {works.map((work) => (
                <div className="compare-table__cell compare-table__cell--work" key={work.slug}>
                  <img
                    className="compare-table__thumbnail"
                    src={getWorkImagePath(work)}
                    alt={`${work.title} のサムネイル`}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget
                      const fallback = getWorkImagePath(work, true)
                      if (img.src.endsWith(fallback)) {
                        img.onerror = null
                        return
                      }
                      img.onerror = null
                      img.src = fallback
                    }}
                  />
                  <strong className="compare-table__title">{work.title}</strong>
                  <span className="compare-table__kicker">
                    {work.genre} / {work.siteType}
                  </span>
                  <div className="compare-table__actions">
                    <button
                      type="button"
                      className="compare-table__remove"
                      onClick={() => { onRemove(work.slug) }}
                      aria-label={`${work.title} を比較から外す`}
                    >
                      外す
                    </button>
                    {(() => {
                      const linkMeta = getDetailLinkMeta(work)
                      if (linkMeta === null) return null
                      return (
                        <a
                          className="compare-table__case-study-link"
                          href={linkMeta.href}
                          target={linkMeta.target}
                          rel={linkMeta.rel}
                        >
                          {linkMeta.label}
                        </a>
                      )
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {panelRows.map((row) => (
              <div className="compare-table__row" key={row.key}>
                <div className="compare-table__cell compare-table__cell--label">
                  {row.label}
                </div>
                {works.map((work) => (
                  <div className="compare-table__cell compare-table__cell--work" key={work.slug}>
                    {row.getValue(work)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
