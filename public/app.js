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
chatsRef.on('child_added', handleChildAdded);

const chatContainer = document.querySelector('.chat-container');
const chatForm = document.querySelector('form');
const textBox = document.querySelector('textarea');
const chats = document.querySelector('ul');

const loginContainer = document.querySelector('.login-container');
const loginButton = document.querySelector('#login-button');
const loginEmail = document.querySelector('#login-email');
const loginPassword = document.querySelector('#login-password');
const logoutButton = document.querySelector('#logout-button');    

let chatState = 'loging';
let chatUser = null;
handleUIChanges();

firebase.auth().onAuthStateChanged(function (user) {
  console.log(user);
  chatUser = user;
  chatState = user ? 'chat' : 'login';  
  handleUIChanges();
});

chatForm.addEventListener('submit', handleMessageSubmit);
textBox.addEventListener('keydown', handleKeyDown);
loginButton.addEventListener('click', handleLogin);
logoutButton.addEventListener('click', handleLogout);

function handleLogin(e) {
  e.preventDefault();
  if (loginEmail.value && loginPassword.value) {
    console.log('try to login', loginEmail.value, loginPassword.value);    
    firebase.auth().signInWithEmailAndPassword(loginEmail.value, loginPassword.value);
  }
}

function handleLogout(e) {
  e.preventDefault();
  firebase.auth().signOut().then(function() {
    chatUser = null;
    chatState = 'login';
    handleUIChanges();
  });
}

function handleMessageSubmit(e) {
  e.preventDefault();
  
  if (!textBox.value) {
    return;
  }

  db.ref('chats').push({
    userId: chatUser.uid,
    message: textBox.value
  });
  
  textBox.value = '';
}

function handleChildAdded(data) {
  const messageData = data.val();
  const li = document.createElement('li');
  
  li.innerHTML = messageData.message;
  
  if (messageData.userId !== chatUser.uid) {
    li.classList.add('other');
  }
  
  chats.appendChild(li);
  chats.scrollTop = chats.scrollHeight;
}


function handleUIChanges() {
  switch (chatState) {
    case 'chat':
      chatContainer.classList.remove('hide');
      logoutButton.classList.remove('hide');
      loginContainer.classList.add('hide');
      break;
    case 'login':
    default:
      loginContainer.classList.remove('hide');
      chatContainer.classList.add('hide');
      logoutButton.classList.add('hide');
      break;
  }
}

function handleKeyDown(e) {
  if (e.keyCode == 13) {
    handleSubmit(e);
    e.preventDefault();
  }
}
