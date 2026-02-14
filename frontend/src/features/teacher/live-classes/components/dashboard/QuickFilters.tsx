import React from "react";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedBatch: string;
  onBatchChange: (value: string) => void;
}

export const QuickFilters: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  selectedBatch,
  onBatchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search by topic..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {/* Batch Filter Dropdown */}
      <select
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
        value={selectedBatch}
        onChange={(e) => onBatchChange(e.target.value)}
      >
        <option value="all">All Batches</option>
        <option value="Physics - Batch Alpha">Physics - Batch Alpha</option>
        <option value="Maths - JEE Mains">Maths - JEE Mains</option>
        <option value="Chemistry - Class XII">Chemistry - Class XII</option>
      </select>
    </div>
  );
};
