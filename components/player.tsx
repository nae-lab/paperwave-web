"use client";

import "client-only";

import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  Chip,
  Image,
  Link,
  ScrollShadow,
  Skeleton,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { button as buttonStyles } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

import { Episode, getEpisode, onEpisodeSnapshot } from "@/lib/episodes";
import { cn } from "@/lib/cn";

interface PlayerProps extends CardProps {
  episodeId: string;
}

export default function Player(props: PlayerProps) {
  const t = useTranslations("Player");
  const [episode, setEpisode] = React.useState<Episode | null>(null);

  const authors = React.useMemo(() => {
    if (!episode) return "Unknown Authors";

    const authors = episode.papers
      .map((paper) => paper.authors.join(", "))
      .flat()
      .join(", ");

    return authors;
  }, [episode]);

  const tags = React.useMemo(() => {
    const chips = episode?.tags.slice(0, 4).map((tag) => (
      <Chip key={tag} className="mb-1 mr-1" color="default" size="sm">
        {tag}
      </Chip>
    ));

    return chips;
  }, []);

  React.useEffect(() => {
    getEpisode(props.episodeId).then((data) => {
      setEpisode(data);
    });
  }, [props.episodeId]);

  React.useEffect(() => {
    console.log("episodeId changed", props.episodeId);
    getEpisode(props.episodeId).then((data) => {
      setEpisode(data);
    });

    const unsubscribeSnapshot = onEpisodeSnapshot(props.episodeId, (data) => {
      setEpisode(data);
    });

    return unsubscribeSnapshot;
  }, [props.episodeId]);

  let playerContent = <></>;

  if (episode?.isRecordingFailed) {
    playerContent = (
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
        <Icon
          className="text-warning"
          icon="solar:danger-triangle-bold"
          width={24}
        />
        <p className="text-default-800">{t("Recording failed")}</p>
      </div>
    );
  } else if (episode?.isRecordingCompleted) {
    // eslint-disable-next-line jsx-a11y/media-has-caption
    playerContent = <audio controls src={episode?.contentUrl} />;
  } else {
    playerContent = (
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
        <Spinner label={t("Recording")} size="sm" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[800px] rounded-lg bg-default-50 p-5 shadow-lg dark:bg-default-100">
      <Link
        className={cn([
          buttonStyles({
            isIconOnly: true,
            radius: "full",
            size: "sm",
            variant: "light",
          }),
          "absolute right-4 top-4 z-10 overflow-visible",
        ])}
        href={`/episodes/${props.episodeId}`}
      >
        <Icon
          className="text-default-500"
          icon="solar:info-circle-linear"
          width={24}
        />
      </Link>
      <div className="relative before:inset-0 before:h-full before:w-full before:content-['']">
        <div className="flex flex-row flex-wrap items-center justify-around gap-5">
          <div className="min-w-[120px] max-w-[150px] flex-auto">
            <Skeleton isLoaded={episode !== null}>
              <Image
                alt="cover"
                className="rounded-xl object-cover"
                src={episode?.coverImageUrl}
              />
            </Skeleton>
          </div>
          <div className="flex min-w-[214px] max-w-full flex-1 flex-col items-stretch justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-stretch justify-start gap-3.5">
              <div className="flex min-w-0 flex-1 flex-col items-stretch justify-start">
                <div className="flex flex-1 pb-2.5">
                  <span className="line-clamp-2 text-ellipsis text-xs font-bold leading-normal text-default-400">
                    {episode?.createdAt.toDate().toLocaleString([], {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || ""}
                  </span>
                  <Spacer className="inline" x={1} />
                  <span className="line-clamp-2 text-ellipsis text-xs font-normal leading-normal text-default-400">
                    {episode?.userDisplayName
                      ? "- " +
                        t("recorded by", { name: episode.userDisplayName })
                      : ""}
                  </span>
                </div>
                {/* <ScrollShadow
                  hideScrollBar
                  className="w-full overflow-x-scroll pb-1"
                  orientation="horizontal"
                >
                  {tags}
                </ScrollShadow> */}
                <div className="flex flex-1">
                  <h2 className="line-clamp-2 text-ellipsis font-bold leading-normal">
                    {episode?.title || "Loading..."}
                  </h2>
                </div>
                <div className="flex flex-1">
                  <p className="line-clamp-2 text-ellipsis font-normal leading-normal text-default-600">
                    {authors ?? "Loading..."}
                  </p>
                </div>
              </div>
            </div>
            {playerContent}
          </div>
        </div>
      </div>
    </div>
  );
}
