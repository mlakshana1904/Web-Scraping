import React, { useEffect, useState } from 'react';
import { FiPlus, FiClock, FiPlay, FiTrash2, FiToggleLeft, FiToggleRight, FiRefreshCw } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import SkeletonLoader from '../components/SkeletonLoader';
import ToastNotification from '../components/ToastNotification';
import ScheduleModal from '../components/ScheduleModal';
import ConfirmationDialog from '../components/ConfirmationDialog';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedRes, srcRes] = await Promise.all([
        apiClient.get('/schedules'),
        apiClient.get('/sources')
      ]);
      setSchedules(schedRes);
      setSources(srcRes);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load schedule configurations.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleActive = async (sch) => {
    try {
      await apiClient.put(`/schedules/${sch.id}`, { ...sch, active: !sch.active });
      setToast({ type: 'success', message: `Schedule ${!sch.active ? 'activated' : 'paused'}.` });
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update schedule status.' });
    }
  };

  const handleDeleteSchedule = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/schedules/${deleteTarget.id}`);
      setToast({ type: 'success', message: 'Schedule deleted.' });
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete schedule.' });
    }
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      if (editingSchedule) {
        await apiClient.put(`/schedules/${editingSchedule.id}`, scheduleData);
        setToast({ type: 'success', message: 'Schedule updated successfully!' });
      } else {
        await apiClient.post('/schedules', scheduleData);
        setToast({ type: 'success', message: 'Schedule created successfully!' });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save schedule.' });
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Automated Scraping Schedules</h2>
          <span className="text-secondary small">Configure automated recurring web scraping jobs via Spring Scheduler Engine</span>
        </div>
        <button className="btn btn-primary-scrapex btn-sm d-flex align-items-center gap-1" onClick={() => { setEditingSchedule(null); setShowModal(true); }}>
          <FiPlus size={16} />
          <span>New Schedule</span>
        </button>
      </div>

      {loading ? (
        <SkeletonLoader rows={4} columns={5} />
      ) : (
        <div className="scrapex-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-body-tertiary">
                <tr>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Target Source</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Frequency</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Last Run</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Next Scheduled Run</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold">Status</th>
                  <th className="px-3 py-3 text-secondary small fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted small">
                      No active schedules found. Click "+ New Schedule" to create a automated job.
                    </td>
                  </tr>
                ) : (
                  schedules.map((sch) => (
                    <tr key={sch.id}>
                      <td className="px-3 py-3">
                        <div className="fw-bold text-primary">{sch.sourceName || 'Target Source'}</div>
                        <span className="text-muted small font-monospace d-block text-truncate" style={{ maxWidth: 220 }}>
                          {sch.sourceUrl}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="badge bg-primary-subtle text-primary fw-semibold">{sch.frequency}</span>
                        {sch.cronExpression && (
                          <span className="d-block text-muted small font-monospace mt-1">Cron: {sch.cronExpression}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-muted small">
                        {sch.lastRun ? new Date(sch.lastRun).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-3 py-3 text-primary fw-medium small">
                        {sch.nextRun ? new Date(sch.nextRun).toLocaleString() : 'Calculating...'}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          className={`btn btn-sm border-0 d-flex align-items-center gap-1 ${sch.active ? 'text-success' : 'text-muted'}`}
                          onClick={() => handleToggleActive(sch)}
                        >
                          {sch.active ? <FiToggleRight size={22} /> : <FiToggleLeft size={22} />}
                          <span className="fw-bold small">{sch.active ? 'ACTIVE' : 'PAUSED'}</span>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm border-0 p-1"
                          onClick={() => setDeleteTarget(sch)}
                          title="Delete Schedule"
                        >
                          <FiTrash2 size={16} />
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

      {/* SCHEDULE MODAL */}
      <ScheduleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        sources={sources}
        initialData={editingSchedule}
        onSave={handleSaveSchedule}
      />

      {/* DELETE DIALOG */}
      <ConfirmationDialog
        show={!!deleteTarget}
        title="Delete Schedule"
        message="Are you sure you want to remove this recurring schedule?"
        onConfirm={handleDeleteSchedule}
        onCancel={() => setDeleteTarget(null)}
      />

      <ToastNotification
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: 'success', message: '' })}
      />
    </div>
  );
}
