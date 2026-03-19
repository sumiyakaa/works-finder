# ============================================================
# Claude Code セットアップ指示文
# ============================================================
# この内容を Claude Code の入力欄にそのままコピー＆ペーストしてください。
# 全てのMDファイルが自動で所定の場所に配置されます。
# ============================================================

以下の作業を順番に実行してください。

## 作業1: CLAUDE.md の作成

プロジェクトルート（現在のディレクトリ）に `CLAUDE.md` を作成してください。
内容は下記の通りです（```で囲まれた部分をファイルに書き出すこと）。

---

※ 注意: この指示文にはCLAUDE.mdの内容は含まれていません。
CLAUDE.mdは別ファイルとして提供済みです。
以下のコマンドでコピーしてください:

```bash
# CLAUDE.mdが既にプロジェクトルートに配置されている前提
# 配置されていない場合は、提供されたCLAUDE.mdをプロジェクトルートにコピーしてください
```

## 作業2: エージェントファイルの配置

以下のディレクトリとファイルを作成してください:

```bash
mkdir -p .claude/agents
mkdir -p .claude/commands
```

提供された以下のファイルを所定の場所にコピーしてください:
- `.claude/agents/analyzer.md`
- `.claude/agents/architect.md`
- `.claude/agents/implementer.md`
- `.claude/agents/reviewer.md`
- `.claude/commands/full-migration.md`

## 作業3: 配置確認

以下のコマンドで配置を確認してください:

```bash
echo "=== CLAUDE.md ==="
test -f CLAUDE.md && echo "✅ 存在" || echo "❌ 不足"

echo "=== エージェント ==="
for f in analyzer architect implementer reviewer; do
  test -f .claude/agents/$f.md && echo "✅ $f.md" || echo "❌ $f.md 不足"
done

echo "=== コマンド ==="
test -f .claude/commands/full-migration.md && echo "✅ full-migration.md" || echo "❌ 不足"
```

全て ✅ であることを確認したら、以下を報告してください:
「セットアップ完了しました。`/full-migration` で移行を開始できます。」

## 作業4: アセット準備

Vanilla版の画像アセットをReact版で使用するため、以下を実行:

```bash
# publicディレクトリにVanilla版の画像をコピー（シンボリックリンクでも可）
mkdir -p public/assets/images
cp -r ../Vanilla/assets/images/* public/assets/images/
```

コピー完了後、画像ファイル数を報告してください。

---

上記の作業1〜4を順番に実行し、完了報告をお願いします。
