// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-cli-only";

import { headers } from "next/headers";
import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { consola } from "../logging";

import { firebaseConfig } from "./config";

export async function getAuthenticatedAppForUser() {
  const idToken = headers().get("Authorization")?.split("Bearer ")[1];

  consola.info("firebaseConfig", JSON.stringify(firebaseConfig));
  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken
      ? {
          authIdToken: idToken,
        }
      : {},
  );

  const auth = getAuth(firebaseServerApp);

  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}
