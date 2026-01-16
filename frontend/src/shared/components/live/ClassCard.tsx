import React from 'react';

interface ClassCardProps {
  title: string;
  teacher: string;
  time: string;
  status?: string;
  children?: React.ReactNode;
}

function ClassCard({
  title,
  teacher,
  time,
  status,
  children,
}: ClassCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 
      transform-gpu transition-transform duration-200 hover:-translate-y-1 hover:border-blue-400
      flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3 gap-4">
        <h3 className="font-semibold text-slate-900 text-lg leading-tight">
          {title}
        </h3>
        {status && (
          <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {status}
          </span>
        )}
      </div>

      <div className="space-y-1 mb-4 flex-grow">
        <div className="flex items-center text-sm text-slate-500">
          <span className="font-medium text-slate-700 mr-1">Instructor:</span> 
          {teacher}
        </div>
        <div className="flex items-center text-sm text-slate-500">
          <span className="font-medium text-slate-700 mr-1">Time:</span> 
          {time}
        </div>
      </div>

      {children && <div className="mt-auto pt-2">{children}</div>}
    </div>
  );
}

export default ClassCard;
