import React from 'react';
import './scss/LoggedOut.scss';

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="logged-out-container">
        <img className="logged-out-logo" src="logo.png"/>
        <div className="logged-out-description">Create perfectly flowing, curated playlists for the occasion–use song features such as energy and danceability to give your playlists shape and structure</div>
        <div className="logged-out-login">
          <a href="http://192.168.1.8:3001/login">LOGIN TO SPOTIFY</a>
        </div>
      </div>
    );
  }
}

export default LoggedOut;
