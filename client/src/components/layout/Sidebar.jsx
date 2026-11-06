import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, BookOpen, Clock, Users, Settings, LogOut, ChevronLeft, Sparkles, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: GraduationCap, label: 'AI Tutor', path: '/tutor' },
  { icon: BookOpen, label: 'Roadmap', path: '/roadmap' },
  { icon: Calendar, label: 'Planner', path: '/planner' },
  { icon: Clock, label: 'Revision', path: '/revision' },
  { icon: Users, label: 'Study Groups', path: '/groups' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-[270px]'} bg-[#0d0e14]/80 backdrop-blur-2xl border-r border-white/[0.04] h-screen sticky top-0 flex flex-col py-6 shrink-0 transition-all duration-300 relative z-50`}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 bg-[#1a1d2e] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer z-10"
      >
        <ChevronLeft size={12} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 mb-10 ${collapsed ? 'px-4 justify-center' : 'px-6'}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
          <Sparkles size={20} />
        </div>
        {!collapsed && (
          <span className="font-black text-lg tracking-tight text-white">
            Edu<span className="shimmer-text">AI</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 space-y-1 ${collapsed ? 'px-3' : 'px-4'}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 ${collapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl transition-all duration-200 font-semibold text-[13px] group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-white border border-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />
                  )}
                  <Icon size={18} className={isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'} />
                  {!collapsed && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`mt-auto pt-4 border-t border-white/[0.04] space-y-1 ${collapsed ? 'px-3' : 'px-4'}`}>
        <NavLink
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 ${collapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl transition-all font-semibold text-[13px] ${
              isActive
                ? 'bg-white/[0.04] text-slate-300'
                : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'
            }`
          }
        >
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 ${collapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl text-red-400/60 hover:bg-red-500/5 hover:text-red-400 transition-all font-semibold text-[13px] cursor-pointer`}
          id="sidebar-logout"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
