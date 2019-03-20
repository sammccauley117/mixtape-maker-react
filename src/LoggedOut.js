import React from 'react';
import './scss/LoggedOut.scss';

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="logged-out-container">
        <div className="logged-out-title">Mixtape Maker</div>
        <div className="logged-out-description"></div>
        <div className="logged-out-colors">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="logged-out-login">
          <a href="http://192.168.1.8:3001/login">LOGIN TO SPOTIFY</a>
        </div>
      </div>
    );
  }
}

export default LoggedOut;
