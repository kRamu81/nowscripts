import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Clock, BookOpen, Settings, Target, Calendar, User } from 'lucide-react';
import { LessonData } from '../../utils/markdownParser';

import { H1, H2, H3 } from './HeadingRenderer';
import { UL, OL, LI } from './Lists';
import { Table, TableHead, TableRow, TableHeader, TableCell } from './TableRenderer';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { ExpandableImage } from './ExpandableImage';
import { FieldInfoCard, SUPPORTED_FIELD_LABELS } from './FieldInfoCard';

import './MarkdownStyles.css';

interface MarkdownRendererProps {
  content: string;
  lessonData?: LessonData;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, lessonData, className }) => {
  
  // Format date helper if needed
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`markdown-body w-full max-w-none mx-auto pb-24 ${className || ''}`}>
      
      {/* Premium Header if lessonData is provided */}
      {lessonData && (
        <div className="mb-12 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2 mb-6">
            {lessonData.category && (
              <span className="bg-now-primary/10 text-now-primary px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
                {lessonData.category}
              </span>
            )}
            {lessonData.difficulty && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-semibold">
                {lessonData.difficulty}
              </span>
            )}
            {lessonData.tags?.slice(0,2).map(tag => (
              <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 leading-[1.15] tracking-tight">
            {lessonData.title}
          </h1>
          
          {lessonData.description && (
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-3xl">
              {lessonData.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
            {lessonData.author && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-now-primary to-blue-500 flex items-center justify-center text-white shadow-sm">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Author</span>
                  <span className="text-slate-900 dark:text-slate-100">{lessonData.author}</span>
                </div>
              </div>
            )}
            
            {lessonData.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-now-primary" />
                <span>{lessonData.readingTime}</span>
              </div>
            )}

            {lessonData.lastUpdated && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-now-primary" />
                <span>Last Updated: {formatDate(lessonData.lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Markdown Content */}
      <Markdown
        options={{
          overrides: {
            h1: { component: H1 },
            h2: { component: H2 },
            h3: { component: H3 },
            p: { 
              component: ({ children, ...props }: any) => {
                const childrenArray = React.Children.toArray(children);
                const fields: any[] = [];
                let isFieldInfoCard = false;
                let currentField: any = null;
                let isValid = true;
                let currentValues: React.ReactNode[] = [];

                const extractText = (node: any): string => {
                  if (typeof node === 'string') return node;
                  if (Array.isArray(node)) return node.map(extractText).join('');
                  if (React.isValidElement(node) && (node.props as any).children) {
                    return extractText((node.props as any).children);
                  }
                  return '';
                };

                const finishCurrentField = () => {
                  if (currentField) {
                    // Clean up trailing/leading newlines from string values
                    const cleanedValues = currentValues.map((v, i) => {
                      if (typeof v === 'string') {
                        let str = v;
                        if (i === 0) str = str.replace(/^\s+/, '');
                        if (i === currentValues.length - 1) str = str.replace(/\s+$/, '');
                        return str;
                      }
                      return v;
                    }).filter(v => v !== '');

                    currentField.value = cleanedValues.length === 1 && typeof cleanedValues[0] === 'string'
                      ? cleanedValues[0]
                      : cleanedValues;
                    fields.push(currentField);
                    currentField = null;
                    currentValues = [];
                  }
                };

                for (let i = 0; i < childrenArray.length; i++) {
                  const child = childrenArray[i];

                  // Ignore standalone <br/> tags when accumulating or checking validity
                  if (React.isValidElement(child) && child.type === 'br') {
                    if (currentField) {
                      // We could add a space or a br, but typically we can just ignore it 
                      // or push it. Let's push it so multi-line values work.
                      currentValues.push(child);
                    }
                    continue;
                  }

                  if (React.isValidElement(child) && child.type === 'strong') {
                    const strongText = extractText(child).trim();
                    let isLabel = false;
                    for (const label of SUPPORTED_FIELD_LABELS) {
                      if (strongText === `${label}:` || strongText === label) {
                        finishCurrentField();
                        currentField = { label };
                        isLabel = true;
                        isFieldInfoCard = true;
                        break;
                      }
                    }
                    if (isLabel) continue;
                  }

                  if (currentField) {
                    currentValues.push(child);
                  } else {
                    if (typeof child === 'string' && child.trim() === '') {
                      continue;
                    }
                    isValid = false;
                    break;
                  }
                }

                finishCurrentField();

                if (isFieldInfoCard && isValid && fields.length > 0) {
                  return <FieldInfoCard fields={fields} />;
                }

                return (
                  <p className="text-[17px] sm:text-[18px] leading-[1.8] mb-[24px] text-slate-800 dark:text-slate-200" {...props}>
                    {children}
                  </p>
                );
              } 
            },
            ul: { component: UL },
            ol: { component: OL },
            li: { component: LI },
            blockquote: { component: Callout },
            pre: {
              component: ({ children, ...props }: any) => {
                // If the pre contains a code block, CodeBlock component handles the extraction
                // markdown-to-jsx passes the <code> as children.
                const codeChild = React.Children.toArray(children)[0];
                if (React.isValidElement(codeChild) && codeChild.type === 'code') {
                  return <CodeBlock className={codeChild.props.className} {...codeChild.props} />;
                }
                return <pre {...props}>{children}</pre>;
              }
            },
            table: { component: Table },
            thead: { component: TableHead },
            tr: { component: TableRow },
            th: { component: TableHeader },
            td: { component: TableCell },
            img: { component: ExpandableImage },
            a: {
              component: ({ children, ...props }: any) => (
                <a className="text-now-primary hover:text-now-accent underline underline-offset-4 decoration-now-primary/30 hover:decoration-now-primary transition-all" {...props}>
                  {children}
                </a>
              )
            }
          }
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
