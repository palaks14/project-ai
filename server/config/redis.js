const Redis = require('ioredis');
require('dotenv').config();

let redis = null;

try {
  const r = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy() { return null; }, // Never retry
  });

  // Suppress ALL error output
  r.on('error', () => {});

  r.connect()
    .then(() => {
      console.log('✅ Redis Connected');
      redis = r;
    })
    .catch(() => {
      console.warn('⚠️  Redis unavailable — AI Jobs & Live Rooms disabled.');
      r.disconnect(false);
    });

} catch (e) {
  // silently skip
}

module.exports = { getRedis: () => redis };
