import { NextRequest, NextResponse } from "next/server";
import { generateTests, type TestFramework } from "@/services/ai";
import { admin } from "@/app/lib/firebaseAdmin";
import { requireUser } from "@/lib/serverAuth";

const frameworks: TestFramework[] = ["playwright", "cypress", "selenium"];
const MAX_PROMPT_LENGTH = 8_000;
const GENERATION_LIMIT = 10;
const WINDOW_MS = 60_000;

async function enforceGenerationLimit(uid: string) {
  const db = admin.firestore();
  const ref = db.collection("generationRateLimits").doc(uid);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const now = Date.now();
    const current = snapshot.data();
    const windowStart = typeof current?.windowStart === "number" ? current.windowStart : 0;
    const count = windowStart + WINDOW_MS > now ? Number(current?.count || 0) : 0;

    if (count >= GENERATION_LIMIT) return false;
    transaction.set(ref, {
      windowStart: count === 0 ? now : windowStart,
      count: count + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (!auth.user) return auth.response ?? NextResponse.json({ error: "Authentication required." }, { status: 401);

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "A JSON request body is required." }, { status: 400 });
    }

    const { prompt, framework } = body as { prompt?: unknown; framework?: unknown };

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }
    if (typeof framework !== "string" || !frameworks.includes(framework as TestFramework)) {
      return NextResponse.json(
        { error: "Framework must be playwright, cypress, or selenium." },
        { status: 400 }
      );
    }

    const allowed = await enforceGenerationLimit(auth.user.uid);
    if (!allowed) {
      return NextResponse.json(
        { error: "Generation limit reached. Please wait a minute and try again." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const generated = await generateTests(prompt.trim(), framework as TestFramework);
    return NextResponse.json(generated);
  } catch (error) {
    console.error("Test generation failed:", error);
    return NextResponse.json(
      { error: "Unable to generate tests right now. Please try again." },
      { status: 500 }
    );
  }
}
