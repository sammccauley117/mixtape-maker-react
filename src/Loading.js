import React from 'react';
import './scss/Loading.scss';

class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="loading-container">
        <p>Loading</p>
        <div id="bars">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    );
  }
}

export default Loading;
