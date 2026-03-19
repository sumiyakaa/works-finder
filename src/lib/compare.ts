/**
 * 比較機能の純関数。
 *
 * 状態本体（compareSlugs）は App に置き、
 * 判定・整形・上限制御はここで行う。
 *
 * 関数名の規則:
 *   操作系  — xxxCompareSelection  (元配列を壊さず新配列を返す)
 *   判定系  — isXxx / canXxx
 *   導出系  — getXxx
 */

import type { Work } from '../types/work'
import type {
  CompareEligibility,
  CompareDerivedState,
  CompareRowDefinition,
  CompareSelection,
  CompareSummary,
} from '../types/compare'
import { COMPARE_MAX, COMPARE_MIN_FOR_PANEL } from '../types/compare'
import { formatCaseStudyAvailability } from './detail'

export { COMPARE_MAX, COMPARE_MIN_FOR_PANEL }
export type { CompareRowDefinition, CompareSelection }

// ---------------------------------------------------------------------------
// Selection manipulation — すべて新しい配列を返す純関数
// ---------------------------------------------------------------------------

/** slug を追加する。すでに含まれている、または上限に達していたら元配列を返す。 */
export const addCompareSelection = (
  slugs: CompareSelection,
  slug: string,
): CompareSelection => {
  if (slugs.includes(slug) || slugs.length >= COMPARE_MAX) {
    return slugs
  }
  return [...slugs, slug]
}

/** slug を除去する。 */
export const removeCompareSelection = (
  slugs: CompareSelection,
  slug: string,
): CompareSelection => slugs.filter((s) => s !== slug)

/** 追加 / 除去をトグルする。 */
export const toggleCompareSelection = (
  slugs: CompareSelection,
  slug: string,
): CompareSelection =>
  slugs.includes(slug)
    ? removeCompareSelection(slugs, slug)
    : addCompareSelection(slugs, slug)

/** 全解除して空配列を返す。 */
export const clearCompareSelection = (): CompareSelection => []

/**
 * 上限を超えた slug を末尾から切り捨てる。
 * データ復元や外部入力を受ける際のガード。
 */
export const clampCompareSelectionToMax = (
  slugs: CompareSelection,
): CompareSelection =>
  slugs.length <= COMPARE_MAX ? slugs : slugs.slice(0, COMPARE_MAX)

// ---------------------------------------------------------------------------
// Queries — 状態に対する読み取り専用の判定
// ---------------------------------------------------------------------------

/** 指定 slug が比較対象に含まれているか。 */
export const isWorkSelectedForCompare = (
  slugs: CompareSelection,
  slug: string,
): boolean => slugs.includes(slug)

/** 比較上限に達しているか。 */
export const isCompareAtLimit = (slugs: CompareSelection): boolean =>
  slugs.length >= COMPARE_MAX

/** これ以上追加できるか（上限未満かつ未選択）。 */
export const canAddToCompare = (
  slugs: CompareSelection,
  slug: string,
): boolean => !slugs.includes(slug) && slugs.length < COMPARE_MAX

/** 比較パネルを開ける条件（2 件以上）。 */
export const canOpenComparePanel = (slugs: CompareSelection): boolean =>
  slugs.length >= COMPARE_MIN_FOR_PANEL

/** 比較バーを表示する条件（1 件以上）。 */
export const shouldShowCompareBar = (slugs: CompareSelection): boolean =>
  slugs.length >= 1

/** 個々のカード向けの比較適格情報を返す。 */
export const getCompareEligibility = (
  slugs: CompareSelection,
  slug: string,
): CompareEligibility => ({
  isCompared: isWorkSelectedForCompare(slugs, slug),
  isAtLimit: isCompareAtLimit(slugs),
})

/** 比較バー・パネル向けの派生状態をまとめて返す。 */
export const getCompareDerivedState = (
  slugs: CompareSelection,
): CompareDerivedState => ({
  showBar: shouldShowCompareBar(slugs),
  canOpenPanel: canOpenComparePanel(slugs),
  isAtLimit: isCompareAtLimit(slugs),
  selectedCount: slugs.length,
})

// ---------------------------------------------------------------------------
// Derived data — 比較パネル / バー用の整形
// ---------------------------------------------------------------------------

