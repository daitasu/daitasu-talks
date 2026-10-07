---
theme: ../../themes/daitasu
colorSchema: light
title: AIがユーザーになる時代のフロントエンドのシステム境界を考える ~ Generative UIに共通する設計思想 ~
description: 2026年10月12日 「フロントエンドカンファレンス関西 2026」における登壇資料です。
talk:
  date: "2026-10-12"
  event: "フロントエンドカンファレンス関西 2026"
fonts:
  sans: Zen Kaku Gothic New
  mono: JetBrains Mono
  weights: "300,400,500,700"
layout: cover
dino: /daitasaurus-dark-king.jpg
---

# AI がユーザーになる時代の<br>フロントエンドの<br>システム境界を考える
<p class="cover-sub">~ Generative UI に共通する設計思想 ~</p>
<div>
  <span class="cover-eyebrow">フロントエンドカンファレンス関西 2026 ・ 2026.10.12</span>
  <span class="cover-by">@daitasu</span>
</div>

<style>
:global(.slidev-layout.cover .dino-img) {
  height: 18rem !important;
  width: 18rem;
  bottom: 1.5rem !important;
  right: 1.5rem !important;
  border-radius: 50%;
  object-fit: cover;
}
.cover-sub { margin-top: 0.5rem; font-size: 1.1rem; color: var(--dt-text-muted); }
</style>

---
layout: intro
---

<div class="flex items-center gap-12">
  <div>
    <img src="https://avatars.githubusercontent.com/u/28728602" class="w-48 h-48 rounded-full" style="box-shadow: 0 18px 44px -18px rgba(30, 64, 128, 0.45); background: #fff;" />
    <div class="mt-3 flex gap-3 items-end justify-center">
      <div class="flex flex-col items-center">
        <p>X</p>
        <img :src="$public('/qrcode_x.com.png')" class="mt-1 rounded-1 h-24" />
      </div>
      <div class="flex flex-col items-center">
        <p>Tachikawa.any</p>
        <img :src="$public('/qrcode_discord.png')" class="mt-1 rounded-1 h-24" />
      </div>
    </div>
  </div>
  <div class="text-xl space-y-1.5">
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
      <p class="ml-3">TypeScript, Onsen, Dinosaurs</p>
    </div>
    <div>
      <p>Career:</p>
      <p class="ml-3">SIer(2年)→ Frontend (3年) → EM (4年) → IC</p>
    </div>
    <div>
      <p>Community:</p>
      <a class="ml-3" href="https://tachikawaany.connpass.com/" target="_blank">
        Tachikawa.any
      </a>
      <a class="ml-3" href="https://gotanda--ts.connpass.com/event/402821/" target="_blank">
        五反田.ts
      </a>
    </div>
  </div>
</div>

---
layout: two-cols
---

# Generative UI ってなに？

::left::

<div class="mt-4 text-lg">

- LLM が**その場で UI を生成**して返すアプローチ
- 返答が「文章」ではなく、**ボタン・カード・フォーム**そのものになる
- 「今日の天気は？」→ テキストの説明ではなく**天気カード**が返ってくる
- ユーザーは読むだけでなく、返ってきた UI を**そのまま操作**できる

</div>

::right::

<div class="mt-8 flex justify-center">
  <img :src="$public('/json-render.gif')" class="rounded-lg" style="max-height: 20rem;" />
</div>

---

# とはいえ、Generative UI には悩みもある

<div class="mt-8 text-xl">

- 生成される UI は**掛け捨て前提**
  - 会話ごとに生まれて、会話ごとに消える
- 業務アプリケーションにおいては、**安定しない UI はリスクが高い**
  - 描画時点では**確立された UI** が出される方が安心
- しかし、ユーザーが **AIで**、**自分で**UIを組み立てられる仕組みは魅力的
  - ノーコードツールの中間構築をAIが担う

</div>

---
layout: section
---

# Generative UI の<span class="accent">仕組みだけ</span>、<br>うまく使えないだろうか？

<div class="mt-10 text-lg text-center color-gray">
  Vercel Labs の <b>json-render</b>を例に、処理を見ていく
</div>

---
layout: two-cols
---

# json-render はどうやっている？

::left::

<div class="mt-6 text-lg space-y-5">
  <div class="howto-step active">① カタログを定義する</div>
  <div class="howto-step">② 実態（コンポーネント）を定義する</div>
  <div class="howto-step">③ カタログからシステムプロンプトを生成</div>
