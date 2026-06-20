import React, { useState } from 'react';
import NewsForm from '../components/NewsForm';
import ResultCard from '../components/ResultCard';
import HeadlineAnalyzer from '../components/HeadlineAnalyzer';
import { predictNews } from '../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('article'); // 'article' or 'headline'
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

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('article')}
          className={`pb-4 px-4 transition border-b-2 -mb-[2px] ${
            activeTab === 'article'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          Verify Article Content
        </button>
        <button
          onClick={() => setActiveTab('headline')}
          className={`pb-4 px-4 transition border-b-2 -mb-[2px] ${
            activeTab === 'headline'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          Headline Clickbait Analyzer
        </button>
      </div>

      {activeTab === 'article' ? (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-955/20 text-red-650 dark:text-red-400 border border-red-155 dark:border-red-900/35 p-4 rounded-xl text-sm mb-6 flex items-center space-x-2">
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
      ) : (
        <HeadlineAnalyzer />
      )}
    </div>
  );
};

export default Dashboard;
