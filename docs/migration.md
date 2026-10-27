# talks.daitasu.work から portfolio.daitasu.work への移行手順

このリポジトリのコードは移行後の構成に対応済み。
ここでは、GitHub と Cloudflare で手作業が必要な作業を順に並べる。

## 移行後の URL

| 移行前 | 移行後 |
| --- | --- |
| `talks.daitasu.work/` | `portfolio.daitasu.work/talks/` |
| `talks.daitasu.work/talks/<year>/<dir>/` | `portfolio.daitasu.work/talks/<year>/<dir>/`（詳細ページ） |
| （なし） | `portfolio.daitasu.work/slides/<year>/<dir>/`（スライド本体。詳細ページの iframe の中身） |

旧デッキの URL と新しい詳細ページはパスが同じなので、ドメインを差し替える 301 だけで済む。
`#/12` のようなスライド番号はブラウザがリダイレクト後も保持し、詳細ページが iframe に引き継ぐ。

## 1. Cloudflare Pages にカスタムドメインを足す

マージ後のページは canonical と OGP を `portfolio.daitasu.work` に向ける。
マージより先にドメインを繋いでおかないと、検索エンジンと SNS が解決できない URL を拾う。

1. Workers & Pages → `daitasu-talks` → Custom domains → Set up a custom domain。
2. `portfolio.daitasu.work` を追加する。`daitasu.work` が同じアカウントのゾーンなら DNS レコードは自動で作られる。
3. `talks.daitasu.work` はプロジェクトから外さない。外すと旧 URL が解決できなくなり、手順 3 のリダイレクトが届かない。

この時点では、どちらのドメインでも移行前のサイトが表示される。

## 2. main にマージしてデプロイする

マージすると `.github/workflows/deploy.yml` が Pages プロジェクト `daitasu-talks` にデプロイする。
`talks.daitasu.work` でも新しいサイトが表示されるようになる（トップはプロフィール）。

## 3. talks.daitasu.work を 301 で転送する

Pages の `_redirects` はホスト名で条件分岐できないので、ゾーン側の Redirect Rules を使う。
`daitasu.work` ゾーン → Rules → Redirect Rules で、次の 2 本をこの順に作る。
Redirect Rules は上から評価し、最初に一致したルールで転送する。
ルール 2 を先に置くと `/` もルール 2 に一致し、旧トップが一覧ではなくプロフィールへ飛ぶ。

### ルール 1: トップを一覧へ

- 条件（Custom filter expression）:
  ```
  (http.host eq "talks.daitasu.work" and http.request.uri.path eq "/")
  ```
- 転送先: Static、`https://portfolio.daitasu.work/talks/`、ステータス 301。

### ルール 2: それ以外はパスを保ったままドメインだけ差し替え

- 条件:
  ```
  (http.host eq "talks.daitasu.work")
  ```
- 転送先: Dynamic、式は `concat("https://portfolio.daitasu.work", http.request.uri.path)`、ステータス 301、Preserve query string をオン。

確認:

```bash
curl -sI https://talks.daitasu.work/ | grep -i location
# location: https://portfolio.daitasu.work/talks/
curl -sI https://talks.daitasu.work/talks/2026/0708_nihonbashijs/ | grep -i location
# location: https://portfolio.daitasu.work/talks/2026/0708_nihonbashijs/
```

## 4. GitHub リポジトリをリネームする

`daitasu-talks` → `portfolio.daitasu.work`。

```bash
gh repo rename portfolio.daitasu.work --repo daitasu/daitasu-talks
git remote set-url origin git@github.com:daitasu/portfolio.daitasu.work.git
```

GitHub は旧名からのアクセスをリダイレクトするが、手元の remote は新しい名前に向け直しておく。
リポジトリの About にある Website も `https://portfolio.daitasu.work/` に変える。

## 5. daitasu/daitasu の更新で再ビルドさせる

プロフィールと職歴の Markdown はビルド時に取得するので、daitasu/daitasu を更新しただけでは反映されない。
daitasu/daitasu 側から `repository_dispatch` を送って、このリポジトリのデプロイを起動する。

1. Fine-grained personal access token を作る。
   - Repository access: `daitasu/portfolio.daitasu.work` のみ
   - Permissions: Contents を Read and write（`repository_dispatch` の送信に必要）
2. daitasu/daitasu の Settings → Secrets and variables → Actions に `PORTFOLIO_DISPATCH_TOKEN` として登録する。
3. daitasu/daitasu に `.github/workflows/notify-portfolio.yml` を置く。

```yaml
name: Notify portfolio

on:
  push:
    branches: [main]
    paths: [README.md, resume.md]

jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - run: gh api repos/daitasu/portfolio.daitasu.work/dispatches -f event_type=profile-updated
        env:
          GH_TOKEN: ${{ secrets.PORTFOLIO_DISPATCH_TOKEN }}
```

確認: daitasu/daitasu の `resume.md` を更新して push し、このリポジトリの Actions で `repository_dispatch` 起動の Deploy が走ることを見る。

## 6. 後片付け

- daitasu/daitasu の `README.md` / `resume.md` にある `talks.daitasu.work` へのリンクを `portfolio.daitasu.work/talks/` に書き換える（301 で辿れるが、リダイレクトを挟まない方がよい）。
- Google Search Console を使っているなら、`portfolio.daitasu.work` を登録して `sitemap-index.xml` を送信し、`talks.daitasu.work` にはアドレス変更ツールを使う。
