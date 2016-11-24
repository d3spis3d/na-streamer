import React from 'react';
import { fullWhite } from '../styles/colours';
import TrackContainer from './TrackContainer';
import MediaControls from './MediaControls';
import VolumeControls from './VolumeControls';

const styles = {
  position: 'absolute',
  display: 'flex',
  background: 'white',
  bottom: 0,
  left: 0,
  right: 0,
  minHeight: 90,
  boxShadow: `0 -5px 10px 0px hsla(0, 0%, 0%, 0.05), 0 -5px 3px -10px ${fullWhite}`
};

export default class NowPlaying extends React.Component {
  refreshPlaying() {
    this.props.refreshPlaying();
  }

  render() {
    return (
      <div style={styles}>
        <MediaControls />
        <TrackContainer playing={this.props.playing} refreshPlaying={this.props.refreshPlaying} />
        <VolumeControls />
        <audio src="/api/stream" autoPlay />
      </div>
    );
  }
}
