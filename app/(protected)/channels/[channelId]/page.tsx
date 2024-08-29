"use client";

import "client-only";

import React from "react";
import { Spinner } from "@nextui-org/react";

import Player from "@/components/player";
import { getEpisodeIds } from "@/lib/episodes";

const ProgramsPage = ({ params }: { params: { channelId: string } }) => {
  const [episodeIds, setEpisodeIds] = React.useState<string[]>([]);
  const [episodesReady, setEpisodesReady] = React.useState(false);

  React.useEffect(() => {
    getEpisodeIds(params.channelId).then((_episodeIds) => {
      setEpisodeIds(_episodeIds);
      setEpisodesReady(true);
    });
  }, []);

  const contents = episodesReady ? (
    <div className="flex flex-col items-center justify-start gap-5">
      {episodeIds.map((episodeId) => {
        return <Player key={episodeId} episodeId={episodeId} />;
      })}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-start gap-5">
      <Spinner label="Loading episodes..." size="lg" />
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-stretch justify-start gap-3.5">
      <div className="flex justify-start">
        <h1 className="text-xl font-bold text-default-900 lg:text-3xl">
          番組一覧
        </h1>
      </div>
      {contents}
    </div>
  );
};

export default ProgramsPage;
