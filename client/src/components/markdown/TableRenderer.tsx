import React from 'react';

export const Table = ({ children, ...props }: any) => (
  <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }} {...props}>
      {children}
    </table>
  </div>
);

export const TableHead = ({ children, ...props }: any) => (
  <thead style={{ backgroundColor: '#1e1e2e' }} {...props}>
    {children}
  </thead>
);

export const TableRow = ({ children, ...props }: any) => (
  <tr style={{ borderBottom: '1px solid #334155' }} {...props}>
    {children}
  </tr>
);

export const TableHeader = ({ children, ...props }: any) => (
  <th style={{
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#94a3b8',
    borderBottom: '2px solid #334155',
    whiteSpace: 'nowrap',
  }} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, ...props }: any) => (
  <td style={{
    padding: '10px 14px',
    fontSize: '15px',
    color: '#e2e8f0',
    borderBottom: '1px solid #1e293b',
  }} {...props}>
    {children}
  </td>
);
