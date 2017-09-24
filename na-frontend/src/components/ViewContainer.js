import React from 'react';
import { connect } from 'react-redux';
import { updateQueue } from '../actions/actions';
import Channel from './views/Channel';

class ViewContainer extends React.Component {
  refreshQueue() {
    this.props.dispatch(updateQueue());
  }

  render() {
    return (
      <div>
        <Channel queue={this.props.queue} refreshQueue={this.refreshQueue.bind(this)} />
      </div>
    );
  }
}

function select(state) {
  return {
    loadingQueue: state.queue.loadingQueue,
    queue: state.queue.queue,
  };
}

export default connect(select)(ViewContainer);
