import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FiActivity, FiRefreshCw, FiEye, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import ToastNotification from '../components/ToastNotification';

export default function HistoryPage() {
  const [jobs, setJobs] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const fetchHistory = async (page = 0) => {
    setLoading(true);
    try {
      const res = await apiClient.get('/history', { params: { page, size: 10 } });
      setJobs(res.content || []);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
      setCurrentPage(res.number || 0);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load job history.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async (jobId) => {
    try {
      const details = await apiClient.get(`/history/${jobId}`);
      setSelectedJob(details);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load job logs.' });
    }
  };

  useEffect(() => {
    fetchHistory(0);
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Scraping Job Audit Log</h2>
          <span className="text-secondary small">Historical record of all manual and scheduled web scraping execution jobs</span>
        </div>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={() => fetchHistory(currentPage)}>
          <FiRefreshCw size={14} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {loading ? (
        <SkeletonLoader rows={5} columns={6} />
      ) : (
        <div className="scrapex-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-body-tertiary">
                <tr>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Job ID</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Target Source</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Status</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Found / Saved</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Duration</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Timestamp</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold text-end">Logs</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted small">
                      No job execution history records found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-3 py-3 fw-bold text-muted font-monospace">#{job.id}</td>
                      <td className="px-3 py-3">
                        <div className="fw-semibold text-primary">{job.sourceName || 'Direct Scrape'}</div>
                        <span className="text-muted small font-monospace d-block text-truncate" style={{ maxWidth: 220 }}>
                          {job.sourceUrl}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-3 py-3 fw-bold">
                        {job.recordsSaved || 0} / {job.recordsFound || 0}
                      </td>
                      <td className="px-3 py-3 text-muted small">
                        {job.durationMs ? `${job.durationMs} ms` : 'N/A'}
                      </td>
                      <td className="px-3 py-3 text-muted small">
                        {job.startedAt ? new Date(job.startedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-3 py-3 text-end">
                        <button
                          className="btn btn-outline-primary btn-sm border-0 p-1"
                          onClick={() => fetchJobDetails(job.id)}
                          title="View Execution Logs"
                        >
                          <FiEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JOB AUDIT LOG MODAL */}
      <Modal show={!!selectedJob} onHide={() => setSelectedJob(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
            <FiActivity className="text-primary" size={20} />
            <span>Job Execution Audit Log #{selectedJob?.id}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3 bg-body-tertiary p-3 rounded">
                <div>
                  <span className="text-muted small d-block">Source Target</span>
                  <span className="fw-bold">{selectedJob.sourceName || 'Direct Scrape'}</span>
                </div>
                <div>
                  <span className="text-muted small d-block">Status</span>
                  <StatusBadge status={selectedJob.status} />
                </div>
                <div>
                  <span className="text-muted small d-block">Duration</span>
                  <span className="fw-bold">{selectedJob.durationMs} ms</span>
                </div>
              </div>

              {selectedJob.errorMessage && (
                <div className="alert alert-danger small mb-3">
                  <strong>Error Message:</strong> {selectedJob.errorMessage}
                </div>
              )}

              <h6 className="fw-bold mb-2">Step-by-Step Execution Logs</h6>
              <div className="bg-dark text-light p-3 rounded font-monospace small" style={{ maxHeight: 300, overflowY: 'auto' }}>
                {(selectedJob.logs || []).length === 0 ? (
                  <span className="text-muted">No explicit log entries recorded for this job.</span>
                ) : (
                  selectedJob.logs.map((logItem, idx) => (
                    <div key={idx} className="mb-1">
                      <span className="text-muted">[{new Date(logItem.timestamp).toLocaleTimeString()}]</span>{' '}
                      <span className={logItem.level === 'ERROR' ? 'text-danger fw-bold' : (logItem.level === 'WARN' ? 'text-warning' : 'text-info')}>
                        [{logItem.level}]
                      </span>{' '}
                      <span>{logItem.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setSelectedJob(null)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <ToastNotification
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: 'success', message: '' })}
      />
    </div>
  );
}
