import { create } from 'zustand';

// Realistic demo data for the study store
const demoCards = [
  { id: 1, question: "What is Schrödinger's equation?", answer: "iħ ∂/∂t |Ψ(t)⟩ = Ĥ |Ψ(t)⟩ — It describes how the quantum state of a physical system changes over time.", topic: 'Quantum Mechanics', difficulty: 'Hard', due: 'Now', streak: 3, interval: 2, ease: 2.5 },
  { id: 2, question: 'Define the second law of thermodynamics', answer: 'The total entropy of an isolated system can never decrease. In any spontaneous process, the total entropy always increases or remains constant.', topic: 'Thermodynamics', difficulty: 'Medium', due: 'Now', streak: 5, interval: 4, ease: 2.8 },
  { id: 3, question: 'What is an eigenvalue?', answer: 'A scalar λ such that Av = λv for a non-zero vector v. It represents the factor by which the eigenvector is scaled during a linear transformation.', topic: 'Linear Algebra', difficulty: 'Easy', due: 'In 1h', streak: 7, interval: 7, ease: 3.1 },
  { id: 4, question: 'Explain electromagnetic induction', answer: "Faraday's law: A changing magnetic flux through a circuit induces an electromotive force (EMF). EMF = -dΦ/dt.", topic: 'Electromagnetism', difficulty: 'Hard', due: 'In 3h', streak: 2, interval: 1, ease: 2.2 },
  { id: 5, question: 'What are sp3 hybrid orbitals?', answer: 'When one s and three p orbitals hybridize to form four equivalent sp3 orbitals arranged tetrahedrally (109.5° bond angle). Example: methane (CH₄).', topic: 'Organic Chemistry', difficulty: 'Medium', due: 'Tomorrow', streak: 4, interval: 3, ease: 2.6 },
  { id: 6, question: 'Derive the Taylor series expansion', answer: 'f(x) = Σ [f⁽ⁿ⁾(a)/n!] × (x-a)ⁿ for n=0 to ∞. It approximates functions as infinite polynomials around point a.', topic: 'Calculus II', difficulty: 'Hard', due: 'Tomorrow', streak: 1, interval: 1, ease: 2.1 },
  { id: 7, question: "What is Gauss's Law?", answer: "The electric flux through any closed surface equals the net charge enclosed divided by ε₀: ∮E·dA = Q_enc/ε₀.", topic: 'Electromagnetism', difficulty: 'Medium', due: 'Oct 26', streak: 6, interval: 5, ease: 2.9 },
  { id: 8, question: "Explain Le Chatelier's principle", answer: 'If a system at equilibrium is disturbed, it shifts in the direction that tends to reduce the effect of the disturbance and restore equilibrium.', topic: 'Inorganic Chemistry', difficulty: 'Easy', due: 'Oct 27', streak: 8, interval: 10, ease: 3.2 },
];

const demoModules = [
  { id: 1, name: 'Classical Mechanics', topics: 8, completed: 8, status: 'done' },
  { id: 2, name: 'Thermodynamics', topics: 6, completed: 6, status: 'done' },
  { id: 3, name: 'Electromagnetism', topics: 10, completed: 7, status: 'active' },
  { id: 4, name: 'Quantum Mechanics', topics: 12, completed: 3, status: 'active' },
  { id: 5, name: 'Optics & Waves', topics: 7, completed: 0, status: 'locked' },
  { id: 6, name: 'Nuclear Physics', topics: 5, completed: 0, status: 'locked' },
  { id: 7, name: 'Organic Chemistry', topics: 9, completed: 9, status: 'done' },
  { id: 8, name: 'Inorganic Chemistry', topics: 6, completed: 4, status: 'active' },
  { id: 9, name: 'Calculus II', topics: 8, completed: 8, status: 'done' },
  { id: 10, name: 'Linear Algebra', topics: 7, completed: 2, status: 'active' },
  { id: 11, name: 'Probability & Statistics', topics: 6, completed: 0, status: 'locked' },
  { id: 12, name: 'Data Structures', topics: 10, completed: 0, status: 'locked' },
];

const demoGroups = [
  { id: 1, name: 'Physics Masterclass', members: ['Sarah J.', 'Alex M.', 'Jordan K.', 'Priya S.'], topic: 'Quantum Mechanics', active: true, streak: 8 },
  { id: 2, name: 'Calculus Warriors', members: ['Sarah J.', 'Mike T.', 'Emma L.'], topic: 'Advanced Calculus', active: true, streak: 12 },
  { id: 3, name: 'Chemistry Lab Prep', members: ['Sarah J.', 'Nina R.', 'Sam B.', 'Leo C.', 'Zara K.'], topic: 'Organic Chemistry', active: false, streak: 5 },
  { id: 4, name: 'Linear Algebra Squad', members: ['Sarah J.', 'David W.'], topic: 'Linear Algebra', active: false, streak: 3 },
];

