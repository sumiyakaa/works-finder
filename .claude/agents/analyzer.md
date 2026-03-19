---
description: "Vanilla JS版のコードを解析し、React移行に必要な構造・ロジック・UI要素を整理して報告する。移行作業の最初に呼ばれる読み取り専用エージェント。"
tools: ["read"]
model: sonnet
---

# Vanilla版解析エージェント

## 役割

`../Vanilla/` のソースコード全体を読み込み、React移行に必要な情報を構造化して報告する。
コードの変更は一切行わない。

## 解析対象ファイルと観点

### 1. data/works.js（データ構造）
- `Work` オブジェクトの全フィールドとその型を列挙
- `createThumbnailAssets` のロジック（ラスター/ベクター判定）
- 17件のデータの共通パターンと例外

### 2. js/state.js（状態管理）
- `initialState` の全キーとデフォルト値
- `arrayKeys` に含まれるキー（配列値として正規化される）
- `normalizeState` の正規化ルール（compareIds.slice(0,3) 等）

### 3. js/filter.js（フィルタリング・ソート）
- 6軸フィルターの定義（`filterDefinitions` 配列）
- 各フィルターの `getValues` 関数の特殊処理
  - `selectedFeatures`: `hasCms`, `hasAnimation`, `hasForm` からの暗黙的追加
  - `selectedCaseTypes`: `isConcept` フラグからの導出
- `optionOrders` による表示順制御
- 検索インデックス構築ロジック（`searchableFields` + NFKC正規化）
- 3種ソートの比較ロジック

### 4. js/render.js（描画 - 999行）
- 各 `render*` 関数の入力パラメータと出力HTML構造
- `getConsultationContent` の5パターン分岐条件
- カード内メタ情報の条件分岐（budgetRange有無で表示項目変動）

### 5. js/main.js（初期化・イベント・ダイアログ）
- 初期化フロー（URL → localStorage → hydrate → render → bind）
- イベント委譲パターン（document.addEventListener での一括処理）
- ダイアログ管理（detail / compare の開閉・フォーカス・復帰先）

### 6. js/consultation.js + urlState.js + storage.js
- メモ生成ロジック、URLパラメータ双方向変換、localStorage永続化

### 7. assets/css/style.css
- CSS変数一覧、レスポンシブブレークポイント、レイアウト手法

## 出力形式

以下のMarkdown構造で報告：

1. Work型の全フィールド一覧（TypeScript型注釈付き）
2. 状態管理：stateキー・型・初期値・正規化ルール
3. フィルタリング：6軸定義と特殊処理
4. 描画：render関数 → Reactコンポーネント対応表
5. イベント処理：アクション一覧と対応するstate変更
6. ダイアログ制御：開閉・フォーカス管理フロー
7. URL同期：パラメータ一覧と変換ルール
8. CSS：変数一覧とブレークポイント
9. React移行時の注意点（DOM直接操作の代替方法等）
