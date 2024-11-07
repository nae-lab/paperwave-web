import "server-cli-only";

import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Link, Tooltip, button as buttonStyles } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/cn";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  // Deny all crawlers
  robots: {
    follow: false,
    index: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const footerTextStyle = tv({
  base: "text-xs text-default-500",
  variants: {
    inherit: {
      true: "text-inherit",
    },
    center: {
      true: "text-center",
    },
  },
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations();

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers
            themeProps={{ attribute: "class", defaultTheme: "system" }}
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="container mx-auto h-full max-w-7xl flex-grow flex-col px-2 pt-6 md:px-8">
                {children}
              </main>
              <Tooltip content={t("Footer.Feedback")} placement="left">
                <Link
                  className={cn([
                    buttonStyles({
                      isIconOnly: true,
                      radius: "full",
                      size: "md",
                      variant: "ghost",
                    }),
                    "fixed bottom-4 right-4 z-10 overflow-visible shadow-md md:bottom-8 md:right-8",
                  ])}
                  href={t("Footer.FeedbackURL")}
                >
                  <Icon icon="fluent:person-feedback-24-regular" width={28} />
                </Link>
              </Tooltip>
              <footer className="w-full flex-col items-stretch justify-center py-3">
                <div className="my-1 flex justify-center">
                  <p className={footerTextStyle({ center: true })}>
                    &copy;{" "}
                    <Link
                      isExternal
                      className="text-xs"
                      href="https://nae-lab.org"
                      size="sm"
                    >
                      Naemura Laboratory
                    </Link>
                    , the University of Tokyo - All Rights Reserved.
                  </p>
                </div>
                <div className="my-1 flex justify-center gap-4">
                  <Link href="/acknowledgements">
                    <p className={footerTextStyle({ inherit: true })}>
                      {t("Acknowledgements.Acknowledgements")}
                    </p>
                  </Link>
                  <Link isExternal href={t("Footer.FeedbackURL")}>
                    <p className={footerTextStyle({ inherit: true })}>
                      {t("Footer.Feedback")}
                    </p>
                  </Link>
                  <Link
                    isExternal
                    href="https://github.com/nae-lab/paperwave-web"
                  >
                    <p className={footerTextStyle({ inherit: true })}>GitHub</p>
                  </Link>
                </div>
              </footer>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
