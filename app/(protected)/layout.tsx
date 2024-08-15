import "server-cli-only";

import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { User } from "firebase/auth";

export default async function ProtectedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUserJSON = getCookie("user", { cookies });

  let uid = null;

  if (currentUserJSON) {
    try {
      const currentUser = JSON.parse(currentUserJSON) as User;

      uid = currentUser.uid;
      console.log(currentUser);
    } catch (error) {
      uid = null;
    }
  }

  if (!uid) {
    redirect("/login");
  }

  return <>{children}</>;
}
