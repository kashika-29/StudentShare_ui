import type { BorrowRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertBorrowingDates } from "@/lib/dates";
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors";
import { findOverlappingBorrowRequest } from "@/lib/borrow-requests/availability";
import { createBorrowRequestSchema } from "@/lib/borrow-requests/schemas";
import type { PublicUser } from "@/lib/users";

const requestInclude = {
  item: {
    select: {
      id: true,
      title: true,
      status: true,
      availableFrom: true,
      availableUntil: true,
      ownerId: true,
    },
  },
  requester: {
    select: { id: true, name: true, email: true, hostel: true, role: true },
  },
  owner: {
    select: { id: true, name: true, email: true, hostel: true, role: true },
  },
} as const;

async function getRequestOrThrow(id: string) {
  const request = await prisma.borrowRequest.findUnique({
    where: { id },
    include: requestInclude,
  });

  if (!request) {
    throw new NotFoundError("Borrow request not found");
  }

  return request;
}

function assertOwnerOrAdmin(user: PublicUser, ownerId: string) {
  if (user.role !== "ADMIN" && user.id !== ownerId) {
    throw new ForbiddenError("Only the item owner or an admin can do that");
  }
}

export async function listBorrowRequests(user: PublicUser, query: URLSearchParams) {
  const scope = query.get("scope");
  const status = query.get("status") as BorrowRequestStatus | null;

  const where =
    user.role === "ADMIN" && scope === "all"
      ? {}
      : scope === "incoming"
        ? { ownerId: user.id }
        : scope === "outgoing"
          ? { requesterId: user.id }
          : { OR: [{ ownerId: user.id }, { requesterId: user.id }] };

  return prisma.borrowRequest.findMany({
    where: {
      ...where,
      ...(status ? { status } : {}),
    },
    include: requestInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function createBorrowRequest(user: PublicUser, input: unknown) {
  const data = createBorrowRequestSchema.parse(input);

  const item = await prisma.item.findUnique({ where: { id: data.itemId } });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  if (item.ownerId === user.id) {
    throw new ForbiddenError("You cannot borrow your own item");
  }

  if (item.status !== "AVAILABLE") {
    throw new ConflictError("This item is not available to borrow");
  }

  const dateErrors = assertBorrowingDates({
    startDate: data.startDate,
    endDate: data.endDate,
    availableFrom: item.availableFrom,
    availableUntil: item.availableUntil,
  });
  if (dateErrors.length > 0) {
    throw new AppError(400, dateErrors[0]);
  }

  const overlap = await findOverlappingBorrowRequest({
    itemId: item.id,
    startDate: data.startDate,
    endDate: data.endDate,
  });
  if (overlap) {
    throw new ConflictError("Those dates overlap an existing booking or pending request");
  }

  return prisma.borrowRequest.create({
    data: {
      itemId: item.id,
      requesterId: user.id,
      ownerId: item.ownerId,
      startDate: data.startDate,
      endDate: data.endDate,
      message: data.message,
    },
    include: requestInclude,
  });
}

export async function acceptBorrowRequest(user: PublicUser, id: string) {
  const request = await getRequestOrThrow(id);
  assertOwnerOrAdmin(user, request.ownerId);

  if (request.status !== "PENDING") {
    throw new ConflictError("Only pending requests can be accepted");
  }

  const overlap = await findOverlappingBorrowRequest({
    itemId: request.itemId,
    startDate: request.startDate,
    endDate: request.endDate,
    excludeRequestId: request.id,
    statuses: ["ACCEPTED"],
  });
  if (overlap) {
    throw new ConflictError("Those dates overlap an existing booking");
  }

  await prisma.$transaction([
    prisma.borrowRequest.update({
      where: { id: request.id },
      data: { status: "ACCEPTED" },
    }),
    prisma.transaction.create({
      data: {
        requestId: request.id,
        itemId: request.itemId,
        borrowerId: request.requesterId,
        ownerId: request.ownerId,
        borrowedAt: request.startDate,
        expectedReturnAt: request.endDate,
        status: "ACTIVE",
      },
    }),
  ]);

  return getRequestOrThrow(id);
}

export async function rejectBorrowRequest(user: PublicUser, id: string) {
  const request = await getRequestOrThrow(id);
  assertOwnerOrAdmin(user, request.ownerId);

  if (request.status !== "PENDING") {
    throw new ConflictError("Only pending requests can be rejected");
  }

  return prisma.borrowRequest.update({
    where: { id },
    data: { status: "REJECTED" },
    include: requestInclude,
  });
}

export async function cancelBorrowRequest(user: PublicUser, id: string) {
  const request = await getRequestOrThrow(id);

  const isRequester = user.id === request.requesterId;
  if (user.role !== "ADMIN" && !isRequester) {
    throw new ForbiddenError("Only the requester or an admin can cancel this request");
  }

  if (request.status !== "PENDING") {
    throw new ConflictError("Only pending requests can be cancelled");
  }

  return prisma.borrowRequest.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: requestInclude,
  });
}
