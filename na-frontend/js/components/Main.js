import React from 'react';
import Queue from './Queue';
import Library from './Library';


const divStyles = {
    flex: 9,
    display: 'flex'
};

export default class Main extends React.Component {
    render() {
        return (
            <div style={divStyles}>
                <Queue queue={this.props.queue} refreshQueue={this.props.refreshQueue}/>
                <Library />
            </div>
        );
    }
}
