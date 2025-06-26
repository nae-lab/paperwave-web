"use client";

import "client-only";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  ScrollShadow,
  Skeleton,
  Table,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Link,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { TableHeader } from "react-stately";
import { tv } from "tailwind-variants";

import { Episode, getEpisode, onEpisodeSnapshot } from "@/lib/episodes";
import { auth } from "@/lib/firebase/clientApp";
import { isUserAdmin as _isUserAdmin } from "@/lib/userInfo";
import Player from "@/components/player";
import { pageTitle, sectionTitle } from "@/components/primitives";
import TranscriptViewer from "@/components/transcript-viewer";

const infoTableStyle = tv({
  base: "w-[99%] px-0.5 py-2",
});

const ProgramsPage = ({ params }: { params: { episodeId: string } }) => {
  const router = useRouter();
  const t = useTranslations("Episode Details");
  const tTranscript = useTranslations("Transcript");
  const user = auth.currentUser;
  const [isUserAdmin, setIsUserAdmin] = React.useState<boolean | null>(null);

  const [episode, setEpisode] = React.useState<Episode | null | undefined>(
    undefined,
  );

  // transcriptUrl更新用のstate
  const [isUpdatingTranscript, setIsUpdatingTranscript] = React.useState(false);
  const [transcriptUpdateAttempted, setTranscriptUpdateAttempted] =
    React.useState(false);

  React.useEffect(() => {
    // episodeIdが変わった時にtranscriptUpdateAttemptedをリセット
    setTranscriptUpdateAttempted(false);

    getEpisode(params.episodeId).then((data) => {
      setEpisode(data);
    });

    const unsubscribeSnapshot = onEpisodeSnapshot(params.episodeId, (data) => {
      setEpisode(data);
    });

    return unsubscribeSnapshot;
  }, [params.episodeId]);

  // transcriptUrlが空、または有効期限切れの場合にAPI routeを呼び出す
  React.useEffect(() => {
    const isTranscriptExpired = (episode: Episode) => {
      if (!episode.transcriptUrlExpiresAt) return false;
      const expiresAt = new Date(episode.transcriptUrlExpiresAt);
      return expiresAt < new Date();
    };

    if (
      episode &&
      episode.contentUrl &&
      (!episode.transcriptUrl ||
        episode.transcriptUrl.trim() === "" ||
        isTranscriptExpired(episode)) &&
      !isUpdatingTranscript &&
      !transcriptUpdateAttempted
    ) {
      setIsUpdatingTranscript(true);
      setTranscriptUpdateAttempted(true);

      fetch(`/api/episodes/${params.episodeId}/update-transcript-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.transcriptUrl) {
            console.debug("Transcript URL updated:", data.transcriptUrl);
          } else if (data.error) {
            console.warn("Failed to update transcript URL:", data.error);
          }
        })
        .catch((error) => {
          console.error("Error updating transcript URL:", error);
        })
        .finally(() => {
          setIsUpdatingTranscript(false);
        });
    }
  }, [
    episode,
    params.episodeId,
    isUpdatingTranscript,
    transcriptUpdateAttempted,
  ]);

  React.useEffect(() => {
    if (episode === null) {
      // router.push("/not-found");
    }
  }, [episode]);

  React.useEffect(() => {
    if (user) {
      _isUserAdmin(user.uid).then((isAdmin) => {
        setIsUserAdmin(isAdmin);
      });
    }
  }, [user]);

  const papersInfo = React.useMemo(() => {
    if (!episode) {
      return null;
    }

    const papersInfo = [];

    for (let i = 0; i < episode.papers.length; i++) {
      const paperInfoElement = (
        <>
          <h3 className="block w-full truncate text-lg font-semibold text-default-700">
            {episode.papers[i].title}
          </h3>
          <Table
            key={episode.papers[i].paperId}
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
                <TableCell>{episode.papers[i].publication || "N/A"}</TableCell>
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
              {episode.uid === user?.uid ? (
                <TableRow>
                  <TableCell>PDF</TableCell>
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
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </>
      );

      papersInfo.push(paperInfoElement);
    }

    return papersInfo;
  }, [episode]);

  const episodeInfo = React.useMemo(() => {
    if (!episode) {
      return null;
    }

    const episodeJson = JSON.stringify(episode, null, 4);
    const episodeInfoElement = (
      <pre className="whitespace-pre text-sm leading-4">{episodeJson}</pre>
    );

    return episodeInfoElement;
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
        {episode && (
          <div className="my-4">
            {episode.transcriptUrl && (
              <>
                <h3 className={sectionTitle()}>Transcript</h3>
                <TranscriptViewer transcriptUrl={episode.transcriptUrl} />
              </>
            )}
          </div>
        )}
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
            {/* <TableRow>
              <TableCell>{t("Updated At")}</TableCell>
              <TableCell>
                {episode?.updatedAt.toDate().toLocaleString() || "N/A"}
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
        <h2 className={sectionTitle()}>{t("Source Papers")}</h2>
        {papersInfo}
        {isUserAdmin === true ? debugInfo : null}
        {episode && (
          <div className="mt-4">
            <h3 className={sectionTitle()}>URLs</h3>
            <Table
              hideHeader
              aria-label="URLs Information"
              className={infoTableStyle()}
            >
              <TableHeader>
                <TableColumn>Key</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="content-url">
                  <TableCell>Content URL</TableCell>
                  <TableCell>
                    <Link isExternal showAnchorIcon href={episode.contentUrl}>
                      <p className="truncate text-sm">{episode.contentUrl}</p>
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow key="transcript-url">
                  <TableCell>Transcript URL</TableCell>
                  <TableCell>
                    {episode.transcriptUrl ? (
                      <Link
                        isExternal
                        showAnchorIcon
                        href={episode.transcriptUrl}
                      >
                        <p className="truncate text-sm">
                          {episode.transcriptUrl}
                        </p>
                      </Link>
                    ) : (
                      <span className="text-sm text-default-400">
                        {isUpdatingTranscript
                          ? tTranscript("Loading")
                          : transcriptUpdateAttempted
                            ? tTranscript("Error")
                            : "N/A"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </Skeleton>
    </div>
  );
};

export default ProgramsPage;
