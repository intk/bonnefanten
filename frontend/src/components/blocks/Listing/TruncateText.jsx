import React from 'react';

class TruncateText extends React.Component {
  truncate(input) {
    if (input !== undefined && input !== null && input.length > 98) {
      return input.substring(0, 98) + '...';
    }
    return input;
  }

  render() {
    return <p>{this.truncate(this.props.text)}</p>;
  }
}

export default TruncateText;
