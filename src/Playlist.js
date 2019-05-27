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

  create() {
    console.log(this.props);
    if(this.isSorted) {
      let name = prompt(`Select a playlist name for '${this.props.playlist.name}' sorted by ${this.feature} in a(n) ${this.inverted?'inverted '+this.shape:this.shape} shape. This will create a whole new playlist and not affect your current one at all.`, `${this.props.playlist.name} - sorted`);
      if(name !== null && name !== '') {
        axios({
          method: 'post',
          url: `https://api.spotify.com/v1/users/${this.props.userID}/playlists`,
          headers: {
            'Authorization': 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'
          },
          data: {'name':name}
        }).then(response => {
          if(response.status === 201) {
            axios({
              method: 'post',
              url: `https://api.spotify.com/v1/playlists/${response.data.id}/tracks`,
              headers: {
                'Authorization': 'Bearer ' + this.props.token,
                'Content-Type': 'application/json'
              },
              data: {
                'uris': this.sortedSongs.map(song => song.uri)
              }
            }).then(response => {
              console.log(response);
              alert('Sorted playlist created!');
            }).catch(e => {
              alert(`Something went wrong: ${e}`);
            });
          } else {
            alert('Something went wrong\nStatus: ${response.status}');
          }
        }).catch(e => {
          alert(`Something went wrong: ${e}`);
        });
        //
        // , {
        //
        //   data: {
        //     'name': name,
        //     // 'public': this.props.playlist.public,
        //     // 'collaborative': this.props.playlist.collaborative,
        //     // 'description': `'${this.props.playlist.name}' sorted [${this.feature}] ${this.inverted?'['+this.shape+'] '+'[inverted]':'['+this.shape+'] '} - www.mixtape-maker.xyz`
        // }}).then(()=>console.log('yeet')).catch((e)=>{
        //   console.log(e);
        // });
      } else {
        alert('Please enter a valid playlist name');
        this.create();
      }
    } else {
      alert('You must sort the playlist before creating a new one');
    }
  }

  updateSelected() {
    // Clear all
    let ids = ['up', 'down', 'left', 'right', 'bell', 'invert',
      'danceability', 'energy', 'tempo', 'mood'];
    ids.forEach(id => document.getElementById(id).classList.remove("selected"));
    // document.getElementById("up").classList.remove("selected");
    // document.getElementById("down").classList.remove("selected");
    // document.getElementById("left").classList.remove("selected");
    // document.getElementById("right").classList.remove("selected");
    // document.getElementById("bell").classList.remove("selected");
    // document.getElementById("invert").classList.remove("selected");
    switch(this.shape) {
      case 'up': document.getElementById("up").classList.add("selected"); break;
      case 'down': document.getElementById("down").classList.add("selected"); break;
      case 'left skew': document.getElementById("left").classList.add("selected"); break;
      case 'right skew': document.getElementById("right").classList.add("selected"); break;
      case 'bell': document.getElementById("bell").classList.add("selected"); break;
    }
    if(this.inverted) document.getElementById("invert").classList.add("selected");
    switch(this.feature) {
      case 'danceability': document.getElementById("danceability").classList.add("selected"); break;
      case 'energy': document.getElementById("energy").classList.add("selected"); break;
      case 'tempo': document.getElementById("tempo").classList.add("selected"); break;
      case 'mood': document.getElementById("mood").classList.add("selected"); break;
    }
  }

  handleShapeClick(shape) {
    if(shape !== 'invert') this.shape = shape;
    if(shape === 'invert' && this.shape === null) this.shape = 'up';
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
      case 'invert':
        this.inverted = !this.inverted; break;
    }
    // Check if shape was clicked before feature--if so set energy as default
    if(this.feature === null) this.feature = 'energy';
    this.updateSelected();
    this.sort();
    this.updateChart();
  }

  handleFeatureClick(feature) {
    this.feature = feature;
    if(this.shape === null) this.shape = 'up';
    this.updateSelected();
    this.sort();
    this.updateChart();
  }

  renderShapeButtons() {
    return (<div className='playlist-shape-section'>
      <div className='playlist-section-header'>Select a sorting shape</div>
      <div className='playlist-shape-btn-container'>
        <div className='playlist-shape-btn' id="up" onClick={()=>this.handleShapeClick('up')}>Up</div>
        <div className='playlist-shape-btn' id="down" onClick={()=>this.handleShapeClick('down')}>Down</div>
        <div className='playlist-shape-btn' id="left" onClick={()=>this.handleShapeClick('left skew')}>Left Skew</div>
        <div className='playlist-shape-btn' id="right" onClick={()=>this.handleShapeClick('right skew')}>Right Skew</div>
        <div className='playlist-shape-btn' id="bell" onClick={()=>this.handleShapeClick('bell')}>Bell</div>
        <div className='playlist-shape-btn' id="invert" onClick={()=>this.handleShapeClick('invert')}>Invert</div>
      </div>
    </div>);
  }

  renderFeatureButtons() {
    return (<div className='playlist-feature-section'>
      <div className='playlist-section-header'>Select a feature to sort by</div>
      <div className='playlist-feature-btn-container'>
        <div className='playlist-feature-btn' id="danceability" onClick={()=>this.handleFeatureClick('danceability')}>
          <div className='playlist-feature-accent' style={{backgroundColor:'#FD4928'}}></div>
          <div className='playlist-feature-name'>Danceability</div>
        </div>
        <div className='playlist-feature-btn' id="energy" onClick={()=>this.handleFeatureClick('energy')}>
          <div className='playlist-feature-accent' style={{backgroundColor:'#1DB952'}}></div>
          <div className='playlist-feature-name'>Energy</div>
        </div>
        <div className='playlist-feature-btn' id="tempo" onClick={()=>this.handleFeatureClick('tempo')}>
          <div className='playlist-feature-accent' style={{backgroundColor:'#FD9528'}}></div>
          <div className='playlist-feature-name'>Tempo</div>
        </div>
        <div className='playlist-feature-btn' id="mood" onClick={()=>this.handleFeatureClick('mood')}>
          <div className='playlist-feature-accent' style={{backgroundColor:'#1E7E9E'}}></div>
          <div className='playlist-feature-name'>Mood</div>
        </div>
      </div>
    </div>);
  }

  render() {
    let shapeButtons = this.renderShapeButtons();
    let featureButtons = this.renderFeatureButtons();

    // Return rendering
    return (<div className='playlist-container'>
      <div className='playlist-section-header graph-header'>Sorted feature graph of <i>{this.props.playlist.name}</i></div>
      <div className='playlist-chart'>
        <div className="playlist-chart-container">
          <canvas id="chart"></canvas>
        </div>
      </div>
      {featureButtons}
      {shapeButtons}
      <div className="playlist-create">
        <div onClick={()=>this.create()}>Create new playlist</div>
      </div>
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
        legend: {display: false},
        layout: {padding:{top: 10, right: 10}},
        scales: {
          xAxes: [{
            ticks: {display:false},
            scaleLabel: {
              display: true,
              labelString: 'Songs',
              fontColor: '#555555'},
            gridLines: {color:'#252525'}}],
            yAxes: [{
              ticks: {display:false},
              scaleLabel: {
                display: true,
                labelString: 'Features',
                fontColor: '#555555'},
              gridLines: {color:'#252525',zeroLineColor:'#252525'}}],
        },
      }
    });
  }

  // Constructs and returns the dataset objects for Chart.js
  getDatasets(songs) {
    // Variable initialization
    const opacity = '15';
    const features = {
      'danceability':'#FD4928',
      'energy':'#1DB952',
      'tempo':'#FD9528',
      'mood':'#1E7E9E'
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
