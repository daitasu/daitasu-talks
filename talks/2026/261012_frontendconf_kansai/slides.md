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

<div class="steps">
  <div>
    <p class="step-no">01</p>
    <p class="step-title">契約をつくる</p>
    <p class="step-body">AI が使ってよい部品と規約（catalog）を、人間が書く</p>
  </div>
  <div>
    <p class="step-no">02</p>
    <p class="step-title">AI が組み立てる</p>
    <p class="step-body">AI は HTML ではなく、JSON の構造（spec）を返す</p>
  </div>
  <div>
    <p class="step-no">03</p>
    <p class="step-title">描画関数が描く</p>
    <p class="step-body">描画関数が、JSON をフレームワークの UI に変換する</p>
  </div>
</div>

<p class="mt-14 text-lg">AI が触るのは <b>JSON だけ</b>。HTML / CSS / コンポーネントの実体には触れない。</p>

<style>
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; margin-top: 3rem; }
.steps > div { border-top: 1px solid #2F3437; padding-top: 1rem; }
.steps p { margin: 0; }
.step-no { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #787774; }
.step-title { margin-top: 0.4rem !important; font-size: 1.3rem; font-weight: 700; }
.step-body { margin-top: 0.6rem !important; font-size: 0.95rem; line-height: 1.7; color: #4b5563; }
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

```mermaid {theme: 'neutral', scale: 0.68}
flowchart LR
  AI["AI（ユーザー）"]
  subgraph server["サーバ"]
    DB[("DB")] --> API["API"]
  end
  subgraph front["フロントエンド"]
    AST["AST<br/>type / props"] --> R["renderer<br/>部品・style"]
  end
  subgraph browser["ブラウザ"]
    DOM["DOM"]
  end
  H["人間（ユーザー）"]
  DB ~~~ AI
  AI -- "schema を読み<br/>AST を返す" --> AST
  API -- "Internet<br/>API 経由のみ" --> R
  R --> DOM --> H
```

<div class="mt-6 text-sm" style="color: #4b5563; line-height: 1.9;">
  <p class="m-0">AI が見るのは <b>schema だけ</b>。ドメイン知識も style も持たない</p>
  <p class="m-0">DB は <b>API の向こう</b>。データは権限つきで解決する</p>
  <p class="m-0">人間は AST から<b>写した DOM</b> を見る</p>
</div>

---

# 先月、<span class="accent">Jev</span> が登場した

<p class="mt-1 text-base" style="color: #787774;">TypeSafe AI / 2026.09.15 公開 / 初の「System One モデル」</p>

<dl class="spec">
  <dt>出力</dt><dd>型付きの判断だけ。文章は書かない</dd>
  <dt>生成</dt><dd>トークンを逐次生成せず、一度に返す</dd>
  <dt>速度</dt><dd>0.1 秒台（公称）</dd>
  <dt>確信度</dt><dd>判断ごとに確率が付く</dd>
</dl>

<p class="mt-8 text-lg">schema から <code>type</code> / <code>props</code> を選ぶのは、<b>型付きの判断</b>そのもの。</p>
<p class="mt-1 text-lg">逐次描画が要らなくなり、<b>UI をリアルタイムに書き換えられる</b>。</p>

<style>
.spec { display: grid; grid-template-columns: 7rem 1fr; margin-top: 1.6rem; border-top: 1px solid #EAEAEA; }
.spec dt, .spec dd { margin: 0; padding: 0.7rem 0; border-bottom: 1px solid #EAEAEA; font-size: 1.05rem; }
.spec dt { color: #787774; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; display: flex; align-items: center; }
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
