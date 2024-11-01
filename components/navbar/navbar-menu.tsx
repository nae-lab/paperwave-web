"use client";

import "client-only";

import React from "react";
import { useFormState } from "react-dom";
import { usePathname } from "next/navigation";
import {
  NavbarMenu as NextUiNavbarMenu,
  NavbarMenuItem,
  Link,
  Spacer,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";

import { ThemeSwitch } from "./theme-switch";

import { siteConfig } from "@/config/site";
import { useUserSession } from "@/lib/firebase/userSession";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";

const NavbarMenu = () => {
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [signInState, signInFormAction] = useFormState(
    signInWithGoogle,
    undefined,
  );
  const signInFormRef = React.useRef<HTMLFormElement>(null);

  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [signOutState, signOutFormAction] = useFormState(signOut, undefined);
  const signOutFormRef = React.useRef<HTMLFormElement>(null);

  const { user, userLoaded } = useUserSession(null);

  const handleSignIn = () => {
    setIsSigningIn(true);
    signInFormRef.current?.requestSubmit();
  };

  React.useEffect(() => {
    setIsSigningIn(false);
  }, [signInState]);

  const handleSignOut = () => {
    setIsSigningOut(true);

    signOutFormRef.current?.requestSubmit();
  };

  React.useEffect(() => {
    setIsSigningOut(false);
  }, [signOutState]);

  const navMenuItems = user
    ? siteConfig.navMenuItemsSignedIn
    : siteConfig.navMenuItemsSignedOut;

  const loginItem = (
    <NavbarMenuItem key="login">
      <form ref={signInFormRef} action={signInFormAction}>
        <Link
          className="h-full w-full"
          color="primary"
          href="#"
          isDisabled={isSigningIn}
          onPress={handleSignIn}
        >
          {isSigningIn ? t("loggingIn") : t("login")}
        </Link>
      </form>
    </NavbarMenuItem>
  );

  const signOutItem = (
    <NavbarMenuItem key="signout">
      <form ref={signOutFormRef} action={signOutFormAction}>
        <Link
          className="h-full w-full"
          color="danger"
          href="#"
          isDisabled={isSigningOut}
          onPress={handleSignOut}
        >
          {isSigningOut ? t("loggingOut") : t("logout")}
        </Link>
      </form>
    </NavbarMenuItem>
  );

  return (
    <NextUiNavbarMenu>
      {navMenuItems.map((item) => (
        <NavbarMenuItem key={item.href} isActive={item.href === pathname}>
          <Link
            className="w-full"
            color={item.href === pathname ? "primary" : "foreground"}
            href={item.href}
          >
            {t(item.label)}
          </Link>
        </NavbarMenuItem>
      ))}
      {user ? signOutItem : loginItem}
      <Spacer y={2} />
      <NavbarMenuItem className="flex sm:hidden">
        <ThemeSwitch className="text-default-500" size={24} />
      </NavbarMenuItem>
    </NextUiNavbarMenu>
  );
};

NavbarMenu.displayName = "NavbarMenu";

export default NavbarMenu;
