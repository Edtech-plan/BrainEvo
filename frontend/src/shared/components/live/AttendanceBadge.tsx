import React from 'react';

interface AttendanceBadgeProps {
  status: 'Present' | 'Late' | 'Absent';
}

function AttendanceBadge({ status }: AttendanceBadgeProps) {
  const styles = {
    Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Late: 'bg-amber-50 text-amber-700 border-amber-200',
    Absent: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
        ${status === 'Present' ? 'bg-emerald-500' : 
          status === 'Late' ? 'bg-amber-500' : 'bg-rose-500'}`} 
      />
      {status}
    </span>
  );
}

export default AttendanceBadge;
