import React from "react";

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
            {listItems.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const parseInline = (text: string): React.ReactNode => {
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let key = 0;

      while (remaining.length > 0) {
        // Find the earliest match among patterns
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

        // Determine which comes first
        const boldIndex = boldMatch?.index ?? Infinity;
        const linkIndex = linkMatch?.index ?? Infinity;

        if (boldIndex === Infinity && linkIndex === Infinity) {
          // No more patterns
          parts.push(remaining);
          break;
        }

        if (linkIndex < boldIndex) {
          // Link comes first
          if (linkIndex > 0) {
            parts.push(remaining.slice(0, linkIndex));
          }
          const isInternal = linkMatch![2].startsWith("/");
          parts.push(
            <a
              key={key++}
              href={linkMatch![2]}
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              {...(!isInternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {linkMatch![1]}
            </a>
          );
          remaining = remaining.slice(linkIndex + linkMatch![0].length);
        } else {
          // Bold comes first
          if (boldIndex > 0) {
            parts.push(remaining.slice(0, boldIndex));
          }
          parts.push(
            <strong key={key++} className="font-semibold text-foreground">
              {boldMatch![1]}
            </strong>
          );
          remaining = remaining.slice(boldIndex + boldMatch![0].length);
        }
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Empty line
      if (trimmed === "") {
        flushList();
        continue;
      }

      // H2 heading
      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl font-semibold text-foreground mt-8 mb-4">
            {trimmed.slice(3)}
          </h2>
        );
        continue;
      }

      // H3 heading
      if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-medium text-foreground mt-6 mb-3">
            {trimmed.slice(4)}
          </h3>
        );
        continue;
      }

      // List item
      if (trimmed.startsWith("- ")) {
        inList = true;
        listItems.push(trimmed.slice(2));
        continue;
      }

      // Horizontal rule
      if (trimmed === "---") {
        flushList();
        elements.push(
          <hr key={`hr-${i}`} className="my-8 border-border" />
        );
        continue;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={`p-${i}`} className="text-muted-foreground mb-4 leading-relaxed">
          {parseInline(trimmed)}
        </p>
      );
    }

    flushList();
    return elements;
  };

  return <div className="prose-custom">{parseMarkdown(content)}</div>;
};

export default MarkdownContent;
