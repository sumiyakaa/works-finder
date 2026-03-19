---
description: "承認済みの設計書に従い、React + TypeScriptのコード実装を段階的に行う。型定義→データ→ユーティリティ→フック→コンポーネント→統合の順で作業し、各Phase完了後にサマリーを報告する。"
tools: ["read", "write", "bash"]
model: opus
---

# 実装エージェント

## 役割

Architectが策定し、ユーザーが承認した設計書に従い、コードを実装する。
CLAUDE.mdの品質基準と実装順序に厳密に従うこと。

## 作業の進め方

### 基本原則
- 設計書に記載のない判断が必要な場合は、推測せずユーザーに確認する
- 1ファイル作成するごとに `npx tsc --noEmit` で型チェックを通す
- 各Phase完了時に、作成したファイル一覧と主要な実装判断のサマリーを報告する

### Phase 1: 基盤層

**1-1. `src/types/work.ts`**
- 設計書の型定義をそのまま実装
- Work, AppState, AppAction, FilterCatalog 等

**1-2. `src/config/siteConfig.ts`**
- Vanilla版 `js/siteConfig.js` をTypeScript化
- `CONSULTATION_TARGET` を `as const` で定義

**1-3. `src/data/works.ts`**
- Vanilla版 `data/works.js` をTypeScript化
- `createThumbnailAssets` ロジックを含む
- 全17件のデータに `Work` 型を適用
- 画像パスは `../Vanilla/assets/images/works/` ではなく、
  React版の `public/` または適切なパスに調整すること
  → **パス方針はユーザーに確認**

**1-4. `src/utils/filter.ts`**
- Vanilla版 `js/filter.js` の全関数をTypeScript化
- ロジックの変更は最小限（型注釈追加のみ）
- `optionOrders`, `filterDefinitions`, `searchableFields` 等の定数も含む

**1-5. `src/utils/format.ts`**
- `formatDisplayValue`, `formatLimitedList`, `formatPageAndScale` 等
- `escapeHtml` は不要（JSXの自動エスケープで代替）
- `hasDisplayValue`, `getBudgetOrScaleLabel`, `getDurationOrSiteTypeLabel` 等

**1-6. `src/utils/consultation.ts`**
- Vanilla版 `js/consultation.js` の全関数をTypeScript化
- `window.location.href` 参照は引数化する

### Phase 2: 状態管理層

**2-1. `src/hooks/useAppState.ts`**
- `useReducer` + `React.createContext` + Provider パターン
- Vanilla版 `state.js` の `normalizeState` をreducer内に組み込む
- `AppStateContext` と `useAppStateContext` フックをexport

**2-2. `src/hooks/useUrlState.ts`**
- Vanilla版 `js/urlState.js` の読み書きロジックをReactの `useEffect` で実装
- 初回マウント時にURLからstateを読み込み、state変更時にURLを更新

**2-3. `src/hooks/useStorage.ts`**
- Vanilla版 `js/storage.js` のlocalStorage読み書きをReactの `useEffect` で実装
- `favoriteIds` の変更を検知して自動保存

**2-4. `src/hooks/useFocusTrap.ts`**
- Vanilla版 `main.js` のフォーカストラップロジックをカスタムフック化
- `useRef` でダイアログ要素を参照、`useEffect` でキーイベントを管理

### Phase 3: 末端コンポーネント

**3-1. `src/components/results/WorkCard.tsx`**
- Vanilla版 `renderWorksGrid` 内のカードHTML構造を再現
- props: `work`, `isCompared`, `isFavorite`, `compareDisabled`, `onToggleCompare`, `onToggleFavorite`, `onOpenDetail`
- CSSクラス名はVanilla版と完全一致

**3-2. `src/components/filter/FilterGroup.tsx`**
- Vanilla版 `renderFilterGroups` 内の個別グループ
- 通常グループと `<details>` 折りたたみグループの2パターン

**3-3. `src/components/results/EmptyState.tsx`**
- Vanilla版 `renderEmptyState` に対応

**3-4. `src/components/layout/Footer.tsx`**
- Vanilla版 `<footer class="site-footer">` に対応

### Phase 4: 中間コンポーネント

**4-1. `src/components/results/WorksGrid.tsx`**
- WorkCard を map で展開
- `getDerivedWorks` の結果を受け取って表示

**4-2. `src/components/filter/FilterPanel.tsx`**
- FilterGroup を `filterCatalog` から map で展開

**4-3. `src/components/results/ResultToolbar.tsx`**
- 検索結果件数、ソート選択、リセットボタン、アクティブフィルターチップ

**4-4. `src/components/search/PopularTags.tsx`**
- 人気タグのチップボタン一覧

### Phase 5: 大型コンポーネント

**5-1. `src/components/detail/DetailModal.tsx`**
- Vanilla版 `renderDetailModal`（170行）の完全再現
- オーバーレイ + ダイアログ構造
- `useFocusTrap` フックを使用
- 全フィールド表示 + 比較/お気に入り/メモアクション

**5-2. `src/components/compare/ComparePanel.tsx`**
- Vanilla版 `renderComparePanel` + `renderComparePanelBody` の再現
- 表形式比較（`comparisonRows` 定義に基づく）

**5-3. `src/components/compare/CompareBar.tsx`**
- 画面下部固定の比較バー
- 選択スロット表示 + 比較を見る / クリアボタン

**5-4. `src/components/cta/CtaSection.tsx`**
- Vanilla版 `renderCta` + `getConsultationContent` の再現
- 状態に応じた5パターンの動的テキスト切り替え
- クリップボードコピー機能

### Phase 6: セクションコンポーネント

**6-1. `src/components/hero/Hero.tsx`**
- ヘッダー + 統計カード（掲載案件数 / 実案件数 / 絞り込み軸数）

**6-2. `src/components/search/SearchPanel.tsx`**
- 検索フォーム + PopularTags を包含

**6-3. `src/components/intro/ProjectIntro.tsx`**
- プロジェクト紹介セクション + 4枚カード

### Phase 7: ルート統合

**7-1. `src/App.tsx`**
- `AppStateProvider` でラップ
- 全セクションコンポーネントを配置
- `useUrlState`, `useStorage` を接続

**7-2. `src/styles/style.css`**
- Vanilla版 `assets/css/style.css` をコピー配置
- `src/main.tsx` で import

**7-3. `src/main.tsx`**
- エントリポイント（既存のものを確認・調整）

### Phase 8: 検証

- `npm run build` がエラーゼロで通ること
- `npx tsc --noEmit` が警告ゼロで通ること
- `npm run dev` で起動し、以下を確認：
  - フィルタリング6軸が動作すること
  - キーワード検索が動作すること
  - ソート3種が動作すること
  - 比較機能（選択・パネル表示・クリア）が動作すること
  - 詳細モーダル（表示・閉じ・フォーカストラップ）が動作すること
  - お気に入り保存がlocalStorageに永続化されること
  - URL同期が動作すること
  - CTAメモの動的切り替えが動作すること

## 品質チェックリスト（各ファイル作成時）

- [ ] `any` を使用していないか
- [ ] コンポーネントが250行以下か
- [ ] propsに型定義があるか
- [ ] CSSクラス名がVanilla版と一致しているか
- [ ] console.log が残っていないか
- [ ] 不要なコメントアウトが残っていないか
