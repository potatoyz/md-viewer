import { Badge } from "@/components/ui/badge";

export type SaveState =
  | { kind: "idle" }
  | { kind: "dirty" }
  | { kind: "saving" }
  | { kind: "saved"; at: Date }
  | { kind: "error"; message: string };

export function SaveBadge({ state }: { state: SaveState }) {
  if (state.kind === "idle") return null;

  if (state.kind === "dirty") {
    return <Badge variant="secondary">编辑中…</Badge>;
  }
  if (state.kind === "saving") {
    return <Badge variant="secondary">保存中…</Badge>;
  }
  if (state.kind === "saved") {
    const hh = state.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return <Badge variant="outline">已保存 {hh}</Badge>;
  }
  return (
    <Badge variant="destructive" title={state.message}>
      保存失败
    </Badge>
  );
}
