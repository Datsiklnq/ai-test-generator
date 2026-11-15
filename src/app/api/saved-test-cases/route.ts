import { NextResponse } from "next/server";
import { admin } from "../../lib/firebaseAdmin";

const db = admin.firestore();
const collection = db.collection("testCases");

function serializeTimestamp(value: FirebaseFirestore.Timestamp | undefined) {
  return value?.toDate().toISOString() ?? null;
}

export async function GET() {
  try {
    const snapshot = await collection.orderBy("createdAt", "desc").get();
    const items = snapshot.docs.map((document) => {
      const data = document.data();
      return {
        id: document.id,
        title: data.title || data.content?.split("\n")[0]?.trim() || "Untitled",
        content: data.content || "",
        contentType: data.contentType === "testScript" ? "testScript" : "testCase",
        createdAt: serializeTimestamp(data.createdAt) ?? new Date().toISOString(),
        updatedAt: serializeTimestamp(data.updatedAt),
      };
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Unable to fetch saved test items:", error);
    return NextResponse.json({ error: "Unable to fetch saved items." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "A JSON request body is required." }, { status: 400 });
    }
    const { content, contentType } = body as { content?: unknown; contentType?: unknown };
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }
    if (content.length > 50_000) {
      return NextResponse.json({ error: "Content is too large." }, { status: 400 });
    }
    if (contentType !== "testCase" && contentType !== "testScript") {
      return NextResponse.json({ error: "Invalid content type." }, { status: 400 });
    }

    const title = content.trim().split("\n")[0].slice(0, 160) || "Untitled";
    const reference = await collection.add({
      title,
      content: content.trim(),
      contentType,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: null,
    });

    return NextResponse.json({ id: reference.id, title, contentType }, { status: 201 });
  } catch (error) {
    console.error("Unable to save test item:", error);
    return NextResponse.json({ error: "Unable to save item." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "A JSON request body is required." }, { status: 400 });
    }
    const { id, title, content } = body as { id?: unknown; title?: unknown; content?: unknown };
    if (typeof id !== "string" || !id || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "A valid id and content are required." }, { status: 400 });
    }

    const reference = collection.doc(id);
    const document = await reference.get();
    if (!document.exists) return NextResponse.json({ error: "Saved item not found." }, { status: 404 });

    await reference.update({
      title: typeof title === "string" && title.trim()
        ? title.trim().slice(0, 160)
        : content.trim().split("\n")[0].slice(0, 160),
      content: content.trim(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ message: "Saved item updated." });
  } catch (error) {
    console.error("Unable to update saved item:", error);
    return NextResponse.json({ error: "Unable to update saved item." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body: unknown = await request.json();
    const id = body && typeof body === "object" ? (body as { id?: unknown }).id : undefined;
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "A valid id is required." }, { status: 400 });
    }
    const reference = collection.doc(id);
    const document = await reference.get();
    if (!document.exists) return NextResponse.json({ error: "Saved item not found." }, { status: 404 });
    await reference.delete();
    return NextResponse.json({ message: "Saved item deleted." });
  } catch (error) {
    console.error("Unable to delete saved item:", error);
    return NextResponse.json({ error: "Unable to delete saved item." }, { status: 500 });
  }
}
