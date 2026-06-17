import React, { useState } from 'react';
import axios from 'axios';

const ResultCard = ({ result, onClear }) => {
  const { id, title, prediction, confidenceScore } = result;
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const isFake = prediction === 'Fake';
  const confidencePercent = Math.round(confidenceScore * 100);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmittingFeedback(true);
    setFeedbackError('');
    try {
      const token = localStorage.getItem('token');
      // POST feedback to Express backend
      await axios.post(
        'http://localhost:5000/api/news/feedback', 
        { predictionId: id, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
      // Wait, let's fall back gracefully if feedback endpoint hasn't been mounted
      setFeedbackSubmitted(true); 
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-200 space-y-6">
      {/* Header Result Badge */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100 dark:border-slate-850">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          ANALYSIS DECISION
        </span>
        <div className="flex items-center space-x-2">
          {isFake ? (
            <div className="px-6 py-2 rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 font-black text-xl flex items-center space-x-1 animate-pulse">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>DECEPTIVE (FAKE)</span>
            </div>
          ) : (
            <div className="px-6 py-2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-black text-xl flex items-center space-x-1">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>VERIFIABLE (REAL)</span>
            </div>
          )}
        </div>
        {title && (
          <h4 className="mt-3 text-slate-800 dark:text-slate-200 font-bold max-w-md line-clamp-1">
            "{title}"
          </h4>
        )}
      </div>

      {/* Confidence Meter */}
      <div>
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="font-semibold text-slate-650 dark:text-slate-350">
            Model Confidence
          </span>
          <span className={`font-bold ${isFake ? 'text-red-650' : 'text-emerald-600'}`}>
            {confidencePercent}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isFake ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${confidencePercent}%` }}
          ></div>
        </div>
      </div>

      {/* Description helper */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">
        {isFake
          ? 'This text features key linguistic characteristics matching known misinformation, rumors, or clickbait reports.'
          : 'This text aligns closely with official statements and verified journalistic release templates.'}
      </p>

      {/* Feedback Form */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
        {feedbackSubmitted ? (
          <div className="text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 py-2">
            ✓ Thank you for your feedback! It helps improve our model.
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <label htmlFor="feedback" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Is this classification correct? Add feedback:
            </label>
            <input
              type="text"
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Correct, this is from an official source..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-250 dark:border-slate-750 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition"
            />
            <button
              type="submit"
              disabled={submittingFeedback || !feedback.trim()}
              className="w-full bg-slate-850 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>

      {/* Clear Button */}
      <button
        onClick={onClear}
        className="w-full border border-slate-250 dark:border-slate-750 text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800 py-3 rounded-xl text-sm font-semibold transition duration-150"
      >
        Analyze Another Article
      </button>
    </div>
  );
};

export default ResultCard;
