import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  sub: string;
  role: UserRole;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string") {
      return null;
    }

    if (payload.role !== "STUDENT" && payload.role !== "ADMIN") {
      return null;
    }

    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}
