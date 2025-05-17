const fs = require('fs').promises;
const EventEmitter = require('events');

// 1. Custom EventEmitter
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// 2. Async Generator to simulate data streaming
async function* lineStreamer(lines) {
  for (const line of lines) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    yield line.toUpperCase(); // Transform data
  }
}

// 3. Main async function using async/await
async function processFile() {
  try {
    // Read file using Promise (async/await)
    const data = await fs.readFile('sample.txt', 'utf-8');
    const lines = data.split('\n');

    // Emit custom event
    myEmitter.emit('start', lines.length);

    // Use async iterator to stream transformed data
    for await (const line of lineStreamer(lines)) {
      console.log('Processed line:', line);
    }

    myEmitter.emit('end');

  } catch (err) {
    console.error('Error:', err);
  }
}

// 4. Listen to events
myEmitter.on('start', count => {
  console.log(`Started processing ${count} lines.`);
});

myEmitter.on('end', () => {
  console.log('Processing complete.');
});

// Run it
processFile();
