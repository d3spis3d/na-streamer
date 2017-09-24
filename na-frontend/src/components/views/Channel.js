import React from 'react';

export default class Channel extends React.Component {
  refreshQueue() {
    this.props.refreshQueue();
  }

  render() {
    let items;
    if (this.props.queue) {
      items = this.props.queue.map(item => (
        <QueueItem
          key={item.rid}
          title={item.title}
          album={item.album}
          artist={item.artist}
          className="queueItem"
        />
        )
      );
    }
    return (
      <div>
        <button onClick={() => this.refreshQueue()}> Sync </button>
        {items}
      </div>
    );
  }
}

class QueueItem extends React.Component {
  render() {
    return (
      <div>
        <div>{this.props.title}</div>
        <span>{this.props.album} - {this.props.artist}</span>
      </div>
    );
  }
}
