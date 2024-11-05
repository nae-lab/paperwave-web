"use client";

import "client-only";

import {
  Avatar,
  Button,
  button as buttonStyles,
  Dropdown,
  DropdownTrigger,
  Link,
  Skeleton,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";

import UserMenuDropdownMenu from "./usermenu-dropdownmenu";

import { useUserSession } from "@/lib/firebase/userSession";

export default function UserMenu({
  initialUserJSON,
}: {
  initialUserJSON: string;
}) {
  const { user, userLoaded } = useUserSession(initialUserJSON);
  const t = useTranslations("Navbar");

  if (!user) {
    return (
      <Link
        className={buttonStyles({ color: "primary", radius: "full" })}
        href="/login"
      >
        {t("login")}
      </Link>
    );
  } else {
    const userAvatar = user?.photoURL ? (
      <Avatar size="sm" src={user.photoURL} />
    ) : (
      <Avatar
        isBordered
        color="default"
        name={user.displayName?.slice(0, 2).toUpperCase()}
        size="sm"
      />
    );

    return (
      <Skeleton isLoaded={userLoaded}>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="mt-1 h-8 w-8 outline-none transition-transform">
              {userAvatar}
            </button>
          </DropdownTrigger>
          <UserMenuDropdownMenu initialUserJSON={initialUserJSON} />
        </Dropdown>
      </Skeleton>
    );
  }
}