const demoActivity = [
  { emoji: '🧪', text: 'Completed "Quantum Mechanics" Quiz — 92% Score', time: '2 hours ago' },
  { emoji: '🤖', text: "AI Tutor: Schrödinger's Equation session finished", time: '4 hours ago' },
  { emoji: '📤', text: 'Shared "Advanced Calculus" notes with study group', time: 'Yesterday' },
  { emoji: '🏆', text: 'Achieved 10-day study streak badge', time: '2 days ago' },
];

const demoNotifications = [
  { id: 1, type: 'review', title: 'Quantum Mechanics review due', message: '2 cards are due for review now', time: '5m ago', read: false },
  { id: 2, type: 'group', title: 'Alex M. sent a message', message: 'Can someone explain the uncertainty principle?', time: '10m ago', read: false },
  { id: 3, type: 'streak', title: 'Streak milestone! 🔥', message: "You've maintained a 12-day study streak!", time: '1h ago', read: false },
  { id: 4, type: 'ai', title: 'AI Tutor recommendation', message: 'Your mastery in Electromagnetism has improved. Try a harder topic.', time: '2h ago', read: true },
  { id: 5, type: 'badge', title: 'New badge earned! 🏆', message: 'You earned the "Quiz Master" badge', time: '1d ago', read: true },
];

const demoRoadmap = [
  {
    id: 1,
    title: "The Foundation: Modern Frontend",
    status: "active",
    start: "2026-05-01",
    end: "2026-06-01",
    tasks: [
      { id: 11, text: "Master HTML5 & Semantic Tags", completed: true },
      { id: 12, text: "Advanced CSS & Responsive Design", completed: true },
      { id: 13, text: "JavaScript ES6+ Fundamentals", completed: false },
      { id: 14, text: "React Hooks & State Management", completed: false },
    ],
    guidance: "Focus on building 3 responsive landing pages this week."
  },
  {
    id: 2,
    title: "Backend & Systems",
    status: "locked",
    start: "2026-06-02",
    end: "2026-07-15",
    tasks: [
      { id: 21, text: "Node.js & Express API Design", completed: false },
      { id: 22, text: "MongoDB & Data Modeling", completed: false },
      { id: 23, text: "Authentication & JWT", completed: false },
    ],
    guidance: "Start by understanding REST architecture."
  },
  {
    id: 3,
    title: "Placement Readiness",
    status: "locked",
    start: "2026-07-16",
    end: "2026-08-30",
    tasks: [
      { id: 31, text: "DSA: Arrays, Strings, Recursion", completed: false },
      { id: 32, text: "GitHub Portfolio Cleanup", completed: false },
      { id: 33, text: "Mock Interview Practice", completed: false },
    ],
    guidance: "Contribute to 2 open source projects during this phase."
  }
];

const demoTimetable = [
  { day: 'Monday', classes: [{ time: '09:00 - 11:00', name: 'Database Systems', type: 'college' }, { time: '14:00 - 16:00', name: 'Computer Networks', type: 'college' }], studyBlocks: [{ time: '18:00 - 20:00', name: 'DSA Practice', focus: 'Arrays' }] },
  { day: 'Tuesday', classes: [{ time: '10:00 - 12:00', name: 'Operating Systems', type: 'college' }], studyBlocks: [{ time: '16:00 - 18:00', name: 'Frontend Dev', focus: 'React Hooks' }, { time: '20:00 - 21:30', name: 'LinkedIn Networking', focus: 'Profile Optimization' }] },
  { day: 'Wednesday', classes: [{ time: '09:00 - 11:00', name: 'Software Eng', type: 'college' }], studyBlocks: [{ time: '15:00 - 17:00', name: 'Full Stack Project', focus: 'Auth System' }] },
];

