const http = require('http');

/*
  Simple script to test the Caching behavior.
  It makes two sequential requests to the jobs endpoint.
*/

const url = 'http://localhost:8000/api/jobs';

const makeRequest = (label, callback) => {
  const start = Date.now();
  const req = http.get(url, (res) => {
    // Consume data to complete request
    res.resume();
    res.on('end', () => {
      const duration = Date.now() - start;
      const cacheStatus = res.headers['x-cache'] || 'NOT SET';
      console.log(`${label}:`);
      console.log(`  - Status: ${res.statusCode}`);
      console.log(`  - Cache Header (X-Cache): ${cacheStatus}`);
      console.log(`  - Time Taken: ${duration}ms`);
      console.log('--------------------------------------------------');
      if (callback) callback();
    });
  });
  
  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });
};

console.log('Starting Cache Test...\n');

// 1. First Request (Expect MISS)
makeRequest('Request 1 (Cold Start)', () => {
  
  // 2. Second Request (Expect HIT)
  setTimeout(() => {
     makeRequest('Request 2 (After Cache)', () => {
       console.log('Test Complete.');
    });
  }, 1000);
  
});
