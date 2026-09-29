import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FiSearch, FiFilter, FiRefreshCw, FiTrash2, FiEye, FiDownload } from 'react-icons/fi';
import apiClient from '../api/apiClient';
import DataTable from '../components/DataTable';
import SkeletonLoader from '../components/SkeletonLoader';
import ToastNotification from '../components/ToastNotification';
import ConfirmationDialog from '../components/ConfirmationDialog';

export default function ScrapedDataPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [dataList, setDataList] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(initialQuery);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [sources, setSources] = useState([]);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState({ type: 'success', message: '' });

  const fetchSources = async () => {
    try {
      const data = await apiClient.get('/sources');
      setSources(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async (page = 0) => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        q: query || undefined,
        sourceId: selectedSource || undefined,
        contentType: selectedType || undefined,
      };
      const res = await apiClient.get('/data', { params });
      setDataList(res.content || []);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
      setCurrentPage(res.number || 0);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load scraped data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    fetchData(0);
  }, [selectedSource, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData(0);
  };

  const handleDeleteRecord = async () => {
    if (!deleteItem) return;
    try {
      await apiClient.delete(`/data/${deleteItem.id}`);
      setToast({ type: 'success', message: 'Record deleted.' });
      setDeleteItem(null);
      fetchData(currentPage);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete record.' });
    }
  };

  const columns = [
    {
      header: 'Title & Content Snippet',
      render: (item) => (
        <div>
          <div className="fw-bold text-primary">{item.title || 'Untitled'}</div>
          <p className="text-secondary small mb-0 text-truncate" style={{ maxWidth: 380 }}>
            {item.content}
          </p>
        </div>
      )
    },
    {
      header: 'Source',
      render: (item) => (
        <div>
          <span className="fw-semibold small d-block">{item.sourceName || 'Direct Scrape'}</span>
          <span className="text-muted small text-truncate font-monospace d-block" style={{ maxWidth: 200 }}>
            {item.sourceUrl}
          </span>
        </div>
      )
    },
    {
      header: 'Type',
      render: (item) => <span className="badge bg-indigo-subtle text-primary">{item.contentType}</span>
    },
    {
      header: 'Scraped At',
      render: (item) => (
        <span className="text-muted small">
          {item.scrapedAt ? new Date(item.scrapedAt).toLocaleString() : 'N/A'}
        </span>
      )
    }
  ];

  return (
    <div className="p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Scraped Data Repository</h2>
          <span className="text-secondary small">Explore, search, filter and inspect all cleaned content saved in PostgreSQL</span>
        </div>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={() => fetchData(currentPage)}>
          <FiRefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="scrapex-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-lg-5 col-md-12">
            <div className="input-group">
              <span className="input-group-text bg-body-tertiary">
                <FiSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, content text, author..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <select
              className="form-select"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="">All Web Sources</option>
              {sources.map((src) => (
                <option key={src.id} value={src.id}>{src.name}</option>
              ))}
            </select>
          </div>

          <div className="col-lg-2 col-md-6">
            <select
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Content Types</option>
              <option value="COMPLETE_PAGE">COMPLETE_PAGE</option>
              <option value="ARTICLE">ARTICLE</option>
              <option value="HEADING">HEADING</option>
              <option value="PARAGRAPH">PARAGRAPH</option>
              <option value="TABLE">TABLE</option>
              <option value="TITLE">TITLE</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-12">
            <button type="submit" className="btn btn-primary-scrapex btn-sm w-100 justify-content-center">
              Filter Data
            </button>
          </div>
        </form>
      </div>

      {/* DATA TABLE */}
      {loading ? (
        <SkeletonLoader rows={5} columns={5} />
      ) : (
        <DataTable
          columns={columns}
          data={dataList}
          totalElements={totalElements}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => fetchData(page)}
          onView={(item) => setViewItem(item)}
          onDelete={(item) => setDeleteItem(item)}
        />
      )}

      {/* VIEW MODAL */}
      <Modal show={!!viewItem} onHide={() => setViewItem(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">{viewItem?.title || 'Extracted Data Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewItem && (
            <div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-primary">{viewItem.contentType}</span>
                <span className="badge bg-secondary">Author: {viewItem.author || 'Unknown'}</span>
                {viewItem.publishedDate && <span className="badge bg-info">Date: {viewItem.publishedDate}</span>}
              </div>

              <div className="mb-3">
                <label className="fw-semibold text-muted small d-block mb-1">Source URL</label>
                <a href={viewItem.sourceUrl} target="_blank" rel="noreferrer" className="small font-monospace text-truncate d-block">
                  {viewItem.sourceUrl}
                </a>
              </div>

              <div className="mb-3">
                <label className="fw-semibold text-muted small d-block mb-1">Content Body</label>
                <div className="bg-body-tertiary p-3 rounded text-secondary small whitespace-pre-wrap" style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {viewItem.content}
                </div>
              </div>

              <div className="mb-2">
                <label className="fw-semibold text-muted small d-block mb-1">Content SHA-256 Hash</label>
                <code className="small text-muted">{viewItem.contentHash}</code>
              </div>

              {viewItem.metadata && (
                <div>
                  <label className="fw-semibold text-muted small d-block mb-1">Metadata JSON</label>
                  <pre className="bg-dark text-light p-2 rounded small mb-0">{viewItem.metadata}</pre>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setViewItem(null)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* DELETE DIALOG */}
      <ConfirmationDialog
        show={!!deleteItem}
        title="Delete Scraped Data Record"
        message="Are you sure you want to permanently delete this record from PostgreSQL database?"
        onConfirm={handleDeleteRecord}
        onCancel={() => setDeleteItem(null)}
      />

      <ToastNotification
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: 'success', message: '' })}
      />
    </div>
  );
}
