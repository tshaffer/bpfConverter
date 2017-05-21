import { connect } from 'react-redux';

import {
  getMrssDataFeedItem,
  getMrssDataFeedItemPath }
from '../store/mrssDataFeedItems';

import MrssDisplayItem from '../components/mrssDisplayItem';

import {
  ArState
} from '../types';

import {
  MrssDisplayItemProps
} from '../components/mrssDisplayItem';

function mapStateToProps (state : ArState, ownProps : any) {
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

