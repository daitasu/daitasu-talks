---
theme: ../../themes/daitasu
colorSchema: dark
title: Semantic Version 単位で戦略を柔軟に変えて、パッケージアップデートを自動化する
talk:
  date: "2026-06-12"
  event: "LT会"
layout: cover
dino: /dino_cover_transparent.png
---

# Semantic Version 単位で戦略を柔軟に変えて、パッケージアップデートを自動化する

::footer::

<div class="text-xl color-gray">2026.06.12 多摩.dev #3 〜半年記念回〜 @daitasu</div>

---
layout: intro
---

<div class="flex items-center gap-12">
  <div class="">
    <img src="https://avatars.githubusercontent.com/u/28728602" class="w-48 h-48 rounded-full" />
    <div class="mt-2 flex gap-2 items-end w-full">
      <div class="flex flex-col items-center">
        <p>X</p>
        <p>
          <img :src="'/qrcode_x.com.png'" class="mt-1 rounded-1 h-24" />
        </p>
      </div>
      <div class="flex flex-col items-center">
        <p>
          <img src="https://media.connpass.com/thumbs/54/39/5439d93cdc71a42279d5aa1415c9c39e.png" class="w-16 rounded-2" />
        </p>
        <p>
          <img :src="'/qrcode_discord.gg.png'" class="mt-1 rounded-1 h-24" />
        </p>
      </div>
    </div>
  </div>
  <div class="text-xl space-y-2">
    <h2 class="!text-2xl">自己紹介</h2>
    <div>
      <p>Name:</p>
      <p class="ml-3">@daitasu</p>
    </div>
    <div>
      <p>Belong to:</p>
      <p class="ml-3">コミューン株式会社</p>
    </div>
    <div>
      <p>Favorite:</p>
      <p class="ml-3">TypeScript, Sauna, Dinosaurs</p>
    </div>
    <div>
      <p>Community:</p>
      <p class="ml-3">Tachikawa.any</p>
    </div>
  </div>
</div>

---

# 今日話すこと

<div class="mt-8 text-xl">

- dependabot の PR が**滞納する問題**
- Semantic Version ごとの**マージ戦略**の考え方
- AIレビュー＆自動マージする**GitHub Action を作った**話
- 導入して**どう変わったか**

</div>

---
layout: section
---

# dependabot の滞納問題

---

# dependabot PR、溜まってませんか？

<div class="mt-6 text-lg">

- dependabot が PR を作ってくれる → **誰もレビューしない**
- 放置すると**バージョン差異が肥大化**
- いざ上げようとすると**破壊的変更が積み重なって大変**

</div>

<MessageBox>開発生産性の低下に直結する</MessageBox>

---

# なぜ人間がレビューしないのか

<div class="mt-6 text-lg">

- ビジネス機能の開発が優先される
- dependabot PR は**数が多い**
- 「ライブラリのアップデート内容を読む」のが**面倒**
- 結果、**後回しにされ続ける**

</div>

---

# AI で解決できるのでは？

<div class="mt-6 text-lg">

- dependabot PR は**ビジネスロジックを含まない**
- 既存コードとライブラリ情報の分析で対応可能
- AIエージェントが**レビュー・マージ判断**を代行できる

</div>

<MessageBox>cc-deps-patrol を作った</MessageBox>

---
layout: section
---

# cc-deps-patrol

---

# cc-deps-patrol とは

<div class="mt-6 text-lg">

