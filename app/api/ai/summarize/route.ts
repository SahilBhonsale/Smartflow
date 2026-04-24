import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gemini, stripToPlainText } from "@/lib/gemini";
import { z } from "zod";

const summarizeSchema = z.object({
  noteId: z.string().min(1, "noteId is required"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = summarizeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const note = await prisma.note.findFirst({
      where: { id: parsed.data.noteId, userId: session.user.id },
    });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const plainText = stripToPlainText(note.content);

    if (!plainText || plainText.length < 10) {
      return NextResponse.json(
        { error: "Note content is too short to summarize" },
        { status: 400 }
      );
    }

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the following note in 3-5 bullet points, keeping it concise and actionable:\n\n${plainText}`,
    });

    const summary = response.text || "Unable to generate summary";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("POST /api/ai/summarize error:", error);
    return NextResponse.json({ error: "Failed to summarize note" }, { status: 500 });
  }
}
