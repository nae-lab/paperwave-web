import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { User } from "firebase/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const userJson = getCookie("user", { cookies });
  const user = userJson ? (JSON.parse(userJson) as User) : null;

  if (!user) {
    redirect("/login");
  } else {
    redirect(`/channels/${user.uid}`);
  }
}
