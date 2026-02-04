"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { DocList } from "@/components/DocList";
import { Outline } from "@/components/Outline";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { SaveBadge, type SaveState } from "@/components/SaveBadge";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import type { DocumentRecord } from "@/lib/types";
import { extractHeadings } from "@/lib/markdown";
import { isPbAuthError } from "@/lib/errors";
import {
  createDocument,
  getDocument,
  listDocuments,
  logout,
  updateDocument,
  uploadAsset,
} from "@/services/documents";

function useDebouncedCallback(fn: () => void, delayMs: number) {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  return () => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(fn, delayMs);
  };
}

export default function DocEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Guard against bad routes like /docs/undefined that would cause PB "Missing required record id".
  useEffect(() => {
    if (!params?.id || params.id === "undefined") {
      router.replace("/docs");
    }
  }, [params?.id, router]);
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [doc, setDoc] = useState<DocumentRecord | null>(null);
  const [title, setTitle] = useState("");
  const [md, setMd] = useState("");
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [error, setError] = useState<string | null>(null);

  const draftKey = `draft:${params.id}`;

  const headings = useMemo(() => extractHeadings(md), [md]);

  async function refreshList() {
    try {
      const items = await listDocuments();
      setDocs(items);
    } catch (e: unknown) {
      if (isPbAuthError(e)) {
        router.replace("/login");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (e as any)?.message || String(e);
      setError(msg);
    }
  }

  async function load() {
    setError(null);
    try {
      const d = await getDocument(params.id);
      setDoc(d);
      setTitle(d.title || "");
      setMd(d.content_md || "");
      setSave({ kind: "idle" });

      // local draft recovery (network fail etc.)
      const cached = localStorage.getItem(draftKey);
      if (cached && cached !== d.content_md) {
        setMd(cached);
        setSave({ kind: "dirty" });
      }
    } catch (e: unknown) {
      if (isPbAuthError(e)) {
        router.replace("/login");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message || String(e));
    }
  }

  useEffect(() => {
    refreshList();
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const debouncedSave = useDebouncedCallback(async () => {
    if (!doc) return;
    try {
      setSave({ kind: "saving" });
      const next = await updateDocument(doc.id, {
        title,
        content_md: md,
        version: (doc.version || 1) + 1,
      });
      setDoc(next);
      setSave({ kind: "saved", at: new Date() });
      localStorage.removeItem(draftKey);
      refreshList();
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSave({ kind: "error", message: (e as any)?.message || String(e) });
      localStorage.setItem(draftKey, md);
    }
  }, 1000);

  function onChangeMd(v: string) {
    setMd(v);
    setSave({ kind: "dirty" });
    debouncedSave();
  }

  function onChangeTitle(v: string) {
    setTitle(v);
    setSave({ kind: "dirty" });
    debouncedSave();
  }

  async function onCreateDoc() {
    try {
      const d = await createDocument();
      await refreshList();
      router.push(`/docs/${d.id}`);
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message || String(e));
    }
  }

  async function onUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!doc) return;
    try {
      const f = files[0];
      const { url } = await uploadAsset(doc.id, f);
      const snippet = `\n\n![](${url})\n`;
      onChangeMd(md + snippet);
    } catch (e: unknown) {
      if (isPbAuthError(e)) {
        router.replace("/login");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message || String(e));
    }
  }

  return (
    <div className="grid h-dvh grid-cols-[280px_1fr_260px]">
      <DocList docs={docs} onCreate={onCreateDoc} />

      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Input
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="标题"
            className="max-w-[520px]"
          />
          <SaveBadge state={save} />

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
            >
              退出
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(e.target.files)}
              />
              <span className="rounded border px-3 py-2 text-sm hover:bg-muted">
                插入图片
              </span>
            </label>
            <Button
              variant="secondary"
              onClick={() => {
                if (doc) localStorage.setItem(draftKey, md);
              }}
            >
              保存草稿
            </Button>
          </div>
        </div>

        {error ? (
          <div className="border-b bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid flex-1 grid-cols-2 overflow-hidden">
          <div className="flex h-full flex-col">
            <div className="px-3 py-2 text-sm font-medium">编辑</div>
            <Separator />
            <div className="flex-1 overflow-auto p-3">
              <Textarea
                value={md}
                onChange={(e) => onChangeMd(e.target.value)}
                placeholder="写点什么…"
                className="min-h-[70vh] font-mono"
                onDrop={(e) => {
                  const f = e.dataTransfer.files;
                  if (f && f.length) {
                    e.preventDefault();
                    onUpload(f);
                  }
                }}
                onDragOver={(e) => {
                  if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
                }}
              />
              <div className="mt-2 text-xs text-muted-foreground">
                支持拖拽图片到编辑框（将上传到 PocketBase assets 并插入 Markdown）。
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col border-l">
            <div className="px-3 py-2 text-sm font-medium">预览</div>
            <Separator />
            <div className="flex-1 overflow-auto p-4">
              <MarkdownPreview markdown={md} />
            </div>
          </div>
        </div>
      </div>

      <Outline headings={headings} />
    </div>
  );
}
