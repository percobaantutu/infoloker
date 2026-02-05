const { getRedisClient, isConnected } = require('../config/redis');

// Helper to generate consistent cache keys
const generateKey = (req) => {
  // Use the full URL (including query lines) as the key
  // e.g., jobs:list:/api/jobs?page=1&type=full-time
  const safeUrl = req.originalUrl || req.url; 
  return `jobs:cache:${safeUrl}`;
};

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // 1. Fail-Safe: If Redis is down or caching disabled, skip entirely
    if (process.env.ENABLE_CACHE !== 'true' || !isConnected()) {
      return next();
    }

    // 2. Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = generateKey(req);
    const redisClient = getRedisClient();

    try {
      // 3. Check Cache
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        // HIT
        res.set('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }

      // MISS (Intercept res.json)
      res.set('X-Cache', 'MISS');
      const originalJson = res.json;

      res.json = (body) => {
        // Restore original method
        res.json = originalJson;

        // Store in Redis (dont await to avoid blocking response)
        // Set Expiry (TTL)
        if (res.statusCode === 200) {
           redisClient.setEx(key, duration, JSON.stringify(body)).catch(err => {
             console.error('Redis Set Error:', err);
           });
        }

        // Send response
        return res.json(body);
      };

      next();

    } catch (err) {
      console.error('Redis Middleware Error:', err);
      // Fail-safe: proceed without caching
      next();
    }
  };
};

module.exports = cacheMiddleware;
