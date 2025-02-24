import { NextResponse } from "next/server";
import { admin } from "../../lib/firebaseAdmin"; // Ensure this imports correctly

const db = admin.firestore();

export async function GET() {
  try {
    const testCasesSnapshot = await db.collection("testCases").get();
    const testCases = testCasesSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        content: data.content || "No content",
        createdAt: data.createdAt?._seconds
          ? new Date(data.createdAt._seconds * 1000).toISOString() // Convert Firestore Timestamp
          : new Date().toISOString(), // Fallback to current date
      };
    });

    return NextResponse.json(testCases, { status: 200 });
  } catch (error) {
    console.error("Error fetching test cases:", error);
    return NextResponse.json(
      { error: "Error fetching test cases" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const newTestCase = {
      content,
      createdAt: new Date().toISOString(), // Ensure correct format
    };

    const docRef = await db.collection("testCases").add(newTestCase);
    return NextResponse.json(
      { id: docRef.id, ...newTestCase },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving test case:", error);
    return NextResponse.json(
      { error: "Error saving test case" },
      { status: 500 }
    );
  }
}
