/*
 * locale.ts
 * https://github.com/amannn/next-intl
 *
 * MIT License
 *
 * Copyright (c) 2024 Jan Amann
 */

"use server";

import { cookies, headers } from "next/headers";
import AcceptLanguage from "accept-language";

import { Locale, defaultLocale } from "@/i18n/config";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = "NEXT_LOCALE";

AcceptLanguage.languages(["en", "ja", "ko"]);

export async function getUserLocale() {
  let language;

  if (cookies().has(COOKIE_NAME)) {
    language = cookies().get(COOKIE_NAME)?.value;
  }

  if (!language && headers().has("accept-language")) {
    language = AcceptLanguage.get(headers().get("accept-language"));
  }

  return language || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  cookies().set(COOKIE_NAME, locale);
}
