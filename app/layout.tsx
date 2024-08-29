import "server-cli-only";

import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Navbar from "@/components/navbar";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userJson: string };
}) {
  const currentUserJSON = getCookie("user", { cookies });

  if (currentUserJSON) {
    params.userJson = currentUserJSON;
  }

  return (
    <html suppressHydrationWarning lang="ja">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "system" }}>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="container mx-auto h-full max-w-7xl flex-grow flex-col px-2 pt-6 md:px-8">
              {children}
            </main>
            <footer className="flex w-full items-center justify-center py-3" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
