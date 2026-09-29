import React from 'react';

export default function SkeletonLoader({ rows = 5, columns = 4 }) {
  return (
    <div className="w-100 py-3">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="d-flex gap-3 mb-3">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <div 
              key={cIdx} 
              className="skeleton py-3" 
              style={{ flex: 1, height: 40 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
