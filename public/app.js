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
const registerLink = document.querySelector('#register-link');

const registerContainer = document.querySelector('.register-container');
const registerButton = document.querySelector('#register-button');
const registerName = document.querySelector('#register-name');
const registerEmail = document.querySelector('#register-email');
const registerPassword = document.querySelector('#register-password');

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
registerButton.addEventListener('click', handleRegister);
registerLink.addEventListener('click', handleGoToRegister);

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

function handleGoToRegister() {
  chatState = 'register';
  handleUIChanges();
}

function handleRegister(e) {
  e.preventDefault();
  if (registerName.value && registerEmail.value && registerPassword.value) {    
    firebase.auth()
      .createUserWithEmailAndPassword(registerEmail.value, registerPassword.value)
      .then(function (user) {
        db.ref('/users').child(user.uid).set({
          name: registerName.value,
          email: registerEmail.value
        })
      });
  }
}

function handleMessageSubmit(e) {
  e.preventDefault();
  
  if (!textBox.value) {
    return;
  }

  db.ref('chats').push({
    userId: chatUser && chatUser.uid,
    message: textBox.value
  });
  
  textBox.value = '';
}

function handleChildAdded(data) {
  const messageData = data.val();
  const li = document.createElement('li');
  
  li.innerHTML = messageData.message;
  
  if (chatUser && messageData.userId !== chatUser.uid) {
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
      registerContainer.classList.add('hide');
      break;
    case 'register':
      chatContainer.classList.add('hide');
      registerContainer.classList.remove('hide');
      loginContainer.classList.add('hide');
      logoutButton.classList.add('hide');
      break;
    case 'login':
      default:
      loginContainer.classList.remove('hide');
      registerContainer.classList.add('hide');
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
