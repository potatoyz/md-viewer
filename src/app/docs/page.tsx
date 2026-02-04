"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { isPbAuthError } from "@/lib/errors";
import { listDocuments, createDocument } from "@/services/documents";

export default function DocsIndex() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const docs = await listDocuments();
        if (docs[0]?.id) {
          router.replace(`/docs/${docs[0].id}`);
          return;
        }
        const created = await createDocument();
        router.replace(`/docs/${created.id}`);
      } catch (e: unknown) {
        if (isPbAuthError(e)) {
          router.replace("/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="text-sm text-muted-foreground">
        {loading ? "加载中…" : "跳转中…"}
      </div>
    </div>
  );
}
