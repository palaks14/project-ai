import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Flame, Zap, X, BookOpen, Brain, Users, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../stores/authStore';
import useStudyStore from '../../stores/studyStore';

const typeIcons = {
  module: <BookOpen size={14} />,
  card: <Brain size={14} />,
  group: <Users size={14} />,
};

const notifIcons = {
  review: '📝',
  group: '💬',
  streak: '🔥',
  ai: '🤖',
  badge: '🏆',
};

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { stats, searchQuery, searchResults, setSearchQuery, clearSearch, notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useStudyStore();

  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setShowSearch(val.length > 0);
  };

  const handleResultClick = (result) => {
    clearSearch();
    setShowSearch(false);
    if (result.type === 'module') navigate('/curriculum');
    else if (result.type === 'card') navigate('/revision');
    else if (result.type === 'group') navigate('/groups');
  };

  const displayName = user?.name || 'Scholar';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&bold=true&size=48`;

  return (
    <header className="h-16 bg-[#0d0e14]/60 backdrop-blur-2xl px-8 flex items-center justify-between sticky top-0 z-40 border-b border-white/[0.04]">
      {/* Search */}
      <div className="relative w-96 group" ref={searchRef}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery.length > 0 && setShowSearch(true)}
          placeholder="Search modules, topics, cards..."
          className="w-full pl-11 pr-20 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl focus:bg-white/[0.05] focus:border-indigo-500/20 outline-none transition-all text-sm font-medium text-slate-300 placeholder:text-slate-600"
          id="navbar-search"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-white/[0.04] rounded-md border border-white/[0.06]">
          <Command size={10} className="text-slate-600" />
          <span className="text-[10px] text-slate-600 font-mono">K</span>
        </div>
        {searchQuery && (
          <button onClick={() => { clearSearch(); setShowSearch(false); }} className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 cursor-pointer">
            <X size={14} />
          </button>
        )}

        <AnimatePresence>
          {showSearch && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#161825] rounded-xl shadow-2xl border border-white/[0.06] overflow-hidden z-50"
            >
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    {typeIcons[result.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {result.type === 'card' ? result.data.question : result.data.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {result.type === 'card' ? result.data.topic : result.type}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
          {showSearch && searchQuery && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#161825] rounded-xl shadow-2xl border border-white/[0.06] p-6 text-center z-50"
            >
              <p className="text-sm text-slate-500">No results for "{searchQuery}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Stats Chips */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-orange-400 font-black text-xs">
            <Flame size={14} />
            <span>{stats.streakCount}</span>
          </div>
          <div className="w-px h-4 bg-white/[0.06]" />
          <div className="flex items-center gap-1.5 text-cyan-400 font-black text-xs">
            <Zap size={14} />
            <span>{stats.xp}</span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] rounded-xl transition-all cursor-pointer"
            id="navbar-notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-[#0d0e14] text-[8px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-[#161825] rounded-2xl shadow-2xl border border-white/[0.06] overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllNotificationsRead} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        setShowNotifications(false);
                        if (notif.type === 'review') navigate('/revision');
                        if (notif.type === 'group') navigate('/groups');
                      }}
                      className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-all text-left cursor-pointer ${!notif.read ? 'bg-indigo-500/[0.03]' : ''}`}
                    >
                      <span className="text-lg mt-0.5">{notifIcons[notif.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${!notif.read ? 'text-slate-200' : 'text-slate-500'}`}>{notif.title}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{notif.message}</p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/[0.04]">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-200 leading-none">{displayName}</p>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
              {user?.role === 'teacher' ? 'Educator' : 'Pro Scholar'}
            </p>
          </div>
          <div className="relative">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-9 h-9 rounded-xl border-2 border-indigo-500/20"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d0e14]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
