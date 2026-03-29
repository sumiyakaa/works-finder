import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Components — barrel import
// ---------------------------------------------------------------------------

import {
  CompareBar,
  ComparePanel,
  ConsultationSection,
  ContactFormModal,
  DetailModal,
  FilterPanel,
  Footer,
  HeroSection,
  ResultsToolbar,
  SearchPanel,
  WorksGrid,
} from './components'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

import { works } from './data/works'

// ---------------------------------------------------------------------------
// Lib — compare (URL / storage 同期対象外)
// ---------------------------------------------------------------------------

import {
  clearCompareSelection,
  COMPARE_MIN_FOR_PANEL,
  getSelectedCompareWorks,
  removeCompareSelection,
  shouldShowCompareBar,
  toggleCompareSelection,
} from './lib/compare'
import type { CompareSelection } from './lib/compare'

// ---------------------------------------------------------------------------
// Lib — explore (URL / storage 同期対象)
// ---------------------------------------------------------------------------

import {
  clearExploreFilters,
  clearExploreQuery,
  createExploreState,
  getDefaultExploreState,
  getExploreEmptyStateContent,
  getExploreUiState,
  getFilterOptions,
  getUniqueWorkValues,
  getVisibleWorks,
  isDefaultExploreState,
  parseExploreState,
  removeExploreChip,
  serializeExploreState,
  sanitizeExploreStateForWorks,
  getPopularTags,
  toggleFilterValue,
} from './lib/works'
import {
  readStoredExploreState,
  writeStoredExploreState,
} from './lib/exploreStorage'
import {
  loadFavoriteIds,
  saveFavoriteIds,
} from './lib/favoritesStorage'
import { getConsultationContent } from './lib/consultation'
import type { ConsultationContent } from './lib/consultation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

import type {
  ActiveFilterChipAction,
  ExploreSerializableState,
  FilterGroupKey,
  FilterState,
  SortOrder,
} from './types/filter'

// ---------------------------------------------------------------------------
// 初期化ソース — URL 復元時に localStorage を上書きしないための判定に使う
// ---------------------------------------------------------------------------

type ExploreInitSource = 'url' | 'storage' | 'default'

const parseExploreStateFromSearch = (
  search: string,
): ExploreSerializableState =>
  sanitizeExploreStateForWorks(parseExploreState(search), works)

/**
 * 初期表示時の探索状態を URL > localStorage > default の優先順位で決定する。
 *
 * - URL に有効な探索条件があれば URL を正とする
 * - URL が空、またはパラメータが sanitize 後にデフォルトと一致するなら localStorage を見る
 * - localStorage も空・不正ならデフォルトへフォールバック
 *
 * 戻り値の source は、初回の storage write をスキップするかの判定に使う。
 */
const resolveInitialExploreState = (): {
  state: ExploreSerializableState
  source: ExploreInitSource
} => {
  if (typeof window === 'undefined') {
    return { state: getDefaultExploreState(), source: 'default' }
  }

  // 1. URL に有効な探索条件があれば URL を優先
  const search = window.location.search

  if (search.length > 0 && search !== '?') {
    const fromUrl = parseExploreStateFromSearch(search)

    // sanitize 後にデフォルトと同じなら URL は実質空 → 次へフォールバック
    if (!isDefaultExploreState(fromUrl)) {
      return { state: fromUrl, source: 'url' }
    }
  }

  // 2. localStorage に有効な状態があれば復元
  const stored = readStoredExploreState()

  if (stored !== null) {
    return { state: sanitizeExploreStateForWorks(stored, works), source: 'storage' }
  }

  // 3. どちらも無ければデフォルト
  return { state: getDefaultExploreState(), source: 'default' }
}

