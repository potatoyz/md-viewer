import { pb } from "@/lib/pb";
import type { DocumentRecord } from "@/lib/types";

const DOCS = "documents";
const ASSETS = "assets";

export async function listDocuments(): Promise<DocumentRecord[]> {
  const res = await pb.collection(DOCS).getList<DocumentRecord>(1, 200, {
    sort: "-updated",
    fields: "id,title,version,updated,created",
  });
  return res.items;
}

export async function getDocument(id: string): Promise<DocumentRecord> {
  return pb.collection(DOCS).getOne<DocumentRecord>(id);
}

export async function createDocument(input?: {
  title?: string;
  content_md?: string;
}): Promise<DocumentRecord> {
  const now = new Date();
  const title = input?.title || `Untitled ${now.toISOString().slice(0, 10)}`;
  const content_md = input?.content_md || "# 新文档\n\n开始写吧。\n";

  return pb.collection(DOCS).create<DocumentRecord>({
    title,
    content_md,
    version: 1,
  });
}

export async function updateDocument(
  id: string,
  patch: Partial<Pick<DocumentRecord, "title" | "content_md" | "version">>
): Promise<DocumentRecord> {
  // For now we just update; later we can enforce optimistic locking via version checks.
  // Suggested rule: client sends expected version; server-side hook validates.
  return pb.collection(DOCS).update<DocumentRecord>(id, patch);
}

export async function uploadAsset(docId: string, file: File) {
  const form = new FormData();
  form.append("doc", docId);
  form.append("file", file);
  const rec = await pb.collection(ASSETS).create(form);

  // PB file URL
  const url = pb.files.getURL(rec, rec.file);
  return { record: rec, url };
}
