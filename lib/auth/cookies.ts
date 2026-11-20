import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  type SessionPayload,
} from "@/lib/auth/session";

export async function setSessionCookie(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function readSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
