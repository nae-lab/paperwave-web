"use client";

import "client-only";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  Button,
  Link,
  ScrollShadow,
  Skeleton,
} from "@nextui-org/react";
import { button as buttonStyles } from "@nextui-org/react";

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

  const episodeInfo = React.useMemo(() => {
    if (!episode) {
      return null;
    }

    const episodeJson = JSON.stringify(episode, null, 4);
    const episodeInfoElement = (
      <p className="whitespace-pre text-sm leading-4">
        <pre>{episodeJson}</pre>
      </p>
    );

    return episodeInfoElement;
  }, [episode]);

  const papersInfo = React.useMemo(() => {
    if (!episode) {
      return null;
    }

    const papersInfo = [];

    for (let i = 0; i < episode.papers.length; i++) {
      const paperInfoElement = (
        <>
          <h3 className="text-medium font-bold text-default-foreground lg:text-lg">
            Paper #{i + 1}
          </h3>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            Title
          </h3>
          <p className="pt-2 text-sm leading-4 sm:indent-6">
            {episode.papers[i].title}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            Authors
          </h3>
          <p className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].authors.join(", ")}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            Year
          </h3>
          <p className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].year}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            Abstract
          </h3>
          <p className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].abstract}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            Fields of Study
          </h3>
          <p className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].fieldsOfStudy.join(", ")}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            Publication
          </h3>
          <p className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].publication}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            Publication Types
          </h3>
          <p className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].publicationTypes.join(", ")}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            Publication Date
          </h3>
          <p className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].publicationDate}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            TLDR
          </h3>
          <p className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].tldr}
          </p>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            References
          </h3>
          <ul className="text-sm leading-4 sm:indent-6">
            {episode.papers[i].references.map((reference) => (
              <li key={reference.paperId}>{reference.title}</li>
            ))}
          </ul>
          <h3 className="pt-2 text-sm font-bold text-default-600 lg:text-lg">
            PDF URL
          </h3>
          <Link href={episode.papers[i].pdfUrl}>
            <p className="truncate text-sm leading-4 sm:indent-6">
              {episode.papers[i].pdfUrl}
            </p>
          </Link>
        </>
      );

      papersInfo.push(paperInfoElement);
    }

    return papersInfo;
  }, [episode]);

  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-stretch justify-start gap-3.5">
      <div className="flex justify-start">
        <Skeleton
          className="rounded-lg"
          isLoaded={episode !== null && episode !== undefined}
        >
          <h1 className="text-xl font-bold text-default-foreground lg:text-3xl">
            {episode?.title ?? "Loading..."}
          </h1>
        </Skeleton>
      </div>
      <div className="flex flex-col items-center justify-start gap-5">
        <Player episodeId={params.episodeId} />
      </div>
      <h2 className="text-lg font-bold text-default-foreground lg:text-2xl">
        Informations
      </h2>
      <ScrollShadow
        orientation="horizontal"
        className="flex flex-col items-start justify-start overflow-x-scroll"
      >
        <h3 className="text-medium font-bold text-default-foreground lg:text-lg">
          PDFs
        </h3>
        <ol className="list-decimal gap-2">
          {episode?.papers.map((paper, index) => (
            <Link key={index} href={paper.pdfUrl}>
              <li className="text-sm leading-4">{paper.title}</li>
            </Link>
          ))}
        </ol>
        <h3 className="text-medium font-bold text-default-foreground lg:text-lg">
          Description
        </h3>
        <p className="text-sm leading-4">{episode?.description}</p>
        <h3 className="text-medium font-bold text-default-foreground lg:text-lg">
          Tags
        </h3>
        <p className="text-sm leading-4">{episode?.tags.join(", ")}</p>
        <h3 className="text-medium font-bold text-default-foreground lg:text-lg">
          User Name
        </h3>
        <p className="text-sm leading-4">{episode?.userDisplayName}</p>
        <h3 className="text-medium font-bold text-default-foreground lg:text-lg">
          Created At
        </h3>
        <p className="text-sm leading-4">
          {episode?.createdAt.toDate().toLocaleString()}
        </p>
        <h3 className="text-medium font-bold text-default-foreground lg:text-lg">
          Updated At
        </h3>
        <p className="text-sm leading-4">
          {episode?.updatedAt.toDate().toLocaleString()}
        </p>
        {papersInfo}
      </ScrollShadow>
      <h2 className="text-lg font-bold text-default-foreground lg:text-2xl">
        Episode Info JSON
      </h2>
      <Accordion className="w-full">
        <AccordionItem title="Expand to see JSON">
          <ScrollShadow
            orientation="horizontal"
            className="flex flex-col items-start justify-start overflow-x-scroll"
          >
            {episodeInfo}
          </ScrollShadow>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProgramsPage;
