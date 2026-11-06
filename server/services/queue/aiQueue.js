const { Queue } = require('bullmq');
const { getRedis } = require('../../config/redis');

let aiQueue = null;

// Only create queue if Redis becomes available
setTimeout(() => {
  const redis = getRedis();
  if (redis) {
    aiQueue = new Queue('ai-jobs', { connection: redis });
    console.log('✅ AI Queue ready');
  }
}, 3000);

module.exports = { getQueue: () => aiQueue };
