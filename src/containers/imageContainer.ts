import { connect } from 'react-redux';

import {
  ArState,
} from '../types';

import Image from '../components/image';
import { ImageProps } from '../components/image';

function mapStateToProps(state : ArState, ownProps : ImageProps) : ImageProps {
  return {
    ...ownProps,
  };
}

const ImageContainer = connect(
  mapStateToProps,
)(Image);

export default ImageContainer;
