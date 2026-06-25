import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

export const CodeBlock = ({ children, className, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /lang-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If it's inline code (no language class usually, or inside a paragraph)
  // markdown-to-jsx passes the className 'lang-*' for code blocks.
  // Actually, markdown-to-jsx wraps code blocks in <pre><code>, 
  // so we handle inline code natively via CSS or a separate override.
  // But just in case this is called directly for inline:
  if (!match && !className?.includes('lang-')) {
    return (
      <code className="bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-8 rounded-xl overflow-hidden border border-slate-700/50 bg-[#0d1117] shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-700/50">
        <span className="text-[12px] font-mono text-slate-400 font-semibold">{language || 'text'}</span>
        <button
          onClick={copyToClipboard}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium bg-transparent hover:bg-slate-700/30 px-2 py-1 rounded-md"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
      </div>
      <div className="text-sm">
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, '')}
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          showLineNumbers={true}
          wrapLines={true}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '13.5px',
            lineHeight: '1.6',
          }}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: '#6e7681',
            textAlign: 'right'
          }}
          {...props}
        />
      </div>
    </div>
  );
};
