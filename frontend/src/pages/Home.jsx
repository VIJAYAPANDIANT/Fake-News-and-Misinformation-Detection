import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-[80vh] justify-center transition-colors duration-200">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center space-y-8">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
          Detect Misinformation with{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Machine Learning
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-550 dark:text-slate-400 leading-relaxed">
          Verify the authenticity of news articles instantly. Our natural language processing (NLP) model scans text for patterns typical of clickbait, rumors, and deceptive reports.
        </p>

        <div className="flex justify-center items-center space-x-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition duration-150 transform hover:-translate-y-0.5"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition duration-150 transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-250 dark:border-slate-750 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-150 transform hover:-translate-y-0.5"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-850 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-xl bg-blue-105 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 mb-2">Instant Detection</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Get predictions in milliseconds. Our optimized Logistic Regression model analyzes syntax structure immediately.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-850 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-xl bg-indigo-105 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 mb-2">Confidence Scores</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Every verification is backed by a statistical percentage showing how confident our model is in its decision.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-850 hover:shadow-md transition duration-200">
          <div className="w-12 h-12 rounded-xl bg-emerald-105 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 mb-2">Persistent History</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Save checks to your private account history so you can track sources, build logs, and export analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
