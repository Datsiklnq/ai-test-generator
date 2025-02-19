import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework } = await req.json();

    if (!prompt || !framework) {
      return NextResponse.json(
        { error: "Missing prompt or framework" },
        { status: 400 }
      );
    }

    // Generate the test case using OpenAI
    const testCasePrompt = `Generate a concise, structured test case for the following scenario: ${prompt}. Keep it in a short step-by-step format.`;
    const testCaseResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: testCasePrompt }],
    });

    const testCase =
      testCaseResponse.choices[0]?.message?.content?.trim() ||
      "No test case description available.";

    // Generate the test script based on the selected framework
    const scriptPrompt = `Generate a ${framework} test script for the following test case:\n\n${testCase}\n\nUse best coding practices and ensure it follows the framework syntax.`;
    const testScriptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: scriptPrompt }],
    });

    const testScript =
      testScriptResponse.choices[0]?.message?.content?.trim() ||
      "No test script generated.";

    return NextResponse.json({ testCase, testScript });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
