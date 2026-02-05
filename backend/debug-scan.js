require('dotenv').config();
const redis = require('redis');

const testScan = async () => {
  console.log('Debugging SCAN command...');

  let url = process.env.REDIS_URL;
  if (url && url.startsWith('redis://')) {
    url = url.replace('redis://', 'rediss://');
  }

  const client = redis.createClient({ url });
  
  client.on('error', (err) => console.error('Redis Client Error', err));

  try {
    await client.connect();
    console.log('Connected.');

    // 1. Reproduce: Pass number 0
    console.log('Testing client.scan(0)...');
    try {
      await client.scan(0, { MATCH: 'test:*', COUNT: 100 });
      console.log('✅ client.scan(0) passed');
    } catch (e) {
      console.error('❌ client.scan(0) failed:', e.message);
    }

    // 2. Test: Pass string "0"
    console.log('Testing client.scan("0")...');
    try {
      await client.scan('0', { MATCH: 'test:*', COUNT: 100 });
      console.log('✅ client.scan("0") passed');
    } catch (e) {
      console.error('❌ client.scan("0") failed:', e.message);
    }

    // 3. Test: scanIterator
    console.log('Testing client.scanIterator()...');
    try {
      const iterator = client.scanIterator({ MATCH: 'test:*', COUNT: 100 });
      for await (const key of iterator) {
        // just loop
      }
      console.log('✅ client.scanIterator() passed');
    } catch (e) {
      console.error('❌ client.scanIterator() failed:', e.message);
    }

    await client.quit();

  } catch (err) {
    console.error('Fatal:', err);
  }
};

testScan();
