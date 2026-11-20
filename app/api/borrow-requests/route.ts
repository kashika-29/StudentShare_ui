import { jsonError, jsonOk, readJsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth/helpers";
import { createBorrowRequest, listBorrowRequests } from "@/lib/borrow-requests/service";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const requests = await listBorrowRequests(user, new URL(request.url).searchParams);
    return jsonOk({ requests });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await readJsonBody(request);
    const borrowRequest = await createBorrowRequest(user, body);
    return jsonOk({ request: borrowRequest }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
