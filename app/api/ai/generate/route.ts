import { auth } from "@/lib/auth";
import { anthropic } from "@/lib/claude";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  type: z.enum(["chat", "generate_tasks", "brainstorm"]),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .default([]),
});

const systemPrompts: Record<string, string> = {
  chat: `You are SmartFlow AI, a helpful productivity assistant. Help users with task management, time management, productivity strategies, and general questions. Be concise and actionable.`,
  generate_tasks: `You are SmartFlow AI, a task generation expert. When a user describes a goal or project, break it down into specific, actionable tasks. Format each task with a clear title and brief description. Present tasks as a numbered list with title and description separated by " - ".`,
  brainstorm: `You are SmartFlow AI, a creative brainstorming partner. Help users explore ideas, think through problems, and generate creative solutions. Use bullet points and organize ideas into categories when helpful.`,
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.issues[0].message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { prompt, type, history } = parsed.data;

    // Build message history for context
    const messages = [
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: prompt },
    ];

    // Use streaming response
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompts[type],
      messages,
    });

    // Create a ReadableStream that pipes Claude's streamed text
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                new TextEncoder().encode(event.delta.text)
              );
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("POST /api/ai/generate error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
