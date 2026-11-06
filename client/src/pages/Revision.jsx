import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Brain, ChevronRight, Flame, CheckCircle2, RotateCcw, Zap, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import useStudyStore from '../stores/studyStore';

const Revision = () => {
  const {
    cards,
    reviewSession,
    startReviewSession,
    toggleShowAnswer,
    rateCard,
    endReviewSession,
  } = useStudyStore();

  const dueNow = cards.filter(c => c.due === 'Now').length;
  const reviewedTotal = cards.reduce((a, c) => a + c.streak, 0);
  const avgInterval = (cards.reduce((a, c) => a + c.interval, 0) / cards.length).toFixed(1);

  // Active review session view
  if (reviewSession.active && reviewSession.dueCards) {
    const currentCard = reviewSession.dueCards[reviewSession.currentIndex];
    const progress = ((reviewSession.currentIndex + 1) / reviewSession.dueCards.length) * 100;

    return (
      <div className="p-10 max-w-3xl mx-auto">
        {/* Session Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={endReviewSession} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold text-sm transition-all cursor-pointer">
            <ArrowLeft size={18} />
            End Session
          </button>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Card {reviewSession.currentIndex + 1} of {reviewSession.dueCards.length}
          </span>
        </div>

        {/* Progress */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-10">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, y: 20, rotateX: -5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="card-glass p-10 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                currentCard.difficulty === 'Hard' ? 'bg-red-50 text-red-600' :
                currentCard.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' :
                'bg-green-50 text-green-600'
              }`}>{currentCard.difficulty}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentCard.topic}</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">{currentCard.question}</h2>

            {/* Show/Hide Answer */}
            <AnimatePresence>
              {reviewSession.showAnswer ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8"
                >
                  <div className="w-16 h-px bg-slate-200 mx-auto mb-6" />
                  <p className="text-slate-600 text-base leading-relaxed">{currentCard.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {!reviewSession.showAnswer ? (
              <button
                onClick={toggleShowAnswer}
                className="btn-primary py-4 px-10 flex items-center justify-center gap-2 mx-auto group"
              >
                <Eye size={18} />
                Show Answer
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">How well did you know this?</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { q: 1, label: 'Again', color: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' },
                    { q: 2, label: 'Hard', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200' },
                    { q: 3, label: 'Good', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200' },
                    { q: 4, label: 'Easy', color: 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200' },
                  ].map((btn) => (
                    <button
                      key={btn.q}
                      onClick={() => rateCard(btn.q)}
                      className={`py-3 rounded-xl border font-bold text-sm transition-all cursor-pointer ${btn.color}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-300 uppercase">
              <span>Streak: {currentCard.streak}</span>
              <span>•</span>
              <span>Interval: {currentCard.interval}d</span>
              <span>•</span>
              <span>Ease: {currentCard.ease}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Session complete summary
  if (reviewSession.scores && reviewSession.scores.length > 0 && !reviewSession.active) {
    const totalReviewed = reviewSession.scores.length;
    const goodOrBetter = reviewSession.scores.filter(s => s.quality >= 3).length;
    const accuracy = Math.round((goodOrBetter / totalReviewed) * 100);

    return (
      <div className="p-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-glass p-12"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Review Session Complete! 🎉</h1>
          <p className="text-slate-500 mb-10">Great work! Here's your session summary.</p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="p-5 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-black text-blue-600">{totalReviewed}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cards Reviewed</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-black text-green-600">{accuracy}%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl">
              <p className="text-2xl font-black text-purple-600">{goodOrBetter}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mastered</p>
            </div>
          </div>

          <button onClick={endReviewSession} className="btn-primary py-4 px-10 w-full">
            Back to Queue
          </button>
        </motion.div>
      </div>
    );
  }

  // Default: Queue view
  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Spaced Repetition</h1>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <Brain size={18} className="text-purple-500" />
            SM-2 Algorithm • {dueNow} cards due now • {cards.length} total in queue
          </p>
        </div>
        <button
          onClick={startReviewSession}
          disabled={dueNow === 0}
          className="btn-primary flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={18} />
          Start Review Session
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="card-glass p-6 text-center">
          <p className="text-3xl font-black text-blue-600">{dueNow}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Due Now</p>
        </div>
        <div className="card-glass p-6 text-center">
          <p className="text-3xl font-black text-orange-500">92%</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Retention Rate</p>
        </div>
        <div className="card-glass p-6 text-center">
          <p className="text-3xl font-black text-green-600">{reviewedTotal}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Streak</p>
        </div>
        <div className="card-glass p-6 text-center">
          <p className="text-3xl font-black text-purple-600">{avgInterval}d</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Avg Interval</p>
        </div>
      </div>

      {/* Review Queue */}
      <div className="card-glass overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
            <RotateCcw size={14} className="text-blue-500" />
            Review Queue
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Sorted by urgency</span>
        </div>
        <div className="divide-y divide-slate-50">
          {cards.map(card => (
            <CardRow key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CardRow = ({ card }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      <div
        className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-5 flex-1">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            card.due === 'Now' ? 'bg-red-500 animate-pulse' :
            card.due.includes('h') ? 'bg-orange-500' : 'bg-slate-300'
          }`} />
          <div className="flex-1">
            <p className="font-semibold text-slate-900 text-sm">{card.question}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{card.topic}</span>
              <span className="text-slate-200">•</span>
              <span className={`text-[10px] font-bold uppercase ${
                card.difficulty === 'Hard' ? 'text-red-500' : card.difficulty === 'Medium' ? 'text-orange-500' : 'text-green-500'
              }`}>{card.difficulty}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className={`text-xs font-bold ${card.due === 'Now' ? 'text-red-500' : 'text-slate-500'}`}>{card.due}</p>
            <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">Streak: {card.streak} • Ease: {card.ease}</p>
          </div>
          <ChevronRight size={16} className={`text-slate-300 transition-transform ${expanded ? 'rotate-90' : ''} group-hover:text-blue-500`} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-5 overflow-hidden"
          >
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Answer</p>
              <p className="text-sm text-slate-700 leading-relaxed">{card.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Revision;
