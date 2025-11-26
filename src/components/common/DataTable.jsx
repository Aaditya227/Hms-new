



import React, { memo } from "react";

function DataTableComponent({ data, columns, onRowClick }) {
  const getCellValue = (row, column) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return String(row[column.accessor] ?? "");
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-8 sm:p-12 border border-gray-100 text-center">
        <p className="text-gray-500 text-sm sm:text-base">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft overflow-hidden border border-gray-100">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[600px] sm:min-w-full text-sm sm:text-base">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`header-${index}`}
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                className={`${
                  onRowClick
                    ? "hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    : ""
                }`}
              >
                {columns.map((column, index) => (
                  <td
                    key={`cell-${row.id}-${index}`}
                    className={`px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm md:text-base break-words ${
                      column.className || "text-gray-900"
                    }`}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const DataTable = memo(DataTableComponent);
