const chatForm = document.querySelector('form');
const textBox = document.querySelector('textarea');
const chats = document.querySelector('ul');
const sessionId = Math.floor(Math.random()*1001);

chatForm.addEventListener('submit', handleMessageSubmit);
textBox.addEventListener('keydown', handleKeyDown);

function handleMessageSubmit(e) {
  e.preventDefault();
  console.log('message submit', textBox.value);
}

function handleKeyDown(e) {
  if (e.which == 13) {
    handleSubmit(e);
  }
}