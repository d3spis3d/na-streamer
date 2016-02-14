import React from 'react';
import {connect} from 'react-redux';
import Main from './Main';
import NowPlaying from './NowPlaying';
import {updateQueue} from '../actions/actions';

const divStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
};

class App extends React.Component {
    render() {
        return (
            <div style={divStyles}>
                <Main queue={this.props.queue} refreshQueue={this.refreshQueue.bind(this)}/>
                <NowPlaying />
            </div>
        );
    }

    refreshQueue() {
        this.props.dispatch(updateQueue());
    }
}

function select(state) {
    return {
        loadingQueue: state.queue.loadingQueue,
        queue: state.queue.queue
    };
}

export default connect(select)(App);
