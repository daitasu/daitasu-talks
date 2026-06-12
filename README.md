# daitasu slides

登壇スライドを管理する monorepo。[Slidev](https://sli.dev) で作成。

## 使い方

タスクランナーに [just](https://github.com/casey/just) を利用。未インストールなら `brew install just`。

```bash
pnpm install

# レシピ一覧を表示
just

# トーク一覧を表示
just list

# 開発サーバー起動（引数なしで対話式、SLUG 指定で直起動）
just dev
just dev sample

# PDF エクスポート（引数なしで対話式、SLUG 指定で直エクスポート）
just pdf
just pdf sample
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
# 雛形作成 → そのまま dev サーバーを起動
just new my-talk "タイトル" 2026-07-01 "イベント名"

# 雛形のみ作成
just scaffold my-talk "タイトル" 2026-07-01 "イベント名"

# 年を指定する場合は最後に渡す（デフォルトは 2026）
just new my-talk "タイトル" 2027-01-01 "イベント名" 2027
```

`talks/<year>/<slug>/slides.md` が以下の frontmatter で生成される：

```yaml
---
theme: ../../themes/daitasu
colorSchema: light
title: タイトル
talk:
  date: "2026-07-01"
  event: "イベント名"
layout: cover
---
```
