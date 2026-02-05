require('dotenv').config();
const redis = require('redis');

const testRedis = async () => {
  console.log('Testing Redis Connection...');
  console.log('URL:', process.env.REDIS_URL?.split('@')[1]); // Log only host part for safety

  // Fix URL scheme for Upstash (must be rediss:// for TLS)
  let url = process.env.REDIS_URL;
  if (url && url.startsWith('redis://')) {
    url = url.replace('redis://', 'rediss://');
  }

  const client = redis.createClient({
    url: url
  });

  client.on('error', (err) => console.error('Redis Client Error', err));

  try {
    await client.connect();
    console.log('✅ Redis Connected!');

    await client.set('test_key', 'Hello Redis');
    const value = await client.get('test_key');
    console.log('✅ Read Value:', value);

    await client.del('test_key');
    console.log('✅ Key Deleted');

    await client.quit();
    console.log('✅ Test Complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Check failed:', err);
    process.exit(1);
  }
};

testRedis();
