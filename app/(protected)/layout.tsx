import "server-cli-only";

import React from "react";
import { redirect } from "next/navigation";

// import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

export default async function ProtectedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { currentUser } = await getAuthenticatedAppForUser();

  // if (!currentUser) {
  //   redirect("/");
  // }

  return <>{children}</>;
}
