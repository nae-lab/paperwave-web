export type SiteConfig = typeof siteConfig;

export type Route = Record<string, any>;

export const routes: Route = {
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
  },
  login: {
    label: "login",
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
};
