"use client";

import "client-only";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  Analytics,
  getAnalytics as _getAnalytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics";

import { firebaseConfig } from "./clientConfig";

export const firebaseApp =
  getApps().length === 0
    ? initializeApp(firebaseConfig, "client")
    : getApps()[0];
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export async function getAnalytics() {
  return (await isAnalyticsSupported()) ? _getAnalytics(firebaseApp) : null;
}
