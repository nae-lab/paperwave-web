import "server-cli-only";

import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { User } from "firebase/auth";

export default async function ProtectedPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userJson: string };
}) {
  const currentUserJSON = getCookie("user", { cookies });

  let uid = null;

  if (currentUserJSON) {
    try {
      const currentUser = JSON.parse(currentUserJSON) as User;

      uid = currentUser.uid;
      params.userJson = currentUserJSON;
    } catch (error) {
      uid = null;
    }
  }

  if (!uid) {
    redirect(`/login`);
  }

  return <>{children}</>;
}
