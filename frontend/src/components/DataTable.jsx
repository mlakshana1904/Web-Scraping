import React from 'react';
import { FiChevronLeft, FiChevronRight, FiEye, FiTrash2 } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

export default function DataTable({ 
  columns = [], 
  data = [], 
  totalElements = 0, 
  totalPages = 1, 
  currentPage = 0, 
  onPageChange, 
  onView, 
  onDelete 
}) {
  if (data.length === 0) {
    return <EmptyState title="No Records Available" message="Try searching or scraping new web pages to populate data." />;
  }

  return (
    <div className="scrapex-card p-0 overflow-hidden mb-0">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-body-tertiary">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="text-secondary small fw-semibold py-3 px-3">
                  {col.header}
                </th>
              ))}
              <th className="text-secondary small fw-semibold py-3 px-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIdx) => (
              <tr key={item.id || rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-3 py-3 small">
                    {col.render ? col.render(item) : item[col.accessor]}
                  </td>
                ))}
                <td className="px-3 py-3 text-end">
                  <div className="d-flex align-items-center justify-content-end gap-1">
                    {onView && (
                      <button 
                        className="btn btn-outline-primary btn-sm border-0 p-1" 
                        onClick={() => onView(item)}
                        title="View details"
                      >
                        <FiEye size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="btn btn-outline-danger btn-sm border-0 p-1" 
                        onClick={() => onDelete(item)}
                        title="Delete record"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="d-flex align-items-center justify-content-between p-3 border-top bg-body-tertiary">
        <span className="text-muted small">
          Showing page <strong>{currentPage + 1}</strong> of <strong>{totalPages || 1}</strong> ({totalElements} total results)
        </span>
        <div className="d-flex gap-1">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
