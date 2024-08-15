import React from "react";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

export default async function RecordingPage() {
  const { currentUser } = await getAuthenticatedAppForUser();

  return (
    <>
      <div>
        <h1>Recording Page</h1>
        <p>
          Current user: {currentUser?.email} {currentUser?.displayName}
        </p>
      </div>
    </>
  );
}
