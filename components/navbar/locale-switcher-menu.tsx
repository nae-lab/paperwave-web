"use client";

import "client-only";

import { DropdownMenu, DropdownItem } from "@nextui-org/react";

import { setUserLocale } from "@/services/locale";
import { Locale } from "@/i18n/config";

type Props = {
  defaultSelectedKeys: Locale;
};

export default function LocaleSwitcherMenu({ defaultSelectedKeys }: Props) {
  async function handleLocaleChange(locale: Locale) {
    await setUserLocale(locale);
    window.location.reload();
  }

  return (
    <DropdownMenu defaultSelectedKeys={defaultSelectedKeys}>
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
