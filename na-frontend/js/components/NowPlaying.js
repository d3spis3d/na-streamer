import React from 'react';

const divStyles = {
    flex: 1,
    display: 'flex',
    border: '1px solid grey'
};

export default class NowPlaying extends React.Component {
    render() {
        return (
            <div style={divStyles}>Bottom</div>
        );
    }
}
