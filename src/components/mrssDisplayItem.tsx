
import * as React from "react";

const path = require('path');

import { MRSSDataFeedItem } from '../entities/mrssDataFeedItem';

import ImageContainer from '../containers/imageContainer';

export interface MrssDisplayItemProps {
  width : number;
  height: number;
  duration : number;
  onTimeout : Function;
  dataFeedId: string;
  mrssDataFeedItem: MRSSDataFeedItem;
  mrssDataFeedItemPath: string;
}

export default class MrssDisplayItem extends React.Component<any, object> {

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
