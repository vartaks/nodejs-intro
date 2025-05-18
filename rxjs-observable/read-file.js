const fs = require('fs').promises;
const EventEmitter = require('events');
const { from, of } = require('rxjs');
const { map, delay, concatMap, catchError } = require('rxjs/operators');

// Event emitter setup
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// RxJS observable pipeline
function streamLinesRxJS(lines) {
  return from(lines).pipe(
    concatMap(line => of(line).pipe(delay(500))), // simulate async delay
    map(line => line.toUpperCase()),              // transform line
    catchError(err => {
      console.error('Stream error:', err);
      return of('ERROR OCCURRED');
    })
  );
}

// Main async function
async function processFileRxJS() {
  try {
    const data = await fs.readFile('sample.txt', 'utf-8');
    const lines = data.split('\n');

    myEmitter.emit('start', lines.length);

    const observable = streamLinesRxJS(lines);

    // Subscribe to observable
    observable.subscribe({
      next: line => console.log('Processed:', line),
      complete: () => myEmitter.emit('end'),
      error: err => console.error('Unhandled error:', err)
    });

  } catch (err) {
    console.error('File read error:', err);
  }
}

// Event listeners
myEmitter.on('start', count => {
  console.log(`Started processing ${count} lines.`);
});

myEmitter.on('end', () => {
  console.log('Processing complete.');
});

// Run it
processFileRxJS();
