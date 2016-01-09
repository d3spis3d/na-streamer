import React from 'react';

const divStyles = {
    border: '1px solid grey',
    flex: 8
};

export default class Library extends React.Component {
    render() {
        return (
            <div style={divStyles}> Right</div>
        );
    }
}
