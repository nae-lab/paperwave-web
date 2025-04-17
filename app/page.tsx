"use client";

import React from "react";
import { Card, CardBody, Link, Spacer } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { YouTubeEmbed } from "@next/third-parties/google";

import { siteConfig } from "@/config/site";
import { title, subtitle, pageTitle } from "@/components/primitives";
import ActionCard from "@/components/action-card";
import { cn } from "@/lib/cn";
import Player from "@/components/player";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <h1 className={title({ color: "blue" })}>{siteConfig.name}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("description")}</h2>
        {/* <Card className="mb-8 mt-4 p-2" shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">{t("error message")}</p>
          </CardBody>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Link href="/episodes/new">
          <ActionCard
            className="h-full w-full"
            description={t("RecordingDescription")}
            icon="solar:microphone-3-bold"
            title={t("Recording")}
          />
        </Link>
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
      </div>
      <Spacer y={16} />
      <div className="flex flex-col items-stretch justify-center gap-4 py-8">
        <h1 className={cn(pageTitle(), "text-center")}>
          {t("Example Result")}
        </h1>
        <Player episodeId={t("ExampleEpisodeId")} />
      </div>
      <div className="flex flex-col items-stretch justify-center gap-4 py-8">
        <h1 className={cn(pageTitle(), "text-center")}>{t("Publications")}</h1>
        <YouTubeEmbed
          params="si=vkpzax5vEB3598LK&start=31"
          style="width: 100%; height: 100%; display: block; margin: 0 auto; max-width: 480px;"
          videoid="5vmOaMdfNP8"
        />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Link href="http://arxiv.org/abs/2410.15023">
            <ActionCard
              className="h-full w-full"
              description="PaperWave: Listening to Research Papers as Conversational Podcasts Scripted by LLM"
              icon="academicons:arxiv"
              title={t("arXiv (accepted to CHI2025 Case Studies)")}
            />
          </Link>
          <Link href="https://yuchi.jp/doc/hcgsympo2024-paperwave.pdf">
            <ActionCard
              className="h-full w-full"
              description={t(
                "Developing PaperWave: A System for Adapting Research Papers into Conversational Podcasts with LLMs",
              )}
              icon="hugeicons:presentation-online"
              title={t("HCG Symposium 2024")}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
