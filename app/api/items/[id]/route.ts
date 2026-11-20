import { jsonError, jsonOk, readJsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth/helpers";
import { deleteItem, getItemById, updateItem } from "@/lib/items/service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const item = await getItemById(id);
    return jsonOk({ item });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await readJsonBody(request);
    const item = await updateItem(user, id, body);
    return jsonOk({ item });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const result = await deleteItem(user, id);
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
