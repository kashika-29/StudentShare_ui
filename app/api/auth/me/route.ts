import { jsonError, jsonOk } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth/helpers";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return jsonOk({ user: null });
    }
    return jsonOk({ user });
  } catch (error) {
    return jsonError(error);
  }
}
