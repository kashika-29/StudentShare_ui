import { jsonError, jsonOk, readJsonBody } from "@/lib/api";
import { loginUser } from "@/lib/auth/service";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const user = await loginUser(body);
    return jsonOk({ user });
  } catch (error) {
    return jsonError(error);
  }
}
