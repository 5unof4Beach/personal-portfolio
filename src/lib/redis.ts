import { createClient } from 'redis';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

// Connect to Redis
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Function to get Redis client (connects if not connected)
export async function getRedisClient() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}

// Cache data with expiration time
export async function cacheData(key: string, data: unknown, expirationInSeconds = 3600) {
  try {
    const client = await getRedisClient();
    await client.set(key, JSON.stringify(data), {
      EX: expirationInSeconds,
    });
    return true;
  } catch (error) {
    console.error('Redis caching error:', error);
    return false;
  }
}

// Get cached data
export async function getCachedData(key: string) {
  try {
    const client = await getRedisClient();
    const cachedData = await client.get(key);
    
    if (!cachedData) {
      return null;
    }
    
    return JSON.parse(cachedData);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

// Delete cached data
export async function deleteCachedData(key: string) {
  try {
    const client = await getRedisClient();
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}

// Delete cached data by pattern
export async function deleteCachedDataByPattern(pattern: string) {
  try {
    const client = await getRedisClient();
    const keys = await client.keys(pattern);
    
    if (keys.length > 0) {
      await client.del(keys);
    }
    
    return true;
  } catch (error) {
    console.error('Redis delete by pattern error:', error);
    return false;
  }
}

// Check and increment rate limit for login attempts
export async function checkRateLimit(
  key: string, // This can be an IP address or email or both combined
  maxAttempts = 5,
  windowInSeconds = 60 * 60 * 24 * 3 // 3 days window
): Promise<{ success: boolean; attemptsLeft: number; resetInSeconds: number | null }> {
  try {
    const client = await getRedisClient();
    
    // Check if the key exists
    const attempts = await client.get(key);
    const currentAttempts = attempts ? parseInt(attempts, 10) : 0;
    
    if (currentAttempts >= maxAttempts) {
      // Get the remaining time for the key
      const ttl = await client.ttl(key);
      return {
        success: false,
        attemptsLeft: 0,
        resetInSeconds: ttl,
      };
    }
    
    // Increment the counter
    await client.incr(key);
    
    // Set expiration if it's the first attempt
    if (currentAttempts === 0) {
      await client.expire(key, windowInSeconds);
    }
    
    // Get the updated TTL
    const ttl = await client.ttl(key);
    
    return {
      success: true,
      attemptsLeft: maxAttempts - (currentAttempts + 1),
      resetInSeconds: ttl,
    };
  } catch (error) {
    console.error('Redis rate limit error:', error);
    // If Redis fails, allow the request to proceed
    return {
      success: true,
      attemptsLeft: 1,
      resetInSeconds: null,
    };
  }
}

// Reset rate limit for a specific identifier
export async function resetRateLimit(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis reset rate limit error:', error);
    return false;
  }
}
