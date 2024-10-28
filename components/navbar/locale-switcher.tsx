import "server-cli-only";

import { getLocale } from "next-intl/server";
import { Button, Dropdown, DropdownTrigger } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import LocaleSwitcherMenu from "./locale-switcher-menu";

import { Locale } from "@/i18n/config";

export default async function LocaleSwitcher() {
  const locale = (await getLocale()) as Locale;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly radius="full" variant="light">
          <Icon
            className="text-default-500"
            icon="heroicons:language-16-solid"
            width={24}
          />
        </Button>
      </DropdownTrigger>
      <LocaleSwitcherMenu defaultSelectedKeys={locale} />
    </Dropdown>
  );
}
