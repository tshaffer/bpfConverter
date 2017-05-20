import { connect } from 'react-redux';

import {
  ArState
} from '../types';

import Video from '../components/video';
import { VideoProps } from '../components/video';


function mapStateToProps (_ : ArState, ownProps : VideoProps ) {
  return {
    ...ownProps,
  };
}

const VideoContainer = connect(
  mapStateToProps,
)(Video);

export default VideoContainer;

