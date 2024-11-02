import "server-cli-only";

import React from "react";
import { getTranslations } from "next-intl/server";

import { getAuth } from "@/lib/firebase/serverApp";
import ChannelCard from "@/components/channel-card";
import { pageTitle } from "@/components/primitives";

export default async function ChannelsPage() {
  const t = await getTranslations("Channels");
  const auth = await getAuth();
  const users = await auth.listUsers();

  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-stretch justify-start gap-3.5">
      <div className="flex justify-start">
        <h1 className={pageTitle()}>{t("Channels")}</h1>
      </div>
      <div className="flex justify-start">
        <p>
          {t("Channels Page is disabled to protect copyright on the papers")}
        </p>
      </div>
      {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {users.users.map((user, index) => {
          return <ChannelCard key={index} userJson={JSON.stringify(user)} />;
        })}
      </div> */}
    </div>
  );
}
