import type { Work } from './work'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** 比較に追加できる最大件数。 */
export const COMPARE_MAX = 3

/** 比較パネルを開くのに必要な最小件数。 */
export const COMPARE_MIN_FOR_PANEL = 2

// ---------------------------------------------------------------------------
// State layer — App が保持する比較本体状態
// ---------------------------------------------------------------------------
// 現時点では URL / localStorage に永続化しない。
// slug 配列 + パネル開閉だけで十分な段階。
// ---------------------------------------------------------------------------

/**
 * 比較対象の slug リスト。
 * 順序は追加順を維持する。最大 COMPARE_MAX 件。
 */
export type CompareSelection = string[]

/**
 * App が useState で管理する比較の本体状態。
 * explore 状態とは独立して扱う。
 */
export interface CompareState {
  /** 比較対象として選択された slug の配列（追加順）。 */
  compareSlugs: CompareSelection
  /** 比較パネルが開いているかどうか。 */
  isComparePanelOpen: boolean
}

// ---------------------------------------------------------------------------
// UI derived layer — CompareState から導出される表示専用の情報
// ---------------------------------------------------------------------------
// 描画のたびに本体状態から再計算される。保存・同期の対象外。
// ---------------------------------------------------------------------------

/**
 * 個々のカードが比較 UI を描画するために必要な情報。
 * lib/compare の query 関数群から導出される。
 */
export interface CompareEligibility {
  /** このカードが現在比較対象に含まれているか。 */
  isCompared: boolean
  /** 比較上限に達しているか（含まれていないカードの追加ボタンを disable にする）。 */
  isAtLimit: boolean
}

/**
 * 比較バー・パネルの表示判定に使う派生フラグ。
 */
export interface CompareDerivedState {
  /** 比較バーを表示するか（1 件以上）。 */
  showBar: boolean
  /** 比較パネルを開けるか（2 件以上）。 */
  canOpenPanel: boolean
  /** 比較上限に達しているか。 */
  isAtLimit: boolean
  /** 選択件数。 */
  selectedCount: number
}

/**
 * 比較バーが表示するサマリー情報。
 * App 側で getCompareSummary() を呼んで取得する。
 */
export interface CompareSummary {
  /** 選択件数。 */
  selectedCount: number
  /** 最大件数。 */
  maxCount: number
  /** "2 / 3 件選択中" のようなラベル。 */
  label: string
  /** バー下部に出す補足メッセージ。 */
  note: string
  /** 比較パネルを開けるか。 */
  canOpenPanel: boolean
}

// ---------------------------------------------------------------------------
// Compare table — 比較パネルの行定義
// ---------------------------------------------------------------------------

/**
 * 比較テーブルで使えるフィールドキー。
 * Work の各プロパティ、または複合的に導出するキーを含む。
 */
export type CompareFieldKey =
  | 'genre'
  | 'siteType'
  | 'purpose'
  | 'year'
  | 'budgetRange'
  | 'durationRange'
  | 'pageScale'
  | 'features'
  | 'techStack'
  | 'techTags'
  | 'booleanFlags'
  | 'designTone'
  | 'caseStudy'

/**
 * 比較テーブルの 1 行を定義する。
 * key は行の識別子、label はヘッダセル、getValue は各作品セルに表示する文字列を返す。
 */
export interface CompareRowDefinition {
  key: CompareFieldKey
  label: string
  getValue: (work: Work) => string
}
