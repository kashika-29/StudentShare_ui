import { jsonError, jsonOk, readJsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth/helpers";
import { createItem, listItems } from "@/lib/items/service";

export async function GET(request: Request) {
  try {
    const user = await requireAuth().catch(() => null);
    const items = await listItems(user, new URL(request.url).searchParams);
    return jsonOk({ items });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await readJsonBody(request);
    const item = await createItem(user, body);
    return jsonOk({ item }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
