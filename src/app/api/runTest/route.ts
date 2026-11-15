import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Test execution is not implemented yet.",
      message: "This endpoint only supports generating test scripts. Add a secure execution service before enabling test runs.",
    },
    { status: 501 }
  );
}
