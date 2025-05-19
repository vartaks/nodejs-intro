const socket = new WebSocket('ws://localhost:3000');
const chat = document.getElementById('chat');
const input = document.getElementById('input');
const userList = document.getElementById('user-list');

function appendMessage(text) {
  const msg = document.createElement('div');
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

socket.onmessage = e => {
  const message = e.data;

  // Check if it's a user list
  if (message.startsWith('[USERS]')) {
    const names = message.replace('[USERS]', '').trim().split(',');
    userList.innerHTML = '';
    names.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      userList.appendChild(li);
    });
  } else {
    appendMessage(message);
  }
};

input.addEventListener('keypress', e => {
  if (e.key === 'Enter' && input.value.trim()) {
    socket.send(input.value.trim());
    input.value = '';
  }
});
