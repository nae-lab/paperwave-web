"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumbs as NextUiBreadcrumbs,
  BreadcrumbItem,
  Link,
} from "@nextui-org/react";
import { capitalize } from "@nextui-org/shared-utils";
import { useTranslations } from "next-intl";

import { routes, Route } from "@/config/site";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  let breadcrumbItem: React.ReactNode[] = [];

  pathname.split("/").map((currentDir, index) => {
    const pathDirs = pathname.split("/").slice(1, index + 1);

    const pathUrl = pathDirs.join("/");

    let currentDirLabel = t("Home");

    try {
      let currentDirLast = pathDirs.reduce<Route | undefined>(
        (acc, dir, idx) => {
          if (idx === 0) {
            return routes[dir];
          }

          return acc ? acc[dir] : undefined;
        },
        undefined,
      );

      if (currentDirLast) {
        currentDirLabel = t(currentDirLast?.label);
      } else {
        currentDirLabel = "";
      }
    } catch (error) {
      currentDirLabel = "Unknown";
    }

    if (
      currentDirLabel &&
      currentDirLabel !== "" &&
      currentDirLabel !== "Unknown"
    ) {
      breadcrumbItem.push(
        <BreadcrumbItem key={index}>
          <Link className="text-inherit" href={`/${pathUrl}`}>
            {capitalize(currentDirLabel)}
          </Link>
        </BreadcrumbItem>,
      );
    }
  });

  return (
    <NextUiBreadcrumbs className="hidden lg:flex" radius="full">
      {breadcrumbItem.map((item) => item)}
    </NextUiBreadcrumbs>
  );
}
