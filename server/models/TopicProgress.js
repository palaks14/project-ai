const mongoose = require('mongoose');

const topicProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: String, required: true }, // Can be a string or ID depending on syllabus source
  abilityEstimate: { type: Number, default: 0 }, // For IRT adaptive difficulty
  masteryLevel: { type: Number, default: 0 }, // 0 to 100
  nextReviewDate: { type: Date, default: Date.now },
  reviewInterval: { type: Number, default: 1 }, // in days
  easeFactor: { type: Number, default: 2.5 }, // SM-2 parameter
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  lastStudied: { type: Date, default: Date.now }
});

topicProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('TopicProgress', topicProgressSchema);
