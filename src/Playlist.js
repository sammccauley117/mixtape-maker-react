import React from 'react';
import Song from './Song.js';
import './scss/Playlist.scss';
const axios = require('axios');
const Chart = require('chart.js');

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
    this.chart = null;
  }

  // Description: Sorts the songs based on three parameters:
  // Parameters:
  //    feature: which aspect of the song the sorting is focused on ('energy', 'tempo', etc.)
  //    peak: index [0,4] of where the highest feature value will appear
  //                a peak of 0 means the highest value will appear at the beginning
  //                a peak of 1 means the highest value will appear 25% into the playlist
  //                a peak of 2 means the highest value will appear at the center
  //                a peak of 3 means the highest value will appear 75% into the playlist
  //                a peak of 4 means the highest value will appear at the end
  //   inverted: flips the shape upside down--essentially turns the peak into a trough
  // Returns: array of sorted songs
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
      for (let j = 0; j < peak; j++) if(songs.length !== 0) left.push(songs.shift());
      for (let j = 0; j < (Q-peak); j++) if(songs.length !== 0) right.push(songs.shift());
    }

    // Merge left and right side
    if (!this.inverted) this.sortedSongs = left.concat(right.reverse()); // Default: peak is peak
    else this.sortedSongs = left.reverse().concat(right); // Peak to trough

    // Return copy of the sorted songs
    this.isSorted = true;
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
    this.updateChart();
  }

  handleFeatureClick(feature) {
    this.feature = feature;
    this.sort();
    this.updateChart();
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
      <div className="playlist-chart-container">
        <canvas id="chart"></canvas>
      </div>
      {shapeButtons}
      {featureButtons}
    </div>);
  }

  // After the component renders, insert the chartjs into the canvas
  componentDidMount() {
    let songs = this.props.playlist.songs.slice();
    this.chart = new Chart(document.getElementById('chart'), {
      type: 'line',
      data: {
        labels: songs.map(song => song.name),
        datasets: this.getDatasets(songs),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // title: {
        //   display: true,
        //   text: `${this.name}`
        // },
        // tooltips: TOOLTIPS, // Bad practice, but the options config is whack so for now it's in config.js
        // scales: SCALES // Same bad practice
      }
    });
  }

  // Constructs and returns the dataset objects for Chart.js
  getDatasets(songs) {
    // Variable initialization
    const opacity = '60';
    const features = {
      'danceability':'#9966FF',
      'energy':'#36A2EB',
      'tempo':'#FF6384',
      'mood':'#4BC0C0'
    };
    let tempoScale = Math.max(...songs.map(song => song.tempo)); // We want tempo to be in the 0-1 range for graphing
    let datasets = [];

    // Construct datasets
    Object.keys(features).forEach(feature => {
      let data = songs.map(song => (feature === 'tempo') ? song[feature]/tempoScale : song[feature]); // Scale tempo down
      let color = (feature === this.feature) ? features[feature] : features[feature]+opacity; // Add opacity if not the selected feature
      datasets.push({
        label: feature,
        data: data,
        backgroundColor: color,
        borderColor: color,
        pointHoverBackgroundColor: features[feature],
        pointHoverBorderColor: features[feature],
        fill: false
      });
    });
    return datasets;
  }

  updateChart() {
    // Get songs
    let songs = this.isSorted ? this.sortedSongs.slice() : this.props.playlist.songs.slice();
    // Update song labels
    this.chart.data.labels = songs.map(song => song.name);
    // Update datasets
    this.getDatasets(songs).forEach((dataset, i) => {
      this.chart.data.datasets[i].data = dataset.data;
      this.chart.data.datasets[i].backgroundColor = dataset.backgroundColor;
      this.chart.data.datasets[i].borderColor = dataset.borderColor;
    });
    this.chart.update(); // 'Push' the updates
  }

}

export default Playlist;
