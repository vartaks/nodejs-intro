const net = require('net');
const { fromEvent, of } = require('rxjs');
const { map, mergeMap, catchError } = require('rxjs/operators');

const clients = new Set();

const server = net.createServer(socket => {
  console.log('New client connected');
  clients.add(socket);
  socket.write('Welcome to the chat! Type messages and press Enter.\n');

  // Create observable from socket data
  const data$ = fromEvent(socket, 'data').pipe(
    mergeMap(buffer => of(buffer.toString())),
    map(msg => msg.trim()),
    catchError(err => {
      console.error('Stream error:', err);
      return of('[Error in message stream]');
    })
  );

  // Subscribe to incoming messages
  data$.subscribe({
    next: msg => {
      if (msg.toLowerCase() === 'exit') {
        socket.end('Goodbye!\n');
        return;
      }

      const formatted = `Client ${socket.remotePort}: ${msg.toUpperCase()}`;
      console.log(formatted);

      // Broadcast to all clients except sender
      for (let client of clients) {
        if (client !== socket) {
          client.write(`${formatted}\n`);
        }
      }
    },
    error: err => {
      console.error('Subscription error:', err);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
    clients.delete(socket);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
    clients.delete(socket);
  });
});

server.listen(3000, () => {
  console.log('Chat server listening on port 3000');
});
