import React from "react";

export const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
    <div className="text-4xl mb-2">📅</div>
    <h3 className="text-lg font-semibold text-gray-900">
      No Classes Scheduled
    </h3>
    <p className="text-gray-500 text-sm">
      Create a new session to get started.
    </p>
  </div>
);