- Claude Code Action で dependabot PR を**パトロール**する GitHub Action
- Semantic Version に応じて**4つの戦略**を使い分け
- npm provenance チェック + AI レビューで**セキュリティも考慮**
- 🔗 [github.com/daitasu/cc-deps-patrol](https://github.com/daitasu/cc-deps-patrol)

</div>

---

# 従来の dependabot の対応フロー

<img :src="'/flow_original.png'" class="mt-6 rounded-lg w-2/3 mx-auto" />

<div class="mt-6">

- dependabot が PR を作成してからマージされるまでの一般的な流れ
- <strong>人間</strong>がレビューし、マージまで持っていく

</div>

---
layout: section
---

# このフローを4つの戦略に分けて<br>AIの対応範囲を決めていく

---

# 4つのマージ戦略

<img :src="'/strategy_overview.png'" class="mt-2 rounded-lg w-2/3 mx-auto" />

<div class="mt-6 text-sm">

- バージョンの影響度に応じて、自動化の度合いを**段階的に変える**
- patch → `verify-and-merge` ／ minor → `review-and-merge` ／ major → `review-only`

</div>

---

# ① verify-and-merge（patch向け）

<img :src="'/verify_merge.png'" class="mt-2 rounded-lg w-3/4 mx-auto" />

<div class="mt-6">

- AI レビューは**実施しない**（コスト削減）。開発元の**信頼性チェックのみ**で判断
- 確認項目：**npm provenance**（由来検証）／ **install スクリプト**の有無 ／ **リリース経過日数**

</div>

---

# ⚠️ verify-and-merge の限界

<div class="mt-6 text-lg">

- npm provenance は「**由来の透明性**」を証明するだけ
  - メンテナ認証情報が奪取された場合は防げない（例：2025年9月の chalk/debug 汚染）
- install スクリプト検査は**回避手法**に対応しきれない
  - binding.gyp + node-gyp 経由での任意コード実行 等

</div>

<MessageBox>過信禁物。最低限のスクリーニングに過ぎない</MessageBox>

---

# ② review-and-merge（minor向け）

<img :src="'/review_merge.png'" class="mt-2 rounded-lg w-3/4 mx-auto" />

<div class="mt-6">

- patch より影響範囲が広いため、**AI の目を通してから**マージする
- npm provenance 前段チェック → AI がアップデート影響をレビュー → 問題なければ **Approve + 自動マージ**

</div>

---

# ③ review-only（major向け）

<img :src="'/review_only.png'" class="mt-2 rounded-lg w-3/4 mx-auto" />

<div class="mt-6">

- AI が**レビューコメントのみ**を残す。Approve も自動マージも**しない**
- 破壊的変更は**人間が最終判断**。コメントがあるだけでも調査工数は大幅に減る

</div>

---
layout: section
---

# 使い方

---

# GitHub Actions の設定

```yaml
- uses: daitasu/cc-deps-patrol@v1
  with:
    github-token: ${{ steps.app-token.outputs.token }}
    anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude-github-token: ${{ steps.app-token.outputs.token }}
    patch-strategy: "verify-and-merge"
    minor-strategy: "review-and-merge"
    major-strategy: "review-only"
    reviewer-login: "deps-keeper"
    review-language: "ja"
```

<div class="mt-4 text-base text-gray-400">

戦略はバージョン種別ごとに柔軟に組み替え可能

</div>

---
layout: section
---

# 導入結果

---

# 導入結果: verify / review-and-merge

<div class="grid grid-cols-2 gap-4 mt-2">
  <img src="https://static.zenn.studio/user-upload/596fded58ab0-20260609.png" class="rounded-lg" />
  <img src="https://static.zenn.studio/user-upload/d409ca6c9dbe-20260609.png" class="rounded-lg" />
</div>

<div class="mt-4 text-base text-gray-400">

AI がレビュー → Approve → 自動マージまで完了

</div>

---

# 導入結果: review-only（Major）

<img src="https://static.zenn.studio/user-upload/e04584c8989b-20260609.png" class="mt-2 rounded-lg w-full" />

<div class="mt-4 text-base text-gray-400">

AI のレビューコメントが残り、人間が最終判断する

</div>

---

# 導入してどう変わったか

<div class="mt-6 text-lg">

- **滞っていた dependabot PR が消化**されるようになった
- `review-only` のコメントだけでも**調査の支援**になる
- ケースに応じて**戦略を柔軟に組み替え**られる

</div>

---

# 今後の展望

<div class="mt-6 text-lg">

- Claude Code Action **以外のエージェント**対応
- prompt の**外部カスタマイズ**機能
- チーム規模やポリシーに応じた**戦略テンプレート**

</div>

---
layout: center
---

# まとめ

<div class="text-left mt-8 space-y-5 text-xl">

- dependabot PR の滞納は**AI で解決できる**
- Semantic Version ごとに**戦略を分けるのが肝**
- セキュリティは**過信せず、最低限のスクリーニング**
- `review-only` だけでも十分**開発体験が改善**する

</div>
