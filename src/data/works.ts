import type { Work } from '../types/work'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

const createWorkImageSet = (
  slug: string,
  rasterExtension: 'jpg' | 'png',
  withVectorFallback = false,
): Pick<Work, 'thumbnail' | 'thumbnailFallback'> => {
  const rasterPath = assetPath(`assets/images/works/${slug}.${rasterExtension}`)
  const vectorPath = assetPath(`assets/images/works/${slug}.svg`)

  return {
    thumbnail: rasterPath,
    thumbnailFallback: withVectorFallback ? vectorPath : rasterPath,
  }
}

/**
 * 全 17 件の作品データ。
 *
 * 参照元: Vanilla/data/works.js（読み取り専用、変更禁止）
 *
 * マッピング方針:
 * - techTags は探索 UI 用の統一フィルター軸。
 *   techStack から HTML / CSS（ベース技術）を除外して導出する。
 *   SCSS は技術選択として意味があるため残す。
 * - techStack は将来の詳細ビュー用にフルセットを保持する。
 * - 表示件数・ソートラベルなどの UI 派生情報はここに持たせない。
 *   それらは lib/works.ts の純関数で算出する。
 * - detailUrl は「モーダル概要の先にある、より深い説明ページ」への URL。
 *   Vanilla 側で公開済みの相対パスをそのまま保持する。
 *   未公開の作品は null（モーダルで概要確認のみ）。
 *   判定・サニタイズは lib/detail.ts に集約。
 */
