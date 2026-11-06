const { getQueue } = require('../services/queue/aiQueue');
const User = require('../models/User');

exports.generateExplanation = async (req, res) => {
  const { topic } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Rate limiting based on tier
    if (user.tier === 'free' && user.aiCreditsUsed >= 3) {
      return res.status(403).json({ message: 'AI limit reached for free tier. Upgrade to Pro.' });
    }

    const aiQueue = getQueue();
    if (!aiQueue) {
      // Fallback: return a simulated response when Redis/queue is unavailable
      user.aiCreditsUsed += 1;
      await user.save();
      return res.json({
        jobId: `fallback_${Date.now()}`,
        message: 'AI explanation generated (fallback mode)',
        result: {
          status: 'completed',
          explanation: `Here is a simplified explanation of "${topic}": This topic involves key concepts that build upon foundational knowledge. Understanding the core principles will help you master this subject.`,
        },
      });
    }

    const job = await aiQueue.add('explain-topic', {
      type: 'EXPLAIN',
      payload: { topic, level: user.learningStyle },
      userId: user._id
    });

    // Update credits
    user.aiCreditsUsed += 1;
    await user.save();

    res.json({ jobId: job.id, message: 'AI job queued successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateQuiz = async (req, res) => {
  const { topic, difficulty } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const aiQueue = getQueue();
    if (!aiQueue) {
      // Fallback: return a simulated quiz when Redis/queue is unavailable
      return res.json({
        jobId: `fallback_${Date.now()}`,
        message: 'Quiz generated (fallback mode)',
        result: {
          status: 'completed',
          quiz: [
            { question: `What is the fundamental principle of ${topic}?`, options: ['A', 'B', 'C', 'D'], correct: 0 },
            { question: `Which of the following best describes ${topic}?`, options: ['A', 'B', 'C', 'D'], correct: 1 },
          ],
        },
      });
    }

    const job = await aiQueue.add('generate-quiz', {
      type: 'QUIZ',
      payload: { topic, difficulty },
      userId: user._id
    });

    res.json({ jobId: job.id, message: 'Quiz generation queued' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobStatus = async (req, res) => {
  const { jobId } = req.params;

  // Handle fallback jobs
  if (jobId.startsWith('fallback_')) {
    return res.json({ status: 'completed', result: { message: 'Completed in fallback mode' } });
  }

  try {
    const aiQueue = getQueue();
    if (!aiQueue) {
      return res.status(503).json({ message: 'Queue service unavailable' });
    }

    const job = await aiQueue.getJob(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const status = await job.getState();
    const result = job.returnvalue;

    res.json({ status, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