/** compareSlugs から Work オブジェクトを追加順を保って解決する。 */
export const getSelectedCompareWorks = (
  slugs: CompareSelection,
  allWorks: Work[],
): Work[] => {
  const workMap = new Map(allWorks.map((w) => [w.slug, w]))
  return slugs
    .map((slug) => workMap.get(slug))
    .filter((w): w is Work => w !== undefined)
}

/** 比較バーが表示するサマリー情報を返す。 */
export const getCompareSummary = (
  slugs: CompareSelection,
): CompareSummary => {
  const selectedCount = slugs.length
  const canOpen = canOpenComparePanel(slugs)
  return {
    selectedCount,
    maxCount: COMPARE_MAX,
    label: `${selectedCount} / ${COMPARE_MAX} 件選択中`,
    note: canOpen
      ? '「比較を見る」で並べて確認できます。'
      : 'もう 1 件追加すると比較できます。',
    canOpenPanel: canOpen,
  }
}

// ---------------------------------------------------------------------------
// Compare table — 行定義と整形ヘルパー
// ---------------------------------------------------------------------------

/** 配列値を表示用テキストに整形する。limit を超えた分は "+N" で省略。 */
const formatListValue = (items: string[] | undefined, limit = 3): string => {
  if (!items || items.length === 0) return '—'
  const visible = items.slice(0, limit)
  const rest = items.length - limit
  return rest > 0 ? `${visible.join('、')}  +${rest}` : visible.join('、')
}

/** boolean フラグを「あり / なし」ラベルに変換する。 */
const formatBooleanFlag = (value: boolean | undefined): string =>
  value === true ? 'あり' : value === false ? 'なし' : '—'

/**
 * 比較テーブルの行定義。
 * UI 側はこの配列を map するだけでテーブルを描画できる。
 */
export const COMPARE_FIELD_ROWS: CompareRowDefinition[] = [
  {
    key: 'genre',
    label: 'ジャンル',
    getValue: (w) => w.genre,
  },
  {
    key: 'siteType',
    label: 'サイト種別',
    getValue: (w) => w.siteType,
  },
  {
    key: 'purpose',
    label: '制作目的',
    getValue: (w) => w.purpose,
  },
  {
    key: 'year',
    label: '制作年',
    getValue: (w) => (typeof w.year === 'number' ? String(w.year) : '—'),
  },
  {
    key: 'budgetRange',
    label: '想定予算帯',
    getValue: (w) => w.budgetRange ?? '個別見積',
  },
  {
    key: 'durationRange',
    label: '制作期間帯',
    getValue: (w) => w.durationRange ?? '要件に応じて調整',
  },
  {
    key: 'pageScale',
    label: 'ページ数 / 規模感',
    getValue: (w) => {
      const parts: string[] = []
      if (typeof w.pageCount === 'number') parts.push(`${w.pageCount}ページ`)
      if (w.scale) parts.push(w.scale)
      return parts.length > 0 ? parts.join(' / ') : '案件ごとに調整'
    },
  },
  {
    key: 'features',
    label: '主な機能',
    getValue: (w) => formatListValue(w.features, 3),
  },
  {
    key: 'techStack',
    label: '使用技術',
    getValue: (w) => formatListValue(w.techStack, 3),
  },
  {
    key: 'techTags',
    label: '技術タグ',
    getValue: (w) => formatListValue(w.techTags, 4),
  },
  {
    key: 'booleanFlags',
    label: 'CMS / アニメ / フォーム',
    getValue: (w) =>
      [
        `CMS: ${formatBooleanFlag(w.hasCms)}`,
        `アニメ: ${formatBooleanFlag(w.hasAnimation)}`,
        `フォーム: ${formatBooleanFlag(w.hasForm)}`,
      ].join('　'),
  },
  {
    key: 'designTone',
    label: 'デザイン傾向',
    getValue: (w) => w.designTone ?? '—',
  },
  {
    key: 'caseStudy',
    label: 'ケーススタディ',
    getValue: (w) => formatCaseStudyAvailability(w),
  },
]

/**
 * 指定キーだけに絞った行定義を返す。
 * UI 側で表示行をカスタマイズしたい場合に使う。
 */
export const getCompareFieldRows = (
  keys?: readonly CompareRowDefinition['key'][],
): CompareRowDefinition[] => {
  if (!keys) return COMPARE_FIELD_ROWS
  return keys
    .map((key) => COMPARE_FIELD_ROWS.find((row) => row.key === key))
    .filter((row): row is CompareRowDefinition => row !== undefined)
}