</div>

::right::

```ts
import { defineCatalog } from "@json-render/core";
import { z } from "zod";

export const catalog = defineCatalog({
  components: {
    Stack: {
      props: z.object({
        direction: z.enum(["row", "column"]),
      }),
      hasChildren: true,
    },
    WeatherWidget: {
      props: z.object({
        city: z.string(),
        temperature: z.number(),
        condition: z.string(),
      }),
    },
  },
});
```

<style>
.howto-step { opacity: 0.35; }
.howto-step.active { opacity: 1; font-weight: 700; }
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.5 !important; }
</style>

---
layout: two-cols
---

# json-render はどうやっている？

::left::

<div class="mt-6 text-lg space-y-5">
  <div class="howto-step">① カタログを定義する</div>
  <div class="howto-step active">② 実態（コンポーネント）を定義する</div>
  <div class="howto-step">③ カタログからシステムプロンプトを生成</div>
</div>

::right::

```tsx
import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";

export const { registry } = defineRegistry(catalog, {
  components: {
    Stack: ({ props, children }) => (
      <div
        className={
          props.direction === "row"
            ? "flex flex-row gap-2"
            : "flex flex-col gap-2"
        }
      >
        {children}
      </div>
    ),
    WeatherWidget: ({ props }) => (
      <WeatherCard
        city={props.city}
        temperature={props.temperature}
        condition={props.condition}
      />
    ),
  },
});
```

<style>
.howto-step { opacity: 0.35; }
.howto-step.active { opacity: 1; font-weight: 700; }
.slidev-code, .slidev-code * { font-size: 10px !important; line-height: 1.4 !important; }
</style>

---
layout: two-cols
---

# json-render はどうやっている？

::left::

<div class="mt-6 text-lg space-y-5">
  <div class="howto-step">① カタログを定義する</div>
  <div class="howto-step">② 実態（コンポーネント）を定義する</div>
  <div class="howto-step active">③ カタログからシステムプロンプトを生成</div>
</div>

::right::

```ts
const systemPrompt = catalog.prompt();

const result = streamText({
  model: anthropic("claude-haiku-4-5"),
  system: systemPrompt,
  prompt,
});
```

<div class="text-sm color-gray mt-4">

catalog の「使っていい部品と props」が、そのまま LLM への契約になる。

</div>

<style>
.howto-step { opacity: 0.35; }
.howto-step.active { opacity: 1; font-weight: 700; }
.slidev-code, .slidev-code * { font-size: 12px !important; line-height: 1.55 !important; }
</style>

---

# つまり、

<div class="flex items-stretch justify-center gap-3 mt-10">
  <div class="step-card">
    <div class="step-no">1</div>
    <div class="step-title">契約をつくる</div>
    <div class="step-body">AI が利用可能な<b>特定パーツと規約</b>（catalog）を人間が作成する</div>
  </div>
  <div class="step-arrow">→</div>
  <div class="step-card">
    <div class="step-no">2</div>
    <div class="step-title">AI が組み立てる</div>
    <div class="step-body">それを元に、AI は HTML ではなく <b>JSON 構造</b>（spec）を組み立てる</div>
  </div>
  <div class="step-arrow">→</div>
  <div class="step-card">
    <div class="step-no">3</div>
    <div class="step-title">描画関数が描く</div>
    <div class="step-body">描画関数が<b>フレームワークに合わせて</b>、JSON を実際の UI に再描画する</div>
  </div>
</div>

<div class="mt-10 text-lg text-center color-gray">
  AI が触るのは <b>JSON</b> だけ。HTML / CSS / コンポーネント実体には一切触れない。
</div>

