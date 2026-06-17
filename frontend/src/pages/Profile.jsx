import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {/* Profile Header Banner */}
        <div className="flex flex-col items-center pb-6 border-b border-slate-100 dark:border-slate-850">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-white">{user.name}</h2>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mt-2">
            {user.role} Status
          </span>
        </div>

        {/* Profile Data Details */}
        <div className="pt-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-650 dark:text-slate-400">Email Address</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">{user.email}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-650 dark:text-slate-400">Account Role</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold capitalize">{user.role}</span>
          </div>

          {user.createdAt && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-650 dark:text-slate-400">Member Since</span>
              <span className="text-slate-850 dark:text-slate-200 font-bold">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
