import { jsonError, jsonOk, readJsonBody } from "@/lib/api";
import { registerUser } from "@/lib/auth/service";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const user = await registerUser(body);
    return jsonOk({ user }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
