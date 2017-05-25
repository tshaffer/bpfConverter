import * as React from 'react';

export interface VideoProps {
  width : number;
  height: number;
  onVideoEnd : () => void;
  resourceIdentifier : string;
}

export default class Video extends React.Component<VideoProps, object> {

  render() {

    const self = this;

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
