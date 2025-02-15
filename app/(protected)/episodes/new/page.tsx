"use client";

import "client-only";

import { createHash } from "crypto";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spacer,
  Spinner,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getCookie } from "cookies-next";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/cn";
import { storage } from "@/lib/firebase/clientApp";
import RowSteps from "@/components/row-steps";
import { useUserSession } from "@/lib/firebase/userSession";
import {
  Episode,
  LanguageLabels,
  LanguageOptions,
  Paper,
  RecordingOptions,
  setEpisode,
} from "@/lib/episodes";

interface UploadedFileInfo {
  path: string;
  name: string;
  url: string;
}

export default function RecordingPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Recording");

  const [step, setStep] = React.useState(0);
  const userJson = getCookie("user");
  const { user, userLoaded } = useUserSession(
    userJson ? JSON.parse(userJson) : null,
  );

  const [isFileUploading, setIsFileUploading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFileInfo[]>(
    [],
  );

  const [isGenerateTaskSubmitting, setIsGenerateTaskSubmitting] =
    React.useState(false);

  const [episodeTitle, setEpisodeTitle] = React.useState("");
  const [episodeDuration, setEpisodeDuration] = React.useState("15");
  const [episodeLanguage, setEpisodeLanguage] = React.useState(locale);
  const [llmModel, setLLMModel] = React.useState("gpt-4o");
  const [episodeDescription, setEpisodeDescription] = React.useState("");
  const [episodeKeywords, setEpisodeKeywords] = React.useState("");
  const [episodeCoverImageURL, setEpisodeCoverImageURL] = React.useState("");

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    setIsFileUploading(true);
    const promises = acceptedFiles.map((file) => {
      const promise = async (file: File) => {
        const userHash = createHash("sha256")
          .update(user?.uid || "unknown-user")
          .digest("hex");
        const filePath = `pdf/${userHash}/${file.name}`;
        const fileRef = storageRef(storage, filePath);

        const uploadTask = uploadBytes(fileRef, file);

        console.debug(`Uploading file ${filePath}...`);
        await uploadTask;
        console.debug(`File ${filePath} uploaded.`);

        const downloadURL = await getDownloadURL(fileRef);

        setUploadedFiles((prev) => [
          ...prev,
          { path: filePath, url: downloadURL, name: file.name },
        ]);
      };

      return promise(file);
    });

    await Promise.all(promises);
    console.debug("All files uploaded.");
    setIsFileUploading(false);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFilePicker,
  } = useDropzone({ onDrop });

  const handleStepChange = (stepIndex: number) => {
    if (uploadedFiles.length === 0 && stepIndex >= 1) {
      return;
    }

    // Prevent skipping to the last step without uploading files
    if (stepIndex === 2) {
      return;
    }

    setStep(stepIndex);
  };

  const handleDropzoneClick = React.useCallback(() => {
    console.log("isFileUploading", isFileUploading);
    // Prevent file picker from opening when uploading
    if (isFileUploading) return;

    openFilePicker();
  }, [isFileUploading]);

  const handleProceedToNextStep = () => {
    if (uploadedFiles.length === 0) {
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBackToPreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleFileDelete = async (filePath: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.path !== filePath));
    const fileRef = storageRef(storage, filePath);

    // Delete the file
    console.debug(`Deleting file ${filePath}...`);
    await deleteObject(fileRef)
      .then(() => {
        console.debug(`File ${filePath} deleted.`);
      })
      .catch((error) => {
        console.error(`Error deleting file ${filePath}: ${error}`);
      });
  };

  const handleGenerateEpisode = async () => {
    setIsGenerateTaskSubmitting(true);

    let language: LanguageOptions;

    if (Object.keys(LanguageLabels).includes(episodeLanguage) === false) {
      language = "en";
    } else {
      language = episodeLanguage as LanguageOptions;
    }

    const recordingOptions = new RecordingOptions({
      paperUrls: uploadedFiles.map((f) => f.url),
      minute: parseInt(episodeDuration),
      language: language,
      llmModel: llmModel,
      ttsConcurrency: 10,
    });

    const papers = uploadedFiles.map((f) => {
      return new Paper({
        pdfUrl: f.url,
        title: f.name,
      });
    });

    const episode = new Episode({
      uid: user?.uid || "",
      userDisplayName: user?.displayName || "Unknown User",
      title: episodeTitle,
      description: episodeDescription,
      tags: episodeKeywords.split(",").map((k) => k.trim()),
      papers: papers,
      coverImageUrl: episodeCoverImageURL || "/default-cover.png",
      recordingOptions: recordingOptions,
    });

    const episodeId = await setEpisode(episode);

    setIsGenerateTaskSubmitting(false);

    router.push(`/episodes/${episodeId}`);
  };

  return (
    <div className="flex flex-col items-stretch gap-2.5">
      <h1 className="text-xl font-bold text-default-foreground lg:text-3xl">
        {t("Recording")}
      </h1>
      <h2 className="text-small text-default-500">
        {t("Generate a new episode from research paper PDFs")}
      </h2>
      <div className="flex justify-center">
        <RowSteps
          currentStep={step}
          steps={[
            { title: t("Upload Research Paper PDFs") },
            { title: t("Recording Settings") },
            { title: t("Check the Result") },
          ]}
          onStepChange={handleStepChange}
        />
      </div>
      <div
        className={cn([
          "align-center flex flex-col items-stretch justify-stretch self-stretch",
          step === 0 ? "visible" : "hidden",
        ])}
      >
        <div
          {...getRootProps()}
          className="flex w-full flex-col items-stretch justify-stretch"
        >
          <input className="hidden h-0 w-0" {...getInputProps()} />
          <Card
            className={cn([
              isDragActive ? "bg-default-300" : "bg-default-100",
              "h-80",
            ])}
            isDisabled={isFileUploading}
            isPressable={!isFileUploading}
            onPress={handleDropzoneClick}
          >
            <CardBody className="flex flex-col items-center justify-center gap-2 py-7">
              <p className="text-center text-medium font-bold text-default-foreground">
                {t("Upload Research Paper PDFs")}
              </p>
              <p className="text-center text-medium text-default-500">
                {t("Drag and drop PDFs or click this box to select")}
              </p>
              <div className="flex h-20 justify-center">
                {isFileUploading ? (
                  <Spinner color="primary" />
                ) : (
                  <Icon
                    className="mt-5 text-7xl text-default-foreground"
                    icon="solar:file-send-linear"
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </div>
        <ul className="mt-5 flex flex-col items-stretch justify-start gap-2.5">
          {uploadedFiles.map((file) => (
            <li
              key={file.name}
              className="flex max-w-full items-center justify-between gap-2.5"
            >
              <p className="text-ellipsis text-default-foreground">
                {file.name}
              </p>
              <Button
                color="danger"
                onClick={() => handleFileDelete(file.path)}
              >
                {t("Delete")}
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-end gap-2.5">
          <Button
            color="primary"
            isDisabled={uploadedFiles.length === 0}
            onPress={handleProceedToNextStep}
          >
            {t("Next")}
          </Button>
        </div>
      </div>
      <div
        className={cn([
          "align-center flex flex-col items-stretch justify-start gap-4 self-stretch",
          step === 1 ? "visible" : "hidden",
        ])}
      >
        <Input
          label={
            <Tooltip
              className="inline text-inherit"
              content={t(
                "Title of the podcast to be generated Displayed as a title in the list",
              )}
              delay={500}
              placement="right"
              showArrow={true}
            >
              <p className="text-inherit">
                {t("Episode Title")}
                <Spacer className="inline" x={1} />
                <Icon
                  className="inline text-inherit"
                  icon="solar:question-circle-linear"
                />
              </p>
            </Tooltip>
          }
          labelPlacement="outside"
          placeholder={t(
            "eg PaperWave Listening to Research Papers as Conversational Podcasts Scripted by LLM",
          )}
          type="text"
          value={episodeTitle}
          onValueChange={setEpisodeTitle}
        />
        <Input
          defaultValue="15"
          label={
            <Tooltip
              className="inline"
              content={t(
                "Podcasts are generated for an approximate specified length of time If the specified time is too long for the content of the paper programs that repeat the same content are likely to be generated",
              )}
              delay={500}
              placement="right"
              showArrow={true}
            >
              <p className="text-inherit">
                {t("Episode Duration (minutes)")}
                <Spacer className="inline" x={1} />
                <Icon
                  className="inline text-inherit"
                  icon="solar:question-circle-linear"
                />
              </p>
            </Tooltip>
          }
          labelPlacement="outside"
          placeholder="15"
          type="number"
          value={episodeDuration}
          onValueChange={setEpisodeDuration}
        />
        <div className="flex flex-col items-stretch justify-start">
          <p className="pb-2 text-small font-medium text-foreground">
            {t("Language")}
          </p>
          <Dropdown className="flex" type="listbox">
            <DropdownTrigger>
              <Button
                className="w-full capitalize"
                color="default"
                variant="bordered"
              >
                <p className="block w-full text-left text-inherit">
                  {LanguageLabels[episodeLanguage as LanguageOptions] ||
                    "Select Language..."}
                </p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Language"
              selectedKeys={episodeLanguage}
              selectionMode="single"
              variant="flat"
              onSelectionChange={(selected) => {
                setEpisodeLanguage(selected.currentKey || "en");
              }}
            >
              <DropdownItem key="en">{LanguageLabels["en"]}</DropdownItem>
              <DropdownItem key="ja">{LanguageLabels["ja"]}</DropdownItem>
              <DropdownItem key="ko">{LanguageLabels["ko"]}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex flex-col items-stretch justify-start">
          <p className="pb-2 text-small font-medium text-foreground">
            {t("Generative AI Model")}
          </p>
          <Dropdown className="flex" type="listbox">
            <DropdownTrigger>
              <Button className="w-full" color="default" variant="bordered">
                <p className="block w-full text-left text-inherit">
                  {llmModel}
                </p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Generative AI Model"
              selectedKeys={llmModel}
              selectionMode="single"
              variant="flat"
              onSelectionChange={(selected) => {
                setLLMModel(selected.currentKey || "gpt-4o-mini");
              }}
            >
              <DropdownItem key="gpt-4o">{"gpt-4o"}</DropdownItem>
              <DropdownItem key="gpt-4o-mini">{"gpt-4o-mini"}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {/* <Input
          defaultValue="gpt-4o"
          label={<p className="text-inherit">{t("Generative AI Model")}</p>}
          labelPlacement="outside"
          placeholder="gpt-4o"
          type="text"
          value={llmModel}
          onValueChange={setLLMModel}
        /> */}

        <Accordion className="w-full">
          <AccordionItem
            key="1"
            aria-label="Accordion item 1"
            className="align-center border-t border-default-200"
            title={t("Advanced Settings")}
          >
            <div className="flex flex-col items-stretch justify-start gap-5 self-stretch">
              <Textarea
                label={
                  <p className="text-default-foreground">{t("Description")}</p>
                }
                labelPlacement="outside"
                value={episodeDescription}
                onValueChange={setEpisodeDescription}
              />
              <Input
                label={
                  <Tooltip
                    className="inline text-inherit"
                    content={t(
                      "Enter keywords for the episode separated by commas",
                    )}
                    delay={500}
                    placement="right"
                    showArrow={true}
                  >
                    <p className="text-inherit">
                      {t("Keywords")}
                      <Spacer className="inline" x={1} />
                      <Icon
                        className="inline text-inherit"
                        icon="solar:question-circle-linear"
                      />
                    </p>
                  </Tooltip>
                }
                labelPlacement="outside"
                placeholder={t(
                  "Podcast, Research paper, Large language models, Autobiographical design, Field study",
                )}
                value={episodeKeywords}
                onValueChange={setEpisodeKeywords}
              />

              <Input
                label={<p className="text-inherit">{t("Cover Image URL")}</p>}
                labelPlacement="outside"
                placeholder="https://example.com/image.jpg"
                type="url"
                value={episodeCoverImageURL}
                onValueChange={setEpisodeCoverImageURL}
              />
            </div>
          </AccordionItem>
        </Accordion>
        <div className="mt-5 flex justify-start gap-2.5">
          <div className="flex flex-1 gap-2.5 self-stretch">
            <Button onPress={handleBackToPreviousStep}>{t("Back")}</Button>
          </div>
          {/* <Button>キャンセル</Button> */}
          <Button
            color="primary"
            isLoading={isGenerateTaskSubmitting}
            onPress={handleGenerateEpisode}
          >
            {t("Generate")}
          </Button>
        </div>
      </div>
    </div>
  );
}
