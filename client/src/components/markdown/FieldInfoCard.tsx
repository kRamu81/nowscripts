import React from 'react';

// Configuration for supported field labels to auto-detect in markdown paragraphs
export const SUPPORTED_FIELD_LABELS = [
  'Name',
  'Table',
  'Active',
  'Category',
  'Subcategory',
  'Caller',
  'Priority',
  'State',
  'Assignment Group',
  'Approval',
  'Short Description'
];

export interface FieldItem {
  label: string;
  value: React.ReactNode;
}

export interface FieldInfoCardProps {
  fields: FieldItem[];
  title?: string;
  className?: string;
}

export const FieldInfoCard: React.FC<FieldInfoCardProps> = ({ fields, title, className = '' }) => {
  if (!fields || fields.length === 0) return null;

  return (
    <div className={`my-8 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm ${className}`}>
      {title && (
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-wide uppercase">
          {title}
        </div>
      )}
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {fields.map((field, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row px-6 py-3.5 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
            <div className="w-full sm:w-1/3 md:w-1/4 text-[14px] font-semibold text-slate-500 dark:text-slate-400 flex items-center mb-1 sm:mb-0">
              {field.label}
            </div>
            <div className="w-full sm:w-2/3 md:w-3/4 text-[15px] font-medium text-slate-900 dark:text-slate-100 flex items-center flex-wrap gap-1">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
