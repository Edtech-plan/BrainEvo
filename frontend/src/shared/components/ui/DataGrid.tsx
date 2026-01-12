import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataGridProps<T = any> {
  rowData: T[];
  columnDefs: ColDef[];
  gridOptions?: GridOptions;
  className?: string;
  loading?: boolean;
  onRowClicked?: (row: any) => void;
  onSelectionChanged?: (selectedRows: T[]) => void;
  pagination?: boolean;
  paginationPageSize?: number;
  enableFilter?: boolean;
  enableSorting?: boolean;
}

export function DataGrid<T = any>({
  rowData,
  columnDefs,
  gridOptions,
  className = '',
  loading = false,
  onRowClicked,
  onSelectionChanged,
  pagination = true,
  paginationPageSize = 10,
  enableFilter = true,
  enableSorting = true,
}: DataGridProps<T>) {
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: enableSorting,
      filter: enableFilter,
    };
  }, [enableFilter, enableSorting]);

  const defaultGridOptions: GridOptions = {
    ...gridOptions,
    defaultColDef,
    pagination,
    paginationPageSize,
    rowSelection: 'multiple',
    animateRows: true,
    suppressRowClickSelection: false,
    onRowClicked: (event) => {
      if (onRowClicked) {
        onRowClicked(event.data);
      }
    },
    onSelectionChanged: (event) => {
      if (onSelectionChanged) {
        const selectedRows = event.api.getSelectedRows();
        onSelectionChanged(selectedRows);
      }
    },
  };

  return (
    <div className={`ag-theme-alpine ${className}`} style={{ height: '100%', width: '100%' }}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={defaultGridOptions}
        />
      )}
    </div>
  );
};
