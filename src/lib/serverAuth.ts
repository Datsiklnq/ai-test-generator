import { NextResponse } from "next/server";
import { admin } from "@/app/lib/firebaseAdmin";

export async function requireUser(request: Request) {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { user: null, response: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    return { user: decoded, response: null };
  } catch {
    return { user: null, response: NextResponse.json({ error: "Invalid or expired authentication token." }, { status: 401 }) };
  }
}
