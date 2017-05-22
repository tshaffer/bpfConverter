import { connect } from 'react-redux';

import {
  getMrssDataFeedItem,
  getMrssDataFeedItemPath }
from '../store/mrssDataFeedItems';

import MrssDisplayItem from '../components/mrssDisplayItem';

import {
  ArState
} from '../types';

export interface MRSSDisplayItemStateProps {
  dataFeedId : string
  duration : number;
  height : number;
  onTimeout : Function;
  width : number
}

function mapStateToProps (state : ArState, ownProps : MRSSDisplayItemStateProps) {
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

