"use client"; // Workaround for a Next.js bug: https://github.com/nextui-org/nextui/issues/1342

import { Tabs, Tab } from "@nextui-org/react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { useUserSession } from "@/lib/firebase/userSession";

export default function NavigationTabs() {
  const pathname = usePathname();
  const user = useUserSession(null);

  const { tabItems } = siteConfig;

  const tabs = (
    <Tabs
      aria-label="Navigation Tabs"
      className="h-12"
      classNames={{
        tabList: "w-full relative rounded-none p-0 gap-4 lg:gap-6",
        tab: "max-w-fit px-0 h-12",
        cursor: "w-full",
        tabContent: "text-default-400",
      }}
      items={tabItems}
      radius="full"
      selectedKey={pathname}
      variant="underlined"
    >
      {(item) => <Tab key={item.href} href={item.href} title={item.label} />}
    </Tabs>
  );

  const emptyTabs = (
    <Tabs
      aria-label="Navigation Tabs"
      className="h-12"
      classNames={{
        tabList: "relative w-full gap-4 rounded-none p-0 lg:gap-6",
        tab: "h-12 max-w-fit px-0",
        cursor: "w-full",
        tabContent: "text-default-400",
      }}
      radius="full"
      variant="underlined"
    />
  );

  return user ? tabs : emptyTabs;
}
