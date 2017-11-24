import * as React from 'react';

import path = require('path');

export interface ImageProps {
  height: number;
  width: number;
  duration: number;
  onTimeout: () => void;
  src: string;
}

export default class Image extends React.Component<ImageProps, object> {

  private timeout: any;

  constructor(props: ImageProps) {
    super(props);
    this.timeout = null;
  }

  shouldComponentUpdate() {

    // if (this.timeout) {
    //   return false;
    // }

    return true;
  }

  render() {

    const self: Image = this;

    // WRONG
    if (this.timeout) {
      // debugger;
      console.log('timeout still active');
    }
    else {
      this.timeout = setTimeout( () => {
          this.timeout = null;
          self.props.onTimeout();
        }
        , this.props.duration);
    }

    return (
      <img
        src={this.props.src}
        width={this.props.width.toString()}
        height={this.props.height.toString()}
      />
    );
  }
}
