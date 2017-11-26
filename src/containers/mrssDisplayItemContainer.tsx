import { connect } from 'react-redux';

import {
  getMrssDataFeedItem,
  getMrssDataFeedItemPath,
} from '../store/mrssDataFeedItems';

import MrssDisplayItem from '../components/mrssDisplayItem';
import  MRSSDataFeedItem  from '../entities/mrssDataFeedItem';

import {
  ArState,
} from '../types';

export interface MRSSDisplayItemStateProps {
  dataFeedId : string;
  height : number;
  width : number;
}

export interface MrssDisplayItemProps extends MRSSDisplayItemStateProps {
  mrssDataFeedItem: MRSSDataFeedItem;
  mrssDataFeedItemPath: string;
}

function mapStateToProps(state : ArState, ownProps : MRSSDisplayItemStateProps) {
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

