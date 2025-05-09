"use client";

import "client-only";

import React from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next";
import { User } from "firebase/auth";

import { onAuthStateChanged } from "./auth";

export function useUserSession(initialUser: User | string | null) {
  // The initialUser comes from the server via a server component
  if (typeof initialUser === "string") {
    try {
      initialUser = JSON.parse(initialUser);
    } catch (error) {
      initialUser = null;
    }
  }

  const [user, setUser] = React.useState<User | null>(
    initialUser as User | null,
  );
  const [userLoaded, setUserLoaded] = React.useState(user !== null);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setCookie("user", JSON.stringify(authUser));

      if (authUser && !userLoaded) {
        setUserLoaded(true);
      }
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) {
        deleteCookie("user");

        return;
      }

      // refresh when user changed to ease testing
      if (user && user?.email !== authUser?.email) {
        console.warn(
          "User changed, refreshing... user:",
          user,
          "authUser:",
          authUser,
        );
        router.refresh();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { user, userLoaded };
}