function App() {
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
  const exploreState = useMemo(
    () => getExploreUiState(serializableExploreState, {
      visibleCount: visibleWorks.length,
      totalCount: works.length,
    }),
    [serializableExploreState, visibleWorks.length],
  )
  const filterGroups = useMemo(
    () => getFilterOptions(works),
    [],
  )
  const emptyStateContent = useMemo(
    () => getExploreEmptyStateContent(serializableExploreState, works.length),
    [serializableExploreState],
  )
  const genrePreview = useMemo(() => getUniqueWorkValues(works, (work) => work.genre, 4), [])
  const siteTypePreview = useMemo(() => getUniqueWorkValues(works, (work) => work.siteType, 4), [])
  const purposePreview = useMemo(() => getUniqueWorkValues(works, (work) => work.purpose, 4), [])

  // -------------------------------------------------------------------------
  // Compare state — 探索状態とは独立して管理する
  // -------------------------------------------------------------------------
  // URL 同期・localStorage 保存の対象外。
  // 絞り込みで visibleWorks が変わっても、選択済み slug は保持する。
  // compareWorks は全件 works から解決するため、パネル側では常に正しく表示される。
  // -------------------------------------------------------------------------

  const [compareSlugs, setCompareSlugs] = useState<CompareSelection>([])
  const [isComparePanelOpen, setIsComparePanelOpen] = useState(false)

  const compareWorks = useMemo(
    () => getSelectedCompareWorks(compareSlugs, works),
    [compareSlugs],
  )

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

  const handleOpenComparePanel = useCallback(() => {
    setIsComparePanelOpen(true)
  }, [])

  const handleCloseComparePanel = useCallback(() => {
    setIsComparePanelOpen(false)
  }, [])

  // -------------------------------------------------------------------------
  // Detail state — 探索・比較とは独立して管理する
  // -------------------------------------------------------------------------
  // URL 同期・localStorage 保存の対象外。
  // slug を保持し、全件 works から Work オブジェクトを解決する。
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Contact form state
  // -------------------------------------------------------------------------

  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const handleOpenContactForm = useCallback(() => {
    setIsContactFormOpen(true)
  }, [])

  const handleCloseContactForm = useCallback(() => {
    setIsContactFormOpen(false)
  }, [])

  const [detailSlug, setDetailSlug] = useState<string | null>(null)

  const detailWork = useMemo(
    () => (detailSlug !== null ? works.find((w) => w.slug === detailSlug) ?? null : null),
    [detailSlug],
  )

  const handleOpenDetail = useCallback((slug: string) => {
    setDetailSlug(slug)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setDetailSlug(null)
  }, [])

  // -------------------------------------------------------------------------
  // Favorites state — localStorage 永続化
  // -------------------------------------------------------------------------

  const validWorkIds = useMemo(() => works.map((w) => w.id ?? w.slug), [])
  const [favoriteIds, setFavoriteIds] = useState<string[]>(
    () => loadFavoriteIds(validWorkIds),
  )

  const handleToggleFavorite = useCallback((workId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(workId)
        ? prev.filter((id) => id !== workId)
        : [...prev, workId]
      saveFavoriteIds(next)
      return next
    })
  }, [])

  // -------------------------------------------------------------------------
  // Popular tags
  // -------------------------------------------------------------------------

  const popularTags = useMemo(() => getPopularTags(works), [])

  const handleApplyPopularTag = useCallback((tag: string) => {
    setQuery(tag)
  }, [])

  // -------------------------------------------------------------------------
  // Consultation content — 状態に応じた動的メモ生成
  // -------------------------------------------------------------------------

  const consultationContent: ConsultationContent = useMemo(
    () => getConsultationContent(
      serializableExploreState,
      compareSlugs,
      works,
      detailWork,
      visibleWorks.length,
    ),
    [serializableExploreState, compareSlugs, detailWork, visibleWorks.length],
  )

  // -------------------------------------------------------------------------
  // Explore handlers
  // -------------------------------------------------------------------------

  const applyExploreState = (nextExploreState: ExploreSerializableState) => {
    const normalizedNextExploreState = sanitizeExploreStateForWorks(nextExploreState, works)
    const nextSerializedSearch = serializeExploreState(normalizedNextExploreState)

    if (nextSerializedSearch === serializedSearch) {
      return
    }

    setQuery(normalizedNextExploreState.query)
    setSelectedFilters({
      selectedCaseTypes: normalizedNextExploreState.selectedCaseTypes,
      selectedGenres: normalizedNextExploreState.selectedGenres,
      selectedSiteTypes: normalizedNextExploreState.selectedSiteTypes,
      selectedPurposes: normalizedNextExploreState.selectedPurposes,
      selectedFeatures: normalizedNextExploreState.selectedFeatures,
      selectedBudgetRanges: normalizedNextExploreState.selectedBudgetRanges,
      selectedTechTags: normalizedNextExploreState.selectedTechTags,
    })
    setSortOrder(normalizedNextExploreState.sortOrder)
  }

  const handleSearchChange = (value: string) => {
    setQuery(value)
  }

  const handleClearSearch = () => {
    applyExploreState(clearExploreQuery(serializableExploreState))
  }

  const handleToggleFilter = (groupKey: FilterGroupKey, value: string) => {
    setSelectedFilters((previous) => ({
      ...previous,
      [groupKey]: toggleFilterValue(previous[groupKey], value),
    }))
  }

  const handleClearFilters = () => {
    applyExploreState(clearExploreFilters(serializableExploreState))
  }

  const handleSortChange = (nextSortOrder: SortOrder) => {
    setSortOrder(nextSortOrder)
  }

  const handleResetExplore = () => {
    applyExploreState(getDefaultExploreState())
  }

  const handleRemoveChip = (action: ActiveFilterChipAction) => {
    applyExploreState(removeExploreChip(serializableExploreState, action))
  }

  // -------------------------------------------------------------------------
  // Side effects — URL 同期・localStorage 保存・popstate
  // -------------------------------------------------------------------------
  // 3 つの effect はすべて serializableExploreState（探索本体状態）を
  // 単一の情報源とする。書き込み先が異なるため互いに競合しない。
  //
  //   state 変更 → serializableExploreState (useMemo)
  //                  ├→ serializedSearch (useMemo)
  //                  │    └→ [1] URL sync    : replaceState
  //                  └→ [2] Storage write    : localStorage
  //
  //   ブラウザ戻る/進む → [3] popstate → state 変更 → 上記 [1][2] が自然に発火
  //
  // デフォルト状態では URL は空（パラメータなし）、storage は削除される。
  // 0 件状態でも探索条件自体は有効なので URL・storage 両方に保持する。
  // -------------------------------------------------------------------------

  // [1] URL sync — serializedSearch が変わったら URL を更新
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const currentSearch = window.location.search.startsWith('?')
      ? window.location.search.slice(1)
      : window.location.search

    if (currentSearch === serializedSearch) {
      return
    }

    const nextSearch = serializedSearch.length > 0 ? `?${serializedSearch}` : ''
    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`
    window.history.replaceState(null, '', nextUrl)
  }, [serializedSearch])

  // [2] Storage write — serializableExploreState が変わったら localStorage を更新
  //     デフォルト状態なら writeStoredExploreState 内で storage を削除する。
  //     URL から初期化した初回だけスキップし、ユーザーの保存済み状態を守る。
  useEffect(() => {
    if (skipInitialStorageWriteRef.current) {
      skipInitialStorageWriteRef.current = false
      return
    }

    writeStoredExploreState(serializableExploreState)
  }, [serializableExploreState])

  // [3] Popstate — ブラウザの戻る/進むで URL が変わったら state を復元
  //     state 更新後、[1] URL sync と [2] Storage write が自然に再発火する。
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handlePopState = () => {
      const nextExploreState = parseExploreStateFromSearch(window.location.search)
      const nextSerializedSearch = serializeExploreState(nextExploreState)

      if (nextSerializedSearch === serializedSearch) {
        return
      }

      setQuery(nextExploreState.query)
      setSelectedFilters({
        selectedCaseTypes: nextExploreState.selectedCaseTypes,
        selectedGenres: nextExploreState.selectedGenres,
        selectedSiteTypes: nextExploreState.selectedSiteTypes,
        selectedPurposes: nextExploreState.selectedPurposes,
        selectedFeatures: nextExploreState.selectedFeatures,
        selectedBudgetRanges: nextExploreState.selectedBudgetRanges,
        selectedTechTags: nextExploreState.selectedTechTags,
      })
      setSortOrder(nextExploreState.sortOrder)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [serializedSearch])

  const emptyState = emptyStateContent
    ? {
        ...emptyStateContent,
        onAction:
          emptyStateContent.actionKind === 'clear-search'
            ? handleClearSearch
            : emptyStateContent.actionKind === 'clear-filters'
              ? handleClearFilters
              : handleResetExplore,
      }
    : undefined

  return (
    <main className={`app-shell${shouldShowCompareBar(compareSlugs) ? ' app-shell--has-compare-bar' : ''}`}>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__logo-link" href="#">
            <img
              className="site-header__logo"
              src={`${import.meta.env.BASE_URL}assets/images/meta/logo-white.png`}
              alt="AKASHIKI"
            />
          </a>
          <button
            type="button"
            className="primary-button site-header__cta"
            onClick={handleOpenContactForm}
          >
            制作について相談する
          </button>
        </div>
      </header>

      <div className="app-container">
        <HeroSection
          stats={[
            {
              label: '掲載案件数',
              value: String(works.length),
              supportingText: '実案件・コンセプト案件を含む総数',
            },
            {
              label: '実案件数',
              value: String(works.filter((w) => !w.isConcept).length),
              supportingText: 'クライアントワークとして制作した案件',
            },
            {
              label: '絞り込み軸',
              value: String(filterGroups.length),
              supportingText: 'ジャンル・目的・予算帯など',
            },
          ]}
          taxonomies={[
            {
              title: 'Genres',
              items: genrePreview,
            },
            {
              title: 'Site types',
              items: siteTypePreview,
            },
            {
              title: 'Purposes',
              items: purposePreview,
            },
          ]}
        />

        <SearchPanel
          query={query}
          totalCount={works.length}
          visibleCount={visibleWorks.length}
          popularTags={popularTags}
          onQueryChange={handleSearchChange}
          onApplyPopularTag={handleApplyPopularTag}
        />
        <section
          className="archive-section explore-section"
          id="archive"
          aria-labelledby="explore-section-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-label">Works archive</p>
              <h2 id="explore-section-title">制作実績一覧</h2>
            </div>
            <p className="section-heading__note">
              条件を組み合わせて、ご依頼に近い案件を絞り込めます。
            </p>
          </div>

          <div className="explore-layout">
            <FilterPanel
              filterGroups={filterGroups}
              appliedFilterCount={exploreState.appliedFilterCount}
              selectedFilters={selectedFilters}
              onFilterToggle={handleToggleFilter}
              onClearFilters={handleClearFilters}
            />

            <div className="explore-layout__main">
              <ResultsToolbar
                exploreState={exploreState}
                onSortChange={handleSortChange}
                onRemoveChip={handleRemoveChip}
              />
              <WorksGrid
                works={visibleWorks}
                totalCount={works.length}
                emptyState={emptyState}
                compareSlugs={compareSlugs}
                favoriteIds={favoriteIds}
                onToggleCompare={handleToggleCompare}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetail={handleOpenDetail}
              />
            </div>
          </div>
        </section>
        <ConsultationSection onOpenContactForm={handleOpenContactForm} />
        <Footer />
      </div>

      {shouldShowCompareBar(compareSlugs) ? (
        <CompareBar
          works={compareWorks}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
          onOpenPanel={handleOpenComparePanel}
        />
      ) : null}

      {isComparePanelOpen ? (
        <ComparePanel
          works={compareWorks}
          onClose={handleCloseComparePanel}
          onRemove={handleRemoveFromCompare}
        />
      ) : null}

      {isContactFormOpen ? (
        <ContactFormModal onClose={handleCloseContactForm} />
      ) : null}

      {detailWork !== null ? (
        <DetailModal
          work={detailWork}
          isCompared={compareSlugs.includes(detailWork.slug)}
          isCompareDisabled={compareSlugs.length >= 3}
          isFavorite={favoriteIds.includes(detailWork.id ?? detailWork.slug)}
          consultationContent={consultationContent}
          onClose={handleCloseDetail}
          onToggleCompare={() => { handleToggleCompare(detailWork.slug) }}
          onToggleFavorite={() => { handleToggleFavorite(detailWork.id ?? detailWork.slug) }}
        />
      ) : null}
    </main>
  )
}

export default App
