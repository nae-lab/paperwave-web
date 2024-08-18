"use client";

import "client-only";

import React from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Input,
  Spacer,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/cn";
import RowSteps from "@/components/row-steps";

export default function RecordingPage() {
  const [step, setStep] = React.useState(0);
  const [isFileUploaded, setIsFileUploaded] = React.useState(true);

  const handleStepChange = (stepIndex: number) => {
    if (!isFileUploaded && stepIndex >= 1) {
      return;
    }

    // 2には遷移させない
    if (stepIndex === 2) {
      return;
    }

    setStep(stepIndex);
  };

  return (
    <div className="flex flex-col items-stretch gap-2.5">
      <h1 className="text-xl font-bold text-default-foreground lg:text-3xl">
        収録
      </h1>
      <h2 className="text-small text-default-500">
        論文のPDFから新規エピソードを生成します．
      </h2>
      <div className="flex justify-center">
        <RowSteps
          currentStep={step}
          steps={[
            { title: "論文PDFのアップロード" },
            { title: "エピソードの生成" },
            { title: "エピソードの確認" },
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
        <Card isPressable>
          <CardBody className="flex flex-col items-center justify-center gap-2 bg-default-100 py-7">
            <p className="text-center text-medium font-bold text-default-foreground">
              論文PDFをアップロード
            </p>
            <p className="text-center text-medium text-default-500">
              PDFをドラッグ&ドロップするか，クリックして選択してください．
            </p>
            <Icon
              className="mt-5 text-7xl text-default-foreground"
              icon="solar:file-send-linear"
            />
          </CardBody>
        </Card>
        <div className="mt-5 flex justify-end gap-2.5">
          <Button>PDFをクリア</Button>
          <Button color="primary">次へ</Button>
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
              content="生成するラジオ番組エピソードのタイトルです．一覧でタイトルとして表示されます．"
              delay={500}
              placement="right"
              showArrow={true}
            >
              <p className="text-inherit">
                エピソードのタイトル
                <Spacer className="inline" x={1} />
                <Icon
                  className="inline text-inherit"
                  icon="solar:question-circle-linear"
                />
              </p>
            </Tooltip>
          }
          labelPlacement="outside"
          placeholder="例: 空中像をつくるワークショップにおいて参加者が直面する困難についての探索的検討"
          type="text"
        />
        <Input
          defaultValue="15"
          label={
            <Tooltip
              className="inline"
              content="概ね指定された通りの分数で作ります．論文のコンテンツに対して指定時間が長すぎると同じ内容を繰り返し話す番組が生成されやすくなります．"
              delay={500}
              placement="right"
              showArrow={true}
            >
              <p className="text-inherit">
                エピソードの長さ (分)
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
        />
        <Input
          defaultValue="gpt-4o"
          label={
            <Tooltip
              className="inline"
              content="エピソードの生成に使用する生成AIのモデルを選択します．"
              delay={500}
              placement="right"
              showArrow={true}
            >
              <p className="text-inherit">
                使用する生成AIモデル
                <Spacer className="inline" x={1} />
                <Icon
                  className="inline text-inherit"
                  icon="solar:question-circle-linear"
                />
              </p>
            </Tooltip>
          }
          labelPlacement="outside"
          placeholder="gpt-4o"
          type="text"
        />

        <Accordion className="w-full">
          <AccordionItem
            key="1"
            aria-label="Accordion item 1"
            className="align-center border-t border-default-200"
            title="詳細オプション"
          >
            <div className="flex flex-col items-stretch justify-start gap-5 self-stretch">
              <Textarea
                label={
                  <p className="text-default-foreground">
                    エピソードの説明・概要
                  </p>
                }
                labelPlacement="outside"
              />
              <Input
                label={
                  <Tooltip
                    className="inline text-inherit"
                    content="エピソードのキーワードをカンマ区切りで入力してください．一覧でキーワードとして表示されます．"
                    delay={500}
                    placement="right"
                    showArrow={true}
                  >
                    <p className="text-inherit">
                      キーワード
                      <Spacer className="inline" x={1} />
                      <Icon
                        className="inline text-inherit"
                        icon="solar:question-circle-linear"
                      />
                    </p>
                  </Tooltip>
                }
                labelPlacement="outside"
                placeholder="HCI, ワークショップ, 空中像, 構築主義, ティンカリング, 質的研究"
              />

              <Input
                label={
                  <Tooltip
                    className="inline text-inherit"
                    content="エピソードのカバー画像のURLを入力してください．"
                    delay={500}
                    placement="right"
                    showArrow={true}
                  >
                    <p className="text-inherit">
                      カバー画像URL
                      <Spacer className="inline" x={1} />
                      <Icon
                        className="inline text-inherit"
                        icon="solar:question-circle-linear"
                      />
                    </p>
                  </Tooltip>
                }
                labelPlacement="outside"
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
          </AccordionItem>
        </Accordion>
        <div className="mt-5 flex justify-start gap-2.5">
          <div className="flex flex-1 gap-2.5 self-stretch">
            <Button>戻る</Button>
          </div>
          {/* <Button>キャンセル</Button> */}
          <Button color="primary">生成する</Button>
        </div>
      </div>
    </div>
  );
}
