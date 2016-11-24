import React from 'react';

const styles = {
  flex: 5,
  display: 'flex',
  alignContent: 'center',
  flexDirection: 'column',
  alignItems: 'center'
};

const spanStyles = {
  marginTop: 20
};

export default class TrackContainer extends React.Component {
  refreshPlaying() {
    this.props.refreshPlaying();
  }

  render() {
    const song = this.props.playing;
    return (
      <div style={styles}>
        <span style={spanStyles}> {song.artist} — {song.title} </span>
        <button onClick={() => this.refreshPlaying()}> Update </button>
      </div>
    );
  }
}
