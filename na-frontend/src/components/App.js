import React from 'react';
import { connect } from 'react-redux';
import Main from './Main';
import NowPlaying from './NowPlaying';
import { updatePlaying } from '../actions/actions';

class App extends React.Component {
  refreshPlaying() {
    this.props.dispatch(updatePlaying());
  }

  render() {
    return (
      <div>
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
