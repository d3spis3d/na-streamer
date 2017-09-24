import React from 'react';
import Sidebar from './Sidebar';
import ViewContainer from './ViewContainer';


const styles = {
  display: 'grid',
  gridTemplateColumns: '1fr 7fr',
  height: '100vh'
};

export default class Main extends React.Component {
  render() {
    return (
      <div style={styles}>
        <Sidebar />
        <ViewContainer />
      </div>
    );
  }
}
