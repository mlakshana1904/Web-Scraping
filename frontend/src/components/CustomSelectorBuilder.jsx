import React from 'react';
import { FiPlus, FiTrash2, FiHelpCircle } from 'react-icons/fi';

export default function CustomSelectorBuilder({ rules = [], onChange }) {
  const handleAddRule = () => {
    onChange([...rules, { fieldName: '', cssSelector: '' }]);
  };

  const handleRemoveRule = (index) => {
    const updated = rules.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = rules.map((rule, i) => {
      if (i === index) {
        return { ...rule, [field]: value };
      }
      return rule;
    });
    onChange(updated);
  };

  return (
    <div className="scrapex-card p-3 mb-3 border-dashed">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h6 className="fw-bold mb-0">Custom CSS Extraction Rules</h6>
          <span className="text-muted small">Target specific HTML elements using standard CSS selectors</span>
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={handleAddRule}>
          <FiPlus size={16} />
          <span>Add Extraction Rule</span>
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="text-muted small italic py-2 bg-body-tertiary px-3 rounded">
          No custom rules added. Click "+ Add Extraction Rule" to define custom CSS selectors (e.g. <code>.price</code>, <code>article h2</code>).
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {rules.map((rule, index) => (
            <div key={index} className="row g-2 align-items-center">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Field Name (e.g. Price, Product Name)"
                  value={rule.fieldName}
                  onChange={(e) => handleChange(index, 'fieldName', e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control form-control-sm font-monospace"
                  placeholder="CSS Selector (e.g. .price, article)"
                  value={rule.cssSelector}
                  onChange={(e) => handleChange(index, 'cssSelector', e.target.value)}
                />
              </div>
              <div className="col-md-1 text-end">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm border-0 p-1"
                  onClick={() => handleRemoveRule(index)}
                  title="Remove rule"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
