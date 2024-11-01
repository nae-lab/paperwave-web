/*
 * locale.ts
 * https://github.com/amannn/next-intl
 *
 * MIT License
 *
 * Copyright (c) 2024 Jan Amann
 */

import { getRequestConfig } from "next-intl/server";

import { getUserLocale } from "@/services/locale";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
