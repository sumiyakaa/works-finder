export interface Work {
  // Identity
  slug: string
  title: string
  id?: string

  // List-safe asset fields
  thumbnail: string
  thumbnailFallback?: string

  // Classification
  category?: string
  genre: string
  siteType: string
  purpose: string
  tags: string[]

  // Summary / detail hand-off
  summary: string
  challenge?: string
  designTone?: string
  features?: string[]
  // Curated technical tags for archive filtering/search.
  techTags: string[]
  // Detailed implementation stack for future detail views.
  techStack: string[]

  // Supplemental list metadata
  pageCount?: number
  scale?: string | null
  budgetRange?: string | null
  durationRange?: string | null
  year?: number

  // Flags / future UI behaviors
  isFeatured?: boolean
  hasCms?: boolean
  hasAnimation?: boolean
  hasForm?: boolean
  isConcept?: boolean

  // ---------------------------------------------------------------------------
  // 補助導線 — ケーススタディ / 詳細ページ
  // ---------------------------------------------------------------------------
  // detailUrl は「モーダル概要の先にある、より深い説明ページ」への URL。
  // モーダル自体の代替ではない。
  //
  //   null / undefined — モーダルで概要確認のみ（完結）
  //   相対パス ("./projects/xxx/") — 同サイト内の詳細ページ
  //   絶対 URL ("https://...") — 外部のケーススタディ
  //
  // 判定・サニタイズは lib/detail.ts に集約。
  // コンポーネントは getWorkNavigationConfig() の戻り値だけで導線を出し分ける。
  // ---------------------------------------------------------------------------
  detailUrl?: string | null
}
