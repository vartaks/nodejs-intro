const net = require('net');
const fs = require('fs');
const { fromEvent, of } = require('rxjs');
const { mergeMap, catchError } = require('rxjs/operators');

const ADMIN_PASSWORD = 'admin123'; // You can change this to any password you want
const clients = new Map(); // socket => nickname
const muted = new Set();   // nicknames that are muted
let adminSocket = null;

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

      const nickname = clients.get(socket);

      // Exit command
      if (msg.toLowerCase() === 'exit') {
        socket.end('Goodbye!\n');
        return;
      }

      // List command
      if (msg.toLowerCase() === '/list') {
        const users = [...clients.values()].join(', ');
        socket.write(`Online users: ${users}\n`);
        return;
      }

      // Admin login
      if (msg.startsWith('/admin ')) {
        const password = msg.split(' ')[1];
        if (password === ADMIN_PASSWORD) {
            adminSocket = socket;
            socket.write('[ADMIN] You are now the admin.\n');
        } else {
            socket.write('Incorrect admin password.\n');
        }
        return;
      }

      // Admin-only: /kick
      if (msg.startsWith('/kick ')) {
        if (socket !== adminSocket) return socket.write('Only admin can kick users.\n');
        const targetName = msg.split(' ')[1];
        const targetSocket = [...clients.entries()].find(([_, name]) => name === targetName)?.[0];
        if (!targetSocket) return socket.write(`User ${targetName} not found.\n`);
        targetSocket.write('You have been kicked by the admin.\n');
        targetSocket.end();
        return;
      }

      // Admin-only: /mute
      if (msg.startsWith('/mute ')) {
        if (socket !== adminSocket) return socket.write('Only admin can mute users.\n');
        const targetName = msg.split(' ')[1];
        if ([...clients.values()].includes(targetName)) {
          muted.add(targetName);
          broadcast(`${targetName} has been muted by the admin.`);
          return;
        }
        return socket.write(`User ${targetName} not found.\n`);
      }

      // Admin-only: /unmute
      if (msg.startsWith('/unmute ')) {
        if (socket !== adminSocket) return socket.write('Only admin can unmute users.\n');
        const targetName = msg.split(' ')[1];
        if (muted.has(targetName)) {
          muted.delete(targetName);
          broadcast(`${targetName} has been unmuted by the admin.`);
          return;
        }
        return socket.write(`User ${targetName} is not muted.\n`);
      }

      // Private message
      if (msg.startsWith('/msg ')) {
        const parts = msg.split(' ');
        const recipientName = parts[1];
        const privateMsg = parts.slice(2).join(' ');
        const recipientSocket = [...clients.entries()].find(([_, name]) => name === recipientName)?.[0];
        if (!recipientSocket) return socket.write(`User ${recipientName} not found.\n`);
        const formatted = `[Private] ${nickname} to ${recipientName}: ${privateMsg}`;
        recipientSocket.write(`${formatted}\n`);
        socket.write(`(to ${recipientName}): ${privateMsg}\n`);
        logMessage(formatted);
        return;
      }

      // Muted check
      if (muted.has(nickname)) {
        socket.write('You are muted and cannot send messages.\n');
        return;
      }

      // Broadcast
      const message = `[${nickname}] ${msg}`;
      broadcast(message, socket);
      logMessage(message);
    }
  });

  socket.on('end', () => {
    const name = clients.get(socket) || 'Unknown';
    if (socket === adminSocket) adminSocket = null;
    clients.delete(socket);
    muted.delete(name);
    broadcast(`${name} has left the chat.`);
    logMessage(`${name} disconnected.`);
  });

  socket.on('error', err => {
    console.error('Socket error:', err);
    clients.delete(socket);
  });
});

function broadcast(message, senderSocket = null) {
  for (let [client] of clients.entries()) {
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
  console.log('Chat server with admin, private messages, mute/kick/list running on port 3000');
});
