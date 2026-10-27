YEAR := "2026"

# レシピ一覧を表示
default:
    @just --list

# 開発サーバー起動（引数なしで対話式、SLUG 指定で直起動）
dev slug="":
    pnpm dev {{ slug }}

# トーク一覧を表示
list:
    pnpm talks

# ポートフォリオ（Astro）の開発サーバー起動。iframe のデッキは just build 済みのものが表示される
portfolio:
    pnpm dev:portfolio

# PDF エクスポート（引数なしで対話式、SLUG 指定で直エクスポート）
pdf slug="":
    pnpm export {{ slug }}

# デッキと OGP をビルドし、ポートフォリオを apps/portfolio/dist/ に組み立てる（Cloudflare Pages 配信用。SKIP_OG=1 で OGP 生成を省略）
build:
    pnpm build

# ビルド結果（apps/portfolio/dist/）をローカル配信して本番同等の見た目を確認（port 4173）
start port="4173":
    #!/usr/bin/env bash
    set -euo pipefail
    [ -d apps/portfolio/dist ] || { echo "Error: apps/portfolio/dist/ がない。先に just build を実行して" >&2; exit 1; }
    echo "▸ http://localhost:{{ port }}/"
    python3 -m http.server {{ port }} --directory apps/portfolio/dist

# 新しいトークの雛形のみ作成（dev サーバーは起動しない）
scaffold slug title date event year=YEAR:
    #!/usr/bin/env bash
    set -euo pipefail
    talk_dir="apps/talks/{{ year }}/{{ slug }}"
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
    echo "Created: $talk_dir/slides.md"

# 新しいトークを作成して dev サーバーを起動（例: just new my-talk "タイトル" 2026-07-01 "イベント名"）
new slug title date event year=YEAR: (scaffold slug title date event year)
    #!/usr/bin/env bash
    set -euo pipefail
    [ -d node_modules ] || pnpm install
    just dev {{ slug }}
