import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
} from "firebase/auth";

import { ActionResult } from "@/types";
import { auth } from "@/lib/firebase/clientApp";
import { consola } from "@/lib/logging";

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    return user;
  } catch (error) {
    consola.error("Error signing in with Google", error);

    return undefined;
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    const result: ActionResult = {};

    return result;
  } catch (error) {
    consola.error("Error signing out with Google", error);

    const result: ActionResult = {
      errors: JSON.stringify(error),
    };

    return result;
  }
}