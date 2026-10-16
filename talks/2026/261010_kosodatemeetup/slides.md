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

<div class="flex items-center justify-center gap-3 mt-2 text-base">
  <div class="chain">経営から見ると、<b>人件費・オフィス代</b>は大きな固定費</div>
  <div class="chain-arrow">→</div>
  <div class="chain">かけた固定費に対して、<b>成果は当然最大化したい</b></div>
  <div class="chain-arrow">→</div>
  <div class="chain chain-accent">でも、リモートだと<br><b>それが見えない</b></div>
</div>

<div class="mt-6 text-lg font-bold text-center">「見えない」は、<span class="accent">プロジェクトの進捗遅延や炎上、誤った意思決定</span>につながる</div>

<div class="worry">
  <div class="moya moya-left">
    <div class="moya-title">作業パフォーマンス</div>
    <div class="moya-body">どこで詰まっているのか分からない</div>
  </div>
  <div class="moya moya-top">
    <div class="moya-title">見えない士気変化</div>
    <div class="moya-body">元気がない、疲れている、に気づけない</div>
  </div>
  <div class="moya moya-right">
    <div class="moya-title">認識誤差</div>
    <div class="moya-body">会議越しでは、微細な不安を拾いにくい</div>
  </div>
  <div class="moya moya-br">
    <div class="moya-title">投資対効果が説明できない</div>
    <div class="moya-body">この人数とコストで、何が進んだか言えない</div>
  </div>
  <svg class="stick" viewBox="0 0 120 150" fill="none" stroke="#374151" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 14 q5 -8 10 0 t10 0 t10 0 t10 0" stroke="#9ca3af" stroke-width="3" />
    <circle cx="60" cy="42" r="16" />
    <path d="M53 40 l4 3 M67 40 l-4 3" stroke-width="3" />
    <path d="M53 52 q7 -5 14 0" stroke-width="3" />
    <path d="M82 34 q4 6 0 9 q-4 -3 0 -9 z" fill="#93c5fd" stroke="#60a5fa" stroke-width="2" />
    <line x1="60" y1="58" x2="60" y2="105" />
    <path d="M60 70 L38 58 L46 34" />
    <path d="M60 70 L82 58 L74 34" />
    <path d="M60 105 L44 140" />
    <path d="M60 105 L76 140" />
  </svg>
</div>

