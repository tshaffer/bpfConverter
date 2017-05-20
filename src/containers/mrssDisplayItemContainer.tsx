import { connect } from 'react-redux';

import {
  getMrssDataFeedItem,
  getMrssDataFeedItemPath }
from '../store/mrssDataFeedItems';

import MrssDisplayItem from '../components/mrssDisplayItem';

function mapStateToProps (state : any, ownProps : any) {
  return {
    ...ownProps,
    mrssDataFeedItem : getMrssDataFeedItem(state, ownProps.dataFeedId),
    mrssDataFeedItemPath : getMrssDataFeedItemPath(state, ownProps.dataFeedId)
  };
}

const MrssDisplayItemContainer = connect(
  mapStateToProps,
)(MrssDisplayItem);

export default MrssDisplayItemContainer;

