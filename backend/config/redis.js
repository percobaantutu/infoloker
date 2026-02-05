const redis = require('redis');

let redisClient;
let isRedisConnected = false;

const initializeRedis = async () => {
  if (process.env.ENABLE_CACHE !== 'true') {
    console.log('Redis caching is disabled via ENABLE_CACHE');
    return;
  }

  try {
    // Ensure text "redis://" is replaced with "rediss://" for Upstash/TLS support
    let url = process.env.REDIS_URL;
    if (url && url.startsWith('redis://')) {
      url = url.replace('redis://', 'rediss://');
    }

    redisClient = redis.createClient({
      url: url,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis: Max retries exhausted. Caching will be disabled.');
            return new Error('Max retries exhausted');
          }
          const delay = Math.min(retries * 500, 2000);
          console.log(`Redis: Reconnecting in ${delay}ms...`);
          return delay;
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      isRedisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
      isRedisConnected = true;
    });

    redisClient.on('ready', () => {
      console.log('Redis Client Ready');
      isRedisConnected = true;
    });

    redisClient.on('end', () => {
      console.log('Redis Client Disconnected');
      isRedisConnected = false;
    });

    await redisClient.connect();

  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    isRedisConnected = false;
  }
};

// Initialize connectivity immediately but don't block app startup if it fails
initializeRedis();

const getRedisClient = () => redisClient;

const isConnected = () => isRedisConnected;

module.exports = {
  getRedisClient,
  isConnected
};
