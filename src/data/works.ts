import type { Work } from '../types/work'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

const createWorkImageSet = (
  slug: string,
  rasterExtension: 'jpg' | 'png',
  withVectorFallback = false,
  hasFullPage = false,
): Pick<Work, 'thumbnail' | 'thumbnailFallback' | 'fullPageScreenshot'> => {
  const rasterPath = assetPath(`assets/images/works/${slug}.${rasterExtension}`)
  const vectorPath = assetPath(`assets/images/works/${slug}.svg`)

  return {
    thumbnail: rasterPath,
    thumbnailFallback: withVectorFallback ? vectorPath : rasterPath,
    fullPageScreenshot: hasFullPage
      ? assetPath(`assets/images/works/${slug}-full.jpg`)
      : null,
  }
}

/**
 * 全 9 件の作品データ（すべて実制作）。
 *
 * マッピング方針:
 * - techTags は探索 UI 用の統一フィルター軸。
 *   techStack から HTML / CSS（ベース技術）を除外して導出する。
 *   SCSS は技術選択として意味があるため残す。
 * - techStack は将来の詳細ビュー用にフルセットを保持する。
 * - 表示件数・ソートラベルなどの UI 派生情報はここに持たせない。
 *   それらは lib/works.ts の純関数で算出する。
 * - detailUrl は「モーダル概要の先にある、より深い説明ページ」への URL。
 *   未公開の作品は null（モーダルで概要確認のみ）。
 *   判定・サニタイズは lib/detail.ts に集約。
 */
