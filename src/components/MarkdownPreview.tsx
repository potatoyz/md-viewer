import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { extractHeadings } from "@/lib/markdown";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function MarkdownPreview({ markdown }: { markdown: string }) {
  // Keep ids stable for ToC jump
  const headings = extractHeadings(markdown);
  const map = new Map<string, string>();
  headings.forEach((h) => map.set(h.text, h.id));

  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children, ...props }) => {
            const text = String(children);
            const id = map.get(text) || slugify(text);
            return (
              <h1 id={id} {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const text = String(children);
            const id = map.get(text) || slugify(text);
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const text = String(children);
            const id = map.get(text) || slugify(text);
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
          h4: ({ children, ...props }) => {
            const text = String(children);
            const id = map.get(text) || slugify(text);
            return (
              <h4 id={id} {...props}>
                {children}
              </h4>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
