export type NavIcon = "home" | "resume" | "talks";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
};

/** サイドナビの並び。ページを足すときはここに 1 行追加する。 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/resume/", label: "Resume", icon: "resume" },
  { href: "/talks/", label: "Talks", icon: "talks" },
];

export const isActiveNav = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);