const useStudyStore = create((set, get) => ({
  // Dashboard stats
  stats: {
    streakCount: 12,
    masteryScore: 84.2,
    timeFocused: 48.5,
    abilityLevel: 4.2,
    xp: 480,
    cgpaGoal: 9.5,
  },

  // Career & Roadmap
  careerGoal: "Full Stack Web Developer",
  roadmap: demoRoadmap,
  timetable: demoTimetable,
  skills: [
    { name: 'JavaScript', level: 85, trend: 'up' },
    { name: 'DSA', level: 40, trend: 'neutral' },
    { name: 'Communication', level: 60, trend: 'up' },
    { name: 'Git/GitHub', level: 75, trend: 'up' },
  ],
  projects: [
    { name: 'E-commerce Platform', progress: 40, status: 'active' },
    { name: 'Real-time Chat App', progress: 0, status: 'upcoming' },
  ],

  // Review cards
  cards: demoCards,
  reviewedCards: [],

  // Curriculum modules
  modules: demoModules,

  // Study groups
  groups: demoGroups,

  // Activity
  activity: demoActivity,

  // Notifications
  notifications: demoNotifications,
  unreadCount: 3,

  // Search
  searchQuery: '',
  searchResults: [],

  // Review session
  reviewSession: {
    active: false,
    currentIndex: 0,
    showAnswer: false,
    scores: [],
  },

  // Actions
  setCareerGoal: (goal) => set({ careerGoal: goal }),
  
  updateRoadmap: (newRoadmap) => set({ roadmap: newRoadmap }),
  
  toggleTask: (phaseId, taskId) => {
    const { roadmap } = get();
    const updated = roadmap.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return phase;
    });
    set({ roadmap: updated });
  },

  setTimetable: (timetable) => set({ timetable }),

  setSearchQuery: (query) => {
    const q = query.toLowerCase();
    const { modules, cards, groups } = get();
    const results = [];

    modules.forEach(m => {
      if (m.name.toLowerCase().includes(q)) results.push({ type: 'module', data: m });
    });
    cards.forEach(c => {
      if (c.question.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q)) results.push({ type: 'card', data: c });
    });
    groups.forEach(g => {
      if (g.name.toLowerCase().includes(q) || g.topic.toLowerCase().includes(q)) results.push({ type: 'group', data: g });
    });

    set({ searchQuery: query, searchResults: results.slice(0, 8) });
  },

  clearSearch: () => set({ searchQuery: '', searchResults: [] }),

  markNotificationRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter(n => !n.read).length };
    });
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  // Review session actions
  startReviewSession: () => {
    const dueCards = get().cards.filter(c => c.due === 'Now' || c.due.includes('h'));
    if (dueCards.length === 0) return;
    set({
      reviewSession: {
        active: true,
        currentIndex: 0,
        showAnswer: false,
        scores: [],
        dueCards,
      },
    });
  },

  toggleShowAnswer: () => {
    set((state) => ({
      reviewSession: { ...state.reviewSession, showAnswer: !state.reviewSession.showAnswer },
    }));
  },

  rateCard: (quality) => {
    const { reviewSession, cards } = get();
    const { dueCards, currentIndex, scores } = reviewSession;
    const currentCard = dueCards[currentIndex];

    const newScores = [...scores, { cardId: currentCard.id, quality }];
    const newEase = Math.max(1.3, currentCard.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    const newInterval = quality >= 3 ? Math.round(currentCard.interval * newEase) : 1;
    const dueMap = { 1: 'Now', 2: 'In 1h', 3: 'Tomorrow', 4: `In ${newInterval}d` };

    const updatedCards = cards.map(c =>
      c.id === currentCard.id
        ? { ...c, ease: +newEase.toFixed(2), interval: newInterval, due: dueMap[quality] || 'Tomorrow', streak: quality >= 3 ? c.streak + 1 : 0 }
        : c
    );

    const nextIndex = currentIndex + 1;
    if (nextIndex >= dueCards.length) {
      set({
        cards: updatedCards,
        reviewSession: { active: false, currentIndex: 0, showAnswer: false, scores: newScores },
        reviewedCards: [...get().reviewedCards, ...dueCards.map(c => c.id)],
      });
    } else {
      set({
        cards: updatedCards,
        reviewSession: { ...reviewSession, currentIndex: nextIndex, showAnswer: false, scores: newScores, dueCards },
      });
    }
  },

  endReviewSession: () => {
    set({ reviewSession: { active: false, currentIndex: 0, showAnswer: false, scores: [] } });
  },

  createGroup: (name, topic) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newGroup = {
      id: Date.now(),
      name,
      members: [user.name || 'You'],
      topic,
      active: false,
      streak: 0,
    };
    set((state) => ({ groups: [newGroup, ...state.groups] }));
  },

  incrementStreak: () => {
    set((state) => ({
      stats: { ...state.stats, streakCount: state.stats.streakCount + 1 },
    }));
  },

  addActivity: (emoji, text) => {
    const activity = [{ emoji, text, time: 'Just now' }, ...get().activity].slice(0, 10);
    set({ activity });
  },
}));

export default useStudyStore;
