import React from 'react';
import './scss/Loading.scss';

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  render() {
    return (
      <div className="loading-container">

      </div>
    );
  }
}

export default LoggedOut;
