import { connect } from 'react-redux';

import path = require('path');

import {
  DmState,
} from '@brightsign/bsdatamodel';

import {
  ArState,
} from '../types';

import Slick from '../components/slick';
import { SlickProps } from '../components/slick';
import {BsAssetItem} from "@brightsign/bscore";

function mapStateToProps(state : ArState, ownProps : SlickProps) : SlickProps {
  return {
    ...ownProps,
    filePaths : getFilePaths(state.bsdm, ownProps)
  };
}

function getFilePaths(bsdm : DmState, ownProps : SlickProps) : Array<string> {

  let filePaths : Array<string> = [];

  let contentItems : BsAssetItem[] = ownProps.contentItems;
  contentItems.forEach( (assetItem) => {
    const filePath = path.join(assetItem.path, assetItem.name);
    filePaths.push(filePath);
  });
  return filePaths;
}
const SlickContainer = connect(
  mapStateToProps,
)(Slick);

export default SlickContainer;