export const works: Work[] = [
  // -------------------------------------------------------------------------
  // work-01: Aoki Beauty Clinic LP
  // -------------------------------------------------------------------------
  {
    id: 'work-01',
    title: 'Aoki Beauty Clinic LP',
    slug: 'aoki-beauty-clinic',
    ...createWorkImageSet('aoki-beauty-clinic', 'jpg', false, true),
    genre: '美容・クリニック',
    siteType: 'LP',
    purpose: 'リード獲得',
    summary:
      '無料カウンセリング予約を主軸に、施術メニュー・症例写真・料金表・医師紹介を1ページに集約し、電話とWebの2経路で予約へつなぐ美容クリニックLP。',
    pageCount: 3,
    scale: null,
    features: ['アニメーション', 'フォーム', '予約導線', '計測連携'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥200,000〜300,000',
    durationRange: null,
    tags: ['美容クリニックLP', '症例ギャラリー', '予約導線', '計測設計'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '施術メニュー・症例・料金・FAQを1ページに整理しつつ、電話予約とWeb予約の2導線を両立させた。',
    designTone: 'クリーン / ライトラグジュアリー',
    detailUrl: './projects/aoki-beauty-clinic/',
    siteUrl: 'https://okiaoki.github.io/Aoki-BeautyClinic/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-02: Aoki Standard Co.
  // -------------------------------------------------------------------------
  {
    id: 'work-02',
    title: 'Aoki Standard Co.',
    slug: 'aoki-standard-co',
    ...createWorkImageSet('aoki-standard-co', 'jpg', false, true),
    genre: 'ファッション・ライフスタイル',
    siteType: 'LP',
    purpose: 'キャンペーン訴求',
    summary:
      'SVGテキストリングの回転アニメーションによるオープニング演出、3レイヤーのパララックス画像で高級感と限定感を訴求し、商品ラインナップからEC遷移までを設計したポップアップストア告知LP。',
    pageCount: 2,
    scale: null,
    features: ['アニメーション', 'EC導線'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥150,000〜200,000',
    durationRange: null,
    tags: ['イベントLP', 'SVGアニメーション', 'パララックス', 'EC導線', '商品ラインナップ'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: false,
    challenge:
      '冒頭のSVG回転演出と多層レイヤーの画像リビールをバニラJSで実装し、ECページまで離脱しにくい流れに整えた。',
    designTone: 'シネマティック / ラグジュアリー',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/lp-aoki-standard/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-03: Aoki Tech Studio
  // -------------------------------------------------------------------------
  {
    id: 'work-03',
    title: 'Aoki Tech Studio',
    slug: 'aoki-tech-studio',
    ...createWorkImageSet('aoki-tech-studio', 'jpg', false, true),
    genre: '制作会社・BtoB',
    siteType: 'コーポレートサイト',
    purpose: 'リード獲得',
    summary:
      '実績数・スタック数のカウントアップ演出やスクロールアニメーションで技術力を伝え、3件のケーススタディと問い合わせ導線をつないだWeb制作スタジオサイト。',
    pageCount: 6,
    scale: null,
    features: ['アニメーション', 'フォーム', 'ケーススタディ'],
    techTags: ['JavaScript', 'Formspree'],
    techStack: ['HTML', 'CSS', 'JavaScript', 'Formspree'],
    budgetRange: '¥350,000〜500,000',
    durationRange: null,
    tags: ['制作会社サイト', 'ケーススタディ', 'カウントアップ演出', 'お問い合わせ導線'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '制作・EC・Webアプリの3領域を個別のケーススタディで掘り下げつつ、初見でも相談内容を想像しやすい構成に整えた。',
    designTone: 'シャープ / テック',
    detailUrl: './projects/aoki-tech-studio/',
    siteUrl: 'https://okiaoki.github.io/Aoki-Tech-Studio/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-04: Cafe Aoki
  // -------------------------------------------------------------------------
  {
    id: 'work-04',
    title: 'Cafe Aoki',
    slug: 'cafe-aoki',
    ...createWorkImageSet('cafe-aoki', 'jpg', false, true),
    genre: 'カフェ・飲食',
    siteType: '店舗サイト',
    purpose: '集客・予約促進',
    summary:
      'パララックス背景やスチームアニメーションで空間の空気感まで再現し、メニューページとFlatpickr予約フォームで来店導線を確保した自家焙煎カフェサイト。',
    pageCount: 2,
    scale: null,
    features: ['アニメーション', 'フォーム', '予約導線', 'SNS連携', 'Google Maps'],
    techTags: ['JavaScript', 'Formspree', 'Flatpickr'],
    techStack: ['HTML', 'CSS', 'JavaScript', 'Formspree', 'Flatpickr'],
    budgetRange: '¥150,000〜200,000',
    durationRange: null,
    tags: ['店舗サイト', 'メニューページ', '予約フォーム', 'パララックス', 'SNSギャラリー'],
    year: 2026,
    isFeatured: false,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      'ダークトーンとゴールドのアクセントで静かな店内の雰囲気を伝えながら、メニュー閲覧・予約・SNS連携を自然につないだ。',
    designTone: 'ダーク / クラシック',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/cafe-aoki/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-05: Aoki Mitumori
  // -------------------------------------------------------------------------
  {
    id: 'work-05',
    title: 'Aoki Mitumori',
    slug: 'aoki-mitumori',
    ...createWorkImageSet('aoki-mitumori', 'jpg', false, true),
    genre: '制作会社・BtoB',
    siteType: 'Webツール',
    purpose: 'リード獲得',
    summary:
      'サイト種別・ページ数・機能を選ぶと即座に概算を算出し、比較保存・PDF出力・メール送信・日英切替まで一画面で完結させるWeb制作見積シミュレーター。',
    pageCount: 4,
    scale: null,
    features: ['フォーム', '多言語', 'PDF出力', 'メール送信'],
    techTags: ['JavaScript', 'EmailJS', 'jsPDF', 'PWA'],
    techStack: ['HTML', 'CSS', 'JavaScript', 'EmailJS', 'jsPDF', 'PWA'],
    budgetRange: '¥800,000〜1,200,000',
    durationRange: null,
    tags: ['見積シミュレーター', '見積比較', 'PDF出力', '日英切替'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '費用感の可視化で終わらせず、比較保存・共有・相談フォーム連携までを切れ目なくつなぐ体験にまとめた。',
    designTone: 'ダーク / プロダクト',
    detailUrl: './projects/aoki-estimate-simulator/',
    siteUrl: 'https://okiaoki.github.io/Aoki-Mitumori/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-06: Aoki Lotion LP
  // -------------------------------------------------------------------------
  {
    id: 'work-06',
    title: 'Aoki Lotion LP',
    slug: 'aoki-lotion-lp',
    ...createWorkImageSet('aoki-lotion-lp', 'jpg', false, true),
    genre: '美容・コスメ',
    siteType: 'LP',
    purpose: '商品販売',
    summary:
      '信頼バッジ・FAQ・3段階のCTAブロックで購買心理を段階的に後押しし、多ステップ購入フォームで商品理解から購入完了まで1ページで完結させるスキンケア販売LP。',
    pageCount: 1,
    scale: null,
    features: ['アニメーション', 'フォーム', 'LP最適化', 'EC導線'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥150,000〜300,000',
    durationRange: null,
    tags: ['販売LP', '購入フォーム', 'CTA設計', '購買導線', 'フローティングCTA'],
    year: 2026,
    isFeatured: false,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '12枚の商品ビジュアルと複数CTAを配置しつつ押し売り感を抑え、モバイルではフローティングCTAがフォーム到達時に自動非表示になる導線を設計した。',
    designTone: 'プレミアム / コンバージョン',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/aoki-lotion-lp/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-07: AokiCosmetic
  // -------------------------------------------------------------------------
  {
    id: 'work-07',
    title: 'AokiCosmetic',
    slug: 'aoki-cosmetic',
    ...createWorkImageSet('aoki-cosmetic', 'jpg'),
    genre: '美容・コスメ',
    siteType: 'ブランドサイト',
    purpose: 'ブランド訴求・販路開拓',
    summary:
      'サロン向けコスメ3ライン（スキンケア・メイク・ヘアケア）を紹介し、導入実績・お客様の声・3段階の料金プランでサロンパートナー獲得へつなぐ美容ブランドサイト。WordPressテーマとしても設計。',
    pageCount: 2,
    scale: null,
    features: ['フォーム', 'CMS', '料金プラン'],
    techTags: ['JavaScript', 'WordPress', 'ACF'],
    techStack: ['HTML', 'CSS', 'JavaScript', 'WordPress', 'ACF', 'PHP'],
    budgetRange: '¥300,000〜450,000',
    durationRange: null,
    tags: ['ブランドサイト', 'WordPressテーマ', 'カスタム投稿タイプ', '料金プラン', 'ACF'],
    year: 2026,
    isFeatured: false,
    hasCms: true,
    hasAnimation: false,
    hasForm: true,
    challenge:
      '高級感あるビジュアルとサロン向けB2B情報（料金プラン・導入実績）を両立し、WordPressテーマとして管理画面からの更新にも対応した。',
    designTone: 'ラグジュアリー / エレガント',
    detailUrl: null,
    siteUrl: 'https://github.com/Okiaoki/aokicosmetic-wp',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-08: Aoki Family English
  // -------------------------------------------------------------------------
  {
    id: 'work-08',
    title: 'Aoki Family English',
    slug: 'aoki-family-english',
    ...createWorkImageSet('aoki-family-english', 'jpg', false, true),
    genre: '教育・スクール',
    siteType: 'LP',
    purpose: '集客・体験予約',
    summary:
      '経堂の家族向け英会話教室LP。キッズ・ママ・パパの3プラン紹介、講師プロフィール、料金表、無料体験予約フォームを1ページに集約し、家族で通える安心感と体験申込への導線を設計。',
    pageCount: 1,
    scale: null,
    features: ['アニメーション', 'フォーム', '予約導線', 'プラン紹介'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥150,000〜230,000',
    durationRange: null,
    tags: ['英会話教室LP', '3プラン紹介', '講師紹介', '料金表', '予約フォーム', 'スクロールアニメーション'],
    year: 2026,
    isFeatured: false,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      'キッズ・ママ・パパ3プランの情報を整理しつつ、講師紹介・料金表・体験予約を自然な流れでつなぎ、家族全員が安心して申し込める導線を設計した。',
    designTone: 'ウォーム / フレンドリー',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/aoki-family-english/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-09: Aoki Animation
  // -------------------------------------------------------------------------
  {
    id: 'work-09',
    title: 'Aoki Animation',
    slug: 'aoki-animation',
    ...createWorkImageSet('aoki-animation', 'jpg', false, true),
    genre: 'アニメ・映像制作',
    siteType: 'コーポレートサイト',
    purpose: 'ポートフォリオ・採用・問い合わせ',
    summary:
      'TV・劇場アニメの制作実績5件を個別詳細ページで紹介し、サービス案内・ニュースティッカー・採用ページ・問い合わせフォームまで全12ページで構成したアニメーション制作会社サイト。',
    pageCount: 12,
    scale: null,
    features: ['アニメーション', 'フォーム', '作品詳細ページ', '採用ページ'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥500,000〜750,000',
    durationRange: null,
    tags: ['制作会社', '作品ポートフォリオ', '採用ページ', 'ニュースティッカー', 'マルチページ'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '作品5件の個別詳細・サービス案内・採用・ニュースなど12ページの情報量を整理し、ファンタジックな世界観を保ったまま企業サイトとしての実用性を両立させた。',
    designTone: 'クリエイティブ / ファンタジック',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/Aoki-Animation/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-10: Aoki Estate
  // -------------------------------------------------------------------------
  {
    id: 'work-10',
    title: 'Aoki Estate',
    slug: 'aoki-estate',
    ...createWorkImageSet('aoki-estate', 'jpg', false, true),
    genre: '不動産',
    siteType: 'コーポレートサイト',
    purpose: '物件紹介・集客・問い合わせ',
    summary:
      '杉並・中野・世田谷エリアに密着する架空の不動産会社サイト。賃貸・売買物件一覧（検索フィルタリング・並び替え対応）、物件詳細6件（ギャラリーUI・モーダル拡大・スワイプ対応）、会社概要・スタッフ紹介・オーナー向け・お客様の声・コラム・採用・お問い合わせ（バリデーション・確認ステップ）の全16ページ構成。明朝体×ゴシック体のタイポグラフィとアースカラー基調のモダンナチュラルなデザイン。',
    pageCount: 16,
    scale: null,
    features: ['アニメーション', 'フォーム', '物件検索', 'ギャラリーUI', '並び替え', 'アコーディオン'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥600,000〜900,000',
    durationRange: null,
    tags: ['不動産サイト', 'マルチページ', '物件検索UI', 'ギャラリーモーダル', 'フォームバリデーション', 'タイポグラフィ', 'アクセシビリティ'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '賃貸・売買合計6物件のデータ属性ベースのフィルタリング・並び替え、ECサイト風のギャラリーUI（矢印ナビ・スワイプ・モーダル）、3ステップフォームなど多数のVanilla JS機能を実装しつつ、全16ページのデザイン統一性とWCAG AAコントラスト準拠を両立させた。',
    designTone: 'モダンナチュラル / アースカラー',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/AokiEstate/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-11: Bistro Aoki
  // -------------------------------------------------------------------------
  {
    id: 'work-11',
    title: 'Bistro Aoki',
    slug: 'bistro-aoki',
    ...createWorkImageSet('bistro-aoki', 'jpg', false, true),
    genre: 'カフェ・飲食',
    siteType: '店舗サイト',
    purpose: '集客・予約促進',
    summary:
      '表参道の隠れ家イタリアン「Bistro Aoki」のサイト。ダークトーンの洗練されたビジュアルで店舗の世界観を表現し、コンセプト・メニュー・ギャラリー・アクセス・予約の全6ページで来店導線を設計。',
    pageCount: 6,
    scale: null,
    features: ['アニメーション', 'フォーム', '予約導線', 'ギャラリーUI', 'Google Maps'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥250,000〜400,000',
    durationRange: null,
    tags: ['レストランサイト', 'マルチページ', 'ダークUI', '料理ギャラリー', '予約フォーム', '世界観設計'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      'ダークトーンで統一した高級感のあるビジュアルと、料理写真12枚のギャラリー・予約フォームを組み合わせ、世界観を崩さずに来店導線を確保した。',
    designTone: 'ダーク / エレガント',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/BistroAoki/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-12: Aoki Gym
  // -------------------------------------------------------------------------
  {
    id: 'work-12',
    title: 'Aoki Gym',
    slug: 'aoki-gym',
    ...createWorkImageSet('aoki-gym', 'jpg', false, true),
    genre: 'フィットネス・ヘルスケア',
    siteType: 'LP',
    purpose: '集客・体験予約',
    summary:
      'パーソナルジムの集客LP。ビフォーアフター比較スライダー・3種のプログラム紹介・トレーナープロフィール・料金表・予約CTAを1ページに集約し、体験予約への導線を設計。',
    pageCount: 1,
    scale: null,
    features: ['アニメーション', 'フォーム', 'ビフォーアフター', 'CTA設計'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥150,000〜250,000',
    durationRange: null,
    tags: ['ジムLP', 'ビフォーアフター', 'プログラム紹介', 'トレーナー紹介', 'CTA設計', 'スクロールアニメーション'],
    year: 2026,
    isFeatured: false,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      'ビフォーアフター比較・プログラム詳細・料金表など情報量の多いコンテンツを1ページに集約しつつ、CTAへの自然な導線を維持した。',
    designTone: 'ダーク / パワフル',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/AokiGym/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-14: Aoki Tax Office
  // -------------------------------------------------------------------------
  {
    id: 'work-14',
    title: 'Aoki Tax Office',
    slug: 'aoki-tax-office',
    ...createWorkImageSet('aoki-tax-office', 'jpg', false, true),
    genre: '士業・専門サービス',
    siteType: 'コーポレートサイト',
    purpose: 'リード獲得',
    summary:
      '紺×白×金の王道トーンに、全幅レイアウトとマーキー演出で情報密度と格式を両立した個人税理士事務所の3ページサイト。',
    pageCount: 3,
    scale: null,
    features: ['アニメーション', 'フォーム', 'FAQ', 'パララックス', 'マーキー'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥250,000〜400,000',
    durationRange: null,
    tags: ['士業サイト', 'マルチページ', 'パララックス', 'マーキー', 'フォームUI', 'エディトリアルデザイン'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '堅実な士業の信頼感を保ちつつ、全幅レイアウト・マーキー・エディトリアル型実績表現で情報密度とデザイン差別化を両立させた。',
    designTone: 'フォーマル / エレガント',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/AokiTax/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-14: Aoki Beauty Clinic No2
  // -------------------------------------------------------------------------
  {
    id: 'work-14',
    title: 'Aoki Beauty Clinic No2',
    slug: 'aoki-beauty-clinic-no2',
    ...createWorkImageSet('aoki-beauty-clinic-no2', 'jpg', false, true),
    genre: '美容・クリニック',
    siteType: 'マルチページサイト',
    purpose: 'ブランディング・集客',
    summary:
      '美容クリニックの総合サイト。施術カテゴリ別メニュー・症例フィルタリング・医師紹介・院内ギャラリーなど全12ページを日英中3言語で展開し、WordPress移行を前提とした設計で構築。',
    pageCount: 36,
    scale: null,
    features: ['多言語対応', '症例フィルタリング', 'アニメーション', 'フォーム', '予約導線', '計測連携', '構造化データ'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥500,000〜750,000',
    durationRange: null,
    tags: ['多言語サイト（JA/EN/ZH）', 'マルチページ（36P）', '症例フィルタリング', 'WordPress移行前提', 'hreflang', 'コンバージョン設計'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '12ページ×3言語の大規模構成を、WordPress移行を見据えた保守性の高い設計で統一しつつ、症例フィルタリングや多言語SEOなど機能面も両立させた。',
    designTone: 'ダーク / ラグジュアリー',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/Aoki-BeautyClinic-No2/ja/',
    isConcept: false,
  },

  // -------------------------------------------------------------------------
  // work-15: Aoki Reform
  // -------------------------------------------------------------------------
  {
    id: 'work-15',
    title: 'Aoki Reform',
    slug: 'aoki-reform',
    ...createWorkImageSet('aoki-reform', 'jpg', false, true),
    genre: '建築・リフォーム',
    siteType: 'コーポレートサイト',
    purpose: '集客・問い合わせ',
    summary:
      '地域密着型リフォーム会社の全13ページサイト。手書き書体と自然素材カラーで温かみを演出し、リアルタイム見積シミュレーター・施工事例フィルター・ビフォーアフターフリップカード・パララックスなど多彩なJS機能を実装。',
    pageCount: 13,
    scale: null,
    features: ['アニメーション', 'フォーム', '見積シミュレーター', '施工事例フィルター', 'ビフォーアフターUI', 'パララックス', 'FAQ'],
    techTags: ['JavaScript'],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    budgetRange: '¥600,000〜900,000',
    durationRange: null,
    tags: ['リフォーム会社', 'マルチページ（13P）', '見積シミュレーター', '施工事例フィルター', 'ビフォーアフターUI', 'パララックス', 'アクセシビリティ'],
    year: 2026,
    isFeatured: true,
    hasCms: false,
    hasAnimation: true,
    hasForm: true,
    challenge:
      '手書き書体×自然素材トーンの温かみあるデザインを全13ページで統一しつつ、見積シミュレーター・施工事例フィルター・ビフォーアフターUIなど実用的なJS機能を多数実装した。',
    designTone: 'ウォーム / ナチュラル',
    detailUrl: null,
    siteUrl: 'https://okiaoki.github.io/Aoki-Reform/',
    isConcept: false,
  },
]
