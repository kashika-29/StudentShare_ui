import type { User, UserRole } from "@prisma/client";

export const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  profileImage: true,
  hostel: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  hostel: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    hostel: user.hostel,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
