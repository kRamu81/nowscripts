import React from 'react';
import { Info, Lightbulb, AlertTriangle, AlertCircle } from 'lucide-react';

export const Callout = ({ children, ...props }: any) => {
  // Extract text from children to check for callout pattern
  let textContent = '';
  let restChildren = children;

  const extractTextAndProcess = (node: any): { isCallout: boolean, type: string, cleanChildren: any } => {
    // If the blockquote has a paragraph child
    if (React.isValidElement(node) && node.type === 'p') {
      const pChildren = React.Children.toArray((node as any).props.children);
      if (pChildren.length > 0 && typeof pChildren[0] === 'string') {
        const firstText = pChildren[0];
        const match = firstText.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]/i);
        
        if (match) {
          const type = match[1].toUpperCase();
          // Remove the matched tag from the first text node
          const cleanFirstText = firstText.replace(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]/i, '').trimStart();
          
          // Reconstruct paragraph without the tag
          const newPChildren = [cleanFirstText, ...pChildren.slice(1)];
          const cleanChildren = React.cloneElement(node as React.ReactElement, {}, newPChildren);
          
          return { isCallout: true, type, cleanChildren };
        }
      }
    }
    
    // Fallback if the structure is just string
    if (typeof node === 'string') {
       const match = node.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]/i);
       if (match) {
          const type = match[1].toUpperCase();
          const cleanChildren = node.replace(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]/i, '').trimStart();
          return { isCallout: true, type, cleanChildren };
       }
    }

    // Support nested arrays (e.g. multiple paragraphs in blockquote)
    if (Array.isArray(node) && node.length > 0) {
       const result = extractTextAndProcess(node[0]);
       if (result.isCallout) {
         return {
           isCallout: true,
           type: result.type,
           cleanChildren: [result.cleanChildren, ...node.slice(1)]
         };
       }
    }

    return { isCallout: false, type: '', cleanChildren: node };
  };

  const { isCallout, type, cleanChildren } = extractTextAndProcess(children);

  if (!isCallout) {
    // Standard blockquote
    return (
      <blockquote 
        className="pl-4 border-l-4 border-gray-300 text-slate-700 dark:text-slate-300 my-6 bg-slate-50 dark:bg-slate-800/50 py-3 pr-4 rounded-r-md italic"
        {...props}
      >
        {children}
      </blockquote>
    );
  }

  // Map types to styles and icons
  const styles: Record<string, { bg: string, border: string, text: string, icon: React.ReactNode, title: string }> = {
    NOTE: {
      bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-800 dark:text-blue-300',
      icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />, title: 'Note'
    },
    TIP: {
      bg: 'bg-green-50 dark:bg-emerald-900/20', border: 'border-green-500 dark:border-emerald-500', text: 'text-green-800 dark:text-emerald-300',
      icon: <Lightbulb className="w-5 h-5 text-green-500 dark:text-emerald-400" />, title: 'Tip'
    },
    WARNING: {
      bg: 'bg-yellow-50 dark:bg-amber-900/20', border: 'border-yellow-500 dark:border-amber-500', text: 'text-yellow-800 dark:text-amber-300',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-amber-400" />, title: 'Warning'
    },
    IMPORTANT: {
      bg: 'bg-red-50 dark:bg-rose-900/20', border: 'border-red-500 dark:border-rose-500', text: 'text-red-800 dark:text-rose-300',
      icon: <AlertCircle className="w-5 h-5 text-red-500 dark:text-rose-400" />, title: 'Important'
    }
  };

  const style = styles[type] || styles.NOTE;

  return (
    <div className={`my-8 pl-5 py-4 pr-5 border-l-[4px] rounded-r-xl ${style.bg} ${style.border}`}>
      <div className={`flex items-center gap-2.5 mb-2 font-bold ${style.text}`}>
        {style.icon}
        <span>{style.title}</span>
      </div>
      <div className="text-[16px] text-slate-800 dark:text-slate-200 leading-[1.8] [&>p:last-child]:mb-0">
        {cleanChildren}
      </div>
    </div>
  );
};
