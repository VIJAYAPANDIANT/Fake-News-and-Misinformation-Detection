import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                Veritas.AI
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium text-sm transition duration-150">
                  Dashboard
                </Link>
                <Link to="/history" className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium text-sm transition duration-150">
                  History
                </Link>
                <Link to="/profile" className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium text-sm transition duration-150">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </>
            ) : (
              <Link to="/" className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium text-sm transition duration-150">
                Home
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition duration-150"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828 0l-.707-.707M17.657 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* CTA Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 shadow-sm"
              >
                Log Out
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-semibold transition duration-150"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 shadow-sm shadow-blue-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-850"
            >
              {darkMode ? (
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828 0l-.707-.707M17.657 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-850 px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-slate-900 transition-all duration-150">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 rounded-md font-medium text-base"
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                onClick={() => setIsOpen(false)}
                className="block text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 rounded-md font-medium text-base"
              >
                History
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 rounded-md font-medium text-base"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-md font-medium text-base mt-2"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="space-y-2 px-3 py-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 py-2 rounded-lg font-semibold text-base"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-base"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
