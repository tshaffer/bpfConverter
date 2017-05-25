import { connect } from 'react-redux';

import TickerZone from '../components/tickerZone';

import {
  ContentItemType,
} from '@brightsign/bscore';

import {
  DmDataFeedContentItem,
  DmMediaStateState,
  DmState,
  DmZone,
  dmGetMediaStateIdsForZone,
  dmGetMediaStateById,
} from '@brightsign/bsdatamodel';

import {
  ArState,
  DataFeedShape,
} from '../types';

import {
  TextDataFeed,
} from '../entities/textDataFeed';

export interface tickerZoneOwnProps {
  bsdm : DmState;
  width : number;
  height : number;
  top : number;
  left : number;
  zone : DmZone;
  playbackState : string;
}

export interface tickerZoneProps extends tickerZoneOwnProps {
  dataFeeds : DataFeedShape;
  articles : string[];
}

function mapStateToProps(state : ArState, ownProps : tickerZoneOwnProps) : tickerZoneProps {
  return {
    ...ownProps,
    dataFeeds: state.dataFeeds,
    articles : getArticles(state, ownProps.zone.id),
  };
}
export const getArticles = (state : ArState, zoneId : string) : string[] => {

  const articles : string[] = [];

  const mediaStateIds = dmGetMediaStateIdsForZone(state.bsdm, { id: zoneId});

  mediaStateIds.forEach( (mediaStateId) => {

    const mediaState : DmMediaStateState = dmGetMediaStateById(state.bsdm, { id : mediaStateId} );
    console.log(mediaState);
    if (mediaState.contentItem.type === ContentItemType.DataFeed) {

      const dataFeedId = (mediaState.contentItem as DmDataFeedContentItem).dataFeedId;

      if (state.dataFeeds.dataFeedsById.hasOwnProperty(dataFeedId)) {
        const textDataFeed : TextDataFeed = state.dataFeeds.dataFeedsById[dataFeedId] as TextDataFeed;
        textDataFeed.rssItems.forEach( (rssItem) => {
          articles.push(rssItem.title);
        });
      }
    }
  });

  return articles;

};

const TickerZoneContainer = connect(
  mapStateToProps,
)(TickerZone);

export default TickerZoneContainer;
