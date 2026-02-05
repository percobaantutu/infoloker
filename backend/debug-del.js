require('dotenv').config();
const redis = require('redis');

const testDel = async () => {
  console.log('Debugging DEL command...');

  let url = process.env.REDIS_URL;
  if (url && url.startsWith('redis://')) {
    url = url.replace('redis://', 'rediss://');
  }

  const client = redis.createClient({ url });
  
  client.on('error', (err) => console.error('Redis Client Error', err));

  try {
    await client.connect();
    console.log('Connected.');

    // Setup keys
    await client.set('test:del:1', 'val');
    await client.set('test:del:2', 'val');

    // Test 1: Passing Array
    console.log('Testing client.del(["key1", "key2"])...');
    try {
      await client.del(['test:del:1', 'test:del:2']);
      console.log('✅ client.del(Array) passed');
    } catch (e) {
      console.error('❌ client.del(Array) failed:', e.message);
    }

    // Reset keys
    await client.set('test:del:1', 'val');
    await client.set('test:del:2', 'val');

    // Test 2: Passing Spread/Varargs
    console.log('Testing client.del("key1", "key2")...');
    try {
      await client.del('test:del:1', 'test:del:2'); // Note: client.del(...['a','b'])
      console.log('✅ client.del(Varargs) passed');
    } catch (e) {
      console.error('❌ client.del(Varargs) failed:', e.message);
    }

    await client.quit();

  } catch (err) {
    console.error('Fatal:', err);
  }
};

testDel();
