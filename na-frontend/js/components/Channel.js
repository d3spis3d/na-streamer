import React from 'react';
import Main from './Main';
import NowPlaying from './NowPlaying';

const divStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
};

export default class Channel extends React.Component {
    render() {
        return (
            <div style={divStyles}>
                <Main queue={this.props.queue} refreshQueue={this.props.refreshQueue}/>
                <NowPlaying playing={this.props.playing} refreshPlaying={this.props.refreshPlaying}/>
            </div>
        );
    }
}
