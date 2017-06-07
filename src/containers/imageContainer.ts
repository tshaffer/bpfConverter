import { connect } from 'react-redux';

import {
  dmGetAssetItemById,
} from '@brightsign/bsdatamodel';

import {
  ArState,
} from '../types';

import Image from '../components/image';
import { ImageProps, ImagePropsAssetItem } from '../components/image';

function mapStateToProps(state : ArState, ownProps : ImageProps) : ImageProps & ImagePropsAssetItem {

  return {
    ...ownProps,
    bsAssetItem : dmGetAssetItemById(state.bsdm, { id : ownProps.assetId })
  };
}

const ImageContainer = connect(
  mapStateToProps,
)(Image);

export default ImageContainer;
