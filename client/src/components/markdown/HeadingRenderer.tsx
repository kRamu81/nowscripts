import React from 'react';
import { generateSlug } from '../../utils/markdownParser';
import { Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

const copyToClipboard = (id: string) => {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  navigator.clipboard.writeText(url);
  toast.success('Heading link copied!');
};

const extractText = (node: any): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node) && (node.props as any).children) {
    return extractText((node.props as any).children);
  }
  return '';
};

export const H1 = ({ children, ...props }: any) => (
  <h1 className="text-5xl font-extrabold mb-8 mt-2 tracking-tighter text-slate-900 dark:text-slate-100 leading-tight" {...props}>
    {children}
  </h1>
);

export const H2 = ({ children, ...props }: any) => {
  const text = extractText(children);
  const id = generateSlug(text);

  return (
    <section id={id} className="scroll-mt-24 group relative mt-16 mb-6">
      <div className="flex items-center -ml-8">
        <button
          onClick={() => copyToClipboard(id)}
          className="w-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity text-now-primary rounded-md outline-none"
          title="Copy link to heading"
        >
          <Link2 className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight pb-2 border-b border-slate-200 dark:border-slate-800 w-full" {...props}>
          {children}
        </h2>
      </div>
    </section>
  );
};

export const H3 = ({ children, ...props }: any) => {
  const text = extractText(children);
  const id = generateSlug(text);

  return (
    <div id={id} className="scroll-mt-24 group relative mt-10 mb-4">
      <div className="flex items-center -ml-8">
        <button
          onClick={() => copyToClipboard(id)}
          className="w-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity text-now-primary outline-none"
          title="Copy link to heading"
        >
          <Link2 className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-snug w-full" {...props}>
          {children}
        </h3>
      </div>
    </div>
  );
};
