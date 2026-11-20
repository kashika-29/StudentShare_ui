import { z } from "zod";

export const createBorrowRequestSchema = z
  .object({
    itemId: z.string().min(1, "Item is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    message: z.string().trim().max(1000).optional(),
  })
  .strict()
  .refine((data) => data.startDate < data.endDate, {
    message: "startDate must be before endDate",
    path: ["endDate"],
  });

export type CreateBorrowRequestInput = z.infer<typeof createBorrowRequestSchema>;
