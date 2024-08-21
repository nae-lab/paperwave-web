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
  ScrollShadow,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { Episode, getEpisode } from "@/lib/episodes";

interface PlayerProps extends CardProps {
  programId: string;
}

export default function Player(props: PlayerProps) {
  const [episode, setEpisode] = React.useState<Episode | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const isRecordingCompleted = true;
  const isRecordingFailed = false;

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
    getEpisode(props.programId).then((data) => {
      setEpisode(data);
    });
  }, [props.programId]);

  let playerContent = <></>;

  if (episode?.isRecordingFailed) {
    playerContent = (
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
        <Icon
          className="text-warning"
          icon="solar:danger-triangle-bold"
          width={24}
        />
        <p className="text-default-800">生成に失敗しました</p>
      </div>
    );
  } else if (episode?.isRecordingCompleted) {
    // eslint-disable-next-line jsx-a11y/media-has-caption
    playerContent = <audio controls src={episode?.contentUrl} />;
  } else {
    playerContent = (
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
        <Spinner label="生成中..." size="sm" />
      </div>
    );
  }

  return (
    <Skeleton isLoaded={episode !== null} className="rounded-lg">
      <Card
        {...(props as CardProps)}
        className="relative max-w-[800px] bg-default-50 p-5 dark:bg-default-100"
      >
        <Button
          isIconOnly
          className="absolute right-4 top-4 z-10 overflow-visible"
          radius="full"
          size="sm"
          variant="light"
          onPress={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <Icon
              className="text-default-500"
              icon="solar:close-circle-linear"
              width={24}
            />
          ) : (
            <Icon
              className="text-default-500"
              icon="solar:info-circle-linear"
              width={24}
            />
          )}
        </Button>

        <CardBody className="relative before:inset-0 before:h-full before:w-full before:content-['']">
          <div className="flex flex-row flex-wrap items-center justify-around gap-5">
            <div className="min-w-[120px] max-w-[150px] flex-auto">
              <Image
                alt="cover"
                className="rounded-xl object-cover"
                src="/default-cover.png"
              />
            </div>
            <div className="flex min-w-[214px] max-w-full flex-1 flex-col items-stretch justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-stretch justify-start gap-3.5">
                <div className="flex min-w-0 flex-1 flex-col items-stretch justify-start">
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
        </CardBody>
      </Card>
    </Skeleton>
  );
}
