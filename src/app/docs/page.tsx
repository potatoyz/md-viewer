import Link from "next/link";

export default function DocsIndex() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-semibold">md-viewer</div>
        <div className="mt-2 text-sm text-muted-foreground">
          从左侧列表打开一篇文档，或新建。
        </div>
        <div className="mt-6">
          <Link
            className="rounded border px-3 py-2 text-sm hover:bg-muted"
            href="/docs"
          >
            刷新
          </Link>
        </div>
      </div>
    </div>
  );
}
