"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { HeadingItem } from "@/lib/markdown";

export function Outline({ headings }: { headings: HeadingItem[] }) {
  return (
    <div className="h-full border-l bg-background">
      <div className="px-3 py-2 text-sm font-medium">大纲</div>
      <ScrollArea className="h-[calc(100%-36px)] px-2">
        {headings.length === 0 ? (
          <div className="px-2 py-3 text-xs text-muted-foreground">暂无标题</div>
        ) : (
          <div className="space-y-1 py-2">
            {headings.map((h) => (
              <button
                key={h.id}
                className="block w-full truncate rounded px-2 py-1 text-left text-sm hover:bg-muted"
                style={{ paddingLeft: 8 + (h.depth - 1) * 10 }}
                onClick={() => {
                  const el = document.getElementById(h.id);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                title={h.text}
              >
                {h.text}
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
