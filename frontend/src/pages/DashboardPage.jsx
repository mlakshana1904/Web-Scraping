import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiLayers, 
  FiDatabase, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiClock, 
  FiPlus, 
  FiRefreshCw 
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import apiClient from '../api/apiClient';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/dashboard/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Scraping Analytics Dashboard</h2>
          <span className="text-secondary small">Real-time overview of web scraping jobs, content extraction metrics & active schedules</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={fetchDashboardData}>
            <FiRefreshCw size={14} />
            <span>Refresh Data</span>
          </button>
          <button className="btn btn-primary-scrapex btn-sm d-flex align-items-center gap-1" onClick={() => navigate('/scrape')}>
            <FiPlus size={16} />
            <span>+ New Scrape</span>
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader rows={4} columns={4} />
      ) : (
        <>
          {/* STATS CARDS */}
          <div className="row g-3 mb-4">
            <div className="col-lg-2 col-md-4 col-6">
              <StatCard title="Total Sources" value={stats?.totalSources || 0} icon={FiLayers} color="#4f46e5" trend="+12%" />
            </div>
            <div className="col-lg-3 col-md-4 col-6">
              <StatCard title="Total Records" value={stats?.totalRecords || 0} icon={FiDatabase} color="#10b981" trend="+24%" />
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <StatCard title="Successful Jobs" value={stats?.successfulScrapes || 0} icon={FiCheckCircle} color="#10b981" />
            </div>
            <div className="col-lg-2 col-md-6 col-6">
              <StatCard title="Failed Jobs" value={stats?.failedScrapes || 0} icon={FiAlertCircle} color="#ef4444" />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <StatCard title="Active Schedules" value={stats?.activeSchedules || 0} icon={FiClock} color="#f59e0b" trend="Spring Quartz" />
            </div>
          </div>

          {/* CHARTS ROW 1 */}
          <div className="row g-4 mb-4">
            {/* Scraping Activity Over Time */}
            <div className="col-lg-8">
              <div className="scrapex-card h-100">
                <h6 className="fw-bold mb-3">Scraping Job Performance (Weekly Trend)</h6>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.activityOverTime || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="successful" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSuccess)" name="Successful Jobs" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Content Type Distribution */}
            <div className="col-lg-4">
              <div className="scrapex-card h-100">
                <h6 className="fw-bold mb-3">Content Type Distribution</h6>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(stats?.contentTypeDistribution || {}).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {Object.keys(stats?.contentTypeDistribution || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY TABLE */}
          <div className="scrapex-card p-0 overflow-hidden">
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-body-tertiary">
              <h6 className="fw-bold mb-0">Recent Scraping Job Activity</h6>
              <button className="btn btn-link text-primary btn-sm text-decoration-none fw-semibold" onClick={() => navigate('/history')}>
                View All Jobs &rarr;
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-secondary small fw-semibold">Source</th>
                    <th className="px-3 py-3 text-secondary small fw-semibold">Content Type</th>
                    <th className="px-3 py-3 text-secondary small fw-semibold">Records</th>
                    <th className="px-3 py-3 text-secondary small fw-semibold">Status</th>
                    <th className="px-3 py-3 text-secondary small fw-semibold">Started At</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentJobs || []).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted small">No recent scraping activity logs found.</td>
                    </tr>
                  ) : (
                    stats.recentJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-3 py-3">
                          <div className="fw-semibold text-primary">{job.sourceName || 'Web Page'}</div>
                          <span className="text-muted small font-monospace">{job.sourceUrl}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="badge bg-secondary-subtle text-secondary">{job.contentType || 'COMPLETE_PAGE'}</span>
                        </td>
                        <td className="px-3 py-3 fw-bold">{job.recordsSaved || 0} / {job.recordsFound || 0}</td>
                        <td className="px-3 py-3">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="px-3 py-3 text-muted small">
                          {job.startedAt ? new Date(job.startedAt).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
