import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Syntax from './Syntax';

type MarkdownProps = { children: string };

export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ children }) {
          return (
            <Syntax>
              {String(children)}
            </Syntax>
          );
        },
        table({ children }) {
          return (
            <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return <th style={{ border: '1px solid #444', padding: '8px 12px', backgroundColor: '#1e1e1e', textAlign: 'left' }}>{children}</th>;
        },
        td({ children }) {
          return <td style={{ border: '1px solid #444', padding: '8px 12px' }}>{children}</td>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
