import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Sidebar } from '../components/layout/Sidebar'
import { Toolbar } from '../components/toolbar/Toolbar'
import type { ViewMode } from '../components/toolbar/Toolbar'
import { CompareBar } from '../components/compare/CompareBar'
import { ComparePanel } from '../components/compare/ComparePanel'

import { works } from '../data/works'
import type { Work } from '../types/work'
import type {
  ExploreSerializableState,
  FilterGroupKey,
  FilterState,
  SortOrder,
} from '../types/filter'
import {
  clearCompareSelection,
  COMPARE_MIN_FOR_PANEL,
  getSelectedCompareWorks,
  isCompareAtLimit,
  isWorkSelectedForCompare,
  removeCompareSelection,
  shouldShowCompareBar,
  toggleCompareSelection,
} from '../lib/compare'
import type { CompareSelection } from '../lib/compare'
import {
  clearExploreFilters,
  clearExploreQuery,
  createExploreState,
  getDefaultExploreState,
  getExploreEmptyStateContent,
  getFilterOptions,
  getVisibleWorks,
  isDefaultExploreState,
  parseExploreState,
  serializeExploreState,
  sanitizeExploreStateForWorks,
  toggleFilterValue,
} from '../lib/works'
import {
  readStoredExploreState,
  writeStoredExploreState,
} from '../lib/exploreStorage'
import { getWorkImagePath } from '../lib/works'
import { getWorkNavigationConfig } from '../lib/detail'

// ---------------------------------------------------------------------------
// Initial state resolution
// ---------------------------------------------------------------------------

type ExploreInitSource = 'url' | 'storage' | 'default'

const parseExploreStateFromSearch = (search: string): ExploreSerializableState =>
  sanitizeExploreStateForWorks(parseExploreState(search), works)

const resolveInitialExploreState = (): {
  state: ExploreSerializableState
  source: ExploreInitSource
} => {
  if (typeof window === 'undefined') {
    return { state: getDefaultExploreState(), source: 'default' }
  }
  const search = window.location.search
  if (search.length > 0 && search !== '?') {
    const fromUrl = parseExploreStateFromSearch(search)
    if (!isDefaultExploreState(fromUrl)) {
      return { state: fromUrl, source: 'url' }
    }
  }
  const stored = readStoredExploreState()
  if (stored !== null) {
    return { state: sanitizeExploreStateForWorks(stored, works), source: 'storage' }
  }
  return { state: getDefaultExploreState(), source: 'default' }
}

// ---------------------------------------------------------------------------
// View mode persistence
// ---------------------------------------------------------------------------

const VIEW_MODE_KEY = 'ads-view-mode'
function getInitialViewMode(): ViewMode {
  const stored = localStorage.getItem(VIEW_MODE_KEY)
  if (stored === 'grid' || stored === 'list' || stored === 'thumbnail') return stored
  return 'grid'
}

// ---------------------------------------------------------------------------
// Card stagger animation variants
// ---------------------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

// ---------------------------------------------------------------------------
// ListPage
// ---------------------------------------------------------------------------

