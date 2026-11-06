import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Clock, TrendingUp, Flame, Brain, Sparkles, ChevronRight, Calendar, Zap, Target, ArrowUpRight } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useStudyStore from '../stores/studyStore';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } } };

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { stats, activity, cards, roadmap } = useStudyStore();

  const dueCards = cards.filter(c => c.due === 'Now' || c.due.includes('h'));
  const displayName = user?.name?.split(' ')[0] || 'Scholar';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-end mb-10"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Welcome back, <span className="shimmer-text">{displayName}</span> 👋
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-400" />
            Neural calibration complete. Peak learning state activated.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/curriculum')}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Calendar size={16} />
            Study Plan
          </button>
          <button
            onClick={() => navigate('/tutor')}
            className="btn-primary flex items-center gap-2 text-sm group"
          >
            Analyze Syllabus
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Flame className="text-orange-400" size={22} />} label="Study Streak" value={`${stats.streakCount} Days`} sub="Top 5% of students" gradient="from-orange-500/10 to-orange-500/5" iconBg="bg-orange-500/10" />
        <StatCard icon={<Brain className="text-violet-400" size={22} />} label="Mastery Score" value={`${stats.masteryScore}%`} sub="+2.4% this week" gradient="from-violet-500/10 to-violet-500/5" iconBg="bg-violet-500/10" />
        <StatCard icon={<Clock className="text-cyan-400" size={22} />} label="Time Focused" value={`${stats.timeFocused}h`} sub="Goal: 50h/week" gradient="from-cyan-500/10 to-cyan-500/5" iconBg="bg-cyan-500/10" />
        <StatCard icon={<TrendingUp className="text-emerald-400" size={22} />} label="Ability Level" value="Advanced" sub={`IRT Level ${stats.abilityLevel}`} gradient="from-emerald-500/10 to-emerald-500/5" iconBg="bg-emerald-500/10" />
      </motion.div>

      {/* Feature Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'AI Tutor', icon: <GraduationCap size={24} />, val: `${stats.masteryScore}% Mastery`, color: 'from-indigo-500/15 to-violet-500/10', iconColor: 'text-indigo-400', borderColor: 'border-indigo-500/10', path: '/tutor' },
          { label: 'Personal Roadmap', icon: <BookOpen size={24} />, val: `${roadmap.length} Phases`, color: 'from-cyan-500/15 to-blue-500/10', iconColor: 'text-cyan-400', borderColor: 'border-cyan-500/10', path: '/roadmap' },
          { label: 'Study Planner', icon: <Calendar size={24} />, val: 'Daily Balanced Schedule', color: 'from-orange-500/15 to-amber-500/10', iconColor: 'text-orange-400', borderColor: 'border-orange-500/10', path: '/planner' }
        ].map((item, i) => (
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            key={i}
            onClick={() => navigate(item.path)}
            className={`card-glass p-6 group hover:-translate-y-1 transition-all duration-300 cursor-pointer border ${item.borderColor}`}
          >
            <div className="flex items-start justify-between mb-5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center ${item.iconColor}`}>
                {item.icon}
              </div>
              <ArrowUpRight size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1">{item.label}</h3>
            <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest">{item.val}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity + Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-glass p-7"
        >
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Zap size={16} className="text-cyan-400" />
            Recent Activity
          </h2>
          <div className="space-y-1">
            {activity.map((item, i) => (
              <ActivityItem key={i} emoji={item.emoji} text={item.text} time={item.time} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-glass p-7"
        >
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Brain size={16} className="text-violet-400" />
            Upcoming Reviews
            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md ml-auto uppercase tracking-wider">SM-2</span>
          </h2>
          <div className="space-y-1">
            {cards.slice(0, 4).map(card => (
              <ReviewItem
                key={card.id}
                subject={card.topic}
                time={card.due}
                difficulty={card.difficulty}
                onClick={() => navigate('/revision')}
              />
            ))}
          </div>
          <div className="mt-5 p-4 bg-gradient-to-r from-indigo-500/10 to-violet-500/5 rounded-xl border border-indigo-500/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="font-bold text-white text-xs">Focus State: High</p>
                <p className="text-[10px] text-slate-500 mt-0.5">AI recommends tackling a Hard topic right now.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, gradient, iconBg }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
    className="card-glass p-5 flex items-center gap-4 group hover:-translate-y-0.5 transition-all duration-300"
  >
    <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xl font-black text-white tracking-tight leading-none">{value}</p>
      <p className="text-[10px] font-bold text-indigo-400 mt-1 uppercase">{sub}</p>
    </div>
  </motion.div>
);

const ActivityItem = ({ emoji, text, time }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-white/[0.02] rounded-xl transition-all">
    <span className="text-lg mt-0.5">{emoji}</span>
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-300">{text}</p>
      <p className="text-[10px] font-bold text-slate-600 uppercase mt-1">{time}</p>
    </div>
  </div>
);

const ReviewItem = ({ subject, time, difficulty, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-3 hover:bg-white/[0.02] rounded-xl transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${difficulty === 'Hard' ? 'bg-red-400' : difficulty === 'Medium' ? 'bg-orange-400' : 'bg-emerald-400'}`} />
      <div>
        <p className="text-sm font-semibold text-slate-200">{subject}</p>
        <p className="text-[10px] font-bold text-slate-600 uppercase">{time}</p>
      </div>
    </div>
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
      difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white' :
      difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white' :
      'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
    }`}>
      {difficulty}
    </span>
  </div>
);

export default Dashboard;
