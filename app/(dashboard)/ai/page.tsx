"use client";

import { Header } from "@/components/layout/Header";
import { AIAssistant } from "@/components/ai/AIAssistant";

export default function AIPage() {
  return (
    <>
      <Header title="AI Assistant" />
      <div className="flex-1 overflow-hidden px-4 lg:px-8 py-4">
        <AIAssistant />
      </div>
    </>
  );
}
