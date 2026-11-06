const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'parent', 'admin'], 
    default: 'student' 
  },
  avatar: { type: String },
  subjects: [{ type: String }],
  goals: { type: String },
  examDates: [{
    subject: String,
    date: Date
  }],
  learningStyle: { 
    type: String, 
    enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
    default: 'visual'
  },
  tier: { 
    type: String, 
    enum: ['free', 'pro', 'school'], 
    default: 'free' 
  },
  stripeCustomerId: { type: String },
  aiCreditsUsed: { type: Number, default: 0 },
  streakCount: { type: Number, default: 0 },
  freezeTokens: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
