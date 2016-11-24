import React from 'react';
import { connect } from 'react-redux';
import Main from './Main';
import NowPlaying from './NowPlaying';
import { updatePlaying } from '../actions/actions';

const divStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
};

class App extends React.Component {
  refreshPlaying() {
    this.props.dispatch(updatePlaying());
  }

  render() {
    return (
      <div style={divStyles}>
        <Main />
        <NowPlaying playing={this.props.playing} refreshPlaying={this.refreshPlaying.bind(this)} />
      </div>
    );
  }
}

function select(state) {
  return { loadingPlaying: state.playing.loadingPlaying, playing: state.playing.playing };
}

export default connect(select)(App);
