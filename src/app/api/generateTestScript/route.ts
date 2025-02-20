import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Generate the test case using OpenAI
    const testCaseResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a concise, structured test case for: ${prompt}`,
        },
      ],
    });

    const testCase = testCaseResponse.choices[0]?.message?.content?.trim();

    // Generate the test script based on the selected framework
    const scriptPrompt = `Generate a ${framework} test script for the following test case:\n\n${testCase}`;
    const testScriptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: scriptPrompt }],
    });

    const testScript = testScriptResponse.choices[0]?.message?.content?.trim();

    return NextResponse.json({ testCase, testScript });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
