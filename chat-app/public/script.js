const socket = new WebSocket('ws://localhost:3000');
const chat = document.getElementById('chat');
const input = document.getElementById('input');

// Append messages to the chat box
function appendMessage(text) {
  const msg = document.createElement('div');
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// Incoming messages
socket.onmessage = e => appendMessage(e.data);

// Send message on Enter
input.addEventListener('keypress', e => {
  if (e.key === 'Enter' && input.value.trim()) {
    socket.send(input.value.trim());
    input.value = '';
  }
});
