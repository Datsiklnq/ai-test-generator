import { NextRequest, NextResponse } from "next/server";
import { generateTests, type TestFramework } from "@/services/ai";

const frameworks: TestFramework[] = ["playwright", "cypress", "selenium"];
const MAX_PROMPT_LENGTH = 8_000;

export async function POST(request: NextRequest) {
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
