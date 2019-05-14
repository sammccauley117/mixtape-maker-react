import React from 'react';
import './scss/LoggedIn.scss';
const axios = require('axios');

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'loading'
    };
    let id = this.get('me').then(response => this.setState({userID: response.data.id}));
    let playlists = this.get('me/playlists?limit=50').then(response => {
      this.setState({playlists: response.data.items});
    });
    Promise.all([id, playlists]).then(() => this.setState({view: 'list'}));
  }

  get(endpoint) {
    return axios.get(`https://api.spotify.com/v1/${endpoint}`,
      {headers: {'Authorization': 'Bearer ' + this.props.token}});
  }

  loadPlaylists() {

  }

  handlePlaylistClick(id) {
    // 1) Find which playlist object was selected
    let selected = this.state.playlists.find(playlist => playlist.id === id);

    console.log(selected);
  }

  getList() {
    let listItems = this.state.playlists.map(playlist => {
      return <div className="logged-in-list-item"
      onClick={() => this.handlePlaylistClick(playlist.id)}
      key={playlist.id}>
        <div>{playlist.name}</div>
      </div>
    });
    return <div className="logged-in-list-container">{listItems}</div>
  }

  render() {
    let view = this.state.view;
    let content = <h1> Error </h1>;
    switch(view) {
      case 'loading':
        content = <h1>Loading</h1>;
        break;
      case 'list':
        content = this.getList();
        break;
      case 'playlist':
        content = <h1>Playlist</h1>;
        break;
    }
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
