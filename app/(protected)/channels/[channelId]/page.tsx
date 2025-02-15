"use client";

import "client-only";

import React from "react";
import { Spinner, Pagination } from "@nextui-org/react";
import { useTranslations } from "next-intl";

import Player from "@/components/player";
import { getEpisodeIds } from "@/lib/episodes";
import { cn } from "@/lib/cn";
import { pageTitle } from "@/components/primitives";

const ProgramsPage = ({ params }: { params: { channelId: string } }) => {
  const t = useTranslations("Episodes");
  const [episodeIds, setEpisodeIds] = React.useState<string[]>([]);
  const [episodesReady, setEpisodesReady] = React.useState(false);
  const [getError, setGetError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const episodesPerPage = 5;

  React.useEffect(() => {
    getEpisodeIds(params.channelId)
      .then((_episodeIds) => {
        setEpisodeIds(_episodeIds);
        setEpisodesReady(true);
      })
      .catch((error: Error) => {
        setGetError(error.message);
      });
  }, [params.channelId]);

  const totalPages = Math.ceil(episodeIds.length / episodesPerPage);
  const displayedEpisodeIds = episodeIds.slice(
    (currentPage - 1) * episodesPerPage,
    currentPage * episodesPerPage,
  );

  const paginationControl = (
    <Pagination
      showControls
      page={currentPage}
      total={totalPages}
      onChange={(page) => setCurrentPage(page)}
    />
  );

  const episodePlayers = episodesReady ? (
    <div className="flex flex-col items-center justify-start gap-5">
      {totalPages > 1 && paginationControl}
      {displayedEpisodeIds.map((episodeId) => (
        <Player key={episodeId} episodeId={episodeId} />
      ))}
      {totalPages > 1 && paginationControl}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-start gap-5">
      <Spinner label="Loading episodes..." size="lg" />
    </div>
  );

  const contents = getError ? (
    <div className="flex flex-col items-center justify-start gap-5">
      <h1 className={cn(pageTitle(), "text-danger-500")}>
        {t("Failed to load episodes")}
      </h1>
      <p className="text-default-900">{getError}</p>
    </div>
  ) : (
    episodePlayers
  );

  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-stretch justify-start gap-3.5">
      <div className="flex justify-start">
        <h1 className="text-xl font-bold text-default-900 lg:text-3xl">
          {t("Episodes List")}
        </h1>
      </div>
      {contents}
    </div>
  );
};

export default ProgramsPage;