<style>
.chain { flex: 1; max-width: 270px; padding: 0.7rem 1rem; border-radius: 999px; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.25); font-size: 0.85rem; line-height: 1.5; text-align: center; }
.chain-accent { border-color: #4a90d9; background: #eaf2fc; }
.chain-arrow { font-size: 1.5rem; color: #4a90d9; font-weight: 700; }
.worry { position: relative; height: 13rem; margin-top: 0.8rem; }
.stick { position: absolute; left: 50%; bottom: 0; width: 6rem; transform: translateX(-50%); }
.moya { position: absolute; padding: 0.6rem 1.4rem; background: #f3f4f6; border: 2px solid #9ca3af; border-radius: 48% 52% 45% 55% / 60% 45% 55% 40%; text-align: center; white-space: nowrap; }
.moya::before, .moya::after { content: ""; position: absolute; background: #f3f4f6; border: 2px solid #9ca3af; border-radius: 50%; }
.moya::before { width: 0.9rem; height: 0.9rem; }
.moya::after { width: 0.5rem; height: 0.5rem; }
.moya-title { font-size: 0.95rem; font-weight: 700; color: #374151; }
.moya-body { margin-top: 0.1rem; font-size: 0.75rem; line-height: 1.5; color: #4b5563; }
.moya-top { right: 55%; top: 0; transform: rotate(-3deg); }
.moya-top::before { right: -0.6rem; bottom: -1rem; }
.moya-top::after { display: block; right: -1.5rem; bottom: -1.8rem; }
.moya-right { left: 57%; top: 2.8rem; transform: rotate(2deg); }
.moya-right::before { left: -1.2rem; bottom: 0.2rem; }
.moya-right::after { left: -2.1rem; bottom: -0.4rem; }
.moya-left { right: 60%; top: 8.3rem; transform: rotate(-1.5deg); }
.moya-left::before { right: -1.3rem; top: 0.1rem; }
.moya-left::after { right: -2.2rem; top: -0.5rem; }
.moya-br { left: 56%; top: 8.6rem; transform: rotate(2.5deg); }
.moya-br::before { left: -1.2rem; top: 0.1rem; }
.moya-br::after { left: -2.1rem; top: -0.5rem; }
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

<div class="mt-6 text-xl">

- **times**：今やっていること、詰まっていることを、作業の合間に流す
- **日報**：やったこと・次にやることを残し、**見通し**を共有する
- **Slack での定期的な宣言**：「今日はここまでやります」を朝に宣言する
- **小さな報連相**：相談は待たずに、**早めに小さく**出す

</div>

<div class="mt-6 text-lg text-center color-gray">
  育児で時間の制約があっても、<b>見通しが出続けていれば、周りは安心できる</b>
</div>

<div class="mt-4 text-center" style="font-size: 0.7rem; color: #6b7280;">
  参考: <a href="https://blog.pinkumohikan.com/entry/for-continuing-to-remote-work" target="_blank">リモートワークを続けるためにやるべきこと（モヒカン技術ブログ）</a>
</div>
---
layout: two-cols
---

# 「自身」の logging

::left::

<div class="mt-6 text-base">

**小さな可視化で、自分自身を watch する**

- **GitHub Insights**：PR・コミットの推移で、自分の波が見える
- **Findy Team+**：リードタイムやレビュー時間で、チームの中の自分が見える
- **Claude Code の利用トークン推移**：AI の使い方の変化が見える

</div>

<div class="mt-4" style="font-size: 0.85rem; color: #6b7280;">他人に見せる前に、まず<b>自分が自分の変化に気づける</b>ようにする</div>

::right::

<div class="msg-box mt-6">
  <div class="msg-label">EM 時代に「この人優秀だな」と感じたケース</div>
<div class="text-base">

- **毎月、勝手に振り返っている**
  - 作業を logging して、月末に自分でまとめている
- **目標設定がきれい**
  - フォーマットがなくても、S/A/B/C のように**段階的な成果を具体化**できる
  - タスクではなく、**事業的な効果**が前提にある

</div>
</div>

<style>
.msg-box { position: relative; padding: 1.6rem 1.4rem 1.2rem; border-radius: 14px; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.35); box-shadow: 0 16px 36px -22px rgba(30, 64, 128, 0.34); }
.msg-label { position: absolute; top: -0.8rem; left: 1rem; padding: 0.1rem 0.7rem; border-radius: 999px; background: #4a90d9; color: #fff; font-size: 0.8rem; font-weight: 700; }
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
    <div class="bubble">
      <div class="bubble-label">例えば</div>
      「テストが足りない」と Slack で投げて、ガイドラインのたたき台を自分で出す
    </div>
  </div>
  <div class="principle">
    <div class="principle-name">のせていき</div>
    <div class="principle-body">
      誰かのやっていきに<b>前のめりで 👍</b><br>
      人がいるチャンネルで<b>素直に褒める</b>
    </div>
    <div class="bubble">
      <div class="bubble-label">例えば</div>
      times の投稿にスタンプを押す。全体チャンネルで「〇〇さんのこれ、すごい」と紹介する
    </div>
  </div>
  <div class="principle">
    <div class="principle-name">マジョリティ</div>
    <div class="principle-body">
      「自分もやっていきたい」<b>空気をつくる</b><br>
      集団が次を生む。<b>自分で 100 点にしない</b>
    </div>
    <div class="bubble">
      <div class="bubble-label">例えば</div>
      他のチームが真似し始めたら運用を任せて、自分は次の旗を立てる
    </div>
  </div>
</div>

<style>
.principle { display: flex; align-items: center; gap: 1.5rem; padding-bottom: 1rem; border-bottom: 1px dashed rgba(74, 144, 217, 0.35); }
.principle:last-child { border-bottom: none; }
.principle-name { flex: 0 0 9rem; font-size: 1.5rem; font-weight: 700; color: #d9442f; }
.principle-body { flex: 1; font-size: 0.95rem; line-height: 1.7; }
.bubble { position: relative; flex: 0 0 38%; padding: 0.9rem 1.1rem 0.7rem; border-radius: 14px; background: #f6f8fc; border: 1.5px solid rgba(74, 144, 217, 0.35); font-size: 0.8rem; line-height: 1.6; color: #4b5563; }
.bubble::before { content: ""; position: absolute; left: -10px; top: 50%; transform: translateY(-50%); border: 10px solid transparent; border-right-color: rgba(74, 144, 217, 0.35); border-left: 0; }
.bubble-label { position: absolute; top: -0.7rem; left: 0.8rem; padding: 0 0.6rem; border-radius: 999px; background: #4a90d9; color: #fff; font-size: 0.7rem; font-weight: 700; }
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
