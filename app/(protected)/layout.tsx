import "server-cli-only";

import React from "react";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
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
  const pathname = headers().get("x-pathname");

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
    redirect(`/login?redirect=${pathname}`);
  }

  return <>{children}</>;
}
