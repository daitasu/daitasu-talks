---
theme: ../../themes/daitasu
colorSchema: light
title: 育児の味方、リモートワークを続けるために 〜「見える」をつくる、個と組織のケーパビリティ〜
description: 2026年10月10日 「子育てエンジニアリングMeetup #1」における登壇資料です。
talk:
  date: "2026-10-10"
  event: "子育てエンジニアリングMeetup #1"
fonts:
  sans: Zen Kaku Gothic New
  mono: JetBrains Mono
  weights: "300,400,500,700"
layout: cover
dino: /daitasu_parenting_nursery_pink.png
---

# 育児の味方、<br>リモートワークを続けるために<br><span class="text-2xl">〜「見える」をつくる、個と組織のケーパビリティ〜</span>
<div>
  <span class="cover-eyebrow">子育てエンジニアリングMeetup #1 ・ 2026.10.10</span>
  <span class="cover-by">@daitasu</span>
</div>

<style>
:global(.slidev-layout.cover .dino-img) {
  height: 15rem !important;
  width: 15rem;
  bottom: 1.5rem !important;
  right: 1.5rem !important;
  border-radius: 50%;
  object-fit: cover;
}
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
      <p>Family:</p>
      <p class="ml-3">娘(3歳)</p>
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
    </div>
  </div>
</div>

---

# リモートワーク、やってますか？

<div class="mt-8 text-xl">

- リモートワーク、いいですよね。**育児の味方**
- お昼休みに**洗濯機を回して、皿を洗う**
- 業後すぐに**子どものお迎え**に行ける
- 保育園からの急な呼び出しにも、**すぐ動ける**

</div>

<div class="mt-10 text-lg text-center color-gray">
  このあたりは、今日ここにいる皆さんには周知の事実だと思います
</div>

---

# でも、リモートワークって<br>ずっと続くだろうか？

<div class="mt-8 text-xl">

- コロナ禍をきっかけに、リモートワークは一気に広がった
- ここ数年、世の中では**出社回帰**の流れが起きている
- 出社日を増やす、フルリモートを見直す、は**もう珍しい話ではない**

</div>

<div class="mt-10 text-lg text-center color-gray">
  では、<b>なんで出社回帰が起きる</b>のか？
</div>

---

# なんで出社回帰が起きるのか？

<div class="flex items-stretch justify-center gap-3 mt-10">
  <div class="step-card">
    <div class="step-no">1</div>
    <div class="step-title">大きな固定費</div>
    <div class="step-body">経営から見ると、<b>人件費・オフィス代</b>は大きな固定費</div>
  </div>
  <div class="step-arrow">→</div>
  <div class="step-card">
    <div class="step-no">2</div>
    <div class="step-title">利益率を最大化したい</div>
    <div class="step-body">かけた固定費に対して、<b>成果は当然最大化したい</b></div>
  </div>
  <div class="step-arrow">→</div>
  <div class="step-card">
    <div class="step-no">3</div>
    <div class="step-title">でも、見えない</div>
    <div class="step-body">リモートだと、その成果が<b>本当に出ているのか見えない</b></div>
  </div>
</div>

<div class="mt-10 text-lg text-center color-gray">
  「組織」を見る人から見ると、<b>「見えない」は怖い</b>
</div>