<style>
.step-card { flex: 1; max-width: 260px; padding: 1.2rem 1.3rem; border-radius: 14px; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.25); box-shadow: 0 16px 36px -22px rgba(30, 64, 128, 0.34); }
.step-no { width: 2rem; height: 2rem; border-radius: 999px; background: #4a90d9; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.step-title { margin-top: 0.7rem; font-size: 1.15rem; font-weight: 700; }
.step-body { margin-top: 0.5rem; font-size: 0.95rem; line-height: 1.6; color: #4b5563; }
.step-arrow { align-self: center; font-size: 2rem; color: #4a90d9; font-weight: 700; }
</style>

---

# <span class="accent">抽象構文木（AST）</span>っぽい

<div class="mt-2 text-base">

「AI が使ってよいノード」の Union として UI を型定義し、AI にはこの木を返させる。

</div>

```ts
type NodeBlock = TextNode | ButtonNode | PriceNode;
```

<div class="grid grid-cols-3 gap-3 mt-1">
<div>

```ts
type TextNode = {
  type: "text";
  props: {
    content: string;
    size: "sm" | "md" | "lg";
    weight: "normal" | "bold";
  };
};
```

</div>
<div>

```ts
type ButtonNode = {
  type: "button";
  props: {
    label: string;
    variant: "primary" | "secondary";
    action: "submit" | "cancel";
  };
};
```

</div>
<div>

```ts
type PriceNode = {
  type: "price";
  props: {
    amount: number;
    currency: "JPY" | "USD";
    showTax: boolean;
  };
};
```

</div>
</div>

<div class="mt-2 text-sm color-gray">

- `type` が **AI に許可した語彙**、`props` が **AI に許可した値の範囲**。自由な HTML はどこにも出てこない
- 木（JSON）を保存しておけば、描画先は React でも Vue でもメールでも選べる

</div>

<style>
.slidev-code, .slidev-code * { font-size: 9.5px !important; line-height: 1.5 !important; }
</style>

---

# この木を軸に、システム境界を引く

<div class="sys">
  <!-- row 1: AI -->
  <div class="sys-ai">
    <div class="actor ai">🤖 AI（ユーザー）</div>
    <div class="ai-arrows">
      <span>↓ schema を読む</span>
      <span>↑ AST を返す</span>
    </div>
  </div>

  <!-- row 2 -->
  <div class="zone server">
    <div class="zone-label">サーバ</div>
    <div class="db">DB</div>
    <div class="v-arrow">↓</div>
    <div class="node">API<small>権限でデータを解決</small></div>
  </div>

  <div class="net">
    <div class="net-label">🌐 Internet</div>
    <div class="h-arrow"><small>API 経由のみ</small>━━━▶</div>
  </div>

  <div class="zone front">
    <div class="zone-label">フロントエンド</div>
    <div class="ai-zone">
      <div class="ai-zone-label">AI に見えるのはここだけ</div>
      <div class="node">schema</div>
      <div class="node">AST<small>{ type, props }</small></div>
    </div>
    <div class="v-arrow">↓</div>
    <div class="node">renderer<small>部品・style</small></div>
  </div>

  <div class="net plain">
    <div class="h-arrow"><small>DOM</small>━━▶</div>
  </div>

  <div class="zone browser">
    <div class="browser-bar"><i></i><i></i><i></i></div>
    <div class="zone-label">ブラウザ</div>
    <div class="actor human">🧑 人間（ユーザー）</div>
    <div class="v-arrow">↑</div>
    <div class="node">DOM</div>
  </div>
</div>

<div class="mt-6 text-lg text-center color-gray">
  AI は <b>schema だけ</b>を見る。DB は <b>API の向こう</b>。人間は AST から<b>写した DOM</b> を見る。
</div>

<style>
.sys { display: grid; grid-template-columns: 1.1fr 0.8fr 1.6fr 0.5fr 1.1fr; grid-template-rows: auto auto; gap: 0.5rem 0; margin-top: 0.8rem; }
.sys-ai { grid-column: 3; grid-row: 1; display: flex; flex-direction: column; align-items: center; }
.ai-arrows { display: flex; gap: 1.6rem; font-size: 0.85rem; color: #4a90d9; font-weight: 700; margin-top: 0.3rem; }
.zone { grid-row: 2; position: relative; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 0.5rem; padding: 2rem 0.9rem 1rem; border-radius: 12px; }
.zone-label { position: absolute; top: 0.5rem; left: 0.8rem; font-size: 0.85rem; font-weight: 700; color: #475569; }
.server { grid-column: 1; background: #e8edf3; border: 2px solid #475569; }
.front { grid-column: 3; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.4); }
.browser { grid-column: 5; background: #fff; border: 1.5px solid #cbd5e1; padding-top: 2.2rem; }
.browser .zone-label { top: 1.2rem; }
.browser-bar { position: absolute; top: 0; left: 0; right: 0; height: 0.9rem; background: #e2e8f0; border-radius: 10px 10px 0 0; display: flex; gap: 0.25rem; align-items: center; padding-left: 0.5rem; }
.browser-bar i { width: 0.4rem; height: 0.4rem; border-radius: 999px; background: #94a3b8; }
.net { grid-row: 2; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding-bottom: 1.1rem; border-left: 2px dashed #cbd5e1; border-right: 2px dashed #cbd5e1; margin: 0 0.4rem; position: relative; }
.net.plain { grid-column: 4; border: none; }
.net:not(.plain) { grid-column: 2; }
.net-label { position: absolute; top: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #64748b; }
.h-arrow { display: flex; flex-direction: column; align-items: center; color: #4a90d9; font-weight: 700; font-size: 0.9rem; line-height: 1.1; }
.h-arrow small { font-size: 0.75rem; color: #475569; }
.node { width: 100%; text-align: center; padding: 0.65rem 0.4rem; border-radius: 8px; background: #fff; border: 1.5px solid #4a90d9; font-weight: 700; font-size: 1.05rem; line-height: 1.2; }
.node small { display: block; font-size: 0.75rem; font-weight: 400; color: #64748b; }
.db { width: 5rem; padding: 1rem 0; text-align: center; font-weight: 700; background: #fff; border: 1.5px solid #475569; border-radius: 2.5rem / 0.8rem; }
.v-arrow { color: #4a90d9; font-weight: 700; line-height: 1; }
.ai-zone { width: 100%; display: flex; gap: 0.5rem; padding: 1.3rem 0.5rem 0.5rem; border: 2px dashed #4a90d9; border-radius: 10px; position: relative; }
.ai-zone-label { position: absolute; top: 0.25rem; left: 0.5rem; font-size: 0.75rem; color: #4a90d9; font-weight: 700; }
.actor { padding: 0.5rem 1rem; border-radius: 999px; font-weight: 700; font-size: 1.05rem; white-space: nowrap; }
.actor.ai { background: #eef4fc; border: 1.5px solid #4a90d9; }
.actor.human { background: #fff7ed; border: 1.5px solid #f59e0b; }
</style>

---

# 先月、<span class="accent">Jev</span> が登場した

<div class="mt-1 text-base color-gray">TypeSafe AI ・ 2026.09.15 公開 ・ 初の「System One モデル」</div>

<div class="grid grid-cols-4 gap-4 mt-6">
  <div class="jev-card"><div class="jev-key">文章を書かない</div><div class="jev-desc"><b>型付きの判断</b>だけ返す</div></div>
  <div class="jev-card"><div class="jev-key">一度に返す</div><div class="jev-desc"><b>逐次生成</b>しない</div></div>
  <div class="jev-card"><div class="jev-key">0.1 秒台</div><div class="jev-desc">公称レイテンシ</div></div>
  <div class="jev-card"><div class="jev-key">確信度つき</div><div class="jev-desc">判断に<b>確率</b>が付く</div></div>
</div>

<div class="jev-punch">
  <p>schema から <code>type</code> / <code>props</code> を選ぶ ＝ <b>型付きの判断</b></p>
  <p class="jev-arrow">↓</p>
  <p><span class="accent">逐次描画は不要に。UI をリアルタイムに書き換えられる</span></p>
</div>

<style>
.jev-card { padding: 1rem 0.9rem; border-radius: 14px; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.3); box-shadow: 0 16px 36px -22px rgba(30, 64, 128, 0.34); text-align: center; }
.jev-key { font-size: 1.3rem; font-weight: 700; color: #4a90d9; }
.jev-desc { margin-top: 0.4rem; font-size: 0.9rem; color: #4b5563; }
.jev-punch { margin-top: 2.2rem; text-align: center; font-size: 1.3rem; }
.jev-punch p { margin: 0; }
.jev-arrow { color: #4a90d9; font-weight: 700; }
</style>

---

# まとめ

<div class="mt-6 text-lg">

- Generative UI の仕組みは、**契約 → AST → 描画** に分解できる
  - catalog（schema）で AI に許す語彙を決め、AI は木を返し、描画関数が UI にする
- AI も**ユーザーの一人**として、境界の外側に置く
  - AI に渡すのは schema だけ。ドメイン知識・style・DB は渡さない
  - データは API が権限つきで解決し、人間は AST から写像された DOM を見る
- 判断特化の高速モデルで、**UI をリアルタイムに組み替える**時代が近づいている
- これからのフロントエンドの責務は、**「AI に何を許すか」を schema として書き下すこと**

</div>
