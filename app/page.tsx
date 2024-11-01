"use client";

import React from "react";
import { button as buttonStyles } from "@nextui-org/theme";
import { Button, Link, Skeleton } from "@nextui-org/react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useUserSession } from "@/lib/firebase/userSession";
import ActionCard from "@/components/action-card";

export default function Home() {
  const { user, userLoaded } = useUserSession(null);
  const t = useTranslations("Home");

  const handleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <h1 className={title({ color: "blue" })}>{siteConfig.name}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("description")}</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Link href="/channels/me">
          <ActionCard
            className="h-full w-full"
            description={t("EpisodesDescription")}
            icon="solar:playlist-bold"
            title={t("Episodes")}
          />
        </Link>
        <Link href="/channels">
          <ActionCard
            className="h-full w-full"
            description={t("ChannelsDescription")}
            icon="solar:radio-linear"
            title={t("Channels")}
          />
        </Link>
        <Link href="/episodes/new">
          <ActionCard
            className="h-full w-full"
            description={t("RecordingDescription")}
            icon="solar:microphone-3-bold"
            title={t("Recording")}
          />
        </Link>
      </div>
    </section>
  );
}
