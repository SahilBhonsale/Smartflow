import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/claude";
import { z } from "zod";

const prioritizeSchema = z.object({
  boardId: z.string().min(1, "boardId is required"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = prioritizeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    // Verify board ownership and get tasks
    const board = await prisma.board.findFirst({
      where: { id: parsed.data.boardId, userId: session.user.id },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const allTasks = board.columns.flatMap((col) =>
      col.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate?.toISOString() ?? null,
        tags: task.tags,
      }))
    );

    if (allTasks.length === 0) {
      return NextResponse.json(
        { error: "No tasks found to prioritize" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a productivity coach. Given these tasks with their priorities and due dates, return a prioritized list with reasoning for each task. Return ONLY valid JSON in this exact format:
{
  "prioritizedTasks": [
    {
      "taskId": "task-id-here",
      "reason": "Brief explanation of priority",
      "suggestedPriority": "HIGH"
    }
  ]
}

Tasks: ${JSON.stringify(allTasks)}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock) {
      return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
    }

    try {
      // Extract JSON from response (handles potential markdown wrapping)
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      const parsed2 = JSON.parse(jsonMatch ? jsonMatch[0] : textBlock.text);
      return NextResponse.json(parsed2);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
  } catch (error) {
    console.error("POST /api/ai/prioritize error:", error);
    return NextResponse.json({ error: "Failed to prioritize tasks" }, { status: 500 });
  }
}
