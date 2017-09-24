import React from 'react';
import { zircon } from '../styles/colours';

const divStyles = {
  borderRight: `1px solid ${zircon}`,
};

export default class Sidebar extends React.Component {
  render() {
    return (
      <div style={divStyles}>
        <div> Channels </div>
      </div>
    );
  }
}
