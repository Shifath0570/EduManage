// components/MarkdownRenderer.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Props {
  content: string;
}

export default function MarkdownRenderer({ content }: Props) {
  // Preprocess content to ensure LaTeX blocks are well-formatted for remark-math
  const processContent = (text: string) => {
    if (!text) return '';

    return text
      // Fix broken environments missing opening tags
      .replace(/(\s*)(a & b & c[\s\S]*?\\end\{vmatrix\})/g, ' \\begin{vmatrix} $2')
      // Safe cross-version regex replacement for $$ blocks without needing the /s flag
      .replace(/\$\$([\s\S]*?)\$\$/g, '\n\n$$\n$1\n$$\n\n');
  };

  return (
    <div className="prose prose-slate max-w-none text-sm leading-relaxed overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkMath as any]}
        rehypePlugins={[rehypeKatex as any]}
      >
        {processContent(content)}
      </ReactMarkdown>
    </div>
  );
}