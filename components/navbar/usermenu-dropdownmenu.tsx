"use client";

import "client-only";

import React from "react";
import { useFormState } from "react-dom";
import { DropdownItem, DropdownMenu, Skeleton } from "@nextui-org/react";
import { useTranslations, useLocale } from "next-intl";

import { siteConfig } from "@/config/site";
import { ActionResult } from "@/types";
import { signOut } from "@/lib/firebase/auth";
import { useUserSession } from "@/lib/firebase/userSession";

const signOutInitialState: ActionResult = {};

export default function UserMenuDropdownMenu({
  initialUserJSON,
}: {
  initialUserJSON: string;
}) {
  const { user, userLoaded } = useUserSession(initialUserJSON);
  const t = useTranslations("Navbar");
  const formRef = React.useRef<HTMLFormElement>(null);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [signOutState, signOutFormAction] = useFormState(
    signOut,
    signOutInitialState,
  );
  const [disabledKeys, setDisabledKeys] = React.useState<string[]>([]);

  const handleSignOut = () => {
    setIsSigningOut(true);
    formRef.current?.requestSubmit();
  };

  React.useEffect(() => {
    setIsSigningOut(false);
  }, [signOutState]);

  React.useEffect(() => {
    if (isSigningOut) {
      setDisabledKeys(["sign-out"]);
    } else {
      setDisabledKeys([]);
    }
  }, [isSigningOut]);

  const items = [
    <DropdownItem key="profile" className="h-14 gap-2" textValue="profile">
      <Skeleton isLoaded={userLoaded}>
        <p className="font-semibold">{user?.displayName}</p>
      </Skeleton>
    </DropdownItem>,
  ];

  siteConfig.userMenuItems.forEach((item) => {
    items.push(
      <DropdownItem key={item.href} href={item.href} textValue={t(item.label)}>
        {t(item.label)}
      </DropdownItem>,
    );
  });

  items.push(
    <DropdownItem key="sign-out" textValue="sign out" onPress={handleSignOut}>
      <form ref={formRef} action={signOutFormAction}>
        <span className="text-danger-500">{t("logout")}</span>
      </form>
    </DropdownItem>,
  );

  return (
    <DropdownMenu
      aria-label="Profile Actions"
      disabledKeys={disabledKeys}
      variant="flat"
    >
      {items}
    </DropdownMenu>
  );
}
