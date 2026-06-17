import React, { useState } from 'react';
import NewsForm from '../components/NewsForm';
import ResultCard from '../components/ResultCard';
import { predictNews } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async ({ title, text }) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await predictNews(title, text);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error || 'Failed to complete classification.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 transition-colors duration-200">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Verify Credibility</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Submit article headlines and content to check for structural indicators of fake news.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-155 dark:border-red-900/35 p-4 rounded-xl text-sm mb-6 flex items-center space-x-2">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {!result ? (
          <NewsForm onSubmit={handleVerify} loading={loading} />
        ) : (
          <ResultCard result={result} onClear={handleClear} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
