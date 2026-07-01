---
theme: ../../themes/daitasu
colorSchema: light
title: CSS だけでFPS視点スクロールアクションを実現する
talk:
  date: "2026-07-10"
  event: "Tamagawa.dev #2"
layout: cover
dino: false
---

# CSS だけでFPS視点スクロールアクションを実現する

<div class="mt-8 text-xl color-gray">2026.07.10 Tamagawa.dev #2 @daitasu</div>

---
layout: intro
---

<div class="flex items-center gap-12">
  <div>
    <img src="https://avatars.githubusercontent.com/u/28728602" class="w-48 h-48 rounded-full" />
    <div class="mt-3 flex flex-col items-center">
      <p>X</p>
      <img :src="'/qrcode_x.com.png'" class="mt-1 rounded-1 h-24" />
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

- 「FPS視点スクロールアクション」って**何？**
- 昔は JS でやっていた。**今は CSS だけでいける**
- キーになる **3つの CSS 技術**（scroll / 3D / sticky）
- 実装のハマりどころと、**使いどころ・限界**

</div>

---
layout: section
---

# スクロールしただけで<br>世界の中を歩けたら？

---

# FPS視点スクロールアクションとは

<div class="mt-6 text-lg">

- スクロール量を **カメラの前進・首振り** にマッピングする体験
  - 縦スクロール = 前進、進むにつれて **視点が回り込む**
- ゲームの一人称視点（FPS）を、**Web ページのスクロール**で再現する
- 「読む」ではなく「**進む**」インタラクション
  - ストーリーテリング LP、ポートフォリオ、ゲーム風の導入に相性がいい

</div>

---
layout: section
---

# それ、JS 要る？🤔

---

# 従来は JS でやっていた

<div class="mt-6 text-lg">

- `scroll` イベントで **スクロール量を取得** → `transform` を毎フレーム書き換え
  - `requestAnimationFrame` でスロットリング、計算量との戦い
- メインスレッドで動くので、**カクつき（jank）が出やすい**
- 状態管理・破棄処理・ライブラリ依存で、**コードが太る**

</div>

<MessageBox>スクロール駆動アニメーションなら、これ全部 CSS に寄せられる</MessageBox>

---
layout: section
---

# CSS Scroll-driven<br>Animations の時代

---

# キーになる 3つの CSS 技術

<div class="mt-6 text-lg">

- **① Scroll-driven Animations** … スクロール量で `@keyframes` を進める
  - `animation-timeline: scroll()` / `view()`
- **② 3D Transform** … 奥行きのある空間をつくる
  - `perspective` / `transform-style: preserve-3d` / `translateZ`
- **③ position: sticky** … ビューポートを固定し、背後で長くスクロールさせる

</div>

---

# ① スクロールで keyframes を進める

```css
@keyframes advance {
  from { transform: translateZ(0); }
  to   { transform: translateZ(-3000px); }
}

.camera {
  animation: advance linear both;
  /* 時間ではなく「スクロール量」でアニメを進める */
  animation-timeline: scroll(root block);
}
```

<div class="mt-4 text-base color-gray">

- `scroll(root block)` = ルートスクローラの縦スクロール進捗（0〜100%）に連動
- JS のスクロールイベントは **一切書かない**

</div>

<style>
.slidev-code, .slidev-code * { font-size: 13px !important; line-height: 1.6 !important; }
</style>

---

# ② perspective と preserve-3d で空間をつくる

```css
.scene {
  perspective: 400px;            /* 焦点距離。小さいほど広角＝没入感 */
  overflow: hidden;
}

.world {
  transform-style: preserve-3d;  /* 子を 3D 空間に配置する */
}

/* 通路の壁を左右に立てる */
.wall-left  { transform: rotateY( 90deg) translateZ(300px); }
.wall-right { transform: rotateY(-90deg) translateZ(300px); }
```

<div class="mt-4 text-base color-gray">

- `perspective` がカメラの画角、`preserve-3d` が「空間として扱う」宣言

</div>

<style>
.slidev-code, .slidev-code * { font-size: 13px !important; line-height: 1.6 !important; }
</style>

---

# ③ sticky で視点を固定して前進＆首振り

```css
.track    { height: 500vh; }        /* スクロール距離を稼ぐ */
.viewport {
  position: sticky; top: 0;
  height: 100vh;
  perspective: 400px;
}

@keyframes walk {
  0%   { transform: translateZ(0)      rotateY(0deg); }
  50%  { transform: translateZ(1500px) rotateY(-20deg); }  /* 曲がり角 */
  100% { transform: translateZ(3000px) rotateY(10deg); }
}

.world {
  transform-style: preserve-3d;
  animation: walk linear both;
  animation-timeline: scroll(root block);
}
```

<div class="mt-3 text-base color-gray">

- 距離・角度・符号は実際の見た目に合わせて **要調整**（ここが演出の勘所）

</div>

<style>
.slidev-code, .slidev-code * { font-size: 12px !important; line-height: 1.5 !important; }
</style>

---
layout: section
---

# デモ

<div class="mt-6 text-xl color-gray">（ここでライブデモ / CodePen リンク）</div>

---

# 実装のハマりどころ

<div class="mt-6 text-lg">

- **ブラウザ対応**：scroll-driven animations は新しめ。未対応環境の fallback を用意
- **クリッピング**：`overflow` や `will-change` の指定で 3D の描画順・はみ出しが崩れる
- **パフォーマンス**：`transform` / `opacity` に寄せてコンポジタで動かす
- `scroll()` の対象スクローラ（`root` / `nearest` / 名前付き `scroll-timeline`）の取り違え

</div>

---
layout: section
---

# ⚠️ ええことばかりやない

---

# 使いどころと限界

<div class="mt-6 text-lg">

- **酔い・アクセシビリティ**：`prefers-reduced-motion` で必ずアニメを止める
  - `@media (prefers-reduced-motion: reduce) { .world { animation: none; } }`
- スクロール = 唯一の操作。**情報を読ませたいページには不向き**
- 凝るほど「作品」寄りになる。**目的（体験 or 伝達）を見失わない**

</div>

<MessageBox>CSS だけで没入体験は作れる。あとは「どこで使うか」</MessageBox>

---
layout: two-cols
---

# まとめ

::left::

<div class="text-left mt-5 space-y-2 text-16">

- スクロール = カメラ操作の FPS 体験が **CSS だけ**で作れる
- 肝は **scroll-driven animation × 3D transform × sticky** の合わせ技
- JS のスクロール処理を捨てて、**コンポジタ任せ**で滑らかに
- 演出力は高いが、**酔い対策と使いどころ**はセットで考える

</div>

::right::

<div class="flex h-full justify-center items-center text-lg color-gray">

（デモ / 記事リンクをここに）

</div>
