import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, CheckCircle2, ChevronRight, GraduationCap, Calendar, Target, Loader2, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';
import useStudyStore from '../stores/studyStore';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null);
  const [targetDate, setTargetDate] = useState('2026-06-15');
  const [targetScore, setTargetScore] = useState('95%');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [ytUrl, setYtUrl] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const { addActivity } = useStudyStore();

  const handleStep2Continue = () => {
    if (!method) { toast.error('Please select a syllabus import method'); return; }
    if (method === 'yt' && !ytUrl.trim()) { toast.error('Please paste a YouTube URL'); return; }
    setIsAnalyzing(true);
    setTimeout(() => { setIsAnalyzing(false); setStep(3); }, 2500);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setFileName(file.name); setMethod('pdf'); toast.success(`"${file.name}" selected`); }
  };

  const handleComplete = () => {
    updateUser({ goals: targetScore, examDate: targetDate });
    addActivity('🎓', 'Completed onboarding — 60-day study plan generated');
    toast.success("Study plan generated! Redirecting to dashboard...");
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="ambient-bg" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress */}
        <div className="flex gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-white/[0.06]'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-glass p-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-violet-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-8 border border-indigo-500/10">
                <Target size={32} />
              </div>
              <h1 className="text-3xl font-black text-white mb-3">Your Journey Starts Here</h1>
              <p className="text-slate-500 mb-8 text-sm">Choose your primary focus so we can calibrate your roadmap.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { id: 'academic', label: 'Academic Excellence', desc: 'Focus on CGPA & Semester Exams', icon: <GraduationCap size={20} /> },
                  { id: 'career', label: 'Career Growth', desc: 'Placement Ready & Skill Building', icon: <Target size={20} /> },
                  { id: 'balanced', label: 'Balanced Path', desc: 'Best of both worlds', icon: <Sparkles size={20} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setTargetScore(item.label); setMethod(item.id); }}
                    className={`p-5 rounded-xl border text-left transition-all cursor-pointer group ${
                      method === item.id 
                        ? 'bg-indigo-500/10 border-indigo-500/30 ring-2 ring-indigo-500/10' 
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                      method === item.id ? 'bg-indigo-500 text-white' : 'bg-white/[0.04] text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {item.icon}
                    </div>
                    <p className="font-bold text-[11px] text-white uppercase tracking-wider leading-tight mb-1">{item.label}</p>
                    <p className="text-[10px] text-slate-600 leading-tight">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-left hover:border-indigo-500/20 transition-all cursor-pointer group">
                  <Calendar size={20} className="text-slate-600 group-hover:text-indigo-400 mb-3" />
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Date</span>
                  <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full font-bold text-white outline-none bg-transparent cursor-pointer" id="onboard-date" />
                </div>
                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-left hover:border-indigo-500/20 transition-all cursor-pointer group">
                  <Target size={20} className="text-slate-600 group-hover:text-indigo-400 mb-3" />
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Goal</span>
                  <input type="text" value={targetScore} onChange={(e) => setTargetScore(e.target.value)} placeholder="e.g. 9.5 CGPA or Full Stack" className="w-full font-bold text-white outline-none bg-transparent placeholder:text-slate-700" id="onboard-score" />
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full py-4 flex items-center justify-center gap-2 group">
                Continue to Curriculum
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-glass p-10 text-center">
              <h1 className="text-3xl font-black text-white mb-3">Import Your Syllabus</h1>
              <p className="text-slate-500 mb-8 text-sm">EduAI will extract topics and subtopics to build your study roadmap instantly.</p>

              <div className="grid grid-cols-2 gap-5 mb-6">
                <div>
                  <button
                    onClick={() => document.getElementById('file-upload').click()}
                    className={`w-full p-7 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${method === 'pdf' ? 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400' : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/10'}`}
                  >
                    <Upload size={36} />
                    <span className="font-bold text-xs uppercase tracking-widest">Upload PDF</span>
                  </button>
                  <input type="file" accept=".pdf,.doc,.docx,.txt" id="file-upload" className="hidden" onChange={handleFileSelect} />
                  {fileName && (
                    <div className="mt-2 flex items-center gap-2 justify-center text-[11px] text-indigo-400 font-bold">
                      <FileText size={14} />{fileName}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setMethod('yt')}
                  className={`w-full p-7 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${method === 'yt' ? 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400' : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/10'}`}
                >
                  <Video size={36} />
                  <span className="font-bold text-xs uppercase tracking-widest">YouTube URL</span>
                </button>
              </div>

              {method === 'yt' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
                  <input type="url" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="input-field" id="onboard-yt-url" />
                </motion.div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-slate-300 transition-all cursor-pointer">Back</button>
                <button onClick={handleStep2Continue} disabled={!method || isAnalyzing} className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 group disabled:opacity-50">
                  {isAnalyzing ? (<><Loader2 size={18} className="animate-spin" />Analyzing...</>) : (<>Analyze & Generate <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>)}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-glass p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-emerald-500/15"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h1 className="text-3xl font-black text-white mb-3">Neural Analysis Complete!</h1>
              <p className="text-slate-500 mb-8 text-sm italic">"We've identified 12 core modules and 48 weak prerequisites in your syllabus. Your 60-day mastery plan is ready."</p>

              <div className="space-y-2 mb-8">
                {[
                  { text: 'Syllabus Extracted: 48 topics found', color: 'emerald' },
                  { text: 'Spaced Repetition Schedule Created', color: 'emerald' },
                  { text: `Target: ${targetScore} by ${new Date(targetDate).toLocaleDateString()}`, color: 'emerald' },
                  { text: 'AI Tutor Ready!', color: 'indigo', pulse: true },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl text-sm border ${
                    item.color === 'indigo' ? 'bg-indigo-500/5 border-indigo-500/10 text-indigo-400' : 'bg-white/[0.02] border-white/[0.04] text-slate-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${item.color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-400'} ${item.pulse ? 'animate-pulse' : ''}`} />
                    {item.text}
                  </div>
                ))}
              </div>

              <button onClick={handleComplete} className="btn-primary w-full py-5 text-lg">
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
