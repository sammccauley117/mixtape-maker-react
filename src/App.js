import React from 'react';
import './scss/App.scss';
import LoggedOut from './LoggedOut.js';
import LoggedIn from './LoggedIn.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: this.isLoggedIn()
    };
  }

  // Checks if access token is in the URL indicating that a user is logged in
  // Does not check validity of access token as of right now
  isLoggedIn() {
    let params = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
    while (e = r.exec(q))
      params[e[1]] = decodeURIComponent(e[2]);
    return 'token' in params;
  }

  getToken() {
    let params = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
    while (e = r.exec(q))
      params[e[1]] = decodeURIComponent(e[2]);
    return params['token'];
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let content = isLoggedIn ? <LoggedIn token={this.getToken()}/> : <LoggedOut/>;
    return (
      <div className="app-container">
        {content}
      </div>
    );
  }
}

export default App;
