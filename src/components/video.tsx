import * as React from 'react';

import path = require('path');

import { getPoolFilePath } from '../utilities/utilities';

export interface VideoProps {
  width : number;
  height: number;
  onVideoEnd : () => void;
  fileId : string;
}

export default class Video extends React.Component<VideoProps, object> {

  render() {

    const self = this;

    const poolFilePath : string = getPoolFilePath(this.props.fileId);

    const src : string = path.join('file://', poolFilePath);
    console.log('video src: ' + src);

    return (
      <video
        src={src}
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
