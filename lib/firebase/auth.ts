import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
} from "firebase/auth";

import { ActionResult } from "@/types";
import { auth, getAnalytics } from "@/lib/firebase/clientApp";
import { logEvent } from "@/lib/firebase/analytics";
import { log } from "console";

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const analytics = await getAnalytics();

    logEvent(analytics, "login", {
      method: "Google",
    });

    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);

    return undefined;
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    const result: ActionResult = {};

    const analytics = await getAnalytics();

    logEvent(analytics, "logout", {
      method: "Google",
    });

    return result;
  } catch (error) {
    console.error("Error signing out with Google", error);

    const result: ActionResult = {
      errors: JSON.stringify(error),
    };

    return result;
  }
}
