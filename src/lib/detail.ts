/**
 * 詳細モーダル + 導線整形の純関数。
 *
 * ---------------------------------------------------------------------------
 * detailUrl の責務定義
 * ---------------------------------------------------------------------------
 * detailUrl は「モーダル概要の先にある、より深い説明ページ」への補助導線。
 * 詳細モーダルそのものの代替ではない。
 *
 *   モーダル（短〜中距離） — 一覧の中でその場で概要を確認する手段。
 *                           全作品が利用可能。detailUrl の有無に関わらず開ける。
 *   detailUrl（中〜長距離）— ケーススタディや詳細ページなど、
 *                           モーダルでは伝えきれない深い情報への導線。
 *                           detailUrl を持つ作品だけが利用可能。
 *
 * この 2 層は競合しない:
 *   カード「概要を見る」→ モーダルが開く（全作品共通）
 *   モーダル footer「ケーススタディを見る」→ 外部/内部ページへ遷移（一部作品のみ）
 *
 * ---------------------------------------------------------------------------
 * 責務の分担
 * ---------------------------------------------------------------------------
 *   lib/detail.ts   — detailUrl の判定・サニタイズ・導線設定の一元管理
 *   WorkCard        — navConfig を受け取って描画するだけ（URL 判定しない）
 *   DetailModal     — navConfig を受け取って描画するだけ（URL 判定しない）
 *   ComparePanel    — formatCaseStudyAvailability() で「あり / —」を表示
 *
 * ---------------------------------------------------------------------------
 * 無効値の扱い
 * ---------------------------------------------------------------------------
 *   null / undefined / 空文字 / "#" 始まり → 導線なし（モーダルで完結）
 *   javascript: / data: / vbscript: 等     → 危険スキームとして拒否
 *   相対パス ("./" or "/")                  → 内部リンクとして通す
 *   http: / https: / mailto:               → 安全なスキームとして通す
 *   それ以外                                → 安全側に倒して拒否
 */

import type { Work } from '../types/work'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** features チップの最大表示件数。超過分は「他 N 件」で省略する。 */
export const DETAIL_FEATURES_LIMIT = 8

/**
 * URL スキームのうち、安全とみなすもの。
 * これ以外のスキーム（javascript:, data:, vbscript: 等）はすべて拒否する。
 */
const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const isNonEmpty = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim().length > 0

const formatFlag = (value: boolean | undefined): string =>
  value === true ? 'あり' : value === false ? 'なし' : '—'

// ===========================================================================
// detailUrl ユーティリティ — 判定・整形・表示方針の一元管理
// ===========================================================================
//
// 公開 API（下位 → 上位の順）:
//
//   ■ 値レベル
//     getSafeDetailUrl(raw)         — サニタイズ済み URL or null
//     isExternalDetailUrl(safeUrl)  — 外部サイトかどうか
//
//   ■ Work レベル — 単純判定
//     hasDetailUrl(work)            — 有効な detailUrl を持つか
//
//   ■ Work レベル — 属性取得（個別）
//     getDetailCtaLabel(work)       — CTA 文言
//     getDetailLinkTarget(work)     — target 属性 or undefined
//     getDetailLinkRel(work)        — rel 属性 or undefined
//
//   ■ Work レベル — まとめ取得
//     getDetailLinkMeta(work)       — { href, label, isExternal, target?, rel? } | null
//     getWorkNavigationConfig(work) — カード・モーダル・バッジ向けの導線設定一式
//
//   ■ 比較テーブル向け
//     formatCaseStudyAvailability(work) — "あり" / "—"
//
// コンポーネントは原則 getWorkNavigationConfig() だけ使えばよい。
// 個別の判定が必要な場面（比較テーブル行など）では下位関数を直接使える。
// ===========================================================================

// ---------------------------------------------------------------------------
// URL sanitization — 不正 URL 耐性
// ---------------------------------------------------------------------------

