import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ConflictError, UnauthorizedError } from "@/lib/errors";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { loginSchema, registerSchema } from "@/lib/auth/schemas";
import { setSessionCookie } from "@/lib/auth/cookies";
import { toPublicUser, userPublicSelect, type PublicUser } from "@/lib/users";

export async function registerUser(input: unknown): Promise<PublicUser> {
  const data = registerSchema.parse(input);
  const passwordHash = await hashPassword(data.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        hostel: data.hostel,
        role: "STUDENT",
      },
      select: userPublicSelect,
    });

    await setSessionCookie({ sub: user.id, role: user.role });
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictError("An account with this email already exists");
    }
    throw error;
  }
}

export async function loginUser(input: unknown): Promise<PublicUser> {
  const data = loginSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const matches = await verifyPassword(data.password, user.passwordHash);
  if (!matches) {
    throw new UnauthorizedError("Invalid email or password");
  }

  await setSessionCookie({ sub: user.id, role: user.role });
  return toPublicUser(user);
}
