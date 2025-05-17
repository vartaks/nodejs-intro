const fs = require('fs');

// Synchronous directory read
const filesSync = fs.readdirSync('./');
console.log('Synchronous read:', filesSync);

// Asynchronous directory read
fs.readdir('./', (err, filesAsync) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  console.log('Asynchronous read:', filesAsync);
});
