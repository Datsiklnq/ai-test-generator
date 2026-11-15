import OpenAI from "openai";

export type TestFramework = "playwright" | "cypress" | "selenium";
export interface GeneratedTests { testCase: string; testScript: string; }

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  return new OpenAI({ apiKey });
}

export async function generateTests(prompt: string, framework: TestFramework): Promise<GeneratedTests> {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages: [
      { role: "system", content: "You are a senior QA automation engineer. Return valid JSON only with exactly two string properties: testCase and testScript. The test case should include preconditions, steps and expected results where relevant. The script should use maintainable selectors and meaningful assertions. Do not invent URLs or credentials." },
      { role: "user", content: `Create a test case and automated test script for this scenario: ${prompt}\nFramework: ${framework}. For Playwright, use TypeScript and the Playwright Test API. Return JSON properties testCase and testScript.` }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("The AI provider returned an empty response.");

  let result: Partial<GeneratedTests>;
  try { result = JSON.parse(content) as Partial<GeneratedTests>; }
  catch { throw new Error("The AI provider returned invalid JSON."); }

  if (typeof result.testCase !== "string" || !result.testCase.trim() ||
      typeof result.testScript !== "string" || !result.testScript.trim()) {
    throw new Error("The AI response is missing testCase or testScript.");
  }
  return { testCase: result.testCase.trim(), testScript: result.testScript.trim() };
}
