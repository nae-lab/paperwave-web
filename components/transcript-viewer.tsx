"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  ScrollShadow,
  Skeleton,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";

export type TranscriptSection = {
  section: string;
  script: {
    speaker: string;
    voice: string;
    text: string;
  }[];
};

export type TranscriptViewerProps = {
  transcriptUrl: string;
};

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcriptUrl,
}) => {
  const t = useTranslations("Transcript");
  const [transcript, setTranscript] = React.useState<
    TranscriptSection[] | null
  >(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!transcriptUrl) return;
    setLoading(true);
    setError(null);
    fetch(transcriptUrl)
      .then((res) => {
        if (!res.ok) throw new Error(t("Error"));
        return res.json();
      })
      .then((data) => {
        setTranscript(data);
      })
      .catch((err) => {
        setError(t("Error"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [transcriptUrl, t]);

  if (!transcriptUrl) {
    return <div className="text-default-400">{t("NotAvailable")}</div>;
  }

  return (
    <div className="mt-6">
      <Skeleton isLoaded={!loading} className="rounded-lg">
        {error ? (
          <div className="text-danger-500">{error}</div>
        ) : transcript ? (
          <Accordion className="w-full" variant="splitted">
            {transcript.map((section, idx) => (
              <AccordionItem
                key={section.section + idx}
                title={section.section}
              >
                <ScrollShadow className="max-h-96 overflow-y-auto">
                  <ul className="space-y-2">
                    {section.script.map((line, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="min-w-[3.5em] font-bold text-primary-700">
                          {line.speaker}:
                        </span>
                        <span className="whitespace-pre-line">{line.text}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollShadow>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div>{t("Loading")}</div>
        )}
      </Skeleton>
    </div>
  );
};

export default TranscriptViewer;
