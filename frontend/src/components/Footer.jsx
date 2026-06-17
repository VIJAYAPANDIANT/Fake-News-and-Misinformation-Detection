import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Veritas.AI. All rights reserved.
        </div>
        <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition">Privacy Policy</span>
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition">Terms of Service</span>
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition">Contact Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
