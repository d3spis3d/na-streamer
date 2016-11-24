import React from 'react';
import { connect } from 'react-redux';
import { updateQueue } from '../actions/actions';
import Channel from './views/Channel';

const divStyles = {
  border: '1px solid grey',
  flex: 8,
};

class ViewContainer extends React.Component {
  refreshQueue() {
    this.props.dispatch(updateQueue());
  }

  render() {
    return (
      <div style={divStyles}>
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
