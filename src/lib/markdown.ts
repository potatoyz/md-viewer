import { unified } from "unified";
import remarkParse from "remark-parse";

export type HeadingItem = {
  depth: number;
  text: string;
  id: string;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractHeadings(markdown: string): HeadingItem[] {
  const tree = unified().use(remarkParse).parse(markdown) as unknown;
  const out: HeadingItem[] = [];
  const used = new Map<string, number>();

  function walk(node: unknown) {
    // mdast types are verbose; use a narrow unsafe cast locally.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const n = node as any;
    if (!n) return;
    if (n.type === "heading" && typeof n.depth === "number") {
      const text = (n.children || [])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((c: any) => c.type === "text" || c.type === "inlineCode")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any) => c.value)
        .join("")
        .trim();
      if (text) {
        const base = slugify(text) || "section";
        const count = (used.get(base) || 0) + 1;
        used.set(base, count);
        const id = count === 1 ? base : `${base}-${count}`;
        out.push({ depth: n.depth, text, id });
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children = (n as any).children as any[] | undefined;
    if (Array.isArray(children)) children.forEach(walk);
  }

  walk(tree);
  return out;
}

export function injectHeadingIds(markdown: string): string {
  // Minimal approach: we don't mutate markdown; ids are used for preview rendering.
  // Real id injection is done at render time via react-markdown components.
  return markdown;
}
