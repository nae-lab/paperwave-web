import "client-only";

import {
  doc,
  FirestoreDataConverter,
  getDoc,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore";

import { db } from "@/lib/firebase/clientApp";
import { DocumentSnapshotType } from "@/lib/firebase/firestore";

const COLLECTION_ID =
  process.env.NEXT_PUBLIC_FIRESTORE_USERS_COLLECTION_ID ?? "users-unknown-env";

export type UserType = "admin" | "user";

export class UserInfo implements DocumentSnapshotType {
  type: UserType;

  constructor(options: Partial<UserInfo>) {
    this.type = options.type ?? "user";
  }
}

function objectifyUserInfo(userInfo: UserInfo) {
  return {
    ...userInfo,
  };
}

export const userInfoConverter = (): FirestoreDataConverter<UserInfo> => ({
  toFirestore(data: WithFieldValue<UserInfo>) {
    return objectifyUserInfo(data as UserInfo);
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<UserInfo>) {
    const data = snapshot.data();

    return new UserInfo({ ...data });
  },
});

export async function isUserAdmin(uid: string) {
  const userInfoRef = doc(db, COLLECTION_ID, uid).withConverter(
    userInfoConverter(),
  );
  const snapshot = await getDoc(userInfoRef);

  if (!snapshot.exists()) {
    console.info(`No user with UID "${uid}"!`);

    return null;
  }

  const userInfo = snapshot.data();

  return userInfo.type === "admin";
}
