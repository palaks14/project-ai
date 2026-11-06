# AI Personalized Learning Companion

A production-ready SaaS application for adaptive, AI-driven learning.

## 🚀 Key Features
- **AI Tutoring Engine**: Socratic questioning with GPT-4o.
- **Adaptive Difficulty (IRT)**: Calibrates question difficulty to student ability in real time.
- **Spaced Repetition (SM-2)**: Smart review scheduling for long-term retention.
- **Real-time Study Rooms**: Collaborative rooms with shared Pomodoro timers and chat.
- **Weak Topic Detection**: Visualizes learning gaps using Radar charts.
- **SaaS Ready**: Stripe integration for Free, Pro, and School tiers.

## 🛠️ Tech Stack
- **Frontend**: React 18, Tailwind CSS, Framer Motion, Recharts, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, BullMQ, Redis, MongoDB.
- **AI**: OpenAI GPT-4o (Content/Tutoring), Embeddings.

## ⚙️ Setup
1. **Prerequisites**: Node.js, MongoDB, Redis.
2. **Backend**:
   - `cd server`
   - `npm install`
   - Fill `.env` with your API keys (OpenAI, Stripe, MongoDB, etc.)
   - `node index.js`
3. **Frontend**:
   - `cd client`
   - `npm install`
   - `npm run dev`

## 🎨 Design System
- **Typography**: Inter (Modern sans-serif).
- **Palette**: Slate/Blue (Professional EdTech).
- **Aesthetic**: Minimalist dashboard with glassmorphism cards and smooth animations.

---

