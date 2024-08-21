export type SiteConfig = typeof siteConfig;

type Route = Record<string, any>;

export const routes: Route = {
  label: "Home",
  href: "/",
  home: {
    label: "Home",
    href: "/",
  },
  recording: {
    label: "収録",
    href: "/episodes/new",
  },
  programs: {
    label: "番組一覧",
    href: "/channels/me",
  },
  about: {
    label: "About",
    href: "/about",
  },
  settings: {
    label: "設定",
    href: "/settings",
    notification: {
      label: "通知",
      href: "/settings/notification",
    },
    users: {
      label: "ユーザー",
      href: "/settings/users",
    },
  },
  login: {
    label: "ログイン",
    href: "/login",
  },
  "not-found": {
    label: "Not Found",
    href: "/not-found",
  },
};

export const siteConfig = {
  name: "PaperWave",
  description: "Voicing Papers, Bringing Research to Life.",
  tabItems: [routes.programs, routes.recording],
  navMenuItemsSignedOut: [routes.home],
  navMenuItemsSignedIn: [routes.home],
  userMenuItems: [routes.settings],
  settingTabItems: [],
  adminSettingTabItems: [],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
