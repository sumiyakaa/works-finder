import type { MouseEvent, SyntheticEvent } from 'react'
import { useCallback } from 'react'
import {
  getDetailBooleanFlags,
  getDetailChipGroups,
  getDetailDesignFacts,
  getDetailMetaFacts,
  getWorkNavigationConfig,
  hasDetailChallenge,
  hasDetailDesignSection,
} from '../../lib/detail'
import { formatTags, getWorkImagePath } from '../../lib/works'
import { useModalDialog } from '../../hooks/useModalDialog'
import type { ConsultationContent } from '../../lib/consultation'
import type { Work } from '../../types/work'

const HEADING_ID = 'detail-modal-title'
const SUMMARY_ID = 'detail-modal-summary'

interface DetailModalProps {
  work: Work
  isCompared: boolean
  isCompareDisabled: boolean
  isFavorite: boolean
  consultationContent: ConsultationContent
  onClose: () => void
  onToggleCompare: () => void
  onToggleFavorite: () => void
}

export function DetailModal({
  work,
  isCompared,
  isCompareDisabled,
  isFavorite,
  consultationContent,
  onClose,
  onToggleCompare,
  onToggleFavorite,
}: DetailModalProps) {
  // -----------------------------------------------------------------------
  // Modal behavior — scroll lock / focus trap / Escape / focus restore
  // -----------------------------------------------------------------------
  const { overlayRef, closeButtonRef } = useModalDialog({ onClose })

  const handleOverlayClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const handleImageError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget
    const fallbackSource = getWorkImagePath(work, true)
    if (image.src.endsWith(fallbackSource)) {
      image.onerror = null
      return
    }
    image.onerror = null
    image.src = fallbackSource
  }, [work])

  // -----------------------------------------------------------------------
  // Data derivation — lib に寄せた純関数から取得
  // -----------------------------------------------------------------------
  const metaFacts = getDetailMetaFacts(work)
  const designFacts = getDetailDesignFacts(work)
  const chipGroups = getDetailChipGroups(work)
  const booleanFlags = getDetailBooleanFlags(work)
  const tagItems = formatTags(work.tags)
  const navConfig = getWorkNavigationConfig(work)
  const showDesignSection = hasDetailDesignSection(work)

  return (
    <div
      ref={overlayRef}
      className="detail-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={HEADING_ID}
      aria-describedby={SUMMARY_ID}
      onClick={handleOverlayClick}
    >
      <div className="detail-modal">
        {/* ---- 1. ヘッダ — タイトル + close ---- */}
        <header className="detail-modal__header">
          <div>
            <p className="section-label">概要</p>
            <h2 id={HEADING_ID}>{work.title}</h2>
            <p className="detail-modal__kicker">
              {work.genre} / {work.siteType}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="card-action card-action--secondary detail-modal__close"
            onClick={onClose}
            aria-label="概要モーダルを閉じる"
          >
            閉じる
          </button>
        </header>

        {/* ---- Body ---- */}
        <div className="detail-modal__body">
          {/* 2. アイキャッチ — サムネイル + status pills */}
          <section className="detail-modal__hero">
            <img
              className="detail-modal__thumbnail"
              src={getWorkImagePath(work)}
              alt={`${work.title} のサムネイル`}
              onError={handleImageError}
            />

            <div className="detail-modal__hero-content">
              <div className="detail-modal__pills">
                {work.isConcept ? (
                  <span className="status-badge">Concept</span>
                ) : (
                  <span className="status-badge status-badge--accent">実案件</span>
                )}
                {work.isFeatured ? (
                  <span className="status-badge status-badge--accent">Featured</span>
                ) : null}
                {navConfig.hasCaseStudy ? (
                  <span className="status-badge status-badge--case-study">Case Study</span>
                ) : null}
              </div>
            </div>
          </section>

          {/* 3. メタ情報 — genre / siteType / year / budget / duration / scale */}
          <section className="detail-modal__section">
            <h3 className="detail-modal__section-title">メタ情報</h3>
            <dl className="detail-modal__facts">
              {metaFacts.map((fact) => (
                <div className="detail-modal__fact" key={fact.label}>
                  <dt className="detail-modal__fact-label">{fact.label}</dt>
                  <dd className="detail-modal__fact-value">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 4. 概要 — purpose + summary */}
          <section className="detail-modal__section">
            <h3 className="detail-modal__section-title">概要</h3>
            <dl className="detail-modal__facts">
              <div className="detail-modal__fact detail-modal__fact--wide">
                <dt className="detail-modal__fact-label">制作目的</dt>
                <dd className="detail-modal__fact-value">{work.purpose}</dd>
              </div>
            </dl>
            <p className="detail-modal__summary" id={SUMMARY_ID}>
              {work.summary}
            </p>
          </section>

          {/* 5. 設計観点 — challenge + designTone (存在する場合のみ) */}
          {showDesignSection ? (
            <section className="detail-modal__section">
              <h3 className="detail-modal__section-title">設計観点</h3>

              {hasDetailChallenge(work) ? (
                <div className="detail-modal__challenge">
                  <p className="detail-modal__challenge-label">背景・課題</p>
                  <p>{work.challenge}</p>
                </div>
              ) : null}

              {designFacts.length > 0 ? (
                <dl className="detail-modal__facts">
                  {designFacts.map((fact) => (
                    <div className="detail-modal__fact" key={fact.label}>
                      <dt className="detail-modal__fact-label">{fact.label}</dt>
                      <dd className="detail-modal__fact-value">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          ) : null}

          {/* 6. 実装 — chips + boolean flags */}
          <section className="detail-modal__section">
            <h3 className="detail-modal__section-title">実装</h3>

            {chipGroups.map((group) => (
              <div className="detail-modal__chip-group" key={group.label}>
                <p className="detail-modal__chip-group-label">{group.label}</p>
                <ul className="detail-modal__chips" aria-label={group.label}>
                  {group.items.map((item) => (
                    <li className="detail-modal__chip" key={item}>{item}</li>
                  ))}
                  {group.truncatedCount > 0 ? (
                    <li className="detail-modal__chip detail-modal__chip--more">
                      他 {group.truncatedCount} 件
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}

            <dl className="detail-modal__facts detail-modal__facts--inline">
              {booleanFlags.map((flag) => (
                <div className="detail-modal__fact" key={flag.label}>
                  <dt className="detail-modal__fact-label">{flag.label}</dt>
                  <dd className="detail-modal__fact-value">{flag.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 7. タグ */}
          {tagItems.length > 0 ? (
            <section className="detail-modal__section">
              <h3 className="detail-modal__section-title">タグ</h3>
              <ul className="detail-modal__chips" aria-label="タグ">
                {tagItems.map((tag) => (
                  <li className="detail-modal__chip" key={tag}>{tag}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* ---- 8. アクション — 比較・保存・メモ・ケーススタディ ---- */}
        <footer className="detail-modal__footer">
          <div className="detail-modal__actions">
            <a
              className="primary-button"
              href={consultationContent.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {consultationContent.primaryLabel}
            </a>

            <button
              className="card-action"
              type="button"
              onClick={onToggleCompare}
              aria-pressed={isCompared}
              disabled={isCompareDisabled && !isCompared}
            >
              {isCompared ? '比較中' : isCompareDisabled ? '上限3件' : '比較'}
            </button>

            <button
              className="card-action"
              type="button"
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
            >
              {isFavorite ? '保存済み' : '保存'}
            </button>

            {navConfig.caseStudyLink !== null ? (
              <a
                href={navConfig.caseStudyLink.href}
                className="ghost-button"
                target={navConfig.caseStudyLink.target}
                rel={navConfig.caseStudyLink.rel}
              >
                {navConfig.caseStudyLink.label}
              </a>
            ) : null}
          </div>
        </footer>
      </div>
    </div>
  )
}
