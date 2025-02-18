import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Securely read the API key from environment variables
});

// Function to handle POST request
export async function POST(req: NextRequest) {
  try {
    const { prompt, framework } = await req.json();

    if (!prompt || !framework) {
      return NextResponse.json(
        { error: "Missing prompt or framework" },
        { status: 400 }
      );
    }

    // AI prompt for generating the test case description and script
    const aiPrompt = `Generate a test case description and an automated test script for the ${framework} framework. 
    Test case: ${prompt}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: aiPrompt }],
    });

    const generatedResponse = response.choices?.[0]?.message?.content || "";

    // Split the generated response into test case description and script
    const [testCase, testScript] = generatedResponse.split("Test Script:");

    if (!testCase || !testScript) {
      return NextResponse.json(
        { error: "AI returned an incomplete response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ testCase: testCase.trim(), testScript: testScript.trim() });
  } catch (error) {
    console.error("Error generating test case and script:", error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
