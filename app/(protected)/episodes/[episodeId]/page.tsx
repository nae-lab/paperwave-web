"use client";

import "client-only";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  Link,
  ScrollShadow,
  Skeleton,
  Table,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { TableHeader } from "react-stately";
import { tv } from "tailwind-variants";

import Player from "@/components/player";
import { Episode, getEpisode, onEpisodeSnapshot } from "@/lib/episodes";
import { auth } from "@/lib/firebase/clientApp";
import { pageTitle, sectionTitle } from "@/components/primitives";
import { isUserAdmin as _isUserAdmin } from "@/lib/userInfo";

const infoTableStyle = tv({
  base: "w-[98%] px-0.5 py-2",
});

const ProgramsPage = ({ params }: { params: { episodeId: string } }) => {
  const router = useRouter();
  const t = useTranslations("Episode Details");
  const user = auth.currentUser;
  const [isUserAdmin, setIsUserAdmin] = React.useState<boolean | null>(null);

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

  React.useEffect(() => {
    if (user) {
      _isUserAdmin(user.uid).then((isAdmin) => {
        setIsUserAdmin(isAdmin);
      });
    }
  }, [user]);

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
        <Accordion isCompact className="w-full">
          <AccordionItem
            key="1"
            aria-label={episode.papers[i].title}
            title={
              <h3 className="block w-full truncate text-lg font-semibold text-default-700">
                {episode.papers[i].title.length > 30
                  ? `${episode.papers[i].title.substring(0, 30)}...`
                  : episode.papers[i].title}
              </h3>
            }
          >
            <Table
              hideHeader
              aria-label={episode.papers[i].title}
              className={infoTableStyle()}
            >
              <TableHeader>
                <TableColumn>Key</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Authors</TableCell>
                  <TableCell>
                    {episode.papers[i].authors.join(", ") || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>
                    {(episode.papers[i].year !== 1000
                      ? episode.papers[i].year
                      : "N/A") || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Abstract</TableCell>
                  <TableCell>{episode.papers[i].abstract || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fields of Study</TableCell>
                  <TableCell>
                    {episode.papers[i].fieldsOfStudy.join(", ") || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Publication</TableCell>
                  <TableCell>
                    {episode.papers[i].publication || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Publication Types</TableCell>
                  <TableCell>
                    {episode.papers[i].publicationTypes.join(", ") || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Publication Date</TableCell>
                  <TableCell>
                    {episode.papers[i].publicationDate || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TLDR</TableCell>
                  <TableCell>{episode.papers[i].tldr || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>References</TableCell>
                  <TableCell>
                    <ul className="text-sm leading-4 sm:indent-6">
                      {episode.papers[i].references.map((reference) => (
                        <li key={reference.paperId}>{reference.title}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PDF URL</TableCell>
                  <TableCell>
                    <Link
                      isExternal
                      showAnchorIcon
                      href={episode.papers[i].pdfUrl}
                    >
                      <p className="truncate text-sm">
                        {episode.papers[i].pdfUrl}
                      </p>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionItem>
        </Accordion>
      );

      papersInfo.push(paperInfoElement);
    }

    return papersInfo;
  }, [episode]);

  const debugInfo = React.useMemo(() => {
    return (
      <>
        <h2 className={sectionTitle()}>Episode Info JSON</h2>
        <Accordion className="w-full">
          <AccordionItem title="Expand to see JSON">
            <ScrollShadow
              className="flex flex-col items-start justify-start overflow-x-scroll"
              orientation="horizontal"
            >
              {episodeInfo}
            </ScrollShadow>
          </AccordionItem>
        </Accordion>
      </>
    );
  }, [episodeInfo]);

  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-stretch justify-start gap-3.5">
      <div className="flex justify-start">
        <Skeleton
          className="rounded-lg"
          isLoaded={episode !== null && episode !== undefined}
        >
          <h1 className={pageTitle()}>{episode?.title ?? "Loading..."}</h1>
        </Skeleton>
      </div>
      <div className="flex flex-col items-center justify-start gap-5">
        <Player episodeId={params.episodeId} />
      </div>
      <Skeleton
        className="rounded-lg"
        isLoaded={episode !== null && episode !== undefined}
      >
        <h2 className={sectionTitle()}>{t("Episode Information")}</h2>
        <Table
          hideHeader
          aria-label="Episode Information"
          className={infoTableStyle()}
        >
          <TableHeader>
            <TableColumn>Key</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{t("Description")}</TableCell>
              <TableCell>{episode?.description || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("Tags")}</TableCell>
              <TableCell>{episode?.tags.join(", ") || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("Recorder")}</TableCell>
              <TableCell>{episode?.userDisplayName || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("Created At")}</TableCell>
              <TableCell>
                {episode?.createdAt.toDate().toLocaleString() || "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("Updated At")}</TableCell>
              <TableCell>
                {episode?.updatedAt.toDate().toLocaleString() || "N/A"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h2 className={sectionTitle()}>{t("Source Papers")}</h2>
        {papersInfo}
        {isUserAdmin === true ? debugInfo : null}
      </Skeleton>
    </div>
  );
};

export default ProgramsPage;
