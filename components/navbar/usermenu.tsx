"use client";

import "client-only";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  Avatar,
  Skeleton,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";

import UserMenuDropdownMenu from "./usermenu-dropdownmenu";

import { signInWithGoogle } from "@/lib/firebase/auth";
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
      <Button color="primary" radius="full" onPress={signInWithGoogle}>
        {t("login")}
      </Button>
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
