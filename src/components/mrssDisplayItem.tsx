
import * as React from 'react';

import path = require('path');

import ImageContainer from '../containers/imageContainer';

import { MrssDisplayItemProps } from '../containers/mrssDisplayItemContainer';

export default class MrssDisplayItem extends React.Component<MrssDisplayItemProps, object> {

  timeout : any;

  constructor(props : MrssDisplayItemProps) {
    super(props);
    this.timeout = null;
  }

  render() {

    const src : string = path.join('file://', this.props.mrssDataFeedItemPath);
    console.log('mrssDisplayItem.js::render, image src: ' + src);

    if (this.props.mrssDataFeedItem.isImage()) {
      return (
        <ImageContainer
          width={this.props.width}
          height={this.props.height}
          src={src}
        />
      );
    } else {
      debugger;
    }
  }
}
