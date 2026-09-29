import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiClock } from 'react-icons/fi';

export default function ScheduleModal({ show, onHide, sources = [], onSave, initialData }) {
  const [sourceId, setSourceId] = useState('');
  const [frequency, setFrequency] = useState('DAILY');
  const [cronExpression, setCronExpression] = useState('0 0 9 * * ?');

  useEffect(() => {
    if (initialData) {
      setSourceId(initialData.sourceId || '');
      setFrequency(initialData.frequency || 'DAILY');
      setCronExpression(initialData.cronExpression || '0 0 9 * * ?');
    } else {
      if (sources.length > 0) setSourceId(sources[0].id);
      setFrequency('DAILY');
      setCronExpression('0 0 9 * * ?');
    }
  }, [initialData, sources, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      sourceId: Number(sourceId),
      frequency,
      cronExpression: frequency === 'CUSTOM' ? cronExpression : null,
      active: true,
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="h5 d-flex align-items-center gap-2">
            <FiClock size={20} className="text-primary" />
            <span>{initialData ? 'Edit Scraping Schedule' : 'Schedule Web Scrape'}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">Select Web Source</Form.Label>
            <Form.Select 
              value={sourceId} 
              onChange={(e) => setSourceId(e.target.value)} 
              required
            >
              <option value="" disabled>Choose a source...</option>
              {sources.map((src) => (
                <option key={src.id} value={src.id}>
                  {src.name} ({src.url})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">Scraping Frequency</Form.Label>
            <Form.Select 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="HOURLY">Every Hour</option>
              <option value="EVERY_6_HOURS">Every 6 Hours</option>
              <option value="DAILY">Daily (at 09:00 AM)</option>
              <option value="WEEKLY">Weekly</option>
              <option value="CUSTOM">Custom Cron Expression</option>
            </Form.Select>
          </Form.Group>

          {frequency === 'CUSTOM' && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Cron Expression</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 0 0 12 * * ?"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                required
              />
              <Form.Text className="text-muted small">
                Spring Quartz cron format: <code>sec min hr day month day-of-week</code>
              </Form.Text>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Save Schedule
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
