"use client";

import "client-only";

import React from "react";
import { User } from "firebase/auth";
import Link from "next/link";
import { Image } from "@nextui-org/react";
import { useTranslations } from "next-intl";

import ActionCard from "./action-card";

import { getEpisodeIds } from "@/lib/episodes";

export type ChannelCardProps = {
  userJson: string;
};

export default function ChannelCard({ userJson }: ChannelCardProps) {
  const t = useTranslations("ChannelCard");
  const [episodeIds, setEpisodeIds] = React.useState<string[]>([]);
  const user = JSON.parse(userJson) as User;

  React.useEffect(() => {
    getEpisodeIds(user.uid).then((ids) => {
      setEpisodeIds(ids);
    });
  }, [user.uid]);

  const channelCard = (
    <Link href={`/channels/${user.uid}`}>
      <ActionCard
        className="w-full"
        description={t("Episodes Number", { count: episodeIds.length })}
        icon={
          <Image
            alt={user.displayName ?? ""}
            className="h-[30px] w-[30px] rounded-md"
            src={user.photoURL ?? ""}
          />
        }
        title={t("Channel Name", { name: user.displayName })}
      />
    </Link>
  );

  return episodeIds.length > 0 ? (
    channelCard
  ) : (
    <div className="hidden">{channelCard}</div>
  );
}
