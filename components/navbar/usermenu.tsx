import { Dropdown, DropdownTrigger, Avatar, Link } from "@nextui-org/react";
import { button as buttonStyle } from "@nextui-org/theme";

import UserMenuDropdownMenu from "./usermenu-dropdownmenu";

import { useUserSession } from "@/lib/firebase/userSession";

export default function UserMenu() {
  const user = useUserSession(null);

  if (!user) {
    return (
      <Link
        className={buttonStyle({
          color: "primary",
          radius: "full",
        })}
        href="/login"
      >
        Log In
      </Link>
    );
  } else {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button className="mt-1 h-8 w-8 outline-none transition-transform">
            <Avatar
              isBordered
              color="default"
              name={user?.displayName?.slice(0, 2).toUpperCase()}
              size="sm"
            />
          </button>
        </DropdownTrigger>
        <UserMenuDropdownMenu />
      </Dropdown>
    );
  }
}
