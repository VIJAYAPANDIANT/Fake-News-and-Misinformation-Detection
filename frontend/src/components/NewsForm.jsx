import React, { useState } from 'react';

const NewsForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Article text is required for analysis.');
      return;
    }

    if (text.trim().length < 20) {
      setError('Article text is too short. Please provide at least 20 characters.');
      return;
    }

    onSubmit({ title, text });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
          Article Title (Optional)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Government announces new economic policies"
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-850 dark:text-slate-100 transition disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="text" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
          Article Text / Content
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the complete text of the news article here..."
          rows={7}
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-850 dark:text-slate-100 transition disabled:opacity-50 resize-y"
        />
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 p-3 rounded-xl text-sm border border-red-155 dark:border-red-900/30">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-blue-500/10 transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing Text...</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Verify Article Integrity</span>
          </>
        )}
      </button>
    </form>
  );
};

export default NewsForm;
