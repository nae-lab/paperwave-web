import "server-cli-only";

import React from "react";

import { getAuth } from "@/lib/firebase/serverApp";
import ChannelCard from "@/components/channel-card";

export default async function ChannelsPage() {
  const auth = await getAuth();
  const users = await auth.listUsers();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {users.users.map((user, index) => {
        return <ChannelCard key={index} userJson={JSON.stringify(user)} />;
      })}
    </div>
  );
}
