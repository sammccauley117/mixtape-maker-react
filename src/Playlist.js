import React from 'react';
import Song from './Song.js';
import './scss/Playlist.scss';
const axios = require('axios');

class Playlist extends React.Component {
  // On creation
  constructor(props) {
    // Initialization
    super(props);
    console.log(this.props);
    this.sortedSongs = [];
    this.isSorted = false;
    this.inverted = false;
    this.feature = null;
    this.shape = null;
    this.peak = null;
  }

  sort() {
    // Initialization
    const Q = 4; // Divides the interval into four quadrants
    let left = [], right = [];
    let songs = this.props.playlist.songs.slice(); // Copy original order
    // Set default sorting options if necessary
    let feature = this.feature === null ? 'energy' : this.feature;
    let peak = this.peak === null ? 4 : this.peak;
    // For this algorithm to work, the songs must start in acsending order
    songs.sort((a, b) => a.features[feature] - b.features[feature]);

    // Build left and right side based on where the bias is
    for (let i = 0; i < this.props.playlist.songs.length/Q; i++) {
      for (let j = 0; j < peak; j++) if(songs.length != 0) left.push(songs.shift());
      for (let j = 0; j < (Q-peak); j++) if(songs.length != 0) right.push(songs.shift());
    }

    // Merge left and right side
    if (!this.inverted) this.sortedSongs = left.concat(right.reverse()); // Default: peak is peak
    else this.sortedSongs = left.reverse().concat(right); // Peak to trough

    // Return copy of the sorted songs
    return this.sortedSongs.slice();
  }

  handleShapeClick(shape) {
    this.shape = shape;
    switch(shape) {
      case 'down':
        this.peak = 0; break;
      case 'left skew':
        this.peak = 1; break;
      case 'bell':
        this.peak = 2; break;
      case 'right skew':
        this.peak = 3; break;
      case 'up':
        this.peak = 4; break;
    }
    this.sort();
  }

  handleFeatureClick(feature) {
    this.feature = feature;
    this.sort();
  }

  renderShapeButtons() {
    return (<div>
      <div className='playlist-shape-option' onClick={() => this.handleShapeClick('up')}>Up</div>
      <div className='playlist-shape-option' onClick={() => this.handleShapeClick('down')}>Down</div>
      <div className='playlist-shape-option' onClick={() => this.handleShapeClick('left skew')}>Left Skew</div>
      <div className='playlist-shape-option' onClick={() => this.handleShapeClick('right skew')}>Right Skew</div>
      <div className='playlist-shape-option' onClick={() => this.handleShapeClick('bell')}>Bell</div>
    </div>);
  }

  renderFeatureButtons() {
    return (<div>
      <div className='playlist-feature-option' onClick={() => this.handleFeatureClick('danceability')}>Danceability</div>
      <div className='playlist-feature-option' onClick={() => this.handleFeatureClick('energy')}>Energy</div>
      <div className='playlist-feature-option' onClick={() => this.handleFeatureClick('tempo')}>Tempo</div>
      <div className='playlist-feature-option' onClick={() => this.handleFeatureClick('mood')}>Mood</div>
    </div>);
  }

  render() {
    let shapeButtons = this.renderShapeButtons();
    let featureButtons = this.renderFeatureButtons();

    // Return rendering
    return (<div className='playlist-container'>
      {shapeButtons}
      {featureButtons}
    </div>);
  }
}

export default Playlist;
