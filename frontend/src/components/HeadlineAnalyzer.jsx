import React, { useState } from 'react';
import { analyzeHeadline } from '../services/api';

const HeadlineAnalyzer = () => {
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!headline.trim()) return;

    setLoading(false);
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await analyzeHeadline(headline);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error || 'Failed to complete headline analysis.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High':
        return 'text-red-650 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900/30';
      case 'Medium':
        return 'text-amber-650 bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 border-amber-205 dark:border-amber-900/30';
      default:
        return 'text-emerald-650 bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Card */}
      <form onSubmit={handleAnalyze} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
        <label htmlFor="headline" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-3">
          Headline text to analyze:
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. 10 SHOCKING Secrets Doctors Don't Want You To Know!"
            disabled={loading}
            className="flex-grow px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-850 dark:text-slate-100 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !headline.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze Headline</span>
            )}
          </button>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-955/20 text-red-650 dark:text-red-400 border border-red-155 dark:border-red-900/35 p-4 rounded-xl text-sm flex items-center space-x-2">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* Results panel */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition duration-200 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Risk Dial Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-155 dark:border-slate-800">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              Clickbait Rating
            </span>

            {/* Score Ring */}
            <div className="relative flex items-center justify-center w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" strokeWidth="8" stroke="currentColor" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle cx="72" cy="72" r="60" strokeWidth="8" stroke="currentColor" fill="transparent"
                  className={`transition-all duration-1000 ${
                    result.risk === 'High' ? 'text-red-500' : result.risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                  }`}
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * result.clickbaitScore) / 100}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-850 dark:text-white">
                  {result.clickbaitScore}%
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">score</span>
              </div>
            </div>

            {/* Risk Badge */}
            <span className={`mt-6 px-4 py-1.5 rounded-full text-sm font-black border uppercase tracking-wider ${getRiskColor(result.risk)}`}>
              {result.risk} Risk
            </span>
          </div>

          {/* Details & Metrics list */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-850 dark:text-white mb-2">Headline Analysis Report</h3>
              <p className="text-sm text-slate-650 dark:text-slate-350 italic">
                "{result.headline}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Metric 1 */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 flex flex-col">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Capitalization Ratio
                </span>
                <span className="text-2xl font-black text-slate-850 dark:text-white">
                  {result.metrics.capitalizationRatio}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Percentage of words fully capitalized.
                </span>
              </div>

              {/* Metric 2 */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 flex flex-col">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Clickbait Markers
                </span>
                <span className="text-2xl font-black text-slate-850 dark:text-white">
                  {result.metrics.sensationalWordsFound.length > 0 ? 'Detected' : 'Clear'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Presence of hyperbolic clickbait phrases.
                </span>
              </div>
            </div>

            {/* Clickbait words detail */}
            {result.metrics.sensationalWordsFound.length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Triggered clickbait keywords:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.metrics.sensationalWordsFound.map((word, idx) => (
                    <span key={idx} className="px-3 py-1 text-xs rounded-lg font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-650 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                      "{word}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Other markers flags list */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className={`flex items-center space-x-1.5 ${result.metrics.hasExclamation ? 'text-blue-550 dark:text-blue-400' : ''}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>Exclamation Points (!)</span>
              </span>
              <span className={`flex items-center space-x-1.5 ${result.metrics.hasQuestion ? 'text-blue-550 dark:text-blue-400' : ''}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>Question Marks (?)</span>
              </span>
              <span className={`flex items-center space-x-1.5 ${result.metrics.startsWithNumber ? 'text-blue-550 dark:text-blue-400' : ''}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>Starts with Number</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadlineAnalyzer;
