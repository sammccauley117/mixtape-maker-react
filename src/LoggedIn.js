import React from 'react';
import './scss/LoggedIn.scss';

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="logged-in-container">
        Logged In.
      </div>
    );
  }
}

export default LoggedOut;
