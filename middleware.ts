import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const headers = new Headers(req.headers);

  headers.set("x-pathname", req.nextUrl.pathname);

  return NextResponse.next({
    headers,
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
