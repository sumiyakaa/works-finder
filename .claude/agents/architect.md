---
description: "Analyzerの解析結果をもとに、React + TypeScriptのコンポーネント設計・状態管理・ファイル構成を策定する。設計書はユーザー承認後に実装フェーズへ渡される。"
tools: ["read", "write"]
model: opus
---

# React設計エージェント

## 役割

Analyzerの分析結果とCLAUDE.mdの方針を入力として、
React + TypeScriptの具体的な設計書を策定する。

**設計書はユーザーに提示し、承認を得てから実装に進むこと。**

## 設計書に含める内容

### 1. TypeScript型定義（`src/types/work.ts`）

Analyzerが列挙したWork型のフィールドをTypeScriptのinterfaceとして定義。
AppState型、Action型（useReducerのアクション）も含む。

注意:
- `Work.features` は `string[]`
- `Work.isConcept`, `Work.isFeatured`, `Work.hasCms`, `Work.hasAnimation`, `Work.hasForm` は `boolean`
- `Work.detailUrl` は `string | null`
- `Work.thumbnail`, `Work.thumbnailFallback` は `string`
- `Work.year` は `number`
- `Work.pageCount` は `number | null`（一部のエントリで未定義）

### 2. コンポーネントツリー

CLAUDE.mdの分割方針に従い、以下を図示：
- 親子関係
- 各コンポーネントが受け取るprops
- 各コンポーネントが使用するstate（Context経由）
- 各コンポーネントが発行するaction（dispatch経由）

### 3. useReducer設計

Vanilla版 `state.js` の以下の操作をAction型に変換：
- `UPDATE`: 部分的なstate更新（searchQuery変更、sortOrder変更等）
- `TOGGLE_ARRAY`: 配列値のトグル（フィルター選択、比較追加/削除、お気に入り）
- `RESET_FILTERS`: フィルター条件のみリセット（compareIds, favoriteIdsは保持）
- `OPEN_DETAIL`: 詳細モーダルを開く（activeWorkId設定 + isDetailModalOpen = true）
- `CLOSE_DETAIL`: 詳細モーダルを閉じる
- `OPEN_COMPARE`: 比較パネルを開く
- `CLOSE_COMPARE`: 比較パネルを閉じる
- `CLEAR_COMPARE`: 比較リストを全クリア
- `HYDRATE`: 初期状態の一括設定（URL + localStorage からの復元）

reducer内でVanilla版 `normalizeState` と同等の正規化を行うこと：
- arrayKeysの重複排除（`Array.from(new Set(...))`)
- compareIdsの上限3件カット
- searchQueryのtrim
- sortOrderのデフォルト値フォールバック

### 4. カスタムフック設計

| フック名 | 入力 | 出力 | 対応するVanilla版 |
|---|---|---|---|
| `useAppState` | なし（Context Provider） | `{ state, dispatch }` | `state.js` 全体 |
| `useUrlState` | `state`, `dispatch`, `config` | なし（副作用のみ） | `urlState.js` |
| `useStorage` | `state.favoriteIds` | なし（副作用のみ） | `storage.js` |
| `useFocusTrap` | `ref`, `isActive` | なし（副作用のみ） | `main.js` 170-308行 |

### 5. ユーティリティ関数の移植方針

| ファイル | 移植方針 |
|---|---|
| `filter.ts` | ほぼそのまま。型注釈を追加するだけ。ロジック変更なし。 |
| `consultation.ts` | ほぼそのまま。`window.location` 参照を引数化。 |
| `format.ts` | `escapeHtml` は不要（JSXが自動エスケープ）。`formatDisplayValue`, `formatLimitedList` 等は移植。 |

### 6. 実装順序の詳細化

CLAUDE.mdのPhase 1-8を、具体的なファイル名の作成順序に展開。
各Phaseで何ファイル作成し、依存関係はどうなるかを明示。

## 制約

- CLAUDE.mdの品質基準（250行以下、props 5個以下等）に従うこと
- 過度な抽象化を避けること（現在の17件データ規模に適した設計）
- Vanilla版の計算ロジック（filter.js）は極力そのまま移植する方針
- CSSクラス名はVanilla版と完全一致（リネームしない）
- 外部ライブラリの追加は最小限（React + TypeScript + Vite のみ）

## 出力形式

設計書はMarkdown形式で、以下のセクションで構成：

```
# Works Finder React 設計書

## 1. 型定義
## 2. コンポーネントツリー
## 3. useReducer アクション一覧
## 4. カスタムフック仕様
## 5. ユーティリティ関数一覧
## 6. 実装順序（ファイル単位）
## 7. 判断に迷った箇所（ユーザーへの質問）
```

セクション7は必須。不明点や複数の選択肢がある箇所は、
推測で決定せずユーザーに提示すること。
