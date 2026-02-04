"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { pb } from "@/lib/pb";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await pb.collection("users").authWithPassword(email, password);
      router.replace("/docs");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.message || "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-sm">
        <div className="text-lg font-semibold">登录</div>
        <div className="mt-1 text-sm text-muted-foreground">
          使用 PocketBase users 邮箱密码。
        </div>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <div className="text-sm font-medium">邮箱</div>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">密码</div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "登录中…" : "登录"}
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          服务器：{process.env.NEXT_PUBLIC_PB_URL || "(unset)"}
        </div>
      </div>
    </div>
  );
}
