const net = require('net');
const fs = require('fs');
const { fromEvent, of } = require('rxjs');
const { map, mergeMap, catchError } = require('rxjs/operators');

const clients = new Map(); // socket => nickname
const logStream = fs.createWriteStream('chat.log', { flags: 'a' });

const server = net.createServer(socket => {
  socket.write('Welcome! Please enter your nickname:\n');

  let nicknameSet = false;

  const data$ = fromEvent(socket, 'data').pipe(
    mergeMap(buffer => of(buffer.toString().trim())),
    catchError(err => {
      console.error('Stream error:', err);
      return of('[Stream Error]');
    })
  );

  data$.subscribe({
    next: msg => {
      if (!nicknameSet) {
        if (msg.length === 0 || [...clients.values()].includes(msg)) {
          socket.write('Invalid or duplicate nickname. Try another:\n');
          return;
        }
        clients.set(socket, msg);
        nicknameSet = true;
        socket.write(`Hi ${msg}! You can now chat. Type 'exit' to leave.\n`);
        broadcast(`${msg} has joined the chat.`, socket);
        return;
      }

      if (msg.toLowerCase() === 'exit') {
        socket.end('Goodbye!\n');
        return;
      }

      if (msg.toLowerCase() === '/list') {
        const users = [...clients.values()].join(', ');
        socket.write(`Online users: ${users}\n`);
        return;
      }

      if (msg.toLowerCase().startsWith('/msg ')) {
        const parts = msg.split(' ');
        const recipientName = parts[1];
        const privateMsg = parts.slice(2).join(' ');

        const recipientSocket = [...clients.entries()].find(([_, name]) => name === recipientName)?.[0];

        if (!recipientSocket) {
          socket.write(`User "${recipientName}" not found.\n`);
          return;
        }

        const senderName = clients.get(socket);
        const formatted = `[Private] ${senderName} to ${recipientName}: ${privateMsg}`;
        recipientSocket.write(`${formatted}\n`);
        socket.write(`(to ${recipientName}): ${privateMsg}\n`);
        logMessage(formatted);
        return;
      }

      // Default: broadcast
      const nickname = clients.get(socket);
      const message = `[${nickname}] ${msg}`;
      broadcast(message, socket);
      logMessage(message);
    },
    error: err => {
      console.error('Client stream error:', err);
    }
  });

  socket.on('end', () => {
    const name = clients.get(socket) || 'Unknown';
    clients.delete(socket);
    broadcast(`${name} has left the chat.`);
    logMessage(`${name} disconnected.`);
  });

  socket.on('error', err => {
    console.error('Socket error:', err);
    clients.delete(socket);
  });
});

function broadcast(message, senderSocket = null) {
  for (let [client, _] of clients.entries()) {
    if (client !== senderSocket) {
      client.write(`${message}\n`);
    }
  }
  console.log(message);
}

function logMessage(message) {
  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] ${message}\n`);
}

server.listen(3000, () => {
  console.log('Chat server with broadcast, /msg, and /list running on port 3000');
});
