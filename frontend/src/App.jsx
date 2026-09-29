import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardPage from './pages/DashboardPage';
import ScrapePage from './pages/ScrapePage';
import SourcesPage from './pages/SourcesPage';
import ScrapedDataPage from './pages/ScrapedDataPage';
import SchedulesPage from './pages/SchedulesPage';
import HistoryPage from './pages/HistoryPage';
import ExportsPage from './pages/ExportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Dashboard Analytics';
      case '/scrape': return 'Scrape Workspace';
      case '/sources': return 'Web Sources';
      case '/data': return 'Scraped Data Repository';
      case '/schedules': return 'Automated Schedules';
      case '/history': return 'Scraping Job Audit Log';
      case '/exports': return 'Data Export Center';
      case '/settings': return 'Platform Settings';
      default: return 'WEB SCRAPEX';
    }
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <TopNavbar 
          title={getPageTitle(location.pathname)} 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scrape" element={<ScrapePage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/data" element={<ScrapedDataPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/exports" element={<ExportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
