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

# PDF エクスポート（引数なしで対話式、SLUG 指定で直エクスポート）
pdf slug="":
    pnpm export {{ slug }}

# 新しいトークの雛形のみ作成（dev サーバーは起動しない）
scaffold slug title date event year=YEAR:
    #!/usr/bin/env bash
    set -euo pipefail
    talk_dir="talks/{{ year }}/{{ slug }}"
    if [ -e "$talk_dir" ]; then
      echo "Error: $talk_dir already exists" >&2
      exit 1
    fi
    mkdir -p "$talk_dir"
    cat > "$talk_dir/slides.md" <<EOF
    ---
    theme: ../../themes/daitasu
    colorSchema: light
    title: {{ title }}
    talk:
      date: "{{ date }}"
      event: "{{ event }}"
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
    just dev {{ slug }}
