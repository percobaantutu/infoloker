const { getRedisClient, isConnected } = require('../config/redis');

/**
 * Invalidates job-related caches.
 * @param {string} jobId - The ID of the specific job (optional).
 */
const invalidateJobCache = async (jobId) => {
  if (!isConnected()) return;

  const client = getRedisClient();

  try {
    // 1. Invalidate ALL list/search queries (Using a pattern scan is heavy, but key tagging is complex in simple Redis)
    // For simpler invalidation with high consistency, we can rely on a namespace approach or just scan.
    // Given the prompt asked for "wiping all job list caches", we will scan for keys starting with jobs:cache:
    
    // Note: In production with millions of keys, SCAN is better. For now, we assume reasonable load.
    // Warning: 'keys' command is blocking, use with care. We will use SCAN if possible, but let's stick to a robust logical approach.
    
    // Strategy: We want to delete `jobs:cache:/api/jobs*`
    
    // Use scanIterator for safer iteration and to avoid "number vs string" cursor issues
    const keysToDelete = [];
    
    for await (const key of client.scanIterator({
      MATCH: 'jobs:cache:*',
      COUNT: 100
    })) {
      keysToDelete.push(key);
      
      // Batch delete to avoid huge commands
      if (keysToDelete.length >= 100) {
        await client.del(...keysToDelete);
        keysToDelete.length = 0;
      }
    }

    // Delete remaining keys
    if (keysToDelete.length > 0) {
      await client.del(...keysToDelete);
    }

    console.log(`Cache Invalidated: Jobs List Cleaned.`);

    // 2. Invalidate specific job detail if ID provided
    if (jobId) {
      // The key format for details would be likely caught by the wildcard above if it starts with jobs:cache:
      // But let's be explicit if we have specific keys for details that might differ?
      // Our middleware uses `jobs:cache:${req.originalUrl}`.
      // A detail URL is `/api/jobs/${id}`. 
      // So logic above (jobs:cache:*) covers EVERYTHING (lists and details).
      // So we are good.
    }

  } catch (err) {
    console.error('Cache Invalidation Error:', err);
  }
};

module.exports = { invalidateJobCache };
