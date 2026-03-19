# Works Finder React — プロジェクト指示書

## プロジェクト概要

Vanilla JS版の制作実績検索・比較アーカイブUI「Aoki Design Studio Works Finder」を
React + TypeScript（Vite）で再構築するプロジェクト。

- Vanilla版ソース: `../Vanilla/`
- React版ソース: 本ディレクトリ（`works-finder-react/`）
- Vanilla版の見た目・計算結果・操作感を正確に再現すること

## 絶対ルール

- 外部への送信・ファイルアップロードは、明示的な許可なく行わないこと
- 推測で進めず、設計判断に迷う箇所は必ずユーザーに確認を取ること
- 各作業ステップ完了後、変更内容のサマリーを報告すること
- 本プロジェクトは作業途中の状態である。実装済みのファイル・コンポーネントが既に存在する場合、
  それらを尊重し、不足部分の追加・未完成部分の修正のみ行うこと。
  既に正常に動作している部分を書き換えないこと。
  実装に着手する前に、まず既存の src/ 配下を確認し、何が完了済みで何が未実装かを把握すること。

## Vanilla版の構造マップ（移行時の参照用）

### ファイル → React対応表

| Vanilla ファイル | 行数 | 役割 | React での対応先 |
|---|---|---|---|
| `data/works.js` | 506行 | 17件の制作実績データ + サムネイル生成 | `src/data/works.ts`（型付きデータ） |
| `js/state.js` | 144行 | subscribe/update型の状態管理 | `src/hooks/useAppState.ts`（useReducer） |
| `js/filter.js` | 369行 | 6軸ファセット検索 + ソート + 検索 | `src/utils/filter.ts`（純粋関数として移植） |
| `js/render.js` | 999行 | 全UIの描画（カード・モーダル・比較等） | 複数コンポーネントに分割（後述） |
| `js/main.js` | 654行 | 初期化 + イベントバインド + ダイアログ制御 | `src/App.tsx` + 各コンポーネント内 |
| `js/consultation.js` | 181行 | 閲覧メモ生成 + URL構築 | `src/utils/consultation.ts` |
| `js/urlState.js` | 142行 | URL ↔ state 同期 | `src/hooks/useUrlState.ts` |
| `js/storage.js` | 49行 | localStorage お気に入り保存 | `src/hooks/useStorage.ts` |
| `js/siteConfig.js` | 16行 | 設定定数 | `src/config/siteConfig.ts` |
| `assets/css/style.css` | 2870行 | 全スタイル | `src/styles/` 配下に配置 |

### render.js（999行）→ コンポーネント分割方針

render.js はVanilla版最大のファイルであり、以下の描画関数群で構成される。
これらを1対1でReactコンポーネントに対応させること。

| render.js の関数群 | React コンポーネント |
|---|---|
| `renderPopularTags` | `src/components/search/PopularTags.tsx` |
| `renderFilterGroups` + `renderFilterOptions` | `src/components/filter/FilterPanel.tsx` + `FilterGroup.tsx` |
| `renderToolbar` | `src/components/results/ResultToolbar.tsx` |
| `renderEmptyState` | `src/components/results/EmptyState.tsx` |
| `renderWorksGrid`（カード描画含む） | `src/components/results/WorksGrid.tsx` + `WorkCard.tsx` |
| `renderCompareBar` + `renderCompareSlots` | `src/components/compare/CompareBar.tsx` |
| `renderComparePanel` + `renderComparePanelBody` | `src/components/compare/ComparePanel.tsx` |
| `renderDetailModal` | `src/components/detail/DetailModal.tsx` |
| `renderCta` + `getConsultationContent` | `src/components/cta/CtaSection.tsx` |
| ヘルパー関数群（`escapeHtml`等） | `src/utils/format.ts`（React では JSX が自動エスケープするため `escapeHtml` は不要） |

### state.js → React状態管理の対応

Vanilla版の `state.js` は subscribe/update パターンの自作ストア。
React移行では `useReducer` + `Context` で以下のように対応する。

```typescript
// src/types/work.ts に定義

interface AppState {
  searchQuery: string;
  selectedGenres: string[];
  selectedCaseTypes: string[];
  selectedSiteTypes: string[];
  selectedPurposes: string[];
  selectedFeatures: string[];
  selectedBudgetRanges: string[];
  sortOrder: 'recommended' | 'newest' | 'budget-asc';
  compareIds: string[];       // max 3
  favoriteIds: string[];
  isComparePanelOpen: boolean;
  activeWorkId: string | null;
  isDetailModalOpen: boolean;
}
```

- `updateState(patch)` → `dispatch({ type: 'UPDATE', payload: patch })`
- `toggleArrayValue(key, value)` → `dispatch({ type: 'TOGGLE_ARRAY', key, value })`
- `resetFilterState()` → `dispatch({ type: 'RESET_FILTERS' })`
- `subscribe(listener)` は不要（Reactの再レンダリングで代替）

### filter.js → 純粋関数として移植

`filter.js` は副作用がなく、全て純粋関数。
**ロジックの書き換えは最小限にし、TypeScript型を付与するだけに留めること。**

