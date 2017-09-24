import React from 'react';

const styles = {
  display: 'flex',
  alignItems: 'center',
  flex: 1
};

export default class VolumeControls extends React.Component {
  render() {
    return (
      <div style={styles}>
        <span>🔊</span>
      </div>
    );
  }
}
