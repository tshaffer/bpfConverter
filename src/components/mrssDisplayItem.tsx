
import * as React from "react";

const path = require('path');

import { MRSSDataFeedItem } from '../entities/mrssDataFeedItem';

import ImageContainer from '../containers/imageContainer';

import { MRSSDisplayItemStateProps } from '../containers/mrssDisplayItemContainer';

interface MrssDisplayItemProps extends MRSSDisplayItemStateProps {
  mrssDataFeedItem: MRSSDataFeedItem;
  mrssDataFeedItemPath: string;
};

export default class MrssDisplayItem extends React.Component<MrssDisplayItemProps, object> {

  constructor(props : MrssDisplayItemProps) {
    super(props);
    this.timeout = null;
  }

  timeout : any;

  render () {

    const src : string = path.join('file://', this.props.mrssDataFeedItemPath);
    console.log('mrssDisplayItem.js::render, image src: ' + src);

    if (this.props.mrssDataFeedItem.isImage()) {
      return (
        <ImageContainer
          resourceIdentifier={src}
          width={this.props.width}
          height={this.props.height}
          duration={this.props.duration}
          onTimeout={this.props.onTimeout.bind(this)}
        />
      );
    }
    else {
      debugger;
    }
  }
}
