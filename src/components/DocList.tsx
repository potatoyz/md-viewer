"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { DocumentRecord } from "@/lib/types";

export function DocList({
  docs,
  onCreate,
}: {
  docs: DocumentRecord[];
  onCreate: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="h-full border-r bg-background">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-sm font-medium">文档</div>
        <Button size="sm" onClick={onCreate}>
          新建
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100%-49px)]">
        <div className="p-2">
          {docs.length === 0 ? (
            <div className="p-2 text-xs text-muted-foreground">暂无文档</div>
          ) : (
            <div className="space-y-1">
              {docs.map((d) => {
                const href = `/docs/${d.id}`;
                const active = pathname === href;
                return (
                  <Link
                    key={d.id}
                    href={href}
                    className={
                      "block rounded px-2 py-2 text-sm hover:bg-muted " +
                      (active ? "bg-muted" : "")
                    }
                    title={d.title}
                  >
                    <div className="truncate font-medium">{d.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {d.updated ? new Date(d.updated).toLocaleString() : ""}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
