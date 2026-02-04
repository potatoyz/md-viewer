import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 text-center shadow-sm">
        <div className="text-lg font-semibold">md-viewer</div>
        <div className="mt-2 text-sm text-muted-foreground">
          单人 Markdown 文档：编辑 / 预览 / 自动保存 / 大纲 / 图片。
        </div>
        <div className="mt-6">
          <Link
            href="/docs"
            className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            进入
          </Link>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          PocketBase: {process.env.NEXT_PUBLIC_PB_URL || "https://pb.potatoyz.tech"}
        </div>
      </div>
    </div>
  );
}
