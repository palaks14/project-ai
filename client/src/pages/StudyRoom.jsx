import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, MessageSquare, Play, Pause, Clock, Share2, Send, Hand, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';

const StudyRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { user: 'System', message: '📚 Study session started. Focus mode activated!', timestamp: Date.now() - 60000 },
  ]);
  const [input, setInput] = useState('');
  const [participants] = useState([
    { id: '1', name: 'You', status: 'studying' },
    { id: '2', name: 'Alex M.', status: 'break' },
    { id: '3', name: 'Jordan K.', status: 'studying' },
  ]);

  // Pomodoro Timer
  const [timerDuration, setTimerDuration] = useState(25 * 60); // 25 minutes
  const [timer, setTimer] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef(null);
  const chatEndRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (isActive && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(intervalRef.current);
      if (soundEnabled) {
        // Play a notification sound using Web Audio API
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.3;
          oscillator.start();
          setTimeout(() => { oscillator.stop(); audioCtx.close(); }, 500);
        } catch (e) { /* Audio not available */ }
      }

      if (!isBreak) {
        setCompletedPomodoros(prev => prev + 1);
        toast.success('Pomodoro complete! Take a 5-minute break. 🎉');
        setMessages(prev => [...prev, { user: 'System', message: '⏰ Pomodoro complete! Take a break.', timestamp: Date.now() }]);
        setIsBreak(true);
        setTimer(5 * 60); // 5 min break
        setIsActive(true);
      } else {
        toast.success('Break over! Ready for another session? 💪');
        setMessages(prev => [...prev, { user: 'System', message: '💪 Break is over! Start another focus session.', timestamp: Date.now() }]);
        setIsBreak(false);
        setTimer(timerDuration);
        setIsActive(false);
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timer, isBreak, soundEnabled, timerDuration]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setMessages(prev => [...prev, {
        user: 'System',
        message: isBreak ? '☕ Break timer started.' : '🎯 Focus timer started. Stay focused!',
        timestamp: Date.now()
      }]);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsBreak(false);
    setTimer(timerDuration);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { user: 'You', message: input, timestamp: Date.now() }]);
    setInput('');

    // Simulate a response from other participants
    const responses = [
      "That's a great point! 👍",
      "I was thinking the same thing.",
      "Can you elaborate on that?",
      "Let me share my notes on this...",
      "I found a helpful resource for this topic!",
    ];
    setTimeout(() => {
      const randomParticipant = participants[Math.floor(Math.random() * (participants.length - 1)) + 1];
      setMessages(prev => [...prev, {
        user: randomParticipant.name,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now()
      }]);
    }, 2000 + Math.random() * 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerPercentage = isBreak
    ? ((5 * 60 - timer) / (5 * 60)) * 100
    : ((timerDuration - timer) / timerDuration) * 100;

  const handleLeave = () => {
    clearInterval(intervalRef.current);
    toast('You left the study room', { icon: '👋' });
    navigate('/groups');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      toast.success('Room link copied to clipboard!');
    }).catch(() => {
      toast('Room ID: ' + id, { icon: '🔗' });
    });
  };

  const handleRaiseHand = () => {
    setMessages(prev => [...prev, { user: 'You', message: '✋ raised their hand', timestamp: Date.now() }]);
    toast('Hand raised! Others have been notified.', { icon: '✋' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
      {/* Left: Participant Grid */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {/* Back button */}
        <button onClick={() => navigate('/groups')} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold text-sm transition-all cursor-pointer w-fit">
          <ArrowLeft size={18} />
          Back to Groups
        </button>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
          {participants.map((p) => (
            <div key={p.id} className="card-glass relative group overflow-hidden bg-slate-900 aspect-video flex flex-col items-center justify-center rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xl font-bold uppercase">
                {p.name.charAt(0)}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
                <span className="text-white text-xs font-bold">{p.name}</span>
                <div className={`w-2 h-2 rounded-full ${p.status === 'studying' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-orange-500'}`} />
              </div>
            </div>
          ))}
          {/* Invite Slot */}
          <button
            onClick={() => toast('Invite link copied!', { icon: '📎' })}
            className="card-glass border-dashed border-2 border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer rounded-2xl"
          >
            <Users size={32} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Invite Peers</span>
          </button>
        </div>

        {/* Bottom Toolbar */}
        <div className="card-glass p-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {isBreak ? '☕ Break Timer' : '🎯 Focus Timer'}
              </span>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className={`text-3xl font-bold font-mono tracking-tighter ${isBreak ? 'text-orange-500' : 'text-slate-900'}`}>
                    {formatTime(timer)}
                  </span>
                  {/* Mini progress bar under timer */}
                  <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isBreak ? 'bg-orange-500' : 'bg-blue-500'}`}
                      style={{ width: `${timerPercentage}%` }}
                    />
                  </div>
                </div>
                <button 
                  onClick={toggleTimer}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
                  }`}
                >
                  {isActive ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-slate-200" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</span>
              <p className="text-sm font-bold text-slate-900">{completedPomodoros} Pomodoros</p>
            </div>
            <div className="w-[1px] h-10 bg-slate-200" />
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-all cursor-pointer text-slate-400 hover:text-slate-700"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          <div className="flex gap-3">
            <button onClick={handleRaiseHand} className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:text-blue-500 transition-all cursor-pointer" title="Raise hand">
              <Hand size={20} />
            </button>
            <button onClick={handleShare} className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:text-blue-500 transition-all cursor-pointer" title="Share room">
              <Share2 size={20} />
            </button>
            <button onClick={handleLeave} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all text-sm cursor-pointer">
              Leave Room
            </button>
          </div>
        </div>
      </div>

      {/* Right: Group Chat */}
      <div className="card-glass flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Group Stream</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between items-end px-1">
                <span className={`text-[9px] font-bold uppercase ${msg.user === 'System' ? 'text-blue-500' : msg.user === 'You' ? 'text-green-500' : 'text-slate-400'}`}>
                  {msg.user}
                </span>
                <span className="text-[8px] text-slate-300">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`p-3 rounded-xl shadow-sm text-xs ${
                msg.user === 'System'
                  ? 'bg-blue-50 border border-blue-100 text-blue-700 rounded-tl-none'
                  : msg.user === 'You'
                    ? 'bg-blue-600 text-white rounded-tr-none ml-auto max-w-[85%]'
                    : 'bg-white border border-slate-200 rounded-tl-none'
              }`}>
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message group..." 
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-200 outline-none transition-all text-xs"
              id="room-chat-input"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:scale-110 transition-transform cursor-pointer disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
