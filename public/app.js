const config = {
  apiKey: "AIzaSyAfaoerSBPvFEnK8aAj2jMkwQuMgL6Vejw",
  authDomain: "test-firestore-1c6df.firebaseapp.com",
  databaseURL: "https://test-firestore-1c6df.firebaseio.com",
  projectId: "test-firestore-1c6df",
  storageBucket: "test-firestore-1c6df.appspot.com",
  messagingSenderId: "88436282463"
};
firebase.initializeApp(config);
const db = firebase.database();
const chatsRef = db.ref('/chats');

const chatForm = document.querySelector('form');
const textBox = document.querySelector('textarea');
const chats = document.querySelector('ul');
const sessionId = Math.floor(Math.random()*1001);

chatForm.addEventListener('submit', handleMessageSubmit);
textBox.addEventListener('keydown', handleKeyDown);

function handleMessageSubmit(e) {
  e.preventDefault();
  
  if (!textBox.value) {
    return;
  }

  db.ref('chats').push({
    userId: sessionId,
    message: textBox.value
  });
  
  textBox.value = '';
}

function handleKeyDown(e) {
  if (e.keyCode == 13) {
    handleSubmit(e);
    e.preventDefault();
  }
}