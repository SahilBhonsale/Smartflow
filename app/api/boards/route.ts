import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").max(100),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const boards = await prisma.board.findMany({
      where: { userId: session.user.id },
      include: {
        _count: { select: { columns: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(boards);
  } catch (error) {
    console.error("GET /api/boards error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createBoardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    // Create board with 3 default columns
    const board = await prisma.board.create({
      data: {
        name: parsed.data.name,
        userId: session.user.id,
        columns: {
          create: [
            { name: "To Do", order: 0 },
            { name: "In Progress", order: 1 },
            { name: "Done", order: 2 },
          ],
        },
      },
      include: {
        columns: { orderBy: { order: "asc" } },
        _count: { select: { columns: true } },
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error("POST /api/boards error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
