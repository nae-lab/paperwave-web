"use client";

import "client-only";

import React from "react";

import Player from "@/components/player";

const ProgramsPage = () => {
  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-stretch justify-start gap-3.5">
      <div className="flex justify-start">
        <h1 className="text-xl font-bold text-default-900 lg:text-3xl">
          番組一覧
        </h1>
      </div>
      <div className="flex flex-col items-center justify-start gap-5">
        <Player programId="hoge" />
        <Player programId="hoge" />
        <Player programId="hoge" />
      </div>
    </div>
  );
};

export default ProgramsPage;
