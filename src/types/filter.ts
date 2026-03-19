export interface FilterOptionItem {
  label: string
  count: number
}

export type SortOrder =
  | 'recommended'
  | 'year-desc'
  | 'year-asc'
  | 'budget-asc'
  | 'title-asc'
  | 'title-desc'

export interface SortOption {
  value: SortOrder
  label: string
}

export type SortOptionLabel = SortOption['label']

export const DEFAULT_SORT_ORDER: SortOrder = 'recommended'

export const SORT_OPTIONS: readonly SortOption[] = [
  { value: 'recommended', label: 'おすすめ順' },
  { value: 'year-desc', label: '新しい順' },
  { value: 'year-asc', label: '古い順' },
  { value: 'budget-asc', label: '予算帯順' },
  { value: 'title-asc', label: 'タイトル順' },
  { value: 'title-desc', label: 'タイトル逆順' },
] as const

export interface FilterState {
  selectedCaseTypes: string[]
  selectedGenres: string[]
  selectedSiteTypes: string[]
  selectedPurposes: string[]
  selectedFeatures: string[]
  selectedBudgetRanges: string[]
  selectedTechTags: string[]
}

export type FilterGroupKey = keyof FilterState

export interface FilterGroup {
  key: FilterGroupKey
  title: string
  options: FilterOptionItem[]
}

// ---------------------------------------------------------------------------
// Serializable layer — URL 同期・localStorage 保存の対象
// ---------------------------------------------------------------------------
// この層に含まれる 6 フィールドだけが永続化される。
// visibleCount, summaryText, chips など UI 派生値はここに含めない。
// ---------------------------------------------------------------------------

export interface SearchState {
  query: string
}

export interface SortState {
  sortOrder: SortOrder
}

/**
 * URL と localStorage の両方で永続化される探索本体状態。
 *
 * 含まれるフィールド（全 6 件）:
 *   query            — 検索キーワード
 *   selectedCaseTypes — 案件区分絞り込み
 *   selectedGenres   — ジャンル絞り込み
 *   selectedSiteTypes — サイト種別絞り込み
 *   selectedPurposes — 目的絞り込み
 *   selectedFeatures — 実装特徴絞り込み
 *   selectedBudgetRanges — 想定予算帯絞り込み
 *   selectedTechTags — 技術要素絞り込み
 *   sortOrder        — 並び順
 *
 * visibleCount, summaryText, chips など表示専用の派生値は
 * ExploreDerivedState / ExploreUiState 側で扱い、ここには含めない。
 */
export interface ExploreSerializableState extends SearchState, FilterState, SortState {}

export type ExploreSerializableKey = keyof ExploreSerializableState

/** ExploreSerializableState の全キーを列挙した定数。ランタイム検証に使用できる。 */
export const EXPLORE_SERIALIZABLE_KEYS: readonly ExploreSerializableKey[] = [
  'query',
  'selectedCaseTypes',
  'selectedGenres',
  'selectedSiteTypes',
  'selectedPurposes',
  'selectedFeatures',
  'selectedBudgetRanges',
  'selectedTechTags',
  'sortOrder',
] as const

// 後方互換のための別名。状態本体を指すときは ExploreSerializableState を優先する。
export type ExploreState = ExploreSerializableState

export type ExploreStateKey = keyof ExploreState

export type ExploreStateInput = Partial<ExploreSerializableState> | null | undefined

// ---------------------------------------------------------------------------
// UI derived layer — ExploreSerializableState から導出される表示専用の型
// ---------------------------------------------------------------------------
// この層の値は保存・同期の対象外。描画のたびに本体状態から再計算される。
// ---------------------------------------------------------------------------

export type ExploreSummaryItemKind = 'query' | 'filter' | 'sort'

export interface ExploreSummaryItem {
  id: string
  label: string
  kind: ExploreSummaryItemKind
}

export type ActiveFilterChipAction =
  | { type: 'clear-query' }
  | { type: 'remove-filter-value'; groupKey: FilterGroupKey; value: string }

export type ActiveExploreChipTarget = ActiveFilterChipAction

export interface RemovableExploreChip {
  id: string
  label: string
  kind: 'query' | 'filter'
  action: ActiveFilterChipAction
}

export type ActiveExploreChip = RemovableExploreChip

export interface ActiveFilterDescriptor {
  id: string
  groupKey: FilterGroupKey
  groupLabel: string
  value: string
  label: string
}

export interface ExploreSummary {
  hasSearchTerm: boolean
  hasSelectedFilters: boolean
  hasCustomSort: boolean
  hasActiveRefinement: boolean
  activeFilterCount: number
  sortLabel: SortOptionLabel
  chips: ExploreSummaryItem[]
  note: string
}

/**
 * ExploreSerializableState から導出される UI 専用の派生情報。
 * URL 同期にも localStorage 保存にも含めない。
 * 描画のたびに本体状態 + ExploreStatusContext から再計算する。
 */
export interface ExploreDerivedState {
  visibleCount: number
  totalCount?: number
  sortLabel: SortOptionLabel
  appliedFilterCount: number
  hasSearchQuery: boolean
  hasActiveFilters: boolean
  hasCustomSort: boolean
  hasActiveRefinement: boolean
  summaryText: string
  statusText: string
  activeFilterDescriptors: ActiveFilterDescriptor[]
  activeFilterChips: ActiveExploreChip[]
  chips: ExploreSummaryItem[]
}

export interface ExploreUiState extends ExploreSerializableState, ExploreDerivedState {}

export type ExploreStateChip = ExploreSummaryItem
export type ExploreStateSummary = ExploreSummary

export type ExploreEmptyStateAction =
  | 'clear-search'
  | 'clear-filters'
  | 'reset-explore'

export interface ExploreEmptyStateContent {
  title: string
  description: string
  actionLabel: string
  actionKind: ExploreEmptyStateAction
}

export interface ExploreStatusContext {
  visibleCount: number
  totalCount?: number
}
