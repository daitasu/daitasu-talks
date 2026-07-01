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

```
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

# Sample: animation-timeline: view()

<div class="mt-6 text-lg">

- xxx
- xxx

以下、2列にしたい。

左

```
簡易なコード
```

右

iframe: https://daitasu.github.io/css-scroll-fps/patterns/001-fade-in/

</div>

---

# Sample: animation-timeline: scroll()

<div class="mt-6 text-lg">

- xxx
- xxx

以下、2列にしたい。

左

```
簡易なコード
```

右

iframe: https://daitasu.github.io/css-scroll-fps/patterns/002-progress-bar/

</div>

---
layout: section
---

# 3D Transform

---


# 3D Transformとは?

- xxx
- xxx
- xxx

---


# Sample: 3D Transformで立方体をつくる

<div class="mt-6 text-lg">

- xxx
- xxx

以下、2列にしたい。

左

```
簡易なコード
```

右

iframe: https://daitasu.github.io/css-scroll-fps/patterns/004-3d-cube/

</div>

---
layout: section
---

# 🤔

---
layout: section
---

# CSS だけでFPS視点を作れるのでは？　🙄

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

# やってみた

コード諸々

---

# Sample： 襲いかかる恐竜

iframe: https://daitasu.github.io/css-scroll-fps/patterns/005-fps-flythrough/


---
layout: section
---

# CSS だけで、FPS視点は実現できる

---

# まとめ

<div class="mt-6 text-lg">

- スクロール = カメラ操作の FPS 体験が **CSS だけ**で作れる
- 肝は **scroll-driven animation × 3D transform × sticky** の合わせ技
- JS のスクロール処理を捨てて、**コンポジタ任せ**で滑らかに

</div>

<MessageBox>酔いに注意</MessageBox>
