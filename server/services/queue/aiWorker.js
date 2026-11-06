const { Worker } = require('bullmq');
const { getRedis } = require('../../config/redis');
require('dotenv').config();

// Only start worker if Redis is available
setTimeout(() => {
  const redis = getRedis();
  if (!redis) return;

  const worker = new Worker('ai-jobs', async (job) => {
    const { type, payload, userId } = job.data;
    console.log(`Processing AI job: ${type} for user ${userId}`);

    try {
      // Placeholder — OpenAI integration goes here
      return { status: 'completed', type, userId };
    } catch (error) {
      console.error('AI Worker Error:', error);
      throw error;
    }
  }, { connection: redis });

  console.log('✅ AI Worker ready');
}, 3000);

module.exports = {};
