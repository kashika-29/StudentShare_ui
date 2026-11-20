import { prisma } from "@/lib/prisma";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { createItemSchema, itemStatusSchema, updateItemSchema } from "@/lib/items/schemas";
import type { PublicUser } from "@/lib/users";

const itemInclude = {
  category: true,
  images: true,
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      hostel: true,
      role: true,
    },
  },
} as const;

function assertCanManageItem(user: PublicUser | null, ownerId: string) {
  if (!user || (user.role !== "ADMIN" && user.id !== ownerId)) {
    throw new ForbiddenError("Only the owner or an admin can change this item");
  }
}

export async function listItems(user: PublicUser | null, query: URLSearchParams) {
  const mine = query.get("mine") === "true";
  const parsedStatus = itemStatusSchema.safeParse(query.get("status"));
  const status = parsedStatus.success ? parsedStatus.data : undefined;

  return prisma.item.findMany({
    where: {
      ...(mine && user ? { ownerId: user.id } : {}),
      ...(status
        ? { status }
        : mine || (user && user.role === "ADMIN")
          ? {}
          : { status: "AVAILABLE" }),
    },
    include: itemInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getItemById(id: string) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: itemInclude,
  });

  if (!item) {
    throw new NotFoundError("Item not found");
  }

  return item;
}

export async function createItem(user: PublicUser, input: unknown) {
  const data = createItemSchema.parse(input);
  const { imageUrls, ...itemData } = data;

  return prisma.item.create({
    data: {
      ...itemData,
      ownerId: user.id,
      images: imageUrls?.length
        ? { create: imageUrls.map((imageUrl) => ({ imageUrl })) }
        : undefined,
    },
    include: itemInclude,
  });
}

export async function updateItem(user: PublicUser | null, id: string, input: unknown) {
  const existing = await getItemById(id);
  assertCanManageItem(user, existing.ownerId);

  const data = updateItemSchema.parse(input);
  const { imageUrls, ...itemData } = data;

  return prisma.item.update({
    where: { id },
    data: {
      ...itemData,
      ...(imageUrls
        ? {
            images: {
              deleteMany: {},
              create: imageUrls.map((imageUrl) => ({ imageUrl })),
            },
          }
        : {}),
    },
    include: itemInclude,
  });
}

export async function deleteItem(user: PublicUser | null, id: string) {
  const existing = await getItemById(id);
  assertCanManageItem(user, existing.ownerId);

  await prisma.item.delete({ where: { id } });
  return { ok: true };
}
