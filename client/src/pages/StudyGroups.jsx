import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Clock, Plus, Crown, Wifi, WifiOff, X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import useStudyStore from '../stores/studyStore';

const recentMessages = [
  { group: 'Physics Masterclass', user: 'Alex M.', text: 'Can someone explain the uncertainty principle?', time: '2m ago' },
  { group: 'Calculus Warriors', user: 'Emma L.', text: 'I shared my notes on integration by parts 📝', time: '15m ago' },
  { group: 'Physics Masterclass', user: 'Jordan K.', text: 'Great session today! Got 95% on the quiz 🎉', time: '1h ago' },
  { group: 'Chemistry Lab Prep', user: 'Nina R.', text: 'Lab report deadline is tomorrow', time: '3h ago' },
];

const StudyGroups = () => {
  const navigate = useNavigate();
  const { groups, createGroup } = useStudyStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTopic, setNewGroupTopic] = useState('');

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupTopic.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    createGroup(newGroupName, newGroupTopic);
    toast.success(`"${newGroupName}" group created!`);
    setShowCreate(false);
    setNewGroupName('');
    setNewGroupTopic('');
  };

  const handleJoinRoom = (group) => {
    if (group.active) {
      navigate(`/room/${group.id}`);
    } else {
      toast('This room is currently offline. Start a session to go live!', { icon: '📡' });
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Study Groups</h1>
          <p className="text-slate-500 mt-2 font-medium">{groups.length} groups • {groups.filter(g => g.active).length} active now</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Create Group
        </button>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Create Study Group</h2>
                <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleCreateGroup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Group Name</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g., Physics Masterclass"
                    className="input-field"
                    required
                    id="create-group-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Topic / Subject</label>
                  <input
                    type="text"
                    value={newGroupTopic}
                    onChange={(e) => setNewGroupTopic(e.target.value)}
                    placeholder="e.g., Quantum Mechanics"
                    className="input-field"
                    required
                    id="create-group-topic"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2">
                    <Plus size={16} />
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Groups List */}
        <div className="lg:col-span-2 space-y-5">
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => handleJoinRoom(group)}
              className="card-glass p-7 hover:-translate-y-0.5 transition-all cursor-pointer group/card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${group.active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Users size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-900">{group.name}</h3>
                      {group.streak >= 10 && <Crown size={16} className="text-yellow-500" />}
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{group.topic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {group.active ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase">
                      <Wifi size={12} /> Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold uppercase">
                      <WifiOff size={12} /> Offline
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 4).map((m, i) => (
                    <img
                      key={i}
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m)}&background=${['3b82f6', '8b5cf6', 'f59e0b', '10b981'][i % 4]}&color=fff&size=32&bold=true`}
                      alt={m}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                  {group.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                      +{group.members.length - 4}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase">
                    <Clock size={12} /> {group.streak}d streak
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase">
                    <MessageSquare size={12} /> Chat
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="card-glass p-7 h-fit">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <MessageSquare size={14} className="text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-5">
            {recentMessages.map((msg, i) => (
              <div key={i} className="flex gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.user)}&background=3b82f6&color=fff&size=32&bold=true`}
                  alt={msg.user}
                  className="w-8 h-8 rounded-full shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{msg.user}</span>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] font-bold text-blue-400 uppercase mt-1 block">{msg.group}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGroups;
