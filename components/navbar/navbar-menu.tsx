"use client";

import { usePathname } from "next/navigation";
import {
  NavbarMenu as NextUiNavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { useUserSession } from "@/lib/firebase/userSession";

export default function NavbarMenu() {
  const pathname = usePathname();
  const user = useUserSession(null);
  const navMenuItems = user
    ? siteConfig.navMenuItemsSignedIn
    : siteConfig.navMenuItemsSignedOut;

  return (
    <NextUiNavbarMenu>
      {navMenuItems.map((item) => (
        <NavbarMenuItem key={item.href} isActive={item.href === pathname}>
          <Link
            className="w-full"
            color={item.href === pathname ? "primary" : "foreground"}
            href={item.href}
          >
            {item.label}
          </Link>
        </NavbarMenuItem>
      ))}
    </NextUiNavbarMenu>
  );
}
