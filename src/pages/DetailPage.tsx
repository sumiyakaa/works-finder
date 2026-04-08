import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { works } from '../data/works'
import { getWorkImagePath, formatTags } from '../lib/works'
import {
  getDetailMetaFacts,
  getDetailDesignFacts,
  getDetailChipGroups,
  getDetailBooleanFlags,
  getWorkNavigationConfig,
  hasDetailChallenge,
  hasDetailDesignSection,
} from '../lib/detail'
import { exportDetailPdf } from '../lib/pdf'

type DetailTab = 'overview' | 'preview' | 'tech'

const TAB_ITEMS: { key: DetailTab; label: string }[] = [
  { key: 'overview', label: '概要' },
  { key: 'preview', label: 'プレビュー' },
  { key: 'tech', label: '技術詳細' },
]

const tabVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export function DetailPage() {
  const { workId } = useParams<{ workId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [previewDevice, setPreviewDevice] = useState<'pc' | 'sp'>('pc')

  const workIndex = works.findIndex((w) => w.slug === workId)
  const work = workIndex >= 0 ? works[workIndex] : null
  const prevWork = workIndex > 0 ? works[workIndex - 1] : null
  const nextWork = workIndex < works.length - 1 ? works[workIndex + 1] : null

  const handleNavigate = useCallback((slug: string) => {
    setActiveTab('overview')
    navigate(`/works-finder/${slug}`)
    window.scrollTo(0, 0)
  }, [navigate])

  if (!work) {
    return (
      <div className="detail-not-found">
        <h2>作品が見つかりません</h2>
        <button type="button" onClick={() => navigate('/works-finder/')} className="primary-button">
          一覧に戻る
        </button>
      </div>
    )
  }

  const navConfig = getWorkNavigationConfig(work)
  const metaFacts = getDetailMetaFacts(work)
  const designFacts = getDetailDesignFacts(work)
  const chipGroups = getDetailChipGroups(work)
  const booleanFlags = getDetailBooleanFlags(work)
  const tagItems = formatTags(work.tags)
  const showDesign = hasDetailDesignSection(work)

  return (
    <motion.div
      className="detail-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* タブ切替 */}
      <div className="detail-tabs">
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`detail-tabs__btn${activeTab === tab.key ? ' detail-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          className="detail-tabs__pdf-btn"
          onClick={() => exportDetailPdf(work)}
        >
          PDF出力
        </button>
      </div>

      {/* タブコンテンツ */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" className="detail-content" variants={tabVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <OverviewTab
              work={work}
              metaFacts={metaFacts}
              designFacts={designFacts}
              chipGroups={chipGroups}
              tagItems={tagItems}
              navConfig={navConfig}
              showDesign={showDesign}
            />
          </motion.div>
        )}
        {activeTab === 'preview' && (
          <motion.div key="preview" className="detail-content" variants={tabVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <PreviewTab
              work={work}
              previewDevice={previewDevice}
              onDeviceChange={setPreviewDevice}
            />
          </motion.div>
        )}
        {activeTab === 'tech' && (
          <motion.div key="tech" className="detail-content" variants={tabVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            <TechTab work={work} booleanFlags={booleanFlags} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 前後ナビ */}
      <nav className="detail-nav" aria-label="作品ナビゲーション">
        {prevWork ? (
          <button type="button" className="detail-nav__btn" onClick={() => handleNavigate(prevWork.slug)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>
              <span className="detail-nav__label">前の作品</span>
              <span className="detail-nav__title">{prevWork.title}</span>
            </span>
          </button>
        ) : <div />}
        {nextWork ? (
          <button type="button" className="detail-nav__btn detail-nav__btn--next" onClick={() => handleNavigate(nextWork.slug)}>
            <span>
              <span className="detail-nav__label">次の作品</span>
              <span className="detail-nav__title">{nextWork.title}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : <div />}
      </nav>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Tab 1: 概要
// ---------------------------------------------------------------------------

interface MetaFact { label: string; value: string }
interface ChipGroup { label: string; items: string[]; truncatedCount: number }

function OverviewTab({
  work,
  metaFacts,
  designFacts,
  chipGroups,
  tagItems,
  navConfig,
  showDesign,
}: {
  work: (typeof works)[number]
  metaFacts: MetaFact[]
  designFacts: MetaFact[]
  chipGroups: ChipGroup[]
  tagItems: string[]
  navConfig: ReturnType<typeof getWorkNavigationConfig>
  showDesign: boolean
}) {
  const imgSrc = work.fullPageScreenshot ?? getWorkImagePath(work)

  return (
    <div className="overview">
      <div className="overview__hero">
        <img src={imgSrc} alt={work.title} className="overview__image" />
        <div className="overview__hero-info">
          <div className="overview__pills">
            {work.isConcept ? (
              <span className="pill">Concept</span>
            ) : (
              <span className="pill pill--accent">実案件</span>
            )}
            {work.isFeatured && <span className="pill pill--accent">Featured</span>}
            {navConfig.hasCaseStudy && <span className="pill pill--success">Case Study</span>}
          </div>
          <h1 className="overview__title">{work.title}</h1>
          <p className="overview__kicker">{work.genre} / {work.siteType}</p>
        </div>
      </div>

      <div className="overview__tags">
        {tagItems.map((tag) => (
          <span key={tag} className="overview__tag">{tag}</span>
        ))}
      </div>

      <section className="overview__section">
        <h3>コンセプト</h3>
        <p>{work.summary}</p>
        {hasDetailChallenge(work) && (
          <div className="overview__challenge">
            <strong>背景・課題</strong>
            <p>{work.challenge}</p>
          </div>
        )}
      </section>

      <section className="overview__section">
        <h3>メタ情報</h3>
        <dl className="overview__facts">
          {metaFacts.map((f) => (
            <div key={f.label} className="overview__fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {showDesign && designFacts.length > 0 && (
        <section className="overview__section">
          <h3>設計観点</h3>
          <dl className="overview__facts">
            {designFacts.map((f) => (
              <div key={f.label} className="overview__fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="overview__section">
        <h3>技術タグ</h3>
        <div className="overview__chips">
          {chipGroups.map((group) => (
            <div key={group.label} className="overview__chip-group">
              <span className="overview__chip-label">{group.label}</span>
              <div className="overview__chip-items">
                {group.items.map((item) => (
                  <span key={item} className="chip">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="overview__actions">
        {navConfig.siteLink && (
          <a href={navConfig.siteLink.href} target={navConfig.siteLink.target} rel={navConfig.siteLink.rel} className="primary-button">
            実サイトを見る
          </a>
        )}
        {navConfig.caseStudyLink && (
          <a href={navConfig.caseStudyLink.href} target={navConfig.caseStudyLink.target} rel={navConfig.caseStudyLink.rel} className="ghost-button">
            ケーススタディ
          </a>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 2: プレビュー
// ---------------------------------------------------------------------------

function PreviewTab({
  work,
  previewDevice,
  onDeviceChange,
}: {
  work: (typeof works)[number]
  previewDevice: 'pc' | 'sp'
  onDeviceChange: (d: 'pc' | 'sp') => void
}) {
  const imgSrc = work.fullPageScreenshot ?? getWorkImagePath(work)
  const siteUrl = work.siteUrl

  return (
    <div className="preview-tab">
      {/* スクロールサムネイル */}
      <div className="preview-tab__scroll-thumb">
        <img src={imgSrc} alt={`${work.title} フルページプレビュー`} className="preview-tab__scroll-img" />
      </div>

      {/* iframe プレビュー */}
      {siteUrl ? (
        <div className="preview-tab__iframe-section">
          <p className="preview-tab__notice">
            このプレビューは実サイトを埋め込み表示しています。画面の比率やレイアウトのバランスは実際の閲覧環境と異なる場合があります。正確な表示を確認したい場合は、下部のリンクから実サイトへ直接アクセスしてください。
          </p>
          <div className="preview-tab__device-toggle">
            <button
              type="button"
              className={`preview-tab__device-btn${previewDevice === 'pc' ? ' preview-tab__device-btn--active' : ''}`}
              onClick={() => onDeviceChange('pc')}
            >
              PC
            </button>
            <button
              type="button"
              className={`preview-tab__device-btn${previewDevice === 'sp' ? ' preview-tab__device-btn--active' : ''}`}
              onClick={() => onDeviceChange('sp')}
            >
              SP
            </button>
          </div>
          <div className={`preview-tab__iframe-wrap preview-tab__iframe-wrap--${previewDevice}`}>
            <iframe
              src={siteUrl}
              title={`${work.title} プレビュー`}
              className="preview-tab__iframe"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
            />
          </div>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="preview-tab__site-link"
          >
            実サイトで確認する
          </a>
        </div>
      ) : (
        <p className="preview-tab__no-url">このプロジェクトにはライブプレビューがありません。</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 3: 技術詳細
// ---------------------------------------------------------------------------

function TechTab({
  work,
  booleanFlags,
}: {
  work: (typeof works)[number]
  booleanFlags: MetaFact[]
}) {
  return (
    <div className="tech-tab">
      <section className="tech-tab__section">
        <h3>使用技術一覧</h3>
        <div className="tech-tab__stack">
          {work.techStack.map((tech) => (
            <span key={tech} className="chip chip--tech">{tech}</span>
          ))}
        </div>
      </section>

      {work.features && work.features.length > 0 && (
        <section className="tech-tab__section">
          <h3>実装ポイント</h3>
          <ul className="tech-tab__features">
            {work.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="tech-tab__section">
        <h3>実装特徴</h3>
        <dl className="tech-tab__flags">
          {booleanFlags.map((flag) => (
            <div key={flag.label} className="tech-tab__flag">
              <dt>{flag.label}</dt>
              <dd>{flag.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="tech-tab__section">
        <h3>技術タグ（フィルター用）</h3>
        <div className="tech-tab__tags">
          {work.techTags.map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>
      </section>

      {work.designTone && (
        <section className="tech-tab__section">
          <h3>デザイントーン</h3>
          <p>{work.designTone}</p>
        </section>
      )}
    </div>
  )
}
