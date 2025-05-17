const net = require('net');
const { fromEvent, of } = require('rxjs');
const { map, mergeMap, catchError } = require('rxjs/operators');

// Create a TCP server
const server = net.createServer(socket => {
  console.log('Client connected');

  // Observable from 'data' event
  const data$ = fromEvent(socket, 'data').pipe(
    mergeMap(buffer => of(buffer.toString())),     // convert Buffer to string
    map(line => line.trim().toUpperCase()),        // transform data
    catchError(err => {
      console.error('Stream error:', err);
      return of('ERROR OCCURRED');
    })
  );

  // Subscribe to the stream
  data$.subscribe({
    next: line => {
      console.log('Processed:', line);
      socket.write(`Echo: ${line}\n`);
    },
    error: err => console.error('Subscription error:', err),
    complete: () => console.log('Client stream ended')
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