/**
 * detailUrl を安全な文字列に正規化する。
 * 危険なスキーム（javascript:, data: 等）を含む場合は null を返す。
 * 空文字・#始まり・null/undefined も null にフォールバックする。
 *
 * 安全判定のルール:
 *   1. null / undefined / 空文字 / "#" 始まり → null
 *   2. 相対パス（"./..." や "/" 始まり）→ そのまま通す
 *   3. 絶対 URL → プロトコルが SAFE_URL_PROTOCOLS に含まれるもののみ通す
 *   4. それ以外 → null（安全側に倒す）
 */
export const getSafeDetailUrl = (
  rawUrl: string | null | undefined,
): string | null => {
  if (rawUrl == null) return null

  const trimmed = rawUrl.trim()
  if (trimmed.length === 0 || trimmed.startsWith('#')) return null

  // 相対パス: "./" or "/" 始まり → 安全
  if (trimmed.startsWith('./') || trimmed.startsWith('/')) {
    return trimmed
  }

  // 絶対 URL の場合、プロトコルを検証
  try {
    const parsed = new URL(trimmed, 'https://placeholder.invalid')
    if (SAFE_URL_PROTOCOLS.has(parsed.protocol)) {
      return trimmed
    }
    // 危険なプロトコル
    return null
  } catch {
    // URL パース失敗（不正な形式）
    return null
  }
}

/**
 * サニタイズ済みの detailUrl が外部サイト（http(s)://...）かどうか。
 * 相対パス・"/" 始まりは内部扱い。
 */
export const isExternalDetailUrl = (safeUrl: string): boolean =>
  /^https?:\/\//i.test(safeUrl.trim())

// ---------------------------------------------------------------------------
// Work レベル — 単純判定
// ---------------------------------------------------------------------------

/** detailUrl が有効なケーススタディ導線として使えるか。 */
export const hasDetailUrl = (work: Work): boolean =>
  getSafeDetailUrl(work.detailUrl) !== null

// ---------------------------------------------------------------------------
// Work レベル — 属性取得（個別）
// ---------------------------------------------------------------------------
// UI 側が必要な属性だけピンポイントで取りたい場合に使う。
// まとめて取りたい場合は getDetailLinkMeta() を使う。
// ---------------------------------------------------------------------------

/**
 * ケーススタディ導線の CTA ラベルを返す。
 *
 * 文言ルール:
 *   - 内部リンク → 「ケーススタディを見る」
 *   - 外部リンク → 「ケーススタディを見る ↗」（外部であることを視覚的に示す）
 *   - detailUrl が無効 → null（導線を出さない）
 */
export const getDetailCtaLabel = (work: Work): string | null => {
  const safeUrl = getSafeDetailUrl(work.detailUrl)
  if (safeUrl === null) return null
  return isExternalDetailUrl(safeUrl) ? 'ケーススタディを見る ↗' : 'ケーススタディを見る'
}

/**
 * detailUrl に付与すべき target 属性を返す。
 *
 *   外部 URL → '_blank'（別タブで開く）
 *   内部 URL → undefined（同タブで遷移）
 *   無効     → undefined
 */
export const getDetailLinkTarget = (work: Work): '_blank' | undefined => {
  const safeUrl = getSafeDetailUrl(work.detailUrl)
  if (safeUrl === null) return undefined
  return isExternalDetailUrl(safeUrl) ? '_blank' : undefined
}

/**
 * detailUrl に付与すべき rel 属性を返す。
 *
 *   外部 URL → 'noopener noreferrer'（セキュリティ対策）
 *   内部 URL → undefined
 *   無効     → undefined
 */
export const getDetailLinkRel = (work: Work): 'noopener noreferrer' | undefined => {
  const safeUrl = getSafeDetailUrl(work.detailUrl)
  if (safeUrl === null) return undefined
  return isExternalDetailUrl(safeUrl) ? 'noopener noreferrer' : undefined
}

