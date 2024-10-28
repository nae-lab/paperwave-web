import { Button, Dropdown, DropdownTrigger } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import LocaleSwitcherMenu from "./locale-switcher-menu";

export default function LocaleSwitcher() {
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
      <LocaleSwitcherMenu />
    </Dropdown>
  );
}
