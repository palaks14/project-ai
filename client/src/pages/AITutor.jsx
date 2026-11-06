import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Sparkles, Brain, Lightbulb, ChevronRight, Volume2, Loader2 } from 'lucide-react';
import useStudyStore from '../stores/studyStore';

// Pre-built AI responses for different levels and topics
const aiResponses = {
  ELI5: [
    { text: "Think of it like this: imagine you have a box with a cat inside. Until you open the box, the cat is both sleeping AND awake at the same time! That's basically what quantum superposition means. The Schrödinger equation is like the rules for how that cat behaves before you peek inside. 🐱", type: 'socratic' },
    { text: "Great question! So you know how when you throw a ball, you can guess where it'll land? In the quantum world, we can't know exactly — we can only guess with probabilities. The equation helps us figure out those probabilities. What do you think happens when we try to measure where a tiny particle is?", type: 'socratic' },
    { text: "You're getting it! So the wavefunction is like a map that shows where a particle is MOST LIKELY to be. The higher the wave, the more likely. When we add up all the probabilities across everywhere, what should the total be?", type: 'socratic' },
  ],
  Standard: [
    { text: "That's a great start. Now, if the wavefunction Ψ represents a probability amplitude, what mathematical constraint must it satisfy when we integrate |Ψ|² over all space? Think about what probability means in a complete system.", type: 'socratic' },
    { text: "Exactly right — the normalization condition ∫|Ψ|² dx = 1. This ensures total probability equals 1. Now, how does the time-dependent Schrödinger equation iħ ∂Ψ/∂t = ĤΨ govern the evolution of this wavefunction? What role does the Hamiltonian Ĥ play?", type: 'socratic' },
    { text: "Excellent reasoning! The Hamiltonian represents the total energy operator (kinetic + potential). For a free particle, V=0, and the solutions are plane waves. Can you write the general form of a plane wave solution and explain what the wavevector k physically represents?", type: 'socratic' },
  ],
  Advanced: [
    { text: "Consider the implications of the Stone-von Neumann theorem on the uniqueness of the Schrödinger representation. Given that the canonical commutation relation [x̂, p̂] = iħ determines the algebra, how does this constrain the possible Hilbert space representations? Relate this to the Weyl algebra.", type: 'socratic' },
    { text: "Precisely. The irreducibility of the Weyl algebra representation ensures uniqueness up to unitary equivalence. Now, consider the propagator K(x',t'; x,t) for the time-dependent Schrödinger equation. How would you derive the Feynman path integral formulation from the time-evolution operator, and what physical insight does the stationary phase approximation provide?", type: 'socratic' },
    { text: "Outstanding analysis. The stationary phase condition δS = 0 recovers classical mechanics as the ħ→0 limit — the principle of least action. This beautifully connects quantum and classical domains. For your next challenge: how does decoherence theory explain the quantum-to-classical transition without invoking wavefunction collapse?", type: 'socratic' },
  ],
};

const hintContents = [
  { level: 1, title: 'Concept Hint', content: "The Schrödinger equation describes quantum state evolution. Think about what 'state' means in physics — it contains all information about the system." },
  { level: 2, title: 'Logic Hint', content: "The equation is iħ ∂/∂t |Ψ⟩ = Ĥ|Ψ⟩. The left side represents how the state changes with time. The right side involves the Hamiltonian (energy operator). Connect energy to time evolution." },
  { level: 3, title: 'Solution Hint', content: "For a time-independent potential, separate variables: Ψ(x,t) = ψ(x)·e^(-iEt/ħ). This gives the time-independent equation: Ĥψ = Eψ, an eigenvalue problem where E is the energy eigenvalue." },
];

