import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new AppError(400, "Request body must be valid JSON");
  }
}
