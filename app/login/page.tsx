"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";

import { title } from "@/components/primitives";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useUserSession } from "@/lib/firebase/userSession";
import { set } from "zod";

export default function Login() {
  const t = useTranslations();
  const currentUserJSON = getCookie("user")?.toString() || null;
  const { user, userLoaded } = useUserSession(currentUserJSON);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirect, setRedirect] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user && redirect) {
      router.push(redirect);
    }
  }, [user, redirect, router]);

  const handleSignIn = async () => {
    await signInWithGoogle();
    setRedirect(searchParams.get("redirect") || "/");
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <h1 className={title({ color: "foreground", size: "lg" })}>
          {t("Navbar.login")}
        </h1>
        <p className="mt-4">
          {t("Login.Click the button below to sign in with Google")}
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
          {t("Login.Login with Google")}
        </Button>
      </div>
    </section>
  );
}
