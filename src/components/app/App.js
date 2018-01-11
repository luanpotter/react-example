import React, { Component } from 'react';
import firebase from 'firebase';
import { FirebaseAuth } from 'react-firebaseui';
import 'components/app/App.css';

const config = {
  apiKey: "AIzaSyC3sWq8Efvd0k6ETKBUfY1BgARIpf5igtc",
  authDomain: "dextra-parking.firebaseapp.com",
  databaseURL: "https://dextra-parking.firebaseio.com",
  projectId: "dextra-parking",
  storageBucket: "dextra-parking.appspot.com",
  messagingSenderId: "164824251074"
};

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccess: () => false
  }
};

firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const email = user.email;
        const name = user.displayName || email;

        user.getIdToken().then(idToken => {
          const login = { email, name, idToken };
          console.log('Logged in!', login);
          localStorage.setItem('login_data', JSON.stringify(login));
          this.setState({ login });
          fetch("https://dextra-parking.appspot.com/api/cars", {
            headers: {
              Authorization: 'Bearer ' + login.idToken
            }
          }).then(c => console.log(c));
        });
      } else {
        console.error('Couldn\'t login!');
      }
    });
  }

  render() {
    return <div className="App">
        <header className="App-header">
          <h1 className="App-title">Dextra Park</h1>
        </header>
        <div className="App-intro">
          <p>Please sign in</p>
          <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>;
  }
}

export default App;
