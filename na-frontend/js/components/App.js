import React from 'react';
import Main from './Main';
import NowPlaying from './NowPlaying';

const divStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
};

export default class App extends React.Component {
    render() {
        return (
            <div style={divStyles}>
                <Main />
                <NowPlaying />
            </div>
        );
    }
}
