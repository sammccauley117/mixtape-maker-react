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
        <div className="logged-out-caption">Sort your playlists by features such as mood and danceability to create perfectly curated mixtapes</div>
        <div className="logged-out-login">
          <a href="http://192.168.1.8:3001/login">LOGIN TO SPOTIFY</a>
        </div>
        <div className="logged-out-description">
          <div className="list-section-header">How it works</div>
          <div className="list-container">
            <div className="list-item">
              <div className="list-number">1</div>
              <div className="list-description">
                Login to your Spotify account
              </div>
            </div>
            <div className="list-item">
              <div className="list-number">2</div>
              <div className="list-description">
                Select a playlist that you would like to sort
              </div>
            </div>
            <div className="list-item">
              <div className="list-number">3</div>
              <div className="list-description">
                Once a playlist is chosen, the danceability, energy, tempo, and mood of each song in the playlist is loaded. Select the feature that you would like to sort the playlist by
              </div>
            </div>
            <div className="list-item">
              <div className="list-number">4</div>
              <div className="list-description">
                You can also choose the sorting shape/method of the feature, such as ascending, descending, or even a bell shaped curve
              </div>
            </div>
            <div className="list-item">
              <div className="list-number">5</div>
              <div className="list-description">
                <span>Click the 'create new playlist' button. This will <i>not</i> affect your original playlist in any way</span>
              </div>
            </div>
          </div>
        </div>
        <div className="git">
          <a href="https://github.com/sammccauley117/mixtape-maker-react">
            <img src="github.svg"/>
          </a>
          Checkout the project on GitHub
        </div>
      </div>
    );
  }
}

export default LoggedOut;
