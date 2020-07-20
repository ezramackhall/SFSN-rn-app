import firebase from 'firebase';

class Fire {
  constructor() {
    this.init();
    let userToMessage = '';
  }

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyADYFVRfgEMckmIYzWnq6Sg8mrkBiWpCEs",
        authDomain: "rn-complete-guide-eh.firebaseapp.com",
        databaseURL: "https://rn-complete-guide-eh.firebaseio.com",
        projectId: "rn-complete-guide-eh",
        storageBucket: "rn-complete-guide-eh.appspot.com",
        messagingSenderId: "399080340497",
        appId: "1:399080340497:web:84b9e56aa73dc61f9045b0",
        measurementId: "G-02NN70V7Z8"
      });
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref(`messages/${this.userToMessage}`);
  }

  setUserToMessage = (userToMessage) => {
      this.userToMessage = userToMessage;
  };

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback => {
    this.ref
        .limitToLast(20)
        .on('child_added', snapshot => callback(this.parse(snapshot)))};

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message); 
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();
export default Fire;