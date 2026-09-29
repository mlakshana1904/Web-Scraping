import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiMenu, FiUser, FiPlus } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

export default function TopNavbar({ title, onToggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/data?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary d-lg-none p-2 border-0"
          onClick={onToggleSidebar}

        >
          <FiMenu size={22} />
        </button>
        <h1 className="h5 mb-0 fw-bold">{title || 'Dashboard'}</h1>
      </div>

      <div className="d-flex align-items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="search-input-group d-none d-md-block">
          <FiSearch className="search-icon" size={16} />
          <input
            type="text"
            className="form-control"
            placeholder="Search scraped data, sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <button
          className="btn btn-primary-scrapex btn-sm d-flex align-items-center gap-1"
          onClick={() => navigate('/scrape')}
        >
          <FiPlus size={16} />
          <span>New Scrape</span>
        </button>

        <ThemeToggle />

        <div className="position-relative">
          <button className="btn btn-outline-secondary border-0 text-muted p-2 d-flex align-items-center justify-content-center" style={{ borderRadius: '50%', width: 40, height: 40 }}>
            <FiBell size={18} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-light rounded-circle" style={{ width: 8, height: 8 }}></span>
          </button>
        </div>

        <div className="d-flex align-items-center gap-2 ps-2 border-start border-color">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36, fontSize: '0.875rem' }}>
            WS
          </div>
        </div>
      </div>
    </header>
  );
}
