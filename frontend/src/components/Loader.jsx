import React from 'react';

const Loader = ({ message = "Analyzing text..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Outer spinning ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-650 dark:text-slate-350 text-sm font-semibold tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;
