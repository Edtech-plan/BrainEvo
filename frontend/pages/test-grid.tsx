import React, { useState } from 'react';
import type { NextPage } from 'next';
import { DataGrid } from '../src/shared/components/ui';
import { ColDef } from 'ag-grid-community';

// Sample data for testing
const sampleUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Teacher', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Student', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Student', status: 'Active' },
];

const sampleCourses = [
  { id: 1, title: 'Introduction to React', instructor: 'John Doe', students: 45, status: 'Active' },
  { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', students: 32, status: 'Active' },
  { id: 3, title: 'Node.js Basics', instructor: 'Bob Johnson', students: 28, status: 'Active' },
  { id: 4, title: 'Database Design', instructor: 'Alice Brown', students: 15, status: 'Draft' },
];

const TestGrid: NextPage = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [clickedRow, setClickedRow] = useState<any>(null);

  // Column definitions for Users
  const userColumns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, checkboxSelection: true },
    { field: 'name', headerName: 'Name', flex: 1, filter: true },
    { field: 'email', headerName: 'Email', flex: 1, filter: true },
    { field: 'role', headerName: 'Role', width: 120, filter: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        return status === 'Active' ? '✅ Active' : '❌ Inactive';
      },
    },
  ];

  // Column definitions for Courses
  const courseColumns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'title', headerName: 'Course Title', flex: 2, filter: true },
    { field: 'instructor', headerName: 'Instructor', flex: 1, filter: true },
    { field: 'students', headerName: 'Students', width: 120, type: 'numericColumn' },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        return status === 'Active' ? '✅ Active' : '📝 Draft';
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AG Grid Test Page</h1>

      {/* Users Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Users Grid</h2>
        <div className="bg-white rounded-lg shadow p-4" style={{ height: '400px' }}>
          <DataGrid
            rowData={sampleUsers}
            columnDefs={userColumns}
            onRowClicked={(row) => setClickedRow(row)}
            onSelectionChanged={(rows) => setSelectedRows(rows)}
            pagination={true}
            paginationPageSize={5}
          />
        </div>
        {clickedRow && (
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="font-semibold">Clicked Row:</p>
            <pre className="text-sm">{JSON.stringify(clickedRow, null, 2)}</pre>
          </div>
        )}
        {selectedRows.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded">
            <p className="font-semibold">Selected Rows ({selectedRows.length}):</p>
            <pre className="text-sm">{JSON.stringify(selectedRows, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Courses Grid</h2>
        <div className="bg-white rounded-lg shadow p-4" style={{ height: '400px' }}>
          <DataGrid
            rowData={sampleCourses}
            columnDefs={courseColumns}
            onRowClicked={(row) => console.log('Course clicked:', row)}
            pagination={true}
            paginationPageSize={5}
          />
        </div>
      </div>

      {/* Features Demo */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Features to Test:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>✅ <strong>Pagination:</strong> Navigate through pages using controls at bottom</li>
          <li>✅ <strong>Sorting:</strong> Click column headers to sort ascending/descending</li>
          <li>✅ <strong>Filtering:</strong> Use filter icons in column headers to filter data</li>
          <li>✅ <strong>Row Selection:</strong> Check boxes in first column to select rows</li>
          <li>✅ <strong>Row Click:</strong> Click any row to see data below</li>
          <li>✅ <strong>Resize Columns:</strong> Drag column borders to resize</li>
          <li>✅ <strong>Responsive:</strong> Grid adapts to container size</li>
        </ul>
      </div>
    </div>
  );
};

export default TestGrid;
