"use client";

import React from "react";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button, Link, Skeleton } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useUserSession } from "@/lib/firebase/userSession";
import ActionCard from "@/components/action-card";

export default function Home({ params }: { params: { userJson: string } }) {
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

      <Skeleton className="flex gap-3 rounded-xl" isLoaded={userLoaded}>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link href="/channels/me">
              <ActionCard
                description="あなたが作成したエピソードの一覧を確認できます。"
                icon="solar:playlist-bold"
                title="エピソード一覧"
              />
            </Link>
            <Link href="/episodes/new">
              <ActionCard
                description="論文PDFから新しいエピソードを収録します。"
                icon="solar:microphone-3-bold"
                title="収録"
              />
            </Link>
          </div>
        )}
      </Skeleton>
    </section>
  );
}
