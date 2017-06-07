import * as React from 'react';

import path = require('path');

import { getPoolFilePath } from '../utilities/utilities';

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

    const fileName : string = this.props.bsAssetItem.name;
    const poolFilePath : string = getPoolFilePath(fileName);
    const src : string = path.join('file://', poolFilePath);

    return (
      <img
        src={src}
        width={this.props.width.toString()}
        height={this.props.height.toString()}
      />
    );
  }
}
