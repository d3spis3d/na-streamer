import React from 'react';

const divStyles = {
    flex: 1,
    display: 'flex',
    border: '1px solid grey'
};

export default class NowPlaying extends React.Component {
    render() {
        const song = this.props.playing;
        return (
            <div style={divStyles}>
                <span> {song.artist} - {song.title} </span>
                <button onClick={() => this.refreshPlaying()}> Update </button>
                <audio src="/api/stream" autoPlay></audio>
            </div>
        );
    }

    refreshPlaying() {
        this.props.refreshPlaying();
    }
}
