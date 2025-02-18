import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import {
  generateCypressScript,
  generatePlaywrightScript,
  generateSeleniumScript,
} from "../../pages/api/generateTestScripts"; // Import the functions

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function POST(req: NextRequest) {
  try {
    const { prompt, framework } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Generate a refined test case prompt for OpenAI
    const refinedPrompt = `Generate a concise, structured test case for the following scenario: ${prompt}. Keep it in a short step-by-step format.`;

    // Request OpenAI for test case description
    const testCaseResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: refinedPrompt }],
    });

    const testCase =
      testCaseResponse.choices[0]?.message?.content?.trim() ||
      "No test case description available.";

    // Request OpenAI for a test script
    const scriptPrompt = `Generate a ${framework} test script for the following test case:\n\n${testCase}\n\nUse best coding practices and ensure it follows the framework syntax.`;

    const testScriptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: scriptPrompt }],
    });

    let testScript =
      testScriptResponse.choices[0]?.message?.content?.trim() || "";

    // Ensure we are returning a properly structured script
    if (framework === "cypress") {
      testScript = generateCypressScript(testScript);
    } else if (framework === "playwright") {
      testScript = generatePlaywrightScript(testScript);
    } else if (framework === "selenium") {
      testScript = generateSeleniumScript(testScript);
    }

    return NextResponse.json({ testCase, testScript });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}

// Dummy function to generate test case description (can be enhanced or customized)
const generateTestCaseDescription = (prompt: string): string => {
  if (!prompt) return "";
  // You can enhance this further based on your requirements.
  return `Test case to verify the ${prompt} functionality`;
};
