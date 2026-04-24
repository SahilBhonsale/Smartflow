import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export { anthropic };

/** Strip HTML/JSON to plain text for AI processing */
export function stripToPlainText(content: string): string {
  try {
    // Try to parse as Tiptap JSON
    const parsed = JSON.parse(content);
    return extractTextFromNode(parsed);
  } catch {
    // If not JSON, strip HTML tags
    return content
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
  }
}

/** Recursively extract text from Tiptap JSON nodes */
function extractTextFromNode(node: Record<string, unknown>): string {
  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }

  if (Array.isArray(node.content)) {
    return (node.content as Record<string, unknown>[])
      .map((child) => extractTextFromNode(child))
      .join(node.type === "paragraph" ? "\n" : "");
  }

  return "";
}
