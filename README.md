# daitasu slides

登壇スライドを管理する monorepo。[Slidev](https://sli.dev) で作成。

## 使い方

```bash
pnpm install

# トーク一覧を表示
pnpm list

# 開発サーバー起動（対話式で選択）
pnpm dev

# PDF エクスポート
pnpm export
```

## 構成

```
talks/
├── themes/daitasu/   # 共通テーマ
├── scripts/          # ヘルパースクリプト
├── 2026/
│   └── sample/       # サンプルプレゼン
│       └── slides.md
└── package.json
```

## 新しいトークを追加する

```bash
mkdir -p talks/2026/my-talk
```

`talks/2026/my-talk/slides.md` を作成し、frontmatter にテーマとメタデータを設定：

```yaml
---
theme: ../../themes/daitasu
title: タイトル
talk:
  date: "2026-01-01"
  event: "イベント名"
---
```
