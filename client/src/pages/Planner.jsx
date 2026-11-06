import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, Plus, Sparkles, GraduationCap, Brain, User, ChevronRight, Upload, Filter, Timer } from 'lucide-react';
import useStudyStore from '../stores/studyStore';
import toast from 'react-hot-toast';

const Planner = () => {
  const { timetable, stats } = useStudyStore();
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayData = timetable.find(d => d.day === selectedDay) || { classes: [], studyBlocks: [] };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge bg-cyan-500/10 text-cyan-400">Intelligent Planner</span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Balanced Routine</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Daily <span className="shimmer-text">Neural</span> Schedule
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Synchronize your college classes with AI-optimized self-study sessions to maximize retention.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn-secondary text-xs flex items-center gap-2">
            <Upload size={14} /> Import Timetable
          </button>
          <button className="btn-primary text-xs flex items-center gap-2">
            <Sparkles size={14} /> Optimize Blocks
          </button>
        </div>
      </motion.div>

      {/* Day Selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              selectedDay === day 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-white/[0.02] border border-white/[0.04] text-slate-500 hover:text-slate-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card-glass p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Timer size={120} className="text-white" />
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-indigo-400" />
                Schedule for {selectedDay}
              </h3>
              <button className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-slate-500 hover:text-indigo-400 transition-all">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-4 relative">
              {/* Timeline Line */}
              <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-white/[0.04]" />

              {/* Combined and Sorted Slots (Simplified for demo) */}
              {[...dayData.classes.map(c => ({...c, type: 'college'})), ...dayData.studyBlocks.map(b => ({...b, type: 'study'}))].map((slot, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative pl-10"
                >
                  <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#0d0e14] ${slot.type === 'college' ? 'bg-amber-400' : 'bg-indigo-500'}`} />
                  
                  <div className={`p-5 rounded-2xl border flex items-center justify-between group transition-all ${
                    slot.type === 'college' 
                      ? 'bg-amber-400/[0.02] border-amber-400/10 hover:border-amber-400/30' 
                      : 'bg-indigo-500/[0.03] border-indigo-500/10 hover:border-indigo-500/30'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{slot.time}</span>
                        <span className={`badge text-[9px] py-0.5 ${slot.type === 'college' ? 'bg-amber-400/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {slot.type === 'college' ? 'College Class' : 'Focus Block'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{slot.name}</h4>
                      {slot.focus && <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <Brain size={12} className="text-indigo-400" />
                        Focus: {slot.focus}
                      </p>}
                    </div>
                    <button className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}

              {dayData.classes.length === 0 && dayData.studyBlocks.length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-600 mx-auto mb-4">
                    <Calendar size={24} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No events scheduled for this day.</p>
                  <button className="text-xs font-bold text-indigo-400 mt-4 uppercase tracking-widest hover:text-indigo-300 transition-colors">Add Activity</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Insights & AI Suggestions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-glass p-6 border-cyan-500/10">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" />
              AI Daily Insight
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              "Based on your {selectedDay} schedule, you have a <span className="text-white font-bold">4-hour gap</span> between your college classes. I've scheduled a 90-minute <span className="text-indigo-400 font-bold">Deep Work</span> block at 15:00 for your Full Stack project."
            </p>
            <div className="mt-6 flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
              <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 shrink-0">
                <Timer size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Focus Window</p>
                <p className="text-xs font-bold text-white">Peak cognitive state: 18:00</p>
              </div>
            </div>
          </div>

          <div className="card-glass p-6">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-6">Mastery Stats</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center">
                  <span className="text-[11px] font-black text-white">72%</span>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-200">Consistency Score</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-0.5">Target: 85%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 flex items-center justify-center">
                  <span className="text-[11px] font-black text-white">4.2h</span>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-200">Avg. Deep Work</p>
                  <p className="text-[9px] text-slate-500 uppercase mt-0.5">Daily average</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-glass p-6 bg-gradient-to-br from-indigo-500/10 to-transparent">
            <h4 className="text-xs font-bold text-white mb-2">College Exam Prep</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              Your semester exams start in <span className="text-white font-bold">24 days</span>. AI recommends shifting 20% of self-study time to "Database Systems" to maintain your 9.5 CGPA goal.
            </p>
            <button className="w-full py-3 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all">
              Balance Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
