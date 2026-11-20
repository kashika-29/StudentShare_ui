import { prisma } from "@/lib/prisma";
import { UnauthorizedError } from "@/lib/errors";
import { readSessionCookie } from "@/lib/auth/cookies";
import { verifySessionToken } from "@/lib/auth/session";
import { assertAdmin } from "@/lib/auth/roles";
import { userPublicSelect, type PublicUser } from "@/lib/users";

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = await readSessionCookie();
  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.sub },
    select: userPublicSelect,
  });
}

export async function requireAuth(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

export async function requireAdmin(): Promise<PublicUser> {
  return assertAdmin(await requireAuth());
}
