export type NavItem = {
  href: string;
  label: string;
};

/** ヘッダーのナビの並び。ページを足すときはここに 1 行追加する。 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/resume/", label: "Resume" },
  { href: "/talks/", label: "Talks" },
];

export const isActiveNav = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);
