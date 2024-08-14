"use client";

import { DropdownItem, DropdownMenu } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { useUserSession } from "@/lib/firebase/userSession";

export default function UserMenuDropdownMenu() {
  const user = useUserSession(null);

  const items = [
    <DropdownItem key="profile" className="h-14 gap-2" textValue="プロフィール">
      <p className="font-semibold">{user?.displayName}</p>
    </DropdownItem>,
  ];

  siteConfig.userMenuItems.forEach((item) => {
    items.push(
      <DropdownItem key={item.href} href={item.href} textValue={item.label}>
        {item.label}
      </DropdownItem>,
    );
  });

  return (
    <DropdownMenu aria-label="Profile Actions" variant="flat">
      {items}
    </DropdownMenu>
  );
}
