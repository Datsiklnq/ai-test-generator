import { NextResponse } from "next/server";
import { admin } from "../../lib/firebaseAdmin"; // Ensure this imports correctly

const db = admin.firestore();

export async function GET() {
  try {
    const testCasesSnapshot = await db.collection("testCases").get();
    const testCases = testCasesSnapshot.docs.map((doc) => {
      const data = doc.data();

      // console.log("Fetched from Firestore:", data); // 🛠 Debugging line

      return {
        id: doc.id,
        title:
          data.title ||
          (data.content
            ? data.content.split("\n")[0].trim()
            : "Untitled Test Case"),
        content: data.content || "No content",
        createdAt: data.createdAt?._seconds
          ? new Date(data.createdAt._seconds * 1000).toISOString()
          : new Date().toISOString(),
      };
    });

    console.log("Final formatted test cases:", testCases); // 🛠 Debugging line
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
    const { content, contentType } = await req.json();

    if (!content || !contentType) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Extract title from first line of content
    const title = content.split("\n")[0].trim() || "Untitled Test Case";

    const newTestCaseRef = await db.collection("testCases").add({
      title, // Save title in Firestore
      content,
      contentType,
      createdAt: admin.firestore.Timestamp.now(),
    });

    return NextResponse.json(
      {
        id: newTestCaseRef.id,
        title,
        content,
        contentType,
        message: "Test case saved successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error saving test case" },
      { status: 500 }
    );
  }
}

// 🔥 NEW: DELETE method to remove test cases
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing test case ID" },
        { status: 400 }
      );
    }

    await db.collection("testCases").doc(id).delete();

    return NextResponse.json(
      { message: "Test case deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting test case:", error);
    return NextResponse.json(
      { error: "Error deleting test case" },
      { status: 500 }
    );
  }
}
