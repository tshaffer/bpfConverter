// @flow

import React, { Component } from 'react';

import path from 'path';

import ImageContainer from '../containers/imageContainer';

export default class MrssDisplayItem extends Component {

  constructor(props : Object) {
    super(props);
    this.timeout = null;
  }

  timeout : ?number;

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

MrssDisplayItem.propTypes = {
  dataFeedId: React.PropTypes.string.isRequired,
  mrssDataFeedItem : React.PropTypes.object.isRequired,
  mrssDataFeedItemPath : React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  duration: React.PropTypes.number.isRequired,
  onTimeout: React.PropTypes.func.isRequired,
};
