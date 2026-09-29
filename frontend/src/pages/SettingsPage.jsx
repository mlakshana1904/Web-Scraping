import React, { useState } from 'react';
import { FiSettings, FiSliders, FiDatabase, FiShield, FiSave } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';
import ToastNotification from '../components/ToastNotification';

export default function SettingsPage() {
  const [timeout, setTimeoutVal] = useState(10000);
  const [maxRecords, setMaxRecords] = useState(100);
  const [retentionDays, setRetentionDays] = useState(90);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setToast({ type: 'success', message: 'System settings saved successfully!' });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-1">Platform Settings</h2>
        <span className="text-secondary small">Manage system scraping limits, data retention policies, theme aesthetics and database parameters</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <form onSubmit={handleSaveSettings} className="scrapex-card p-4 mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FiSliders className="text-primary" size={20} />
              <span>Scraping Engine Parameters</span>
            </h5>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Default HTTP Request Timeout (ms)</label>
              <input
                type="number"
                className="form-control"
                value={timeout}
                onChange={(e) => setTimeoutVal(Number(e.target.value))}
                min="1000"
                max="60000"
              />
              <span className="text-muted small">Maximum time spent waiting for target web page server response.</span>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Maximum Records Per Scrape Batch</label>
              <input
                type="number"
                className="form-control"
                value={maxRecords}
                onChange={(e) => setMaxRecords(Number(e.target.value))}
                min="10"
                max="1000"
              />
              <span className="text-muted small">Prevents excessive memory consumption during large DOM extractions.</span>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small">Data Retention Period (Days)</label>
              <input
                type="number"
                className="form-control"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                min="1"
                max="365"
              />
              <span className="text-muted small">Automatic cleanup threshold for stale job audit logs.</span>
            </div>

            <div className="d-flex justify-content-end border-top pt-3">
              <button type="submit" className="btn btn-primary-scrapex btn-sm">
                <FiSave size={16} className="me-1" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>

          {/* APPEARANCE */}
          <div className="scrapex-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FiSettings className="text-primary" size={20} />
              <span>Appearance & Theme</span>
            </h5>
            <div className="d-flex align-items-center justify-content-between p-3 bg-body-tertiary rounded-3">
              <div>
                <span className="fw-semibold d-block">Dark / Light Mode Toggle</span>
                <span className="text-muted small">Switch between crisp light mode and sleek dark navy mode</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* SYSTEM STATUS CARD */}
        <div className="col-lg-4">
          <div className="scrapex-card p-4 mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FiDatabase className="text-success" size={20} />
              <span>Database & System Info</span>
            </h5>
            <ul className="list-group list-group-flush small">
              <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
                <span className="text-muted">Database Engine:</span>
                <span className="fw-bold text-success">PostgreSQL</span>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
                <span className="text-muted">Backend Framework:</span>
                <span className="fw-bold">Spring Boot 3.2</span>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
                <span className="text-muted">HTML Parser:</span>
                <span className="fw-bold">Jsoup 1.17</span>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
                <span className="text-muted">Java Runtime:</span>
                <span className="fw-bold">Java 17+ / 21</span>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
                <span className="text-muted">Frontend UI:</span>
                <span className="fw-bold">React 18 + Vite</span>
              </li>
            </ul>
          </div>

          <div className="scrapex-card p-4 bg-primary-subtle border-primary">
            <h6 className="fw-bold text-primary mb-2 d-flex align-items-center gap-2">
              <FiShield size={18} />
              <span>Ethical Scraping Compliance</span>
            </h6>
            <p className="small text-secondary mb-0">
              WEB SCRAPEX adheres to ethical crawl guidelines: respecting site terms, robots.txt directives, rate limits, copyright, and permitted public access without bypassing access controls.
            </p>
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
