import * as React from 'react';

import path = require('path');

export interface VideoProps {
  width : number;
  height: number;
  onVideoEnd : () => void;
  src : string;
}

export default class Video extends React.Component<VideoProps, object> {

  render() {

    const self = this;

    return (
      <video
        src={this.props.src}
        autoPlay={true}
        width={this.props.width.toString()}
        height={this.props.height.toString()}
        type="video/mp4"
        onEnded = {() => {
          console.log('**** - videoEnd');
          self.props.onVideoEnd();
        }
        }/>
    );
  }
}
