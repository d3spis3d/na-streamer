import React from 'react';
import {connect} from 'react-redux';
import Channel from './Channel';
import {updateQueue, updatePlaying} from '../actions/actions';

class App extends React.Component {
    render() {
        return (
            <Channel
                refreshQueue={this.refreshQueue.bind(this)}
                refreshPlaying={this.refreshPlaying.bind(this)}
                queue={this.props.queue}
                playing={this.props.playing} />
        );
    }

    refreshQueue() {
        this.props.dispatch(updateQueue());
    }

    refreshPlaying() {
        this.props.dispatch(updatePlaying());
    }
}

function select(state) {
    return {
        loadingQueue: state.queue.loadingQueue,
        queue: state.queue.queue,
        loadingPlaying: state.playing.loadingPlaying,
        playing: state.playing.playing
    };
}

export default connect(select)(App);