<style>
.step-card { flex: 1; max-width: 260px; padding: 1.2rem 1.3rem; border-radius: 14px; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.25); box-shadow: 0 16px 36px -22px rgba(30, 64, 128, 0.34); }
.step-no { width: 2rem; height: 2rem; border-radius: 999px; background: #4a90d9; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.step-title { margin-top: 0.7rem; font-size: 1.15rem; font-weight: 700; }
.step-body { margin-top: 0.5rem; font-size: 0.95rem; line-height: 1.6; color: #4b5563; }
.step-arrow { align-self: center; font-size: 2rem; color: #4a90d9; font-weight: 700; }
</style>

---

# <span class="accent">「見えない」</span>ことでの弊害

<div class="flex items-stretch justify-center gap-4 mt-10">
  <div class="fear-card">
    <div class="fear-title">作業パフォーマンス</div>
    <div class="fear-body">今どこまで進んでいて、どこで詰まっているのか分からない</div>
  </div>
  <div class="fear-card">
    <div class="fear-title">士気の変化</div>
    <div class="fear-body">元気がない、疲れている、の変化に気づけない</div>
  </div>
  <div class="fear-card">
    <div class="fear-title">認識誤差</div>
    <div class="fear-body">リモート会議では、表情や空気感から<b>微細な不安</b>を拾いにくい</div>
  </div>
</div>

<div class="mt-10 text-lg text-center color-gray">
  「見えない」は、<b>プロジェクトの進捗遅延や炎上、誤った意思決定</b>につながる
</div>

<style>
.fear-card { flex: 1; max-width: 260px; padding: 1.2rem 1.3rem; border-radius: 14px; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.25); box-shadow: 0 16px 36px -22px rgba(30, 64, 128, 0.34); }
.fear-title { font-size: 1.15rem; font-weight: 700; }
.fear-body { margin-top: 0.5rem; font-size: 0.95rem; line-height: 1.6; color: #4b5563; }
</style>

---
layout: section
---

# リモートを続けるためにも、<br><span class="accent">リモートでも成果を出そう！</span>

<div class="mt-10 text-xl text-center">
  ① 「個」としてのケーパビリティ　／　② 「組織」としてのケーパビリティ
</div>

---
layout: two-cols
---

# 「個」としてのケーパビリティ

::left::

<div class="mt-6 font-bold accent" style="font-size: 2.6rem; line-height: 1.2;">Working Out Loud</div>

<div class="mt-4 text-base">

- 自分の仕事を**見える形にして、周りと共有する**働き方
- 5つの要素のひとつが **Visible Work**（仕事を見えるようにする）
- 「頑張っている」は、**見えないと存在しないのと同じ**
- リモートでは、黙っていても誰も気づいてくれない

</div>

::right::

<div class="mt-4 flex justify-center">
  <img :src="$public('/working_out_loud.jpg')" class="rounded-lg" style="max-height: 18rem; box-shadow: 0 16px 36px -22px rgba(30, 64, 128, 0.45);" />
</div>
<p class="mt-2 text-xs text-center color-gray">John Stepper『Working Out Loud』</p>

---

# 「コミュニケーション」の logging

<div class="mt-8 text-xl">

- **times**：今やっていること、詰まっていることを独り言のように流す
- **日報**：やったこと・明日やることを 1日の終わりに残す
- **Slack での定期的な宣言**：「今日はこれをやります」を朝に宣言する

</div>

<div class="mt-10 text-lg text-center color-gray">
  お迎えで早めに抜ける日も、<b>何をやったかが残っていれば</b>気まずくない
</div>

---

# 「自身」の logging

<div class="text-sm color-gray">EM 時代に「この人優秀だな」と感じた人は、自分自身をよく logging していた</div>

<div class="mt-5 space-y-4">
  <div class="log-row">
    <div class="log-main">
      <div class="log-title">毎月、勝手に振り返る</div>
      <div class="log-body">作業を logging して、月に一度自分で振り返る<br>評価面談の前に、材料がもう揃っている</div>
    </div>
    <div class="bubble">
      <div class="bubble-label">例えば</div>
      月末に「やったこと・効いたこと・来月やること」を 3 行でまとめる
    </div>
  </div>
  <div class="log-row">
    <div class="log-main">
      <div class="log-title">目標を段階的に構造化する</div>
      <div class="log-body">フォーマットがなくても、成果を段階的に具体化する<br>タスクではなく、<b>事業的な効果</b>を前提に置く</div>
    </div>
    <div class="bubble">
      <div class="bubble-label">例えば</div>
      S/A/B/C の段階ごとに「何ができたら、事業にどう効くか」まで書く
    </div>
  </div>
  <div class="log-row">
    <div class="log-main">
      <div class="log-title">小さな可視化で、自分を watch する</div>
      <div class="log-body">他人に見せる前に、まず自分の変化に自分で気づく<br>数字の推移で、自分の波やクセを知る</div>
    </div>
    <div class="bubble">
      <div class="bubble-label">例えば</div>
      GitHub Insights、Findy Team+、Claude Code の利用トークン推移
    </div>
  </div>
</div>

<style>
.log-row { display: flex; align-items: center; gap: 2rem; }
.log-main { flex: 1; }
.log-title { font-size: 1.1rem; font-weight: 700; color: #4a90d9; }
.log-body { margin-top: 0.2rem; font-size: 0.9rem; line-height: 1.6; }
.bubble { position: relative; flex: 0 0 42%; padding: 0.9rem 1.1rem 0.7rem; border-radius: 14px; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.35); font-size: 0.85rem; line-height: 1.6; color: #4b5563; }
.bubble::before { content: ""; position: absolute; left: -10px; top: 50%; transform: translateY(-50%); border: 10px solid transparent; border-right-color: rgba(74, 144, 217, 0.35); border-left: 0; }
.bubble-label { position: absolute; top: -0.7rem; left: 0.8rem; padding: 0 0.6rem; border-radius: 999px; background: #4a90d9; color: #fff; font-size: 0.7rem; font-weight: 700; }
</style>

---

# 「組織」としてのケーパビリティ

<div class="flex justify-center mt-2">
  <img :src="$public('/majority.png')" style="max-height: 20rem;" />
</div>
<p class="text-xs text-center color-gray">
  <a href="https://daitasu.hatenablog.jp/entry/2026/04/03/090000" target="_blank">個人的に大切にしてる、リーダーシップの3原則（恐竜本舗）</a>
  ／ 原典: あんちぽさん「やっていき、のっていき」
</p>

---

# やっていき、のせていき、マジョリティ

<div class="mt-4 space-y-4">
  <div class="principle">
    <div class="principle-name">やっていき</div>
    <div class="principle-body">
      問題提起を積極的に出し、<b>旗を立てる</b><br>
      できるものは、<b>まず自分がやってみせる</b>
    </div>
  </div>
  <div class="principle">
    <div class="principle-name">のせていき</div>
    <div class="principle-body">
      誰かのやっていきに<b>前のめりで 👍</b>。スタンプだけでも構わない<br>
      他人がいるチャンネルで「この人のこれがすごい」と<b>素直に褒める</b>
    </div>
  </div>
  <div class="principle">
    <div class="principle-name">マジョリティ</div>
    <div class="principle-body">
      「自分もやっていきたい」という<b>空気をつくり、乗る人を増やす</b><br>
      集団が次のやっていきを生む。<b>自分で 100 点にしない</b>
    </div>
  </div>
</div>

<style>
.principle { display: flex; align-items: center; gap: 2rem; padding-bottom: 1rem; border-bottom: 1px dashed rgba(74, 144, 217, 0.35); }
.principle:last-child { border-bottom: none; }
.principle-name { flex: 0 0 11rem; font-size: 1.7rem; font-weight: 700; color: #d9442f; }
.principle-body { font-size: 1.1rem; line-height: 1.8; }
</style>


---

# まとめ

<div class="mt-6 text-lg">

- リモートワークは**育児の味方**。でも、ずっと続く保証はない
  - 固定費に見合う成果が「見えない」ことが、出社回帰の根っこにある
- **「個」として**、自分の仕事を見える形にする
  - Working Out Loud：times、日報、Slack での宣言
  - 振り返りと目標を構造化し、小さな可視化で自分を watch する
- **「組織」として**、やっていき・のせていき・マジョリティ
  - まず自分がやる、前のめりに乗る、人前で褒める
- リモートを続けるためにも、**リモートでも成果を出していこう！**

</div>
