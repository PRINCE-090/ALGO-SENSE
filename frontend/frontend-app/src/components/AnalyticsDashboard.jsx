import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/stats`),
        axios.get(`${API_URL}/api/analytics/history?limit=15`)
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mr-3"></div>
        Loading Pattern Mastery Analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-800 text-red-300 p-4 rounded-xl my-4 text-sm">
        Failed to load analytics: {error}
        <button
          onClick={fetchDashboardData}
          className="ml-3 px-3 py-1 bg-red-800/40 hover:bg-red-800/60 rounded text-xs text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const { overview = {}, patternMastery = [], timeline = [] } = stats || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Practiced</div>
          <div className="text-2xl font-bold text-white mt-1">{overview.totalAttempts || 0}</div>
          <div className="text-xs text-cyan-400 mt-1">LeetCode submissions</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Accuracy</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{overview.overallAccuracy || 0}%</div>
          <div className="text-xs text-slate-400 mt-1">{overview.correctAttempts || 0} correct patterns</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Pattern</div>
          <div className="text-xl font-bold text-cyan-300 mt-1 truncate" title={overview.topPattern}>
            {overview.topPattern || "None"}
          </div>
          <div className="text-xs text-slate-400 mt-1">Highest frequency</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GitHub Synced</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{overview.githubSyncedCount || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Via Contents API</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pattern Mastery Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Pattern Mastery (%)</h3>
            <span className="text-xs text-slate-400">By algorithmic category</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patternMastery.slice(0, 8)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="pattern"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(value, name) => [`${value}%`, "Mastery Rate"]}
                />
                <Bar dataKey="mastery" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Mastery %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Practice Activity & Accuracy Trend */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Practice Timeline & Trajectory</h3>
            <span className="text-xs text-slate-400">Volume & Accuracy</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(value, name) => [name === "accuracy" ? `${value}%` : value, name === "accuracy" ? "Accuracy %" : "Attempts"]}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#34d399" fillOpacity={1} fill="url(#accuracyGrad)" name="Accuracy %" />
                <Bar dataKey="attempts" fill="#818cf8" barSize={12} name="Attempts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Attempts History Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">Recent Solutions & Sync Status</h3>
          <span className="text-xs text-slate-400">Tracked in Database</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Problem</th>
                <th className="py-2.5 px-3">Pattern</th>
                <th className="py-2.5 px-3">Complexity</th>
                <th className="py-2.5 px-3">Lang</th>
                <th className="py-2.5 px-3">GitHub</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-medium text-white">{row.problem_title}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      {row.pattern}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-xs text-slate-400">
                    {row.time_complexity} / {row.space_complexity}
                  </td>
                  <td className="py-2.5 px-3 uppercase text-xs text-slate-400">{row.language}</td>
                  <td className="py-2.5 px-3">
                    {row.github_synced ? (
                      <span className="inline-flex items-center text-xs text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                        Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-slate-500">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-slate-500">
                    {row.created_at ? new Date(row.created_at).toLocaleDateString() : "Recent"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
