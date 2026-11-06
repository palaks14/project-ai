const TopicProgress = require('../models/TopicProgress');
const { calculateSM2 } = require('../services/spacedRepetition/sm2');
const { updateAbilityEstimate } = require('../services/irt/adaptive');

exports.logSession = async (req, res) => {
  const { topicId, duration, confidenceRating, isCorrect } = req.body;
  const userId = req.user.id;

  try {
    let progress = await TopicProgress.findOne({ userId, topicId });
    if (!progress) {
      progress = new TopicProgress({ userId, topicId });
    }

    // Update SM-2 (Spaced Repetition)
    const { interval, easeFactor, repetitions } = calculateSM2(
      confidenceRating, 
      progress.reviewInterval, 
      progress.easeFactor, 
      progress.correctCount
    );

    progress.reviewInterval = interval;
    progress.easeFactor = easeFactor;
    progress.nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

    // Update IRT (Adaptive Difficulty)
    if (isCorrect !== undefined) {
      // Assuming a middle difficulty of 0 for the session if not specified
      progress.abilityEstimate = updateAbilityEstimate(progress.abilityEstimate, 0, isCorrect ? 1 : 0);
      if (isCorrect) progress.correctCount += 1;
      else progress.incorrectCount += 1;
    }

    progress.lastStudied = new Date();
    // Simplified mastery calculation
    progress.masteryLevel = Math.min(100, (progress.correctCount / (progress.correctCount + progress.incorrectCount || 1)) * 100);

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRevisionQueue = async (req, res) => {
  try {
    const queue = await TopicProgress.find({
      userId: req.user.id,
      nextReviewDate: { $lte: new Date() }
    }).sort({ nextReviewDate: 1 }).limit(20);

    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
