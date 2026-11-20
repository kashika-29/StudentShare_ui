import { ForbiddenError } from "@/lib/errors";
import type { PublicUser } from "@/lib/users";

export function assertAdmin(user: PublicUser): PublicUser {
  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  return user;
}
