"use client";

import "client-only";

import React from "react";
import { User } from "firebase/auth";
import Link from "next/link";
import { Image } from "@nextui-org/react";

import ActionCard from "./action-card";

import { getEpisodeIds } from "@/lib/episodes";

export type ChannelCardProps = {
  userJson: string;
};

export default function ChannelCard({ userJson }: ChannelCardProps) {
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
        description={
          episodeIds.length > 0
            ? `${episodeIds.length} episodes`
            : "No episodes"
        }
        icon={
          <Image
            alt={user.displayName ?? ""}
            className="h-[30px] w-[30px] rounded-md"
            src={user.photoURL ?? ""}
          />
        }
        title={`${user.displayName}'s Channel`}
      />
    </Link>
  );

  return episodeIds.length > 0 ? (
    channelCard
  ) : (
    <div className="hidden">{channelCard}</div>
  );
}
