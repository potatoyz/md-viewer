"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { pb } from "@/lib/pb";
import { isPbAuthError } from "@/lib/errors";
import { createDocument, listDocuments } from "@/services/documents";
import type { DocumentRecord } from "@/lib/types";

export default function DocsIndex() {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      try {
        if (!pb.authStore.isValid) {
          setDocs([]);
          return;
        }
        const items = await listDocuments();
        setDocs(items);
      } catch (e: unknown) {
        if (isPbAuthError(e)) {
          setDocs([]);
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError((e as any)?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onCreate() {
    setError(null);
    try {
      const created = await createDocument();
      window.location.href = `/docs/${created.id}`;
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message || String(e));
    }
  }

  const authed = pb.authStore.isValid;

  return (
    <div className="flex h-dvh items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm">
        <div className="text-lg font-semibold">文档</div>
        <div className="mt-1 text-sm text-muted-foreground">
          {authed ? "已登录" : "未登录"}
        </div>

        {error ? (
          <div className="mt-4 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {!authed ? (
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              去登录
            </Link>
          </div>
        ) : loading ? (
          <div className="mt-6 text-sm text-muted-foreground">加载中…</div>
        ) : docs.length === 0 ? (
          <div className="mt-6">
            <div className="text-sm text-muted-foreground">还没有文档。</div>
            <button
              className="mt-3 inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              onClick={onCreate}
            >
              新建第一篇
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            <div className="text-sm text-muted-foreground">打开最近文档：</div>
            <Link
              href={`/docs/${docs[0].id}`}
              className="block rounded border px-3 py-2 text-sm hover:bg-muted"
            >
              {docs[0].title}
            </Link>
            <button
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-muted"
              onClick={onCreate}
            >
              新建
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
