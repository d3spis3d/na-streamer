import React from 'react';

const styles = {
  display: 'flex',
  alignItems: 'center',
  flex: 1
};

export default class MediaControlls extends React.Component {
  render() {
    return (
      <div style={styles}>
        <span>Previous ► Next</span>
      </div>
    );
  }
}
