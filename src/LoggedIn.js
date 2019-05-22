import React from 'react';
import Song from './Song.js';
import Loading from './Loading.js';
import Playlist from './Playlist.js';
import './scss/LoggedIn.scss';
const axios = require('axios');

class LoggedIn extends React.Component {
  // On creation
  constructor(props) {
    // Initialization
    super(props);
    this.state = {
      view: 'loading', // Which type of view is currently displayed (loading, list of playlists, specific playlist)
      selected: null, // Which playlist is currently selected (if applicable)
    };

    // Request user ID as well as a list of their playlists
    let id = this.get('me').then(response => this.setState({userID: response.data.id}));
    let playlists = this.get('me/playlists?limit=50').then(response => {
      // Initialize playlist loaded variable to false and set state of playlists
      this.setState({playlists: response.data.items.map(item => {
        item.loaded = false;
        item.songs = [];
        return item;
      })});
    });

    // Wait for both requests to resolve before displaying the list view
    Promise.all([id, playlists]).then(() => {
      // Wait 1 second so that the loading image can be seen and not just flash
      setTimeout(() => this.setState({view: 'list'}), 1000);
    });
  }

  // Easy GET requests
  get(endpoint) {
    return axios.get(`https://api.spotify.com/v1/${endpoint}`,
      {headers: {'Authorization': 'Bearer ' + this.props.token}});
  }

  // Handles a user clicking on one of the playlists in the list view
  // Argument: id - the id/uri of the playlist clicked
  handlePlaylistClick(id) {
    // Find index of which playlist object was selected
    let selected = this.state.playlists.findIndex(playlist => playlist.id === id);

    // Update view and selected states (load the playlist data if applicable)
    let playlists = this.state.playlists;
    if (!playlists[selected].loaded) { // Need to load the playlist data before changing the state
      this.setState({view: 'loading'}); // Display the loading animation while the request are made
      // Make request for playlist tracks
      this.get(`playlists/${playlists[selected].id}/tracks`).then(response => {
        // Create song objects
        let newSongs = [];
        response.data.items.forEach(song => {
          if(!song.is_local) newSongs.push(new Song(song.track))
        });

        // Load the features of the songs
        let ids = newSongs.map(song => song.id);
        ids = ids.join('%2C'); // URL commas
        this.get(`audio-features?ids=${ids}`).then(response => {
          newSongs.forEach((song, i) => {
            song.addFeatures(response.data.audio_features[i]);
          });

          // Load is complete, update the state with the selected playlist
          playlists[selected].songs = newSongs;
          playlists[selected].loaded = true;
          this.setState({
            view: 'playlist',
            selected: playlists[selected]
          });
        });
      });
    } else { // Songs and features have already been loaded for this playlist
      this.setState({
        view: 'playlist',
        selected: playlists[selected]
      });
    }

  }

  // Creates a div element: a list of playlist titles for the user to interact with
  renderList() {
    // Iterate through all user's playlist, creating individual divs for each one
    console.log(this.state.playlists);
    let listItems = this.state.playlists.map(playlist => {
      // Only show valid playlists
      if(playlist.images.length !== 0 && playlist.tracks.total !== 0) {
        return <div className="logged-in-list-item">
          <div className="logged-in-card"
          onClick={() => this.handlePlaylistClick(playlist.id)}
          key={playlist.id}>
            <img src={playlist.images[0].url}/>
            <div>{playlist.name}</div>
          </div>
        </div>
      }
    });

    // Return a div containing each playlist
    return <div className="logged-in-list-content">
      <div className="logged-in-list-header">Select a playlist</div>
      <div className="logged-in-list-container">{listItems}</div>
    </div>;
  }

  // Creates a back button to display in the header--when clicked it takes the user back to list view
  renderBack() {
    return <div className='logged-in-back-button' onClick={() => this.setState({view: 'list'})}></div>
  }

  render() {
    // Initialization
    let view = this.state.view; // Either loading, list of playlists, or a specific playlist
    let content = <h1> Error </h1>; // Main content
    let back = null; // Back button for playlist view

    // Determine which view we're in
    switch(view) {
      case 'loading':
        content = <Loading/>; break;
      case 'list':
        content = this.renderList(); break;
      case 'playlist':
        back = this.renderBack();
        content = <Playlist playlist={this.state.selected}
          token={this.props.token} userID={this.state.userID}/>;
        break;
    }

    // Return rendering
    return (
      <div className="logged-in-container">
        <div className="logged-in-header">
          <div className="logged-in-header-container">
            <div className="logged-in-back-container">{back}</div>
            <div className="logged-in-title">Mixtape Maker</div>
            <div className="logged-in-logout-container"></div>
          </div>
        </div>
        <div className="logged-in-content">{content}</div>
      </div>
    );
  }
}

export default LoggedIn;
