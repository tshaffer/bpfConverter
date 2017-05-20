// @flow

import React, { Component } from 'react';

export default class Video extends Component {

  render () {

    let self = this;

    console.log('video.js::render, video src: ' + this.props.resourceIdentifier);

    return (
      <video
        src={this.props.resourceIdentifier}
        autoPlay={true}
        width={this.props.width.toString()}
        height={this.props.height.toString()}
        type="video/mp4"
        onEnded = {() => {
          self.props.onVideoEnd();
        }
        }/>
    );
  }
}

Video.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  onVideoEnd: React.PropTypes.func.isRequired,
  resourceIdentifier: React.PropTypes.string.isRequired,
};
