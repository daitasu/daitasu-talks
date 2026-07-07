---
theme: ../../themes/daitasu
colorSchema: light
title: CSS だけでFPS視点スクロールアクションを実現する
talk:
  date: "2026-07-10"
  event: "Tamagawa.dev #2"
fonts:
  sans: Zen Kaku Gothic New
  mono: JetBrains Mono
  weights: "300,400,500,700"
layout: cover
dino: false
---


# CSS だけで<br>FPS視点スクロールアクションを実現する

<div>
  <span class="cover-eyebrow">Tamagawa.dev #2 ・ 2026.07.10</span>
  <span class="cover-by">@daitasu</span>
</div>
 
---
layout: intro
---

<div class="flex items-center gap-12">
  <div>
    <img src="https://avatars.githubusercontent.com/u/28728602" class="w-48 h-48 rounded-full" style="box-shadow: 0 18px 44px -18px rgba(30, 64, 128, 0.45); background: #fff;" />
    <div class="mt-3 flex flex-col items-center">
      <p>X</p>
      <img :src="$public('/qrcode_x.com.png')" class="mt-1 rounded-1 h-24" />
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

- **① Scroll-driven Animations** … スクロール量で `@keyframes` を進める
  - `animation-timeline: scroll()` / `view()`
- **② 3D Transform** … 奥行きのある空間をつくる
  - `perspective` / `transform-style: preserve-3d` / `translateZ`

</div>

---
layout: section
---

# animation-timeline

---

# animation-timeline とは

<div class="mt-6 text-lg">

- CSSアニメーションの進行を制御するためのtimeline を構築するCSSプロパティ
- スクロール駆動アニメーションをCSSのみで実現できる
- スクロールできるコンテナー内のスクロール位置の始点〜終点まででアニメーションを作成する

```css
@keyframes scroll-scale {
  from { scale: 0.5 1; }
  to { scale: 1 1; }
}

.container {
  animation: scroll-scale linear;
  animation-timeline: scroll();
}
```

</div>

---
layout: two-cols
---

# Sample: animation-timeline: view()

::left::

<div class="text-sm">

- `view()` = **要素自身がビューポートを横切る進捗**でアニメを駆動
- `animation-range` で「どの区間で animate するか」を指定
- shorthand の `animation` は timeline を auto に戻すので、**timeline / range は後に書く**

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(60px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

</div>

::right::

<DemoFrame src="https://daitasu.github.io/css-scroll-fps/patterns/001-fade-in/" height="380px" class="mt-2" />

---
layout: two-cols
---

# Sample: animation-timeline: scroll()

::left::

<div class="text-sm">

- `scroll(root)` = **ページ全体の縦スクロール進捗 0〜100%** をタイムライン化
- `scaleX` を 0→1 で伸ばすだけ。**レイアウトを起こさず GPU 合成**で軽い
- 読み進みバーや円形インジケーターなど「**進捗 UI**」に最適

```css
.progress {
  position: fixed;
  inset: 0 0 auto 0;
  transform-origin: 0 50%;
  animation: grow-x linear both;
  animation-timeline: scroll(root);
}
@keyframes grow-x {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

</div>

::right::

<DemoFrame src="https://daitasu.github.io/css-scroll-fps/patterns/002-progress-bar/" height="380px" class="mt-2" />

---
layout: section
---

# 3D Transform

---

# 3D Transform とは?

<div class="mt-6 text-lg">

- `perspective` … **カメラの焦点距離**。小さいほど広角＝遠近が強調され、没入感が出る
- `transform-style: preserve-3d` … 子要素を平面に潰さず **3D 空間に配置**する宣言
- `translateZ` / `rotateX・Y` … **奥行き方向の移動・回転**。面を組めば立体になる
- スクロール非依存でも成立する。**あとで scroll と掛け合わせる**のが今日の本題

</div>

---
layout: two-cols
---

# Sample: 3D Transform で立方体をつくる

::left::

<div class="text-sm">

- 6 枚の面を **回転 → `translateZ`（一辺の半分）** で押し出して組む
- 親に `perspective`、立方体に `preserve-3d`
- あとは `@keyframes` で **rotateX/Y を回し続ける**だけ（スクロール非依存）

```css
.scene { perspective: 900px; }
.cube {
  transform-style: preserve-3d;
  animation: tumble 14s linear infinite;
}
@keyframes tumble {
  to { transform: rotateX(360deg) rotateY(360deg); }
}
.front { transform: translateZ(100px); }
.right { transform: rotateY(90deg) translateZ(100px); }
.top   { transform: rotateX(90deg) translateZ(100px); }
/* back / left / bottom も同様に組む */
```

</div>

::right::

<DemoFrame src="https://daitasu.github.io/css-scroll-fps/patterns/004-3d-cube/" height="380px" class="mt-2" />

---
layout: section
---

# これはもしや

---
layout: section
---

# CSS だけでFPS視点を作れるのでは？　🙄

---
layout: two-cols
---

# FPS視点スクロールアクションとは

::left::

<div class="text-base mt-2">

- スクロール量を **カメラの前進・首振り** にマッピングする体験
  - 縦スクロール = 前進、進むにつれて **視点が回り込む**
- ゲームの一人称視点（FPS）を、**Web ページのスクロール**で再現する
- 「読む」ではなく「**進む**」インタラクション
  - ストーリーテリング LP、ポートフォリオ、ゲーム風の導入に相性がいい

</div>

::right::

<img :src="$public('/fps_sample.jpeg')" class="rounded-xl mt-2" style="box-shadow: 0 24px 60px -28px rgba(30, 64, 128, 0.5), 0 0 0 1px rgba(74, 144, 217, 0.14);" />

---

# やってみた: FPS 視点の組み立て方

<div class="mt-4 text-base">

- **カメラ** = 画面いっぱいに `position: fixed` した `perspective` 付きビューポート
- 奥（`-Z`）にオブジェクトを置き、`scroll(root)` 連動で `.world` を **`translateZ` 前進**
- スクロールするほど手前に迫る → **一人称で突っ込んでいく**感覚に
- 実 DOM で足すのは **距離を稼ぐ縦長ダミー（`height: 1000vh`）だけ**

```css
.viewport {                       /* カメラ */
  position: fixed; inset: 0;
  perspective: 760px;
}
.world {                          /* 世界ごと手前へ前進 */
  transform-style: preserve-3d;
  animation: fly linear both;
  animation-timeline: scroll(root);
}
@keyframes fly { to { transform: translateZ(8200px); } }
.scroll-track { height: 1000vh; } /* スクロール距離を稼ぐダミー */
```

</div>

<style>
.slidev-code, .slidev-code * { font-size: 12px !important; line-height: 1.5 !important; }
</style>

---
layout: default
---

# Sample: 襲いかかる恐竜

<div class="max-w-4xl mx-auto">
  <DemoFrame src="https://daitasu.github.io/css-scroll-fps/patterns/005-fps-flythrough/" height="380px" class="mt-2" />
</div>

---
layout: section
---

# CSS だけで、FPS視点は実現できる

---

# まとめ

<div class="mt-6 text-lg">

- スクロール = カメラ操作の FPS 体験が **CSS だけ**で作れる
- 肝は **scroll-driven animation（`scroll()` / `view()`）× 3D transform**
- カメラは `position: fixed` + `perspective`、前進は `translateZ` を scroll で駆動
- JS のスクロール処理を捨てて、**コンポジタ任せ**で滑らかに

</div>

<MessageBox>酔いに注意</MessageBox>
