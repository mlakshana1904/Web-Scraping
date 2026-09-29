import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiPlus, FiGlobe, FiPlay, FiCalendar, FiTrash2, FiEdit2, FiLayers } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import SkeletonLoader from '../components/SkeletonLoader';
import ToastNotification from '../components/ToastNotification';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ScheduleModal from '../components/ScheduleModal';

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [scheduleSource, setScheduleSource] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    contentType: 'COMPLETE_PAGE',
    cssSelector: '',
    active: true
  });

  const fetchSources = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/sources');
      setSources(data);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load web sources.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleOpenAdd = () => {
    setEditingSource(null);
    setFormData({ name: '', url: '', description: '', contentType: 'COMPLETE_PAGE', cssSelector: '', active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (src) => {
    setEditingSource(src);
    setFormData({
      name: src.name || '',
      url: src.url || '',
      description: src.description || '',
      contentType: src.contentType || 'COMPLETE_PAGE',
      cssSelector: src.cssSelector || '',
      active: src.active !== false
    });
    setShowModal(true);
  };

  const handleSaveSource = async (e) => {
    e.preventDefault();
    try {
      if (editingSource) {
        await apiClient.put(`/sources/${editingSource.id}`, formData);
        setToast({ type: 'success', message: 'Source updated successfully!' });
      } else {
        await apiClient.post('/sources', formData);
        setToast({ type: 'success', message: 'New source created successfully!' });
      }
      setShowModal(false);
      fetchSources();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save source.' });
    }
  };

  const handleDeleteSource = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/sources/${deleteTarget.id}`);
      setToast({ type: 'success', message: 'Source deleted.' });
      setDeleteTarget(null);
      fetchSources();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete source.' });
    }
  };

  const handleScrapeNow = async (sourceId) => {
    try {
      setToast({ type: 'success', message: 'Scraping job started for source...' });
      const job = await apiClient.post(`/sources/${sourceId}/scrape`);
      setToast({ type: 'success', message: `Scraping finished! Saved ${job.recordsSaved || 0} records.` });
      fetchSources();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Scrape execution failed.' });
    }
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      await apiClient.post('/schedules', scheduleData);
      setToast({ type: 'success', message: 'Schedule created successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to create schedule.' });
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Web Sources Directory</h2>
          <span className="text-secondary small">Manage permitted web sites and configure recurring scraping parameters</span>
        </div>
        <button className="btn btn-primary-scrapex btn-sm d-flex align-items-center gap-1" onClick={handleOpenAdd}>
          <FiPlus size={16} />
          <span>Add New Source</span>
        </button>
      </div>

      {loading ? (
        <SkeletonLoader rows={5} columns={5} />
      ) : (
        <div className="row g-4">
          {sources.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              No sources registered. Click "+ Add New Source" to create your first web page target.
            </div>
          ) : (
            sources.map((src) => (
              <div key={src.id} className="col-lg-4 col-md-6">
                <div className="scrapex-card hoverable h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge bg-primary-subtle text-primary fw-semibold">{src.contentType}</span>
                      <span className={`badge ${src.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                        {src.active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>

                    <h5 className="fw-bold text-truncate mb-1">{src.name}</h5>
                    <a href={src.url} target="_blank" rel="noreferrer" className="text-muted small text-truncate d-block mb-2">
                      {src.url}
                    </a>
                    <p className="text-secondary small line-clamp-2 mb-3">
                      {src.description || 'No description provided.'}
                    </p>

                    {src.cssSelector && (
                      <div className="small font-monospace bg-body-tertiary p-2 rounded mb-3">
                        Selector: <code>{src.cssSelector}</code>
                      </div>
                    )}
                  </div>

                  <div className="border-top pt-3 mt-2 d-flex align-items-center justify-content-between">
                    <span className="small text-muted">Records: <strong>{src.totalRecords || 0}</strong></span>
                    <div className="d-flex align-items-center gap-1">
                      <button className="btn btn-outline-primary btn-sm p-1" title="Scrape Now" onClick={() => handleScrapeNow(src.id)}>
                        <FiPlay size={16} />
                      </button>
                      <button className="btn btn-outline-warning btn-sm p-1" title="Schedule Scrape" onClick={() => setScheduleSource(src)}>
                        <FiCalendar size={16} />
                      </button>
                      <button className="btn btn-outline-secondary btn-sm p-1" title="Edit Source" onClick={() => handleOpenEdit(src)}>
                        <FiEdit2 size={16} />
                      </button>
                      <button className="btn btn-outline-danger btn-sm p-1" title="Delete Source" onClick={() => setDeleteTarget(src)}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSaveSource}>
          <Modal.Header closeButton>
            <Modal.Title className="h5">{editingSource ? 'Edit Web Source' : 'Add New Web Source'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Source Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Wikipedia Web Scraping Article"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Web Page URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Optional notes or details about this target source"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Content Type Mode</Form.Label>
              <Form.Select
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              >
                <option value="COMPLETE_PAGE">COMPLETE_PAGE</option>
                <option value="ARTICLE">ARTICLE</option>
                <option value="BLOG">BLOG</option>
                <option value="SPECIFIC_CONTENT">SPECIFIC_CONTENT</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Default CSS Selector (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. article, .main-content"
                value={formData.cssSelector}
                onChange={(e) => setFormData({ ...formData, cssSelector: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save Source</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* CONFIRM DELETE */}
      <ConfirmationDialog
        show={!!deleteTarget}
        title="Delete Web Source"
        message={`Are you sure you want to delete source "${deleteTarget?.name}"? Associated data will be unlinked.`}
        onConfirm={handleDeleteSource}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* SCHEDULE MODAL */}
      <ScheduleModal
        show={!!scheduleSource}
        onHide={() => setScheduleSource(null)}
        sources={sources}
        initialData={scheduleSource ? { sourceId: scheduleSource.id } : null}
        onSave={handleSaveSchedule}
      />

      <ToastNotification
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: 'success', message: '' })}
      />
    </div>
  );
}
