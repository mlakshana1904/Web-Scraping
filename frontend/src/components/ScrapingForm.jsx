import React, { useState } from 'react';
import { FiGlobe, FiCheckSquare, FiSliders, FiPlay, FiSearch, FiCheck, FiLoader } from 'react-icons/fi';
import CustomSelectorBuilder from './CustomSelectorBuilder';

export default function ScrapingForm({ onPreview, onExecute, isLoading }) {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('COMPLETE_PAGE');
  
  // Specific checkboxes
  const [extractTitle, setExtractTitle] = useState(true);
  const [extractHeadings, setExtractHeadings] = useState(true);
  const [extractParagraphs, setExtractParagraphs] = useState(true);
  const [extractArticle, setExtractArticle] = useState(true);
  const [extractLinks, setExtractLinks] = useState(false);
  const [extractTables, setExtractTables] = useState(false);
  const [extractImages, setExtractImages] = useState(false);
  const [extractMetaDescription, setExtractMetaDescription] = useState(true);
  const [extractAuthor, setExtractAuthor] = useState(true);
  const [extractPublishedDate, setExtractPublishedDate] = useState(true);

  // Custom rules
  const [customRules, setCustomRules] = useState([]);
  const [cleanData, setCleanData] = useState(true);

  // Progress stepper state
  const [stepIndex, setStepIndex] = useState(-1);

  const steps = [
    '1. Connecting to webpage...',
    '2. Fetching HTML content...',
    '3. Parsing HTML DOM...',
    '4. Extracting selected elements...',
    '5. Cleaning data & normalizing formatting...',
    '6. Checking content duplicates...',
    '7. Generating preview & stats...'
  ];

  const handleSubmit = async (e, isSaveImmediately = false) => {
    e.preventDefault();
    if (!url.trim()) return;

    const payload = {
      url: url.trim(),
      mode,
      extractTitle,
      extractHeadings,
      extractParagraphs,
      extractArticle,
      extractLinks,
      extractTables,
      extractImages,
      extractMetaDescription,
      extractAuthor,
      extractPublishedDate,
      customRules,
      cleanData,
      saveToDb: isSaveImmediately
    };

    // Simulate smooth progress stepper
    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 250);

    try {
      if (isSaveImmediately) {
        await onExecute(payload);
      } else {
        await onPreview(payload);
      }
    } finally {
      clearInterval(interval);
      setStepIndex(-1);
    }
  };

  return (
    <div className="scrapex-card p-4">
      <form onSubmit={(e) => handleSubmit(e, false)}>
        {/* SECTION 1 — WEB PAGE URL */}
        <div className="mb-4">
          <label className="form-label fw-bold text-primary mb-1">Web Page URL</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-body-tertiary border-end-0">
              <FiGlobe className="text-primary" />
            </span>
            <input
              type="url"
              className="form-control border-start-0"
              placeholder="Enter permitted public web page URL (e.g. https://en.wikipedia.org/wiki/Web_scraping)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <span className="text-muted small mt-1 d-block">
            Supports permitted public HTTP/HTTPS URLs. Respects web terms and rate limits.
          </span>
        </div>

        {/* SECTION 2 — EXTRACTION MODE */}
        <div className="mb-4">
          <label className="form-label fw-bold text-primary mb-2">Extraction Mode</label>
          <div className="row g-3">
            <div className="col-md-6">
              <div 
                className={`p-3 border rounded-3 cursor-pointer ${mode === 'COMPLETE_PAGE' ? 'border-primary bg-primary-subtle' : 'bg-body-tertiary'}`}
                onClick={() => setMode('COMPLETE_PAGE')}
                style={{ cursor: 'pointer' }}
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="mode"
                    id="modeComplete"
                    checked={mode === 'COMPLETE_PAGE'}
                    onChange={() => setMode('COMPLETE_PAGE')}
                  />
                  <label className="form-check-label fw-bold" htmlFor="modeComplete">
                    Complete Page Content
                  </label>
                </div>
                <p className="text-muted small mb-0 mt-2 ms-4">
                  Extracts full readable textual content of the webpage, stripping technical scripts and styles while preserving meaningful structure.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div 
                className={`p-3 border rounded-3 cursor-pointer ${mode === 'SPECIFIC_CONTENT' ? 'border-primary bg-primary-subtle' : 'bg-body-tertiary'}`}
                onClick={() => setMode('SPECIFIC_CONTENT')}
                style={{ cursor: 'pointer' }}
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="mode"
                    id="modeSpecific"
                    checked={mode === 'SPECIFIC_CONTENT'}
                    onChange={() => setMode('SPECIFIC_CONTENT')}
                  />
                  <label className="form-check-label fw-bold" htmlFor="modeSpecific">
                    Specific Content Selectors
                  </label>
                </div>
                <p className="text-muted small mb-0 mt-2 ms-4">
                  Target explicit elements such as Headings, Article text, Tables, Links, Metadata, or Custom CSS rules.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SPECIFIC CONTENT CHECKBOXES */}
        {mode === 'SPECIFIC_CONTENT' && (
          <div className="bg-body-tertiary p-3 rounded-3 mb-4">
            <label className="fw-bold mb-2 small text-uppercase text-secondary">Target Elements to Extract</label>
            <div className="row g-3">
              <div className="col-md-3 col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="chkTitle" checked={extractTitle} onChange={(e) => setExtractTitle(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="chkTitle">Page Title</label>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="chkHeadings" checked={extractHeadings} onChange={(e) => setExtractHeadings(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="chkHeadings">Headings (h1 - h6)</label>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="chkParagraphs" checked={extractParagraphs} onChange={(e) => setExtractParagraphs(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="chkParagraphs">Paragraphs (p)</label>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="chkArticle" checked={extractArticle} onChange={(e) => setExtractArticle(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="chkArticle">Article Content</label>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="chkLinks" checked={extractLinks} onChange={(e) => setExtractLinks(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="chkLinks">Links & URLs</label>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="chkTables" checked={extractTables} onChange={(e) => setExtractTables(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="chkTables">Tables & Data Grids</label>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="chkImages" checked={extractImages} onChange={(e) => setExtractImages(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="chkImages">Images & Alt Tags</label>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="chkMeta" checked={extractMetaDescription} onChange={(e) => setExtractMetaDescription(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="chkMeta">Meta Description</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM CSS SELECTORS */}
        <CustomSelectorBuilder rules={customRules} onChange={setCustomRules} />

        {/* OPTIONS & ACTION BUTTONS */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-top pt-3">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="cleanDataSwitch"
              checked={cleanData}
              onChange={(e) => setCleanData(e.target.checked)}
            />
            <label className="form-check-label small fw-semibold" htmlFor="cleanDataSwitch">
              Enable Automatic Data Cleaning & Deduplication
            </label>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isLoading || !url}
            >
              <FiSearch className="me-1" /> Preview Content
            </button>
            <button
              type="submit"
              className="btn btn-primary-scrapex btn-sm"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading || !url}
            >
              <FiPlay className="me-1" /> Scrape &amp; Save
            </button>
          </div>
        </div>

        {/* STEPPER PROGRESS OVERLAY DURING FETCHING */}
        {isLoading && stepIndex >= 0 && (
          <div className="mt-4 p-3 border border-primary bg-primary-subtle rounded-3">
            <div className="fw-bold mb-2 small text-primary d-flex align-items-center gap-2">
              <FiLoader className="spin" /> Scraping Execution in Progress...
            </div>
            <div className="d-flex flex-column gap-1">
              {steps.map((st, idx) => (
                <div key={idx} className={`stepper-item ${idx === stepIndex ? 'active' : ''} ${idx < stepIndex ? 'completed' : ''}`}>
                  {idx < stepIndex ? <FiCheck size={16} className="text-success" /> : (idx === stepIndex ? <FiLoader size={16} className="spin" /> : <span style={{ width: 16 }}></span>)}
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
