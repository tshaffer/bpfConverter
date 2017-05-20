// @flow

import { connect } from 'react-redux';

import Video from '../components/video';


function mapStateToProps (_, ownProps) {
  return {
    ...ownProps,
  };
}

const VideoContainer = connect(
  mapStateToProps,
)(Video);

export default VideoContainer;