export const works: Work[] = [
  // -------------------------------------------------------------------------
  // work-01: Lumen Clinic Renewal（既存）
  // -------------------------------------------------------------------------
  {
    id: 'work-01',
    title: 'Lumen Clinic Renewal',
    slug: 'lumen-clinic-renewal',
    ...createWorkImageSet('lumen-clinic-renewal', 'jpg', true),
    genre: '美容・クリニック',
    siteType: 'コーポレートサイト',
    purpose: 'ブランド刷新',
    summary:
      '初診予約と施術理解を両立し、信頼感と華やかさを同居させたクリニック刷新サイト。',
    pageCount: 12,
    scale: '3-4名体制',
    features: ['CMS', 'アニメーション', '予約導線', 'フォーム'],
    techTags: ['WordPress', 'GSAP', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'WordPress', 'GSAP'],
    budgetRange: '120-180万円',
    durationRange: '8-10週間',
    tags: ['余白設計', '診療導線', '編集的レイアウト'],
    year: 2025,
    isFeatured: true,
    hasCms: true,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '医療系の安心感を保ちながら、美容系らしい高揚感を削ぎすぎない見せ方に整えた。',
    designTone: 'ミニマル / クリニカル',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-02: Northwind Recruit Stories（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-02',
    title: 'Northwind Recruit Stories',
    slug: 'northwind-recruit-stories',
    ...createWorkImageSet('northwind-recruit-stories', 'jpg', true),
    genre: '採用・BtoB',
    siteType: '採用サイト',
    purpose: '採用強化',
    summary:
      '社員インタビューを軸に、候補者の不安を段階的にほぐす採用アーカイブサイト。',
    pageCount: 18,
    scale: '4-5名体制',
    features: ['CMS', 'フォーム', '記事運用', '検索UI'],
    techTags: ['WordPress', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'WordPress'],
    budgetRange: '180-250万円',
    durationRange: '10-12週間',
    tags: ['カルチャー訴求', '社員紹介', '情報設計', '記事運用'],
    year: 2024,
    isFeatured: true,
    hasCms: true,
    hasAnimation: false,
    hasForm: true,
    challenge:
      '情報量の多い採用訴求を、候補者目線で読み進めやすい順序に再構成した。',
    designTone: 'クワイエット / エディトリアル',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-03: Asteria Residence Launch（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-03',
    title: 'Asteria Residence Launch',
    slug: 'asteria-residence-launch',
    ...createWorkImageSet('asteria-residence-launch', 'jpg', true),
    genre: '不動産',
    siteType: 'ブランドサイト',
    purpose: '商品訴求',
    summary:
      '公開前の限られた情報でも期待感を高める、不動産プレローンチ用ブランドサイト。',
    pageCount: 9,
    scale: '4-6名体制',
    features: ['アニメーション', 'フォーム', 'LP最適化'],
    techTags: ['GSAP', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'GSAP'],
    budgetRange: '250-400万円',
    durationRange: '12-14週間',
    tags: ['スクロール演出', '高級感', 'シネマティック'],
    year: 2025,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '情報が少ない段階でも、映像的な体験で価値期待を先に設計できる構成へ整えた。',
    designTone: 'ラグジュアリー / シネマティック',
    detailUrl: null,
    isConcept: true,
  },

  // -------------------------------------------------------------------------
  // work-04: Kuroto Tea Commerce（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-04',
    title: 'Kuroto Tea Commerce',
    slug: 'kuroto-tea-commerce',
    ...createWorkImageSet('kuroto-tea-commerce', 'jpg', true),
    genre: '食品・ライフスタイル',
    siteType: 'ECサイト',
    purpose: '売上拡大',
    summary:
      '定期購入率の改善を狙い、商品導線とブランド体験を両立したECリニューアル。',
    pageCount: 16,
    scale: '4-5名体制',
    features: ['CMS', 'フォーム', 'EC導線'],
    techTags: ['Shopify', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'Shopify'],
    budgetRange: '250-400万円',
    durationRange: '10-14週間',
    tags: ['ブランドEC', '定期購入', '商品導線'],
    year: 2023,
    isFeatured: false,
    hasCms: true,
    hasAnimation: false,
    hasForm: true,
    challenge:
      '高級感を保ちながら、購入まで迷わせない導線に全体構成を組み直した。',
    designTone: 'ウォーム / プレミアム',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-05: Solace Dental Flow（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-05',
    title: 'Solace Dental Flow',
    slug: 'solace-dental-flow',
    ...createWorkImageSet('solace-dental-flow', 'jpg', true),
    genre: '美容・クリニック',
    siteType: 'LP',
    purpose: '問い合わせ改善',
    summary:
      '症例訴求と予約導線を1ページで完結させる、短距離設計の集患LP。',
    pageCount: 1,
    scale: '2-3名体制',
    features: ['アニメーション', '予約導線', 'フォーム', 'LP最適化'],
    techTags: ['GSAP', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'GSAP'],
    budgetRange: '80-120万円',
    durationRange: '4-6週間',
    tags: ['短距離導線', '症例訴求', '予約最適化'],
    year: 2022,
    isFeatured: false,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '限られた情報量でも不安を払拭し、フォーム離脱を抑える流れに調整した。',
    designTone: 'クリーン / コンバージョン',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-06: Vireon SaaS Explorer（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-06',
    title: 'Vireon SaaS Explorer',
    slug: 'vireon-saas-explorer',
    ...createWorkImageSet('vireon-saas-explorer', 'jpg', true),
    genre: 'SaaS・BtoB',
    siteType: 'サービスサイト',
    purpose: 'リード獲得',
    summary:
      '複雑なSaaS機能を整理し、問い合わせ獲得までつなぐBtoBサービスサイト。',
    pageCount: 14,
    scale: '4-5名体制',
    features: ['CMS', 'アニメーション', 'フォーム', '検索UI'],
    techTags: ['WordPress', 'Alpine.js', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'WordPress', 'Alpine.js'],
    budgetRange: '180-250万円',
    durationRange: '9-12週間',
    tags: ['機能整理', 'BtoB導線', '比較視点'],
    year: 2025,
    isFeatured: true,
    hasCms: true,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '機能説明に寄りすぎず、導入後の運用イメージまで届く見せ方に整えた。',
    designTone: 'シャープ / プロダクト',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-07: Morii Architects Journal（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-07',
    title: 'Morii Architects Journal',
    slug: 'morii-architects-journal',
    ...createWorkImageSet('morii-architects-journal', 'jpg', true),
    genre: '建築・インテリア',
    siteType: 'コーポレートサイト',
    purpose: 'ブランド刷新',
    summary:
      '施工実績と思想を並列で読ませる、建築事務所のジャーナル型コーポレートサイト。',
    pageCount: 20,
    scale: '4-6名体制',
    features: ['CMS', '記事運用', '多言語'],
    techTags: ['WordPress', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'WordPress'],
    budgetRange: '180-250万円',
    durationRange: '12-14週間',
    tags: ['施工実績', 'ジャーナル', '建築写真'],
    year: 2024,
    isFeatured: false,
    hasCms: true,
    hasAnimation: false,
    hasForm: false,
    challenge:
      '写真の強さを保ちながら、思想や文脈も読み飛ばされない導線へ再構成した。',
    designTone: 'エディトリアル / カーム',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-08: Hoshina Bakery Seasons（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-08',
    title: 'Hoshina Bakery Seasons',
    slug: 'hoshina-bakery-seasons',
    ...createWorkImageSet('hoshina-bakery-seasons', 'jpg', true),
    genre: '食品・ライフスタイル',
    siteType: 'LP',
    purpose: 'キャンペーン訴求',
    summary:
      '季節商品の販売ピークに合わせ、写真と短い導線で熱量をつくるキャンペーンLP。',
    pageCount: 1,
    scale: '2-3名体制',
    features: ['アニメーション', 'フォーム', 'LP最適化'],
    techTags: ['SCSS'],
    techStack: ['HTML', 'SCSS'],
    budgetRange: '80-120万円',
    durationRange: '3-5週間',
    tags: ['キャンペーン', '物撮り映え', '回遊短縮'],
    year: 2024,
    isFeatured: false,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '世界観を崩さず、購入や来店予約までの距離を短く保つ必要があった。',
    designTone: 'ソフト / シーズナル',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-09: Oniwa Landscapes Collection（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-09',
    title: 'Oniwa Landscapes Collection',
    slug: 'oniwa-landscapes-collection',
    ...createWorkImageSet('oniwa-landscapes-collection', 'jpg', true),
    genre: '建築・インテリア',
    siteType: 'ブランドサイト',
    purpose: 'ブランド刷新',
    summary:
      '造園事例の余韻を保ちながら、問い合わせ導線を静かに成立させるブランドサイト。',
    pageCount: 11,
    scale: '3-5名体制',
    features: ['アニメーション', 'フォーム', '多言語'],
    techTags: ['GSAP', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'GSAP'],
    budgetRange: '250-400万円',
    durationRange: '8-11週間',
    tags: ['静けさ', '世界観訴求', '余白設計'],
    year: 2025,
    isFeatured: false,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '写真主体でも単調に見せず、相談意欲を落とさない流れに設計し直した。',
    designTone: 'クワイエット / アトモスフェリック',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-10: Riverline Logistics Recruit Portal（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-10',
    title: 'Riverline Logistics Recruit Portal',
    slug: 'riverline-logistics-recruit-portal',
    ...createWorkImageSet('riverline-logistics-recruit-portal', 'jpg', true),
    genre: '採用・BtoB',
    siteType: '採用サイト',
    purpose: '採用強化',
    summary:
      '職種理解と福利厚生を整理し、現場志向の候補者に届く採用ポータル。',
    pageCount: 15,
    scale: '3-4名体制',
    features: ['CMS', 'フォーム', '検索UI'],
    techTags: ['WordPress', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'WordPress'],
    budgetRange: '120-180万円',
    durationRange: '8-10週間',
    tags: ['職種別導線', '福利厚生整理', '採用ポータル'],
    year: 2023,
    isFeatured: false,
    hasCms: true,
    hasAnimation: false,
    hasForm: true,
    challenge:
      '知りたい実務情報を優先しつつ、会社理解も深められる順序に整理した。',
    designTone: 'ストラクチャード / ダイレクト',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-11: Sumi Skincare Global LP（既存）
  // -------------------------------------------------------------------------
  {
    id: 'work-11',
    title: 'Sumi Skincare Global LP',
    slug: 'sumi-skincare-global-lp',
    ...createWorkImageSet('sumi-skincare-global-lp', 'jpg', true),
    genre: '美容・クリニック',
    siteType: 'LP',
    purpose: '商品訴求',
    summary:
      '海外展開を見据え、世界観訴求とフォーム獲得を両立させたグローバルLP。',
    pageCount: 1,
    scale: '3-4名体制',
    features: ['アニメーション', 'フォーム', '多言語', 'LP最適化'],
    techTags: ['GSAP', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'GSAP'],
    budgetRange: '120-180万円',
    durationRange: '5-7週間',
    tags: ['グローバル訴求', '商品世界観', 'ファーストビュー'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '国内外でトーンを崩さず、短い滞在時間でも訴求が届く構成へ最適化した。',
    designTone: 'グロッシー / プレミアム',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-12: Acaia Arts Foundation Archive（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-12',
    title: 'Acaia Arts Foundation Archive',
    slug: 'acaia-arts-foundation-archive',
    ...createWorkImageSet('acaia-arts-foundation-archive', 'jpg', true),
    genre: 'カルチャー・アート',
    siteType: 'サービスサイト',
    purpose: '情報整理',
    summary:
      '展示記録と活動文脈を横断検索できる、文化財団向けのアーカイブサイト。',
    pageCount: 24,
    scale: '5-6名体制',
    features: ['CMS', '検索UI', '多言語', 'フォーム'],
    techTags: ['WordPress', 'Alpine.js', 'SCSS'],
    techStack: ['HTML', 'SCSS', 'WordPress', 'Alpine.js'],
    budgetRange: '400万円以上',
    durationRange: '14-18週間',
    tags: ['アーカイブ', 'タグ設計', '多言語'],
    year: 2024,
    isFeatured: true,
    hasCms: true,
    hasAnimation: false,
    hasForm: true,
    challenge:
      '記録性を落とさず、初見ユーザーでも回遊しやすい情報構造へ整理した。',
    designTone: 'アーカイブ / インスティテューショナル',
    detailUrl: null,
    isConcept: true,
  },

  // -------------------------------------------------------------------------
  // work-13: Aoki Beauty Clinic LP（既存）
  // -------------------------------------------------------------------------
  {
    id: 'work-13',
    title: 'Aoki Beauty Clinic LP',
    slug: 'aoki-beauty-clinic',
    ...createWorkImageSet('aoki-beauty-clinic', 'jpg'),
    genre: '美容・クリニック',
    siteType: 'LP',
    purpose: '問い合わせ改善',
    summary:
      '無料カウンセリング予約を主軸に、施術理解と安心感をひとつの導線でつなぐ美容クリニックLP。',
    pageCount: 3,
    scale: null,
    features: ['アニメーション', 'フォーム', '予約導線'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: null,
    durationRange: null,
    tags: ['美容クリニックLP', '症例ギャラリー', '予約導線', '計測設計'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '症例・料金・担当医・FAQを一枚に整理しつつ、予約CTAが途切れない流れに設計した。',
    designTone: 'クリーン / ライトラグジュアリー',
    detailUrl: './projects/aoki-beauty-clinic/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-14: Aoki Standard Co.（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-14',
    title: 'Aoki Standard Co.',
    slug: 'aoki-standard-co',
    ...createWorkImageSet('aoki-standard-co', 'jpg'),
    genre: 'ファッション・ライフスタイル',
    siteType: 'ブランドサイト',
    purpose: 'キャンペーン訴求',
    summary:
      'ポップアップ開催の熱量を動画とレイヤー演出で立ち上げ、EC遷移までを設計したファッションLP。',
    pageCount: 2,
    scale: null,
    features: ['アニメーション', 'LP最適化'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: null,
    durationRange: null,
    tags: ['ポップアップ訴求', '動画ファースト', 'EC導線', '商品ラインナップ'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: false,
    challenge:
      '冒頭の映像体験と商品訴求を分断させず、LPからEC案内ページまで離脱しにくい流れに整えた。',
    designTone: 'シネマティック / モード',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-15: Aoki Tech Studio（既存）
  // -------------------------------------------------------------------------
  {
    id: 'work-15',
    title: 'Aoki Tech Studio',
    slug: 'aoki-tech-studio',
    ...createWorkImageSet('aoki-tech-studio', 'png'),
    genre: '制作会社・BtoB',
    siteType: 'サービスサイト',
    purpose: 'リード獲得',
    summary:
      '制作からアプリ開発、AI連携までの対応範囲を整理し、実績詳細と問い合わせ導線をつないだスタジオサイト。',
    pageCount: 7,
    scale: null,
    features: ['アニメーション', 'フォーム'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: null,
    durationRange: null,
    tags: ['制作会社サイト', '実績詳細ページ', 'FAQ', 'お問い合わせ導線'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '情報量の多い開発領域を広く見せつつ、初見でも相談内容を想像しやすい順序に再構成した。',
    designTone: 'シャープ / テック',
    detailUrl: './projects/aoki-tech-studio/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-16: Cafe Aoki（新規）
  // -------------------------------------------------------------------------
  {
    id: 'work-16',
    title: 'Cafe Aoki',
    slug: 'cafe-aoki',
    ...createWorkImageSet('cafe-aoki', 'jpg'),
    genre: '食品・ライフスタイル',
    siteType: '店舗サイト',
    purpose: 'ブランド刷新',
    summary:
      '自家焙煎と静かな空間の世界観を軸に、メニュー閲覧と席予約までを自然につなぐカフェサイト。',
    pageCount: 2,
    scale: null,
    features: ['アニメーション', 'フォーム'],
    techTags: ['JavaScript', 'Formspree'],
    techStack: ['HTML', 'CSS', 'JavaScript', 'Formspree'],
    budgetRange: null,
    durationRange: null,
    tags: ['店舗サイト', 'メニューページ', '予約モーダル', '空間訴求'],
    year: 2026,
    isFeatured: false,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '写真と余白で店内の静けさを伝えながら、メニュー閲覧と予約アクションが自然につながる導線に整えた。',
    designTone: 'ダーク / クラシック',
    detailUrl: null,
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-17: Aoki Estimate Simulator（既存）
  // -------------------------------------------------------------------------
  {
    id: 'work-17',
    title: 'Aoki Estimate Simulator',
    slug: 'aoki-estimate-simulator',
    ...createWorkImageSet('aoki-estimate-simulator', 'jpg'),
    genre: '制作会社・BtoB',
    siteType: 'サービスサイト',
    purpose: '問い合わせ改善',
    summary:
      '概算見積、比較、PDF保存、URL共有を一画面で完結させ、相談前のハードルを下げる見積シミュレーター。',
    pageCount: 4,
    scale: null,
    features: ['フォーム', '多言語'],
    techTags: ['JavaScript', 'EmailJS', 'jsPDF', 'PWA'],
    techStack: ['HTML', 'CSS', 'JavaScript', 'EmailJS', 'jsPDF', 'PWA'],
    budgetRange: null,
    durationRange: null,
    tags: ['見積シミュレーター', '見積比較', 'PDF保存', '日英切替'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '費用感の可視化で終わらせず、比較保存・共有・相談フォーム連携までを切れ目なくつなぐ体験にまとめた。',
    designTone: 'ダーク / プロダクト',
    detailUrl: './projects/aoki-estimate-simulator/',
    isConcept: false,
  },
]
