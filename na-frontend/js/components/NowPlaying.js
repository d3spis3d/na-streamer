import React from 'react';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    border: '1px solid grey'
  }
};

export default class NowPlaying extends React.Component {
  refreshPlaying() {
    this.props.refreshPlaying();
  }

  render() {
    const song = this.props.playing;
    return (
      <div style={styles}>
        <span> {song.artist} - {song.title} </span>
        <button onClick={() => this.refreshPlaying()}> Update </button>
        <audio src="/api/stream" autoPlay />
      </div>
    );
  }
}
