import { jsonError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth/helpers";
import { acceptBorrowRequest } from "@/lib/borrow-requests/service";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const borrowRequest = await acceptBorrowRequest(user, id);
    return jsonOk({ request: borrowRequest });
  } catch (error) {
    return jsonError(error);
  }
}
