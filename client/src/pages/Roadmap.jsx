import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, BookOpen, Plus, Sparkles, CheckCircle2, ChevronRight, GraduationCap, Brain, User, Globe, Link, Code } from 'lucide-react';
import useStudyStore from '../stores/studyStore';
import toast from 'react-hot-toast';

const Roadmap = () => {
  const { careerGoal, roadmap, skills, projects, toggleTask, stats } = useStudyStore();
  const [activePhase, setActivePhase] = useState(1);

  const currentPhase = roadmap.find(p => p.id === activePhase) || roadmap[0];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge bg-indigo-500/10 text-indigo-400">Career Track</span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target: {stats.cgpaGoal} CGPA</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            The <span className="shimmer-text">{careerGoal}</span> Journey
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium max-w-2xl">
            A comprehensive, AI-curated roadmap blending your college curriculum with industry-standard placement readiness.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn-secondary text-xs flex items-center gap-2">
            <Globe size={14} /> Portfolio
          </button>
          <button className="btn-primary text-xs flex items-center gap-2">
            <Sparkles size={14} /> AI Optimization
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Phase Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-4">Journey Phases</h3>
          {roadmap.map((phase, idx) => (
            <motion.div
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                activePhase === phase.id 
                  ? 'bg-indigo-500/5 border-indigo-500/20 text-white' 
                  : 'bg-white/[0.02] border-white/[0.04] text-slate-500 hover:border-white/10'
              }`}
            >
              {idx < roadmap.length - 1 && (
                <div className="absolute left-9 bottom-[-16px] w-[1px] h-4 bg-white/[0.06]" />
              )}
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                  activePhase === phase.id 
                    ? 'bg-indigo-500 text-white border-indigo-400/30' 
                    : 'bg-white/[0.04] border-white/[0.06]'
                }`}>
                  {phase.status === 'done' ? <CheckCircle2 size={16} /> : <span className="text-[11px] font-bold">{idx + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{phase.title}</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase mt-0.5">
                    {new Date(phase.start).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - {new Date(phase.end).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <ChevronRight size={14} className={`transition-transform ${activePhase === phase.id ? 'rotate-90 text-indigo-400' : 'text-slate-700'}`} />
              </div>
            </motion.div>
          ))}

          {/* Placement Checklist Card */}
          <div className="mt-8 card-glass p-6 border-indigo-500/10">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <GraduationCap size={14} className="text-indigo-400" />
              Placement Readiness
            </h4>
            <div className="space-y-3">
              {[
                { icon: <Code size={12} />, label: 'DSA Preparation', val: '40%' },
                { icon: <Globe size={12} />, label: 'Open Source', val: '2/5' },
                { icon: <Link size={12} />, label: 'Personal Brand', val: 'High' },
                { icon: <User size={12} />, label: 'Soft Skills', val: 'B+' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="text-slate-600 group-hover:text-indigo-400 transition-colors">{item.icon}</div>
                    <span className="text-xs font-medium text-slate-400">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">{item.val}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/10 transition-all">
              Resume Analysis
            </button>
          </div>
        </div>

        {/* Right: Phase Details */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card-glass p-8"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">{currentPhase.title}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Calendar size={14} />
                      {currentPhase.start} — {currentPhase.end}
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <Sparkles size={14} />
                      AI Guidance Active
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white leading-none">
                    {Math.round((currentPhase.tasks.filter(t => t.completed).length / currentPhase.tasks.length) * 100)}%
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Phase Progress</p>
                </div>
              </div>

              <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl mb-8">
                <p className="text-xs text-indigo-300 italic flex items-start gap-3">
                  <Brain size={16} className="shrink-0 mt-0.5" />
                  "{currentPhase.guidance}"
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-4">Milestones & Tasks</h3>
                {currentPhase.tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(currentPhase.id, task.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                      task.completed ? 'bg-emerald-500/[0.03] border-emerald-500/10' : 'bg-white/[0.01] border-white/[0.04] hover:border-white/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      task.completed ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 bg-white/[0.02]'
                    }`}>
                      {task.completed && <CheckCircle2 size={12} />}
                    </div>
                    <span className={`text-sm font-medium flex-1 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {task.text}
                    </span>
                    <ChevronRight size={14} className="text-slate-800 group-hover:text-slate-600 transition-colors" />
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Skill Growth</h4>
                  <div className="space-y-4">
                    {skills.slice(0, 3).map((skill, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[11px] font-bold mb-1.5">
                          <span className="text-slate-300">{skill.name}</span>
                          <span className="text-indigo-400">{skill.level}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Projects</h4>
                  <div className="space-y-4">
                    {projects.map((project, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-indigo-400">
                          <Code size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-200 truncate">{project.name}</p>
                          <div className="w-full h-1 bg-white/[0.04] rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-600">{project.progress}%</span>
                      </div>
                    ))}
                    <button className="w-full mt-2 py-2.5 rounded-lg border border-dashed border-white/10 text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:border-indigo-500/30 hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
                      <Plus size={10} /> Add New Project
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
