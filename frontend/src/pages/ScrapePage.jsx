import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import ScrapingForm from '../components/ScrapingForm';
import ScrapingPreview from '../components/ScrapingPreview';
import ToastNotification from '../components/ToastNotification';

export default function ScrapePage() {
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ type: 'success', message: '' });
  const [currentPayload, setCurrentPayload] = useState(null);

  const handlePreview = async (payload) => {
    setIsLoading(true);
    setCurrentPayload(payload);
    try {
      const data = await apiClient.post('/scrape/preview', payload);
      setPreviewData(data);
      setToast({ type: 'success', message: `Web page fetched successfully! Extracted ${data.recordsFound} items.` });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to fetch web page content.' });
      setPreviewData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteSave = async (payload) => {
    setIsSaving(true);
    try {
      const reqPayload = payload || currentPayload;
      const job = await apiClient.post('/scrape', { ...reqPayload, saveToDb: true });
      setToast({ type: 'success', message: `Scraping completed! Saved ${job.recordsSaved || 0} records to database.` });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to execute web scraping task.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await apiClient.get('/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scrapex_extracted_data.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast({ type: 'success', message: 'CSV file downloaded successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to download CSV export.' });
    }
  };

  const handleExportJson = async () => {
    try {
      const blob = await apiClient.get('/export/json', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scrapex_extracted_data.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast({ type: 'success', message: 'JSON file downloaded successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to download JSON export.' });
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-1">Web Page Scraper Workspace</h2>
        <span className="text-secondary small">Enter permitted URLs to fetch, parse HTML, extract textual/media data, clean & persist to database</span>
      </div>

      <ScrapingForm 
        onPreview={handlePreview} 
        onExecute={handleExecuteSave} 
        isLoading={isLoading} 
      />

      {previewData && (
        <div className="mt-4">
          <ScrapingPreview
            previewData={previewData}
            onScrapeAgain={() => handlePreview(currentPayload)}
            onSaveToDb={() => handleExecuteSave(currentPayload)}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
            isSaving={isSaving}
          />
        </div>
      )}

      <ToastNotification
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: 'success', message: '' })}
      />
    </div>
  );
}
