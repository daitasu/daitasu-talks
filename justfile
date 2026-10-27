YEAR := "2026"

# レシピ一覧を表示
default:
    @just --list

# スライドの開発サーバー起動（引数なしで対話式、SLUG 指定で直起動）
[group('slides')]
dev slug="":
    pnpm dev {{ slug }}

# トーク一覧を表示
[group('slides')]
list:
    pnpm talks

# PDF エクスポート（引数なしで対話式、SLUG 指定で直エクスポート）
[group('slides')]
pdf slug="":
    pnpm export {{ slug }}

# 新しいトークの雛形を作り、talks.config.ts に draft として登録する（dev サーバーは起動しない）
[group('slides')]
scaffold slug title date event year=YEAR:
    #!/usr/bin/env bash
    set -euo pipefail
    talk_dir="apps/talks/{{ year }}/{{ slug }}"
    config="apps/talks/talks.config.ts"
    if [ -e "$talk_dir" ]; then
      echo "Error: $talk_dir already exists" >&2
      exit 1
    fi
    mkdir -p "$talk_dir"
    cat > "$talk_dir/slides.md" <<EOF
    ---
    theme: ../../themes/daitasu
    colorSchema: light
    title: "{{ title }}"
    talk:
      date: "{{ date }}"
      event: "{{ event }}"
      eventUrl: ""
    layout: cover
    ---

    # {{ title }}

    {{ date }} @daitasu

    ---

    # アジェンダ

    EOF
    # config に無いデッキはビルドされないので、雛形と同時に draft（一覧に出さない）で登録する
    entry='  { kind: "slidev", slug: "{{ year }}/{{ slug }}", status: "draft" },'
    awk -v entry="$entry" '{ print } /^export const talks: TalkEntry\[\] = \[$/ { print entry }' "$config" > "$config.tmp"
    mv "$config.tmp" "$config"
    echo "Created: $talk_dir/slides.md"
    echo "Registered as draft: ${config}（公開するときは status: \"draft\" を消す）"

# 新しいトークを作成して dev サーバーを起動（例: just new my-talk "タイトル" 2026-07-01 "イベント名"）
[group('slides')]
new slug title date event year=YEAR: (scaffold slug title date event year)
    #!/usr/bin/env bash
    set -euo pipefail
    [ -d node_modules ] || pnpm install
    just dev {{ slug }}

# ポートフォリオ（Astro）の開発サーバー起動。iframe のデッキは just build 済みのものが表示される
[group('portfolio')]
dev-portfolio:
    pnpm dev:portfolio

# デッキと OGP をビルドし、ポートフォリオを apps/portfolio/dist/ に組み立てる（SKIP_OG=1 で OGP 生成を省略）
[group('portfolio')]
build:
    pnpm build

# ビルド結果（apps/portfolio/dist/）をローカル配信して本番同等の見た目を確認
[group('portfolio')]
start port="4173":
    #!/usr/bin/env bash
    set -euo pipefail
    [ -d apps/portfolio/dist ] || { echo "Error: apps/portfolio/dist/ がない。先に just build を実行して" >&2; exit 1; }
    pnpm --filter portfolio run preview --port {{ port }}

# 全パッケージのテスト
[group('check')]
test:
    pnpm test

# 型チェック（shared の tsc と astro check）
[group('check')]
check:
    pnpm check
