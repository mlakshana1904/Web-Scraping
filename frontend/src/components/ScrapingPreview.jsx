import React, { useState } from 'react';
import { 
  FiFileText, 
  FiLink, 
  FiGrid, 
  FiImage, 
  FiInfo, 
  FiCode, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiDownload, 
  FiSave, 
  FiRefreshCw, 
  FiFilter 
} from 'react-icons/fi';

export default function ScrapingPreview({ previewData, onScrapeAgain, onSaveToDb, onExportCsv, onExportJson, isSaving }) {
  const [activeTab, setActiveTab] = useState('items');

  if (!previewData) return null;

  const {
    pageTitle,
    sourceUrl,
    httpStatus,
    responseTimeMs,
    contentSize,
    jsRequired,
    warningMessage,
    recordsFound = 0,
    duplicatesFound = 0,
    cleanRecords = 0,
    items = [],
    links = [],
    tables = [],
    images = [],
    metadata = {}
  } = previewData;

  return (
    <div className="scrapex-card p-4">
      {/* Header Info */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom pb-3 mb-3">
        <div>
          <span className="badge bg-primary-subtle text-primary mb-1">Scraped Preview</span>
          <h4 className="fw-bold mb-1">{pageTitle || 'Extracted Web Page'}</h4>
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-muted small text-decoration-none text-truncate d-block" style={{ maxWidth: 600 }}>
            {sourceUrl}
          </a>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-2 py-1">
            HTTP {httpStatus}
          </span>
          <span className="badge bg-secondary-subtle text-secondary px-2 py-1">
            {responseTimeMs} ms
          </span>
          <span className="badge bg-secondary-subtle text-secondary px-2 py-1">
            {contentSize}
          </span>
        </div>
      </div>

      {/* Warning Alert if JS Rendering or Warnings exist */}
      {(jsRequired || warningMessage) && (
        <div className="alert alert-warning d-flex align-items-start gap-2 mb-3" role="alert">
          <FiAlertTriangle size={20} className="mt-1 flex-shrink-0" />
          <div>
            <strong className="d-block">Scraping Warning / JS Render Notice</strong>
            <span>{warningMessage || 'This page may require JavaScript rendering to display full dynamic content.'}</span>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="bg-body-tertiary p-3 rounded text-center">
            <span className="text-muted small">Records Found</span>
            <div className="h4 fw-bold mb-0 text-primary">{recordsFound}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="bg-body-tertiary p-3 rounded text-center">
            <span className="text-muted small">Duplicates Removed</span>
            <div className="h4 fw-bold mb-0 text-warning">{duplicatesFound}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="bg-body-tertiary p-3 rounded text-center">
            <span className="text-muted small">Clean Records</span>
            <div className="h4 fw-bold mb-0 text-success">{cleanRecords}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="bg-body-tertiary p-3 rounded text-center">
            <span className="text-muted small">Content Status</span>
            <div className="h6 fw-bold mb-0 text-info mt-2">Validated</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs nav-tabs-scrapex mb-3">
        <li className="nav-item">
          <button className={`nav-item-btn ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')}>
            <FiFileText size={16} />
            <span>Extracted Items ({items.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-item-btn ${activeTab === 'links' ? 'active' : ''}`} onClick={() => setActiveTab('links')}>
            <FiLink size={16} />
            <span>Links ({links.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-item-btn ${activeTab === 'tables' ? 'active' : ''}`} onClick={() => setActiveTab('tables')}>
            <FiGrid size={16} />
            <span>Tables ({tables.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-item-btn ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>
            <FiImage size={16} />
            <span>Images ({images.length})</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-item-btn ${activeTab === 'metadata' ? 'active' : ''}`} onClick={() => setActiveTab('metadata')}>
            <FiInfo size={16} />
            <span>Metadata</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-item-btn ${activeTab === 'json' ? 'active' : ''}`} onClick={() => setActiveTab('json')}>
            <FiCode size={16} />
            <span>JSON Output</span>
          </button>
        </li>
      </ul>

      {/* Tab Contents */}
      <div className="tab-content py-2">
        {activeTab === 'items' && (
          <div className="d-flex flex-column gap-3" style={{ maxHeight: 450, overflowY: 'auto' }}>
            {items.length === 0 ? (
              <div className="text-muted py-4 text-center">No extracted text content available.</div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="border rounded p-3 bg-body-tertiary">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-indigo-subtle text-primary fw-semibold">{item.contentType}</span>
                    <span className="text-muted small font-monospace">Hash: {item.contentHash ? item.contentHash.substring(0, 12) : ''}...</span>
                  </div>
                  <h6 className="fw-bold mb-1">{item.title}</h6>
                  <p className="small text-secondary mb-2 whitespace-pre-wrap">{item.content}</p>
                  <div className="d-flex gap-3 text-muted small border-top pt-2">
                    <span>Author: {item.author || 'Unknown'}</span>
                    {item.publishedDate && <span>Date: {item.publishedDate}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="table-responsive" style={{ maxHeight: 400 }}>
            <table className="table table-sm table-hover align-middle">
              <thead>
                <tr>
                  <th>Anchor Text</th>
                  <th>Target URL</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, idx) => (
                  <tr key={idx}>
                    <td className="fw-medium">{link.text}</td>
                    <td>
                      <a href={link.url} target="_blank" rel="noreferrer" className="text-truncate d-inline-block" style={{ maxWidth: 450 }}>
                        {link.url}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tables' && (
          <div className="d-flex flex-column gap-3" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {tables.map((tableRows, idx) => (
              <div key={idx} className="border rounded p-2 bg-body-tertiary">
                <span className="fw-semibold small d-block mb-2">Table #{idx + 1}</span>
                <pre className="small mb-0 font-monospace bg-dark text-light p-2 rounded">{tableRows.join('\n')}</pre>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'images' && (
          <div className="row g-3" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {images.map((img, idx) => (
              <div key={idx} className="col-md-4">
                <div className="border rounded p-2 text-center bg-body-tertiary">
                  <img src={img.src} alt={img.alt} className="img-fluid rounded mb-2" style={{ maxHeight: 120, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="text-truncate small fw-medium">{img.alt || 'No alt text'}</div>
                  <span className="text-muted text-truncate d-block small" style={{ fontSize: '0.75rem' }}>{img.src}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="bg-body-tertiary p-3 rounded font-monospace small">
            <pre className="mb-0">{JSON.stringify(metadata, null, 2)}</pre>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="bg-dark text-light p-3 rounded font-monospace small" style={{ maxHeight: 400, overflowY: 'auto' }}>
            <pre className="mb-0">{JSON.stringify(previewData, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 border-top pt-3 mt-3">
        <button type="button" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={onScrapeAgain}>
          <FiRefreshCw size={14} />
          <span>Scrape Again</span>
        </button>

        <div className="d-flex align-items-center gap-2">
          <button type="button" className="btn btn-outline-success btn-sm d-flex align-items-center gap-1" onClick={onExportCsv}>
            <FiDownload size={14} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn btn-outline-info btn-sm d-flex align-items-center gap-1" onClick={onExportJson}>
            <FiDownload size={14} />
            <span>Export JSON</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary-scrapex btn-sm d-flex align-items-center gap-1" 
            onClick={onSaveToDb}
            disabled={isSaving}
          >
            <FiSave size={14} />
            <span>{isSaving ? 'Saving to Database...' : 'Save to Database'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
