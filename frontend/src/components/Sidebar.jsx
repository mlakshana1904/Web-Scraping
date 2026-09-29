import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiLayers, 
  FiDatabase, 
  FiFileText, 
  FiClock, 
  FiActivity, 
  FiDownload, 
  FiSettings, 
  FiGlobe,
  FiX
} from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/scrape', label: 'Scrape Workspace', icon: FiGlobe },
    { path: '/sources', label: 'Sources', icon: FiLayers },
    { path: '/data', label: 'Scraped Data', icon: FiDatabase },
    { path: '/schedules', label: 'Schedules', icon: FiClock },
    { path: '/history', label: 'History', icon: FiActivity },
    { path: '/exports', label: 'Exports', icon: FiDownload },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
      <div className="sidebar-logo d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="logo-icon">
            <FiLayers size={18} />
          </div>
          <span>WEB SCRAPEX</span>
        </div>
        <button className="btn btn-sm text-light d-lg-none p-0" onClick={onClose}>
          <FiX size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-top border-secondary border-opacity-10 text-xs text-muted">
        <div className="fw-semibold text-light mb-1" style={{ fontSize: '0.8rem' }}>WEB SCRAPEX v1.0</div>
        <div style={{ fontSize: '0.75rem' }}>Smart Web Content Extraction Platform</div>
      </div>
    </aside>
  );
}
