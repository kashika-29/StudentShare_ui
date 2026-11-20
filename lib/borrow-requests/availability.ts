import type { BorrowRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { rangesOverlap } from "@/lib/dates";

export async function findOverlappingBorrowRequest(input: {
  itemId: string;
  startDate: Date;
  endDate: Date;
  excludeRequestId?: string;
  statuses?: BorrowRequestStatus[];
}) {
  const statuses = input.statuses ?? ["PENDING", "ACCEPTED"];
  const candidates = await prisma.borrowRequest.findMany({
    where: {
      itemId: input.itemId,
      status: { in: statuses },
      ...(input.excludeRequestId ? { id: { not: input.excludeRequestId } } : {}),
    },
  });

  return (
    candidates.find((request) =>
      rangesOverlap(
        { start: input.startDate, end: input.endDate },
        { start: request.startDate, end: request.endDate },
      ),
    ) ?? null
  );
}