const AITutor = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! Ready to master Quantum Mechanics today? I've noticed you're doing great with Wave-Particle Duality, but maybe we should dive into Schrödinger's Equation? I'll guide you through it using Socratic questioning.", type: 'socratic' }
  ]);
  const [input, setInput] = useState('');
  const [level, setLevel] = useState('Standard');
  const [hintLevel, setHintLevel] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const addActivity = useStudyStore((s) => s.addActivity);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Pick an AI response based on current level and response index
    const responses = aiResponses[level] || aiResponses.Standard;
    const idx = responseIndex % responses.length;

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', ...responses[idx] }]);
      setResponseIndex(prev => prev + 1);
      setIsTyping(false);
      addActivity('🤖', `AI Tutor: ${level} mode discussion on Quantum Mechanics`);
    }, 1200 + Math.random() * 800);
  };

  const handleHint = (h) => {
    setHintLevel(h);
    const hint = hintContents.find(hc => hc.level === h);
    if (hint) {
      setMessages(prev => [...prev, { role: 'ai', text: `💡 **${hint.title}:** ${hint.content}`, type: 'hint' }]);
    }
  };

  const handleVoice = () => {
    if ('speechSynthesis' in window) {
      const lastAI = [...messages].reverse().find(m => m.role === 'ai');
      if (lastAI) {
        const utterance = new SpeechSynthesisUtterance(lastAI.text.replace(/[*_]/g, ''));
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
      {/* Main Chat Interface */}
      <div className="lg:col-span-3 flex flex-col card-glass overflow-hidden h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">EduAI Socratic Tutor</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Active: Schrödinger's Equation</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            {['ELI5', 'Standard', 'Advanced'].map((l) => (
              <button 
                key={l}
                onClick={() => {
                  setLevel(l);
                  setResponseIndex(0);
                }}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${level === l ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
                    : msg.type === 'hint'
                      ? 'bg-yellow-50 border border-yellow-200 rounded-tl-none shadow-sm'
                      : 'bg-white border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.type === 'socratic' && (
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-purple-500 uppercase tracking-[0.2em] mb-2">
                      <Brain size={12} />
                      Socratic Reasoning
                    </div>
                  )}
                  {msg.type === 'hint' && (
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-yellow-600 uppercase tracking-[0.2em] mb-2">
                      <Lightbulb size={12} />
                      Hint
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVoice}
              className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
              title="Read last AI response aloud"
            >
              <Mic size={20} />
            </button>
            <div className="relative flex-1">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Explain your reasoning or ask a question..." 
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-200 outline-none transition-all text-sm"
                disabled={isTyping}
                id="tutor-input"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 cursor-pointer"
                disabled={!input.trim() || isTyping}
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="space-y-6">
        {/* Hint Ladder */}
        <div className="card-glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb size={18} className="text-yellow-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Hint Ladder</h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((h) => (
              <button 
                key={h}
                onClick={() => handleHint(h)}
                disabled={hintLevel >= h}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer disabled:cursor-default ${hintLevel >= h ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">Level 0{h} {h === 1 ? 'Concept' : h === 2 ? 'Logic' : 'Solution'}</span>
                <ChevronRight size={14} className={hintLevel >= h ? 'rotate-90 transition-transform' : ''} />
              </button>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-slate-400 italic">Hints reduce the ability estimate increase for this session.</p>
        </div>

        {/* Adaptive Context */}
        <div className="card-glass p-6 border-blue-100 bg-blue-50/30">
          <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Adaptive Context</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Estimated Ability</span>
              <span className="text-xs font-bold text-slate-900">+1.24 (Advanced)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${65 + (responseIndex * 5)}%` }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Concept Stability</span>
              <span className="text-xs font-bold text-slate-900">{82 + responseIndex * 2}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Hints Used</span>
              <span className="text-xs font-bold text-slate-900">{hintLevel}/3</span>
            </div>
          </div>
        </div>

        {/* AI Voice Output */}
        <div className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Voice Mode</span>
            <button onClick={handleVoice} className="text-blue-500 hover:scale-110 transition-transform cursor-pointer">
              <Volume2 size={20} />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed italic">
            Click the voice icon to hear the AI's last response read aloud using text-to-speech.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