export function ListPage() {
  const navigate = useNavigate()
  const [initialResolvedState] = useState(resolveInitialExploreState)
  const skipInitialStorageWriteRef = useRef(initialResolvedState.source === 'url')

  const [query, setQuery] = useState(initialResolvedState.state.query)
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(() => ({
    selectedCaseTypes: initialResolvedState.state.selectedCaseTypes,
    selectedGenres: initialResolvedState.state.selectedGenres,
    selectedSiteTypes: initialResolvedState.state.selectedSiteTypes,
    selectedPurposes: initialResolvedState.state.selectedPurposes,
    selectedFeatures: initialResolvedState.state.selectedFeatures,
    selectedBudgetRanges: initialResolvedState.state.selectedBudgetRanges,
    selectedTechTags: initialResolvedState.state.selectedTechTags,
  }))
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialResolvedState.state.sortOrder)
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCompareMode, setIsCompareMode] = useState(false)

  // Compare state
  const [compareSlugs, setCompareSlugs] = useState<CompareSelection>([])
  const [isComparePanelOpen, setIsComparePanelOpen] = useState(false)
  const compareWorks = useMemo(() => getSelectedCompareWorks(compareSlugs, works), [compareSlugs])

  // Derived explore state
  const serializableExploreState = useMemo(
    () => createExploreState(query, selectedFilters, sortOrder),
    [query, selectedFilters, sortOrder],
  )
  const visibleWorks = useMemo(
    () => getVisibleWorks(works, serializableExploreState),
    [serializableExploreState],
  )
  const serializedSearch = useMemo(
    () => serializeExploreState(serializableExploreState),
    [serializableExploreState],
  )
  const filterGroups = useMemo(() => getFilterOptions(works), [])
  const emptyStateContent = useMemo(
    () => getExploreEmptyStateContent(serializableExploreState, works.length),
    [serializableExploreState],
  )

  // View mode persistence
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode)
  }, [viewMode])

  // URL sync
  useEffect(() => {
    if (typeof window === 'undefined') return
    const currentSearch = window.location.search.startsWith('?')
      ? window.location.search.slice(1)
      : window.location.search
    if (currentSearch === serializedSearch) return
    const nextSearch = serializedSearch.length > 0 ? `?${serializedSearch}` : ''
    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`
    window.history.replaceState(null, '', nextUrl)
  }, [serializedSearch])

  // Storage sync
  useEffect(() => {
    if (skipInitialStorageWriteRef.current) {
      skipInitialStorageWriteRef.current = false
      return
    }
    writeStoredExploreState(serializableExploreState)
  }, [serializableExploreState])

  // Popstate
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handlePopState = () => {
      const next = parseExploreStateFromSearch(window.location.search)
      setQuery(next.query)
      setSelectedFilters({
        selectedCaseTypes: next.selectedCaseTypes,
        selectedGenres: next.selectedGenres,
        selectedSiteTypes: next.selectedSiteTypes,
        selectedPurposes: next.selectedPurposes,
        selectedFeatures: next.selectedFeatures,
        selectedBudgetRanges: next.selectedBudgetRanges,
        selectedTechTags: next.selectedTechTags,
      })
      setSortOrder(next.sortOrder)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Handlers
  const handleSearchChange = (value: string) => setQuery(value)
  const handleToggleFilter = (groupKey: FilterGroupKey, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [groupKey]: toggleFilterValue(prev[groupKey], value),
    }))
  }
  const handleClearFilters = () => {
    const cleared = clearExploreFilters(serializableExploreState)
    setQuery(cleared.query)
    setSelectedFilters({
      selectedCaseTypes: cleared.selectedCaseTypes,
      selectedGenres: cleared.selectedGenres,
      selectedSiteTypes: cleared.selectedSiteTypes,
      selectedPurposes: cleared.selectedPurposes,
      selectedFeatures: cleared.selectedFeatures,
      selectedBudgetRanges: cleared.selectedBudgetRanges,
      selectedTechTags: cleared.selectedTechTags,
    })
  }
  const handleSortChange = (next: SortOrder) => setSortOrder(next)

  const handleToggleCompare = useCallback((slug: string) => {
    setCompareSlugs((prev) => toggleCompareSelection(prev, slug))
  }, [])
  const handleRemoveFromCompare = useCallback((slug: string) => {
    setCompareSlugs((prev) => {
      const next = removeCompareSelection(prev, slug)
      if (next.length < COMPARE_MIN_FOR_PANEL) setIsComparePanelOpen(false)
      return next
    })
  }, [])
  const handleClearCompare = useCallback(() => {
    setCompareSlugs(clearCompareSelection())
    setIsComparePanelOpen(false)
  }, [])

  const handleOpenDetail = (slug: string) => {
    navigate(`/works-finder/${slug}`)
  }

  const appliedFilterCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <>
      <div className="list-layout">
        <Sidebar
          filterGroups={filterGroups}
          selectedFilters={selectedFilters}
          appliedFilterCount={appliedFilterCount}
          visibleCount={visibleWorks.length}
          isOpen={isSidebarOpen}
          onFilterToggle={handleToggleFilter}
          onClearFilters={handleClearFilters}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="list-main">
          <Toolbar
            query={query}
            visibleCount={visibleWorks.length}
            viewMode={viewMode}
            sortOrder={sortOrder}
            isCompareMode={isCompareMode}
            onQueryChange={handleSearchChange}
            onViewModeChange={setViewMode}
            onSortChange={handleSortChange}
            onToggleCompareMode={() => setIsCompareMode((p) => !p)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />

          {visibleWorks.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__title">
                {emptyStateContent?.title ?? '条件に合う作品がありません'}
              </p>
              <p className="empty-state__desc">
                {emptyStateContent?.description ?? '条件を緩めてお試しください'}
              </p>
              {emptyStateContent && (
                <button
                  type="button"
                  className="empty-state__btn"
                  onClick={() => {
                    if (emptyStateContent.actionKind === 'clear-search') {
                      const cleared = clearExploreQuery(serializableExploreState)
                      setQuery(cleared.query)
                    } else {
                      handleClearFilters()
                    }
                  }}
                >
                  {emptyStateContent.actionLabel}
                </button>
              )}
            </div>
          ) : (
            <div className={`works-view works-view--${viewMode}`}>
              {visibleWorks.map((work, i) => (
                <WorkCardItem
                  key={work.slug}
                  work={work}
                  index={i}
                  viewMode={viewMode}
                  isCompareMode={isCompareMode}
                  isCompared={isWorkSelectedForCompare(compareSlugs, work.slug)}
                  isCompareDisabled={isCompareAtLimit(compareSlugs)}
                  onOpenDetail={() => handleOpenDetail(work.slug)}
                  onToggleCompare={() => handleToggleCompare(work.slug)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Compare bar & panel */}
      {shouldShowCompareBar(compareSlugs) && (
        <CompareBar
          works={compareWorks}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
          onOpenPanel={() => setIsComparePanelOpen(true)}
        />
      )}
      {isComparePanelOpen && (
        <ComparePanel
          works={compareWorks}
          onClose={() => setIsComparePanelOpen(false)}
          onRemove={handleRemoveFromCompare}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Card item — renders differently based on viewMode
// ---------------------------------------------------------------------------

function WorkCardItem({
  work,
  index,
  viewMode,
  isCompareMode,
  isCompared,
  isCompareDisabled,
  onOpenDetail,
  onToggleCompare,
}: {
  work: Work
  index: number
  viewMode: ViewMode
  isCompareMode: boolean
  isCompared: boolean
  isCompareDisabled: boolean
  onOpenDetail: () => void
  onToggleCompare: () => void
}) {
  const navConfig = getWorkNavigationConfig(work)
  const imgSrc = work.fullPageScreenshot ?? getWorkImagePath(work)

  if (viewMode === 'thumbnail') {
    return (
      <motion.div
        className="thumb-card"
        custom={index}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        onClick={onOpenDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onOpenDetail() }}
      >
        <img src={imgSrc} alt={work.title} loading="lazy" className="thumb-card__img" />
        {isCompareMode && (
          <label className="thumb-card__compare" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isCompared}
              disabled={isCompareDisabled && !isCompared}
              onChange={onToggleCompare}
            />
          </label>
        )}
      </motion.div>
    )
  }

  if (viewMode === 'list') {
    return (
      <motion.article
        className="list-card"
        custom={index}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ y: -2 }}
        onClick={onOpenDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onOpenDetail() }}
      >
        <div className="list-card__thumb">
          <img src={imgSrc} alt={work.title} loading="lazy" />
        </div>
        <div className="list-card__body">
          <h3 className="list-card__title">{work.title}</h3>
          <p className="list-card__meta">{work.genre} / {work.siteType}</p>
          <p className="list-card__summary">{work.summary}</p>
          <div className="list-card__tags">
            {work.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="list-card__tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="list-card__right">
          <span className="list-card__price">{work.budgetRange ?? '要見積'}</span>
          {isCompareMode && (
            <label className="list-card__compare" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isCompared}
                disabled={isCompareDisabled && !isCompared}
                onChange={onToggleCompare}
              />
              比較
            </label>
          )}
        </div>
      </motion.article>
    )
  }

  // Grid view (default) — ミニマル: サムネイル + タイトル、ホバーでクイックプレビュー
  return (
    <motion.article
      className="grid-card"
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{
        scale: 1.03,
        rotateX: 1,
        rotateY: -1,
        boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
      }}
      transition={{ duration: 0.3 }}
      onClick={onOpenDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpenDetail() }}
    >
      <div className="grid-card__media">
        <img src={imgSrc} alt={work.title} loading="lazy" className="grid-card__img" />
        {/* ホバー時クイックプレビュー */}
        <div className="grid-card__overlay">
          <p className="grid-card__overlay-summary">{work.summary}</p>
          <div className="grid-card__overlay-tags">
            {work.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {work.budgetRange && (
            <span className="grid-card__overlay-price">{work.budgetRange}</span>
          )}
        </div>
        {isCompareMode && (
          <label className="grid-card__compare" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isCompared}
              disabled={isCompareDisabled && !isCompared}
              onChange={onToggleCompare}
            />
          </label>
        )}
        {navConfig.showCaseStudyBadge && (
          <span className="grid-card__badge">Case Study</span>
        )}
      </div>
      <div className="grid-card__body">
        <h3 className="grid-card__title">{work.title}</h3>
      </div>
    </motion.article>
  )
}