以下の関数はそのまま移植する：
- `matchesSearchQuery(work, searchQuery)`
- `matchesSelectedValues(selectedValues, workValues)`
- `matchesAllFilters(work, state)`
- `sortWorks(works, sortOrder)`
- `getDerivedWorks(works, state)`
- `getFilterCatalog(works)`
- `getPopularTags(works, limit)`
- `getActiveFilterChips(state)`

### ダイアログ制御（main.js 170-308行）

Vanilla版はフォーカストラップ・復帰先管理を手動実装している。
React版では以下の方針で対応：
- `role="dialog"` + `aria-modal="true"` を使用
- フォーカストラップは `useFocusTrap` カスタムフックで自前実装（ライブラリ不使用）
- Escape キーでの閉じ動作を各モーダルコンポーネント内で処理
- `focusReturnTargets` の仕組みは `useRef` で再現

## React側の目標ディレクトリ構成

```
src/
├── App.tsx
├── main.tsx
├── types/
│   └── work.ts                      # Work型 + AppState型 + Action型
├── config/
│   └── siteConfig.ts                # CONSULTATION_TARGET等
├── data/
│   └── works.ts                     # 制作実績データ（型付き）
├── hooks/
│   ├── useAppState.ts               # useReducer + Context
│   ├── useUrlState.ts               # URL同期
│   ├── useStorage.ts                # localStorage
│   └── useFocusTrap.ts              # フォーカストラップ
├── utils/
│   ├── filter.ts                    # フィルタリング純粋関数
│   ├── consultation.ts              # メモ生成
│   └── format.ts                    # 表示整形ヘルパー
├── components/
│   ├── hero/Hero.tsx
│   ├── search/SearchPanel.tsx
│   ├── search/PopularTags.tsx
│   ├── intro/ProjectIntro.tsx
│   ├── filter/FilterPanel.tsx
│   ├── filter/FilterGroup.tsx
│   ├── results/ResultToolbar.tsx
│   ├── results/WorksGrid.tsx
│   ├── results/WorkCard.tsx
│   ├── results/EmptyState.tsx
│   ├── compare/CompareBar.tsx
│   ├── compare/ComparePanel.tsx
│   ├── detail/DetailModal.tsx
│   ├── cta/CtaSection.tsx
│   └── layout/Footer.tsx
└── styles/
    └── style.css                    # Vanilla版CSSをコピー配置
```

## 品質基準

### コンポーネント設計
- 1コンポーネント1責務。250行を超えたら分割を検討
- propsは型定義で明示。5個を超える場合はオブジェクトにまとめる
- ビジネスロジックはカスタムフックまたはutils/に分離

### 命名規則
- コンポーネント: PascalCase（例: `WorkCard.tsx`）
- フック: use接頭辞（例: `useAppState.ts`）
- ユーティリティ: camelCase（例: `filter.ts`）
- 型定義: PascalCase（例: `Work`, `AppState`）

### CSS方針
- Vanilla版の `style.css`（2870行）を `src/styles/style.css` にコピーして使用
- CSSクラス名はVanilla版と完全一致させること（React用にリネームしない）
- JSX内ではVanilla版と同じclass名を `className` で指定する
- 追加CSSが必要な場合のみ、別ファイルで追記
- case-study.css は個別プロジェクトページ用のため、今回の移行対象外

### TypeScript
- `any` の使用は禁止
- 全てのprops・state・関数引数に型を付与
- `Work` 型は `data/works.js` の実データ構造から正確に導出

### 動作一致の検証項目
1. 6軸フィルタリング（案件区分・ジャンル・制作目的・サイト種別・実装特徴・予算帯）
2. キーワード検索（NFKC正規化 + スペース分割のAND検索）
3. 3種ソート（おすすめ順・新着順・予算帯順）
4. 比較機能（最大3件選択 → 比較パネルで表形式比較）
5. 詳細モーダル（全フィールド表示 + アクションボタン群）
6. お気に入り保存（localStorage永続化）
7. URL状態同期（検索条件・比較対象・詳細表示をURLパラメータに反映）
8. CTA閲覧メモ（状態に応じた動的テキスト生成 + クリップボードコピー）
9. 人気タグ（出現頻度上位8件）
10. アクティブフィルターチップ（条件表示 + 個別解除）
11. レスポンシブ対応（Vanilla版と同等）
12. フォーカストラップ（モーダル内Tab/Shift+Tab循環 + Escape閉じ）
13. サムネイルフォールバック（ラスター → SVGベクター）

## 実装順序（依存関係を考慮した必須順序）

Phase 1: 基盤層（型・設定・データ・ユーティリティ）
Phase 2: 状態管理層（hooks）
Phase 3: 末端コンポーネント（WorkCard, FilterGroup, EmptyState, Footer）
Phase 4: 中間コンポーネント（WorksGrid, FilterPanel, ResultToolbar, PopularTags）
Phase 5: 大型コンポーネント（DetailModal, ComparePanel, CompareBar, CtaSection）
Phase 6: セクションコンポーネント（Hero, SearchPanel, ProjectIntro）
Phase 7: ルート統合（App.tsx）+ CSS配置
Phase 8: ビルド検証 + 動作一致テスト
