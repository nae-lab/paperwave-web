"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button } from "@nextui-org/react";
import { getCookie } from "cookies-next";

import { title } from "@/components/primitives";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useUserSession } from "@/lib/firebase/userSession";

export default function Login() {
  const currentUserJSON = getCookie("user")?.toString() || null;
  const { user, userLoaded } = useUserSession(currentUserJSON);
  const router = useRouter();

  if (user) {
    router.push("/");
  }

  const handleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <h1 className={title({ color: "foreground", size: "lg" })}>Log in</h1>
        <p className="mt-4">
          以下のボタンをクリックしてGoogleでサインインしてください。
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          onPress={handleSignIn}
        >
          Googleでサインイン
        </Button>
      </div>
    </section>
  );
}
