import React from 'react';

export default class Channel extends React.Component {
    render() {
        let items;
        if (this.props.queue) {
            items = this.props.queue.map(item => {
                return <QueueItem key={item.rid} title={item.title} album={item.album} artist={item.artist} />;
            });
        }
        return (
            <div>
                <button onClick={() => this.refreshQueue()}> Sync </button>
                {items}
            </div>
        );
    }

    refreshQueue() {
        this.props.refreshQueue();
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
