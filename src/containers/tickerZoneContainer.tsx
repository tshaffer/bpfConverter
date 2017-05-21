import { connect } from 'react-redux';

import TickerZone from '../components/tickerZone';

import {
  ContentItemType
} from '@brightsign/bscore';

import {
  DmDataFeedContentItem,
  DmMediaStateState,
  dmGetMediaStateIdsForZone,
  dmGetMediaStateById,
} from '@brightsign/bsdatamodel';

import {
  ArState
} from '../types';

import {
  TextDataFeed
} from '../entities/textDataFeed';

function mapStateToProps (state : ArState, ownProps : any) {
  return {
    ...ownProps,
    dataFeeds: state.dataFeeds,
    articles : getArticles(state, ownProps.zone.id)
  };
}
export const getArticles = (state : ArState, zoneId : string) : Array<string> => {

  let articles : Array<string> = [];

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
