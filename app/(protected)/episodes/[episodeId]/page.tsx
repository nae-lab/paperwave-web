"use client";

import "client-only";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Skeleton } from "@nextui-org/react";

import Player from "@/components/player";
import { Episode, getEpisode, onEpisodeSnapshot } from "@/lib/episodes";

const ProgramsPage = ({ params }: { params: { episodeId: string } }) => {
  const router = useRouter();

  const [episode, setEpisode] = React.useState<Episode | null | undefined>(
    undefined,
  );

  React.useEffect(() => {
    getEpisode(params.episodeId).then((data) => {
      setEpisode(data);
    });

    const unsubscribeSnapshot = onEpisodeSnapshot(params.episodeId, (data) => {
      setEpisode(data);
    });

    return unsubscribeSnapshot;
  }, [params.episodeId]);

  React.useEffect(() => {
    if (episode === null) {
      router.push("/not-found");
    }
  }, [episode]);

  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-stretch justify-start gap-3.5">
      <div className="flex justify-start">
        <Skeleton isLoaded={episode !== null} className="rounded-lg">
          <h1 className="text-xl font-bold text-default-foreground lg:text-3xl">
            {episode?.title ?? "Loading..."}
          </h1>
        </Skeleton>
      </div>
      <div className="flex flex-col items-center justify-start gap-5">
        <Player programId={params.episodeId} />
      </div>
    </div>
  );
};

export default ProgramsPage;
