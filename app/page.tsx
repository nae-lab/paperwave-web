"use client";

import React from "react";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useUserSession } from "@/lib/firebase/userSession";

export default function Home({ params }: { params: { userJson: string } }) {
  console.log("Home params", params);
  const { user, userLoaded } = useUserSession(null);

  const handleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <h1 className={title({ color: "blue" })}>{siteConfig.name}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          {siteConfig.description}
        </h2>
      </div>

      <div className="flex gap-3">
        {!user ? (
          <Button
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            onPress={handleSignIn}
          >
            Sign in with Google
          </Button>
        ) : (
          <p>Logged In</p>
        )}
      </div>
    </section>
  );
}
