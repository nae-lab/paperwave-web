"use client";

import "client-only";

import { DropdownMenu, DropdownItem } from "@nextui-org/react";

import { setUserLocale } from "@/services/locale";
import { Locale } from "@/i18n/config";

export default function LocaleSwitcherMenu() {
  async function handleLocaleChange(locale: Locale) {
    await setUserLocale(locale);
    window.location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownItem onPress={() => handleLocaleChange("en")}>
        English
      </DropdownItem>
      <DropdownItem onPress={() => handleLocaleChange("ja")}>
        日本語
      </DropdownItem>
      <DropdownItem onPress={() => handleLocaleChange("ko")}>
        한국어
      </DropdownItem>
    </DropdownMenu>
  );
}
