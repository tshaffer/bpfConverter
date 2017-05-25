import {ActionWithPayload, ArState} from '../types/index';

import { MrssDataFeedItemShape } from '../types/index';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_MRSS_DATA_FEED_ITEM = 'SET_FEED_DISPLAY_ITEM';

// ------------------------------------
// Actions
// ------------------------------------
export function setMrssDataFeedItem(mrssDataFeedItemId : string, mrssDataFeedItem : object) {

  return {
    type: SET_MRSS_DATA_FEED_ITEM,
    payload: {
      mrssDataFeedItemId,
      mrssDataFeedItem,
    },
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  mrssDataFeedItemsByFeedId : {},
};

export default function(state : MrssDataFeedItemShape = initialState, action : ActionWithPayload) {

  switch (action.type) {

    case SET_MRSS_DATA_FEED_ITEM: {

      const newState : MrssDataFeedItemShape = Object.assign({}, state);

      const { mrssDataFeedItemId, mrssDataFeedItem } = action.payload;
      newState.mrssDataFeedItemsByFeedId[mrssDataFeedItemId] = mrssDataFeedItem;

      console.log(newState);

      return newState;
    }
  }

  return state;
}

// ------------------------------------
// Selectors
// ------------------------------------
export function getMrssDataFeedItem(state : ArState, mrssDataFeedItemId : string) {

  const mrssDataFeedItemsByFeedId = state.mrssDataFeedItems.mrssDataFeedItemsByFeedId;
  return mrssDataFeedItemsByFeedId[mrssDataFeedItemId];
}

export function getMrssDataFeedItemPath(state : ArState, mrssDataFeedItemId : string) {

  const mrssDataFeedItemsByFeedId = state.mrssDataFeedItems.mrssDataFeedItemsByFeedId;
  const mrssDataFeedItem = mrssDataFeedItemsByFeedId[mrssDataFeedItemId];

  const dataFeed = state.dataFeeds.dataFeedsById[mrssDataFeedItemId];
  const url = mrssDataFeedItem.url;
  return dataFeed.feedPoolAssetFiles[url];
}
