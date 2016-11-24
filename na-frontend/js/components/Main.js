import React from 'react';
import Sidebar from './Sidebar';
import ViewContainer from './ViewContainer';


const divStyles = {
  flex: 9,
  display: 'flex',
};

export default class Main extends React.Component {
  render() {
    return (
      <div style={divStyles}>
        <Sidebar />
        <ViewContainer />
      </div>
    );
  }
}
