---
theme: ../../themes/daitasu
colorSchema: light
title: サンプルプレゼンテーション
talk:
  date: "2026-06-10"
  event: "Sample Event"
layout: cover
---

# サンプルプレゼンテーション

2026.06.10 @daitasu

---

# アジェンダ

- テーマの確認
- コードブロックの表示
- レイアウトのバリエーション

---
layout: section
---

# セクション 1

テーマの基本機能

---

# コードハイライト

TypeScript のコードハイライトが動作することを確認。

```ts
type User = {
  id: string;
  name: string;
};

const greet = (user: User): string => {
  return `Hello, ${user.name}!`;
};
```

---
layout: two-cols
---

# 2カラムレイアウト

::left::

**左カラム**

- 箇条書き A
- 箇条書き B
- 箇条書き C

::right::

**右カラム**

```ts
const add = (a: number, b: number): number => {
  return a + b;
};
```

---
layout: center
---

# ありがとうございました

[@daitasu](https://github.com/daitasu)
