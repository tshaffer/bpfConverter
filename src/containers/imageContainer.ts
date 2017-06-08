import { connect } from 'react-redux';

import {
  dmGetAssetItemById,
} from '@brightsign/bsdatamodel';

import {
  ArState,
} from '../types';

import Image from '../components/image';
import { ImageProps } from '../components/image';

function mapStateToProps(state : ArState, ownProps : ImageProps) : ImageProps {

  // bsAssetItem : dmGetAssetItemById(state.bsdm, { id : ownProps.assetId })

  return {
    ...ownProps,
  };
}

const ImageContainer = connect(
  mapStateToProps,
)(Image);

export default ImageContainer;