// ---------------------------------------------------------------------------
// Work レベル — まとめ取得
// ---------------------------------------------------------------------------

/**
 * ケーススタディリンクに必要な属性をまとめて返す。
 * detailUrl が無効なら null。
 *
 * コンポーネント側はこのオブジェクトの各フィールドを
 * そのまま <a> に展開するだけでよい。
 */
export interface DetailLinkMeta {
  /** サニタイズ済み URL */
  href: string
  /** CTA ラベル */
  label: string
  /** 外部リンクかどうか */
  isExternal: boolean
  /** 外部の場合のみ付与する target */
  target?: '_blank'
  /** 外部の場合のみ付与する rel */
  rel?: 'noopener noreferrer'
}

export const getDetailLinkMeta = (work: Work): DetailLinkMeta | null => {
  const safeUrl = getSafeDetailUrl(work.detailUrl)
  if (safeUrl === null) return null

  const isExternal = isExternalDetailUrl(safeUrl)
  return {
    href: safeUrl,
    label: isExternal ? 'ケーススタディを見る ↗' : 'ケーススタディを見る',
    isExternal,
    ...(isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' as const } : {}),
  }
}

// ---------------------------------------------------------------------------
// Navigation config — カード・モーダル・バッジ向けの導線設定一式
// ---------------------------------------------------------------------------
// getDetailLinkMeta() を内部で使い、カード CTA やバッジの出し分けも含めた
// 上位レベルの設定オブジェクトを返す。
// コンポーネントは原則これだけ呼べばよい。
// ---------------------------------------------------------------------------

/**
 * 導線の優先順位:
 *   1. カード — 「概要を見る」→ モーダルを開く（全作品共通、唯一の CTA）
 *   2. モーダル footer — 「ケーススタディを見る」→ 外部/内部ページへ遷移
 *      （detailUrl が有効な作品のみ。モーダル内で概要を確認した後の次ステップ）
 *   3. バッジ — カード・モーダル上に「Case Study」バッジを表示
 *      （detailUrl がある作品を視覚的に示唆。クリック導線はモーダル内に集約）
 */
export interface WorkNavigationConfig {
  /** カードのプライマリ CTA ラベル（全作品共通） */
  cardActionLabel: string
  /** ケーススタディ導線が利用可能か */
  hasCaseStudy: boolean
  /** モーダル footer 用のリンク設定（hasCaseStudy が false なら null） */
  caseStudyLink: DetailLinkMeta | null
  /** カード・モーダル上に「ケーススタディあり」バッジを出すか */
  showCaseStudyBadge: boolean
}

/**
 * Work から導線設定を導出する。
 * 全コンポーネントがこの関数を通して導線を決定する。
 */
export const getWorkNavigationConfig = (work: Work): WorkNavigationConfig => {
  const caseStudyLink = getDetailLinkMeta(work)
  return {
    cardActionLabel: '概要を見る',
    hasCaseStudy: caseStudyLink !== null,
    caseStudyLink,
    showCaseStudyBadge: caseStudyLink !== null,
  }
}

// ---------------------------------------------------------------------------
// 比較テーブル向け
// ---------------------------------------------------------------------------

/** detailUrl の有無を表示用テキストに変換する。 */
export const formatCaseStudyAvailability = (work: Work): string =>
  hasDetailUrl(work) ? 'あり' : '—'

// ---------------------------------------------------------------------------
// Text field helpers — summary / challenge / designTone
// ---------------------------------------------------------------------------

/** summary が表示可能かどうか。 */
export const hasDetailSummary = (work: Work): boolean =>
  isNonEmpty(work.summary)

/** challenge が表示可能かどうか。 */
export const hasDetailChallenge = (work: Work): boolean =>
  isNonEmpty(work.challenge)

/** designTone が表示可能かどうか。 */
export const hasDetailDesignTone = (work: Work): boolean =>
  isNonEmpty(work.designTone)

/** 「設計観点」セクションを表示すべきか（challenge または designTone がある）。 */
export const hasDetailDesignSection = (work: Work): boolean =>
  hasDetailChallenge(work) || hasDetailDesignTone(work)

// ---------------------------------------------------------------------------
// Detail section data types
// ---------------------------------------------------------------------------

export interface DetailFactItem {
  label: string
  value: string
}

export interface DetailChipGroup {
  label: string
  items: string[]
  /** 省略された件数。0 なら全件表示。 */
  truncatedCount: number
}

// ---------------------------------------------------------------------------
// Meta facts — genre / siteType / year / budgetRange / durationRange / scale
// ---------------------------------------------------------------------------

/**
 * メタ情報ファクト。
 * ヘッダーの kicker にも genre/siteType は出るが、
 * メタ情報としてもラベル付きで一覧表示する。
 */
export const getDetailMetaFacts = (work: Work): DetailFactItem[] => {
  const items: DetailFactItem[] = [
    { label: 'ジャンル', value: work.genre },
    { label: 'サイト種別', value: work.siteType },
  ]

  if (typeof work.year === 'number') {
    items.push({ label: '制作年', value: `${work.year}年` })
  }

  items.push({ label: '想定予算帯', value: work.budgetRange ?? '個別見積' })
  items.push({ label: '制作期間帯', value: work.durationRange ?? '要件に応じて調整' })

  const scaleValue = work.scale
    ?? (typeof work.pageCount === 'number' ? `${work.pageCount}ページ` : null)
  if (scaleValue !== null) {
    items.push({ label: '規模感', value: scaleValue })
  }

  return items
}

// ---------------------------------------------------------------------------
// Design section facts — designTone
// ---------------------------------------------------------------------------

/**
 * 設計観点のファクト（designTone）。
 * challenge は長文テキストなので DetailFactItem ではなくテキスト表示。
 */
export const getDetailDesignFacts = (work: Work): DetailFactItem[] => {
  const items: DetailFactItem[] = []

  if (hasDetailDesignTone(work)) {
    items.push({ label: 'デザイン傾向', value: work.designTone! })
  }

  return items
}

// ---------------------------------------------------------------------------
// Chip groups — 実装系のリスト表示
// ---------------------------------------------------------------------------

/**
 * 実装系チップグループ。
 * - features: DETAIL_FEATURES_LIMIT で件数制御、超過分は truncatedCount で返す
 * - techStack: 全件表示
 * - techTags: techStack と重複しない要素のみ表示、空なら省略
 */
export const getDetailChipGroups = (work: Work): DetailChipGroup[] => {
  const groups: DetailChipGroup[] = []

  if (work.features && work.features.length > 0) {
    const allFeatures = work.features
    const visible = allFeatures.slice(0, DETAIL_FEATURES_LIMIT)
    const truncated = allFeatures.length - visible.length
    groups.push({ label: '主な機能', items: visible, truncatedCount: truncated })
  }

  if (work.techStack.length > 0) {
    groups.push({ label: '使用技術', items: work.techStack, truncatedCount: 0 })
  }

  // techTags は techStack と重複しない要素だけ表示
  if (work.techTags.length > 0) {
    const stackSet = new Set(work.techStack.map((s) => s.toLowerCase()))
    const uniqueTags = work.techTags.filter((tag) => !stackSet.has(tag.toLowerCase()))
    if (uniqueTags.length > 0) {
      groups.push({ label: '技術タグ', items: uniqueTags, truncatedCount: 0 })
    }
  }

  return groups
}

// ---------------------------------------------------------------------------
// Boolean flags
// ---------------------------------------------------------------------------

/** boolean フラグのファクト。undefined は「—」で表示。 */
export const getDetailBooleanFlags = (work: Work): DetailFactItem[] => [
  { label: 'CMS', value: formatFlag(work.hasCms) },
  { label: 'フォーム', value: formatFlag(work.hasForm) },
  { label: 'アニメーション', value: formatFlag(work.hasAnimation) },
]
