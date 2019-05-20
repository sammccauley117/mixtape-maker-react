import React from 'react';
import Song from './Song.js';
import './scss/Playlist.scss';
const axios = require('axios');

class LoggedOut extends React.Component {
  // On creation
  constructor(props) {
    // Initialization
    super(props);
    console.log(this.props);
    // this.state = {
    // };
  }

  render() {
    // Return rendering
    return <div>This is a playlist called '{this.props.playlist.name}'</div>
  }
}

export default LoggedOut;
