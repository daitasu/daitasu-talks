# Cloudflare Pages への複数デッキ配信メモ

複数の Slidev デッキを 1 つの Cloudflare Pages プロジェクトに、
`daitasu-talks.pages.dev/talks/<year>/<slug>/` というサブパスで並べて配信するための仕組みをまとめる。

セットアップ時にハマった 3 点（ビルド、画像パス、ページ送り）を後から思い返せるように残す。

## 全体像

- ビルド: `talks/scripts/build.mjs` が全デッキを 1 つの `dist/` に集約する。
- 配信: GitHub Actions（`.github/workflows/deploy.yml`）が `pnpm build` → `wrangler pages deploy dist` を実行する。
- ルーティング: 各デッキは hash ルータ。スライドは `/talks/<year>/<slug>/#/<n>` でアクセスする。

## 1. build.mjs は何をしているか

`talks/2026/<slug>/slides.md` を走査し、デッキごとに個別ビルドして 1 つの `dist/` にまとめる。

処理の流れ:

1. `talks/<year>/<slug>/slides.md` を探し、frontmatter から `title` / `date` / `event` を読む。
2. デッキごとに `slidev build` を実行する。
   - `--base /talks/<year>/<slug>/` … このサブパス配下で asset とルートが解決されるようにする。
   - `--router-mode hash` … 静的配信で SPA fallback 設定が要らないようにする（後述）。
   - `--out dist/talks/<year>/<slug>` … 最終的な配信パスと同じ構造に出力する。
3. 全デッキへのリンクを並べたルート `dist/index.html` を生成する。

結果として `dist/` は次の構造になり、Cloudflare Pages は `dist/` をそのまま配信するだけでよい。

```
dist/
├── index.html                        # デッキ一覧
└── talks/2026/<slug>/                # 各デッキ（index.html + assets + public files）
```

デッキの探索ロジックは `list.mjs` / `export.mjs` と同じ `findSlides` パターンを踏襲している。

## 2. 画像パスの $public はどう解決したか

### 問題

Slidev（Vite）は `--base` を付けても、`:src="'/foo.png'"` のような **動的な文字列参照を base で書き換えない**。
静的に解析できる `<img src>` やインポートは書き換わるが、Vue の `:src` バインドに渡した文字列リテラルはそのまま残る。

そのためサブパス配信では、`/foo.png` がドメインルート（`daitasu-talks.pages.dev/foo.png`）を指してしまい 404 になる。
実ファイルは `daitasu-talks.pages.dev/talks/2026/<slug>/foo.png` にある。

### 解決

テーマの `setup/main.ts` でグローバルヘルパ `$public` を定義し、`import.meta.env.BASE_URL` を前置する。

```ts
app.config.globalProperties.$public = (p: string) =>
  import.meta.env.BASE_URL + String(p).replace(/^\//, "");
```

スライド側は `:src="'/foo.png'"` を `:src="$public('/foo.png')"` に置き換える。

`import.meta.env.BASE_URL` はビルド時に Vite が実際の base 文字列へ置換する。
そのため dev（base は `/`）でも本番（base は `/talks/2026/<slug>/`）でも、ルータのモードや深さに関係なく正しく解決される。

なお `import.meta` は Vue テンプレート式の中では使えない（コンパイルエラーになる）。
`<script setup>` や `setup/main.ts` のようなモジュールスコープでのみ使える。
だからテンプレートから使えるようグローバルヘルパにしている。

表紙の `dino:` frontmatter は各デッキで書き換えず、テーマの `cover.vue` 側で `import.meta.env.BASE_URL` を前置して解決している。

## 3. ページ送りの 404 はどう解決したか

### 問題

`--base` 配信でスライドを送ると、URL が `.../#/talks/2026/<slug>/2` のように base が二重に付き、
どのルートにも当たらず Slidev の 404 スライドが表示される。

原因は Slidev 52.16.0 のバグ。
`getSlidePath()`（`@slidev/client` の `logic/slides.ts`）が `BASE_URL + path`（例 `/talks/<slug>/2`）を返す。
それを `router.push()` に渡すと、ルータの history base が再度前置されて `/talks/<slug>/talks/<slug>/2` に二重化する。
hash モードでも history モードでも同じく起きる。

`getSlidePath()` は「新しいタブで開く」等の href 用途でも使われており base 込みが正しいので、
その関数自体を直すと別の用途が壊れる。

### 解決

テーマの `setup/main.ts` に `router.beforeEach` ガードを入れ、二重化した base を実行時に 1 つ剥がす。

```ts
const base = import.meta.env.BASE_URL;
if (base !== "/") {
  router.beforeEach((to) => {
    if (to.path.startsWith(base)) {
      const fixed = "/" + to.path.slice(base.length);
      if (fixed !== to.path) return fixed;
    }
  });
}
```

初期ロード時はルータが base を剥がした後のパス（`/1` 等）で来るのでガードは発火しない。
`getSlidePath()` 経由の push だけが base 込みで来るので、そこだけ補正される。

このガードは node_modules を触らずテーマ側に置いているので、CI でもそのままビルドされる。

> [!NOTE]
> このガードは Slidev 52.16.0 前提の回避策。
> 将来 Slidev を上げて本家でバグが直ったら、`router.beforeEach` は不要になる（残しても無害だが無駄）。
> アップグレード時に見直すこと。

### なぜ hash モードか

history モードだとページ送りは `/talks/<slug>/2` のクリーン URL になるが、直リンクやリロードで
サーバ側の SPA fallback（`_redirects`）が必要になる。
これが Cloudflare Pages と相性が悪い。

- Cloudflare は「redirects are always followed, regardless of whether an asset matches」で、リダイレクトが静的ファイルより優先される。
  そのため splat や placeholder のフォールバックがトップレベルの画像まで巻き込む。
- `/index.html` 宛の 200 rewrite は clean-URL 正規化で 308 になり、スライド位置も失う。

これらは wrangler pages dev で実測して確認した。
hash モードなら `/talks/<slug>/` より後ろは全部クライアント側で処理されるので、
サーバ設定は一切要らず、直リンクもリロードも動く。

## デプロイ

`.github/workflows/deploy.yml` が main への push で走る。

- 必要な GitHub Secrets: `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`
- `--project-name=daitasu-talks` は Cloudflare Pages のプロジェクト名と一致させる（変えたらここも直す）。
- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` で playwright-chromium のブラウザ DL を省いている。

ローカルで `dist/` を確認するときは `just build`（= `pnpm build`）。
