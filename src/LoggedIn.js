import React from 'react';
import './scss/LoggedIn.scss';
const axios = require('axios');

class LoggedOut extends React.Component {
  // On creation
  constructor(props) {
    // 1) Initialization
    super(props);
    this.state = {
      view: 'loading'
    };

    // 2) Request user ID as well as a list of their playlists
    let id = this.get('me').then(response => this.setState({userID: response.data.id}));
    let playlists = this.get('me/playlists?limit=50').then(response => {
      this.setState({playlists: response.data.items});
    });

    // 3) Wait for both requests to resolve before displaying the list view
    Promise.all([id, playlists]).then(() => this.setState({view: 'list'}));
  }

  // Easy GET requests
  get(endpoint) {
    return axios.get(`https://api.spotify.com/v1/${endpoint}`,
      {headers: {'Authorization': 'Bearer ' + this.props.token}});
  }

  // Handles a user clicking on one of the playlists in the list view
  handlePlaylistClick(id) {
    // 1) Find which playlist object was selected
    let selected = this.state.playlists.find(playlist => playlist.id === id);
    console.log(selected);
  }

  // Creates a div element: a list of playlist titles for the user to interact with
  renderList() {
    // 1) Iterate through all user's playlist, creating individual divs for each one
    let listItems = this.state.playlists.map(playlist => {
      return <div className="logged-in-list-item"
      onClick={() => this.handlePlaylistClick(playlist.id)}
      key={playlist.id}>
        <div>{playlist.name}</div>
      </div>
    });

    // 2) Create a div containing each playlist
    return <div className="logged-in-list-container">{listItems}</div>
  }

  render() {
    // 1) Initialization
    let view = this.state.view; // Either loading, list of playlists, or a specific playlist
    let content = <h1> Error </h1>; // Main content

    // 2) Determine which view we're in
    switch(view) {
      case 'loading':
        content = <h1>Loading</h1>; break;
      case 'list':
        content = this.renderList(); break;
      case 'playlist':
        content = <h1>Playlist</h1>; break;
    }

    // 3) Return rendering
    return (
      <div className="logged-in-container">
        <div className="logged-in-header">
          Mixtape Maker
        </div>
        {content}
      </div>
    );
  }
}

export default LoggedOut;
