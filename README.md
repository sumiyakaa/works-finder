# Aoki Design Studio Works Finder / React Scaffold

`works-finder-react` は、Aoki Design Studio Works Finder を React + TypeScript で再構築するための初期土台です。

このフォルダは `Vanilla` を完成版の参照元として扱い、React 側だけで独立開発できるように必要素材をコピーして構成しています。`Vanilla` は編集対象ではありません。

## Commands

```bash
npm install
npm run dev
npm run build
```

## Current Scope

- Vite + React + TypeScript の初期化
- `public/` への作品サムネイル / meta アイコンのコピー
- `src/types/work.ts` と `src/data/works.ts` による型付きデータ土台
- `src/components/` と `src/lib/` による最小 UI 骨組み
- 一覧レンダリングまでの初期表示

## Directory Guide

```text
public/
  assets/images/
    meta/            # Vanilla からコピーした favicon / og / icon 類
    works/           # 一覧カードで使う作品サムネイル
  site.webmanifest

src/
  components/
    layout/          # シェル・ヘッダー・フッター
    sections/        # ページセクション単位
    works/           # 作品カードと一覧表示
  data/              # 移設済みの作品シードデータ
  lib/               # 派生データ・一覧整形・集計
  types/             # 共通型
```

## Next Migration Targets

- 検索 / フィルター UI
- URL 状態同期
- 比較導線
- 詳細ページルーティング
- localStorage を使う状態保持
