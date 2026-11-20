import { z } from "zod";

export const transactionTypeSchema = z.enum(["BORROW", "RENT", "SELL", "EXCHANGE"]);
export const itemStatusSchema = z.enum(["AVAILABLE", "UNAVAILABLE", "INACTIVE"]);

const itemFields = {
  categoryId: z.string().min(1, "Category is required"),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
  transactionType: transactionTypeSchema,
  condition: z.string().trim().min(1, "Condition is required").max(100),
  price: z.number().nonnegative().nullable().optional(),
  deposit: z.number().nonnegative().nullable().optional(),
  location: z.string().trim().min(1, "Location is required").max(200),
  availableFrom: z.coerce.date(),
  availableUntil: z.coerce.date(),
  imageUrls: z.array(z.url()).max(10).optional(),
};

export const createItemSchema = z
  .object(itemFields)
  .strict()
  .refine((data) => data.availableFrom < data.availableUntil, {
    message: "availableFrom must be before availableUntil",
    path: ["availableUntil"],
  });

export const updateItemSchema = z
  .object({
    ...itemFields,
    status: itemStatusSchema,
  })
  .partial()
  .strict()
  .refine(
    (data) =>
      !data.availableFrom ||
      !data.availableUntil ||
      data.availableFrom < data.availableUntil,
    {
      message: "availableFrom must be before availableUntil",
      path: ["availableUntil"],
    },
  );

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
