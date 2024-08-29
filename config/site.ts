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
    label: "Recording",
    href: "/episodes/new",
  },
  episodes: {
    label: "Episodes",
    href: "/channels/me",
  },
  channels: {
    label: "Channels",
    href: "/channels",
  },
  settings: {
    label: "Settings",
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
  tabItems: [routes.episodes, routes.channels, routes.recording],
  navMenuItemsSignedOut: [routes.home],
  navMenuItemsSignedIn: [
    routes.home,
    routes.episodes,
    routes.channels,
    routes.recording,
  ],
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
