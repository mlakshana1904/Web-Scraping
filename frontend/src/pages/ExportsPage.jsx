import React, { useEffect, useState } from 'react';
import { FiDownload, FiFileText, FiCode, FiFilter, FiCheckCircle } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import ToastNotification from '../components/ToastNotification';

export default function ExportsPage() {
  const [format, setFormat] = useState('CSV');
  const [sourceId, setSourceId] = useState('');
  const [contentType, setContentType] = useState('');
  const [sources, setSources] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  useEffect(() => {
    apiClient.get('/sources').then(setSources).catch(console.error);
  }, []);

  const handleTriggerExport = async () => {
    setIsExporting(true);
    try {
      const endpoint = format === 'CSV' ? '/export/csv' : '/export/json';
      const params = {
        sourceId: sourceId || undefined,
        contentType: contentType || undefined,
      };

      const blob = await apiClient.get(endpoint, { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scrapex_export_${Date.now()}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setToast({ type: 'success', message: `${format} export generated and downloaded successfully!` });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to generate export file.' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-1">Data Export Center</h2>
        <span className="text-secondary small">Generate downloadable CSV and JSON data exports directly from the PostgreSQL backend database</span>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="scrapex-card p-4">
            <h5 className="fw-bold mb-3">Export Configuration</h5>

            {/* FORMAT SELECTION */}
            <div className="mb-4">
              <label className="fw-semibold small text-muted d-block mb-2">Export File Format</label>
              <div className="row g-3">
                <div className="col-6">
                  <div
                    className={`p-3 border rounded-3 text-center cursor-pointer ${format === 'CSV' ? 'border-primary bg-primary-subtle fw-bold text-primary' : 'bg-body-tertiary'}`}
                    onClick={() => setFormat('CSV')}
                    style={{ cursor: 'pointer' }}
                  >
                    <FiFileText size={24} className="mb-2 d-block mx-auto" />
                    <span>CSV Format</span>
                    <span className="d-block text-muted small fw-normal mt-1">Comma-separated values spreadsheet format</span>
                  </div>
                </div>

                <div className="col-6">
                  <div
                    className={`p-3 border rounded-3 text-center cursor-pointer ${format === 'JSON' ? 'border-primary bg-primary-subtle fw-bold text-primary' : 'bg-body-tertiary'}`}
                    onClick={() => setFormat('JSON')}
                    style={{ cursor: 'pointer' }}
                  >
                    <FiCode size={24} className="mb-2 d-block mx-auto" />
                    <span>JSON Format</span>
                    <span className="d-block text-muted small fw-normal mt-1">Structured JSON document export format</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FILTERS */}
            <div className="bg-body-tertiary p-3 rounded-3 mb-4">
              <h6 className="fw-bold small text-uppercase text-secondary mb-3">Filter Dataset Scope</h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Target Web Source</label>
                  <select className="form-select form-select-sm" value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
                    <option value="">All Web Sources (Full Dataset)</option>
                    {sources.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Content Type</label>
                  <select className="form-select form-select-sm" value={contentType} onChange={(e) => setContentType(e.target.value)}>
                    <option value="">All Content Types</option>
                    <option value="COMPLETE_PAGE">COMPLETE_PAGE</option>
                    <option value="ARTICLE">ARTICLE</option>
                    <option value="HEADING">HEADING</option>
                    <option value="PARAGRAPH">PARAGRAPH</option>
                    <option value="TABLE">TABLE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <div className="d-flex align-items-center justify-content-between border-top pt-3">
              <span className="text-muted small">
                Generates actual downloadable <code>.{format.toLowerCase()}</code> file
              </span>
              <button
                className="btn btn-primary-scrapex"
                onClick={handleTriggerExport}
                disabled={isExporting}
              >
                <FiDownload size={18} className="me-1" />
                <span>{isExporting ? 'Generating Export...' : `Download ${format} File`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastNotification
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: 'success', message: '' })}
      />
    </div>
  );
}
