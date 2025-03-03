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
        title:
          data.title ||
          (data.content
            ? data.content.split("\n")[0].trim()
            : "Untitled Test Case"),
        content: data.content || "No content",
        createdAt: data.createdAt?._seconds
          ? new Date(data.createdAt._seconds * 1000).toISOString()
          : new Date().toISOString(),
        updatedAt: data.updatedAt?._seconds
          ? new Date(data.updatedAt._seconds * 1000).toISOString()
          : null, // Ensuring updatedAt is included
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
    const { content, contentType } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const title = content.split("\n")[0].trim() || "Untitled Test Case";

    const newTestCaseRef = await db.collection("testCases").add({
      title,
      content,
      contentType: contentType || "defaultType", // Ensure it is always set
      createdAt: admin.firestore.Timestamp.now(),
    });

    return NextResponse.json(
      {
        id: newTestCaseRef.id,
        title,
        content,
        contentType: contentType || "defaultType",
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

// 🔥 DELETE method to remove test cases
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

// 🔥 PUT method to update test cases
export async function PUT(req: Request) {
  try {
    const { id, title, content } = await req.json();

    // Check if both the title and content are provided
    if (!id || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optionally, set the title from content if it's not provided
    const updatedTitle =
      title || content.split("\n")[0].trim() || "Untitled Test Case";

    // Ensure that the 'updatedAt' field is set correctly
    const updatedTestCase = {
      title: updatedTitle,
      content,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    // Update the document in Firestore
    await db.collection("testCases").doc(id).update(updatedTestCase);

    // Return success response
    return NextResponse.json(
      { message: "Test case updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error updating test case:", error);
    return NextResponse.json(
      { error: "Error updating test case" },
      { status: 500 }
    );
  }
}
