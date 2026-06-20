import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/api';
import Loader from '../components/Loader';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getHistory();
        if (res.success) {
          setHistory(res.data);
        } else {
          setError('Failed to fetch prediction logs.');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Connection error.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader message="Fetching historical checks..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 transition-colors duration-200">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Analysis History</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Review prediction records run on your account.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-155 dark:border-red-900/35 p-4 rounded-xl text-sm mb-6 flex items-center space-x-2">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <svg className="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No predictions found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Submit news texts from the dashboard to populate your history.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Analytics Dashboard cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Articles Analyzed
              </span>
              <span className="text-3xl font-black text-slate-850 dark:text-white">
                {history.length}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Verifiable (Real)
              </span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {history.filter(r => r.prediction === 'Real').length}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Deceptive (Fake)
              </span>
              <span className="text-3xl font-black text-red-600 dark:text-red-400">
                {history.filter(r => r.prediction === 'Fake').length}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Avg. Confidence
              </span>
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {Math.round((history.reduce((acc, curr) => acc + curr.confidenceScore, 0) / history.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Visual Distribution Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-700 dark:text-slate-350">Content Credibility Breakdown</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Distribution Ratio</span>
            </div>

            {/* Segmented bar */}
            <div className="flex h-5 rounded-full overflow-hidden w-full bg-slate-100 dark:bg-slate-800">
              <div 
                style={{ width: `${Math.round((history.filter(r => r.prediction === 'Real').length / history.length) * 100)}%` }} 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" 
              />
              <div 
                style={{ width: `${Math.round((history.filter(r => r.prediction === 'Fake').length / history.length) * 100)}%` }} 
                className="h-full bg-gradient-to-r from-red-500 to-rose-600" 
              />
            </div>

            {/* Legends */}
            <div className="flex items-center space-x-6 text-xs font-bold">
              <div className="flex items-center space-x-1.5 text-emerald-650 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Verifiable News ({Math.round((history.filter(r => r.prediction === 'Real').length / history.length) * 100)}%)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-red-650 dark:text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Deceptive News ({Math.round((history.filter(r => r.prediction === 'Fake').length / history.length) * 100)}%)</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-black text-slate-850 dark:text-white pt-4">Detailed Scans List</h3>

          <div className="grid grid-cols-1 gap-4">
          {history.map((record) => {
            const isFake = record.prediction === 'Fake';
            return (
              <div 
                key={record._id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span 
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isFake 
                          ? 'bg-red-100 text-red-755 dark:bg-red-900/20 dark:text-red-400' 
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      }`}
                    >
                      {record.prediction}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold">
                      Confidence: {Math.round(record.confidenceScore * 100)}%
                    </span>
                  </div>
                  <h4 className="text-slate-800 dark:text-slate-200 font-bold text-base">
                    {record.title || 'Untitled Article Scan'}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 max-w-2xl">
                    {record.newsText}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 text-xs text-slate-450 dark:text-slate-500 font-semibold">
                  {new Date(record.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
