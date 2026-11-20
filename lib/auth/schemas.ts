import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .pipe(z.email("Enter a valid email")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  hostel: z.string().trim().max(200).optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .pipe(z.email("Enter a valid email")),
  password: z.string().min(1, "Password is required").max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
