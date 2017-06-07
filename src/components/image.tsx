import * as React from 'react';

import path = require('path');

import {
  BsAssetItem
} from '@brightsign/bscore';

export interface ImageProps {
  height: number;
  width: number;
  duration: number;
  onTimeout: () => void;
  assetId : string;
}

export interface ImagePropsAssetItem {
  bsAssetItem : BsAssetItem;
}

export default class Image extends React.Component<ImageProps & ImagePropsAssetItem, object> {

  private timeout: any;

  constructor(props: ImageProps & ImagePropsAssetItem) {
    super(props);
    this.timeout = null;
  }

  shouldComponentUpdate() {

    if (this.timeout) {
      return false;
    }

    return true;
  }

  render() {

    const self: Image = this;

    if (this.timeout) {
      debugger;
    }

    this.timeout = setTimeout( () => {
        this.timeout = null;
        self.props.onTimeout();
      }
      , this.props.duration);

    // console.log('image.js::render, image src: ' + this.props.resourceIdentifier);

    const filePath : string = this.props.bsAssetItem.path;
    const src : string = path.join('file://', filePath);

    return (
      <img
        src={src}
        width={this.props.width.toString()}
        height={this.props.height.toString()}
      />
    );
  }
}
