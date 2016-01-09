import React from 'react';

const divStyles = {
    border: '1px solid grey',
    flex: 2
};

export default class Queue extends React.Component {
    render() {
        return (
            <div style={divStyles}> Left</div>
        );
    }
}
