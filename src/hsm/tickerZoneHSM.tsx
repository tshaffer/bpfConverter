/* @flow */

import { HSM, HState, STTopEventHandler } from './HSM';

import {
  dmGetMediaStateById,
  dmGetZoneSimplePlaylist,
  dmGetZonePropertiesById,
  dmGetZoneById,
  // dmGetDataFeedById,
} from '@brightsign/bsdatamodel';

import {
  updateDataFeed
} from '../store/dataFeeds';

import {
  DataFeed
} from '../entities/dataFeed';

type DataFeedLUT = { [dataFeedId:string]: DataFeed };

export class TickerZoneHSM extends HSM {

  constructor(dispatch: Function, getState: Function, zoneId: string) {
    super();

    this.type = 'ticker';

    this.dispatch = dispatch;
    this.getState = getState;
    this.bsdm = getState().bsdm;
    this.zoneId = zoneId;

    this.stTop = new HState(this, "Top");
    this.stTop.HStateEventHandler = STTopEventHandler;
    this.topState = this.stTop;

    this.constructorHandler = this.tickerZoneConstructor;
    this.initialPseudoStateHandler = this.tickerZoneGetInitialState;

    const zoneProperties = dmGetZonePropertiesById(this.bsdm, {id: zoneId});

    this.numberOfLines = zoneProperties.textWidget.numberOfLines;
    this.delay = zoneProperties.textWidget.delay;

    const rotation = zoneProperties.textWidget.rotation;
    switch (rotation) {
      case"0": {
        this.rotation = 0;
        break;
      }
      case "90": {
        this.rotation = 3;
        break;
      }
      case "180": {
        this.rotation = 2;
        break;
      }
      case "270": {
        this.rotation = 1;
        break;
      }
    }

    const alignment = zoneProperties.textWidget.alignment;
    switch (alignment) {
      case "center": {
        this.alignment = 1;
        break;
      }
      case "right": {
        this.alignment = 2;
        break;
      }
      default: {
        this.alignment = 0;
        break;
      }
    }

    this.scrollingMethod = zoneProperties.textWidget.scrollingMethod;

    this.scrollSpeed = zoneProperties.scrollSpeed;

    // necessary if code must support old format live data feeds
    // zoneHSM.rssDownloadPeriodicValue% = sign.rssDownloadPeriodicValue%
    // zoneHSM.rssDownloadTimer = CreateObject("roTimer")

    this.backgroundTextColor = zoneProperties.widget.backgroundTextColor;
    this.backgroundBitmapAssetId = zoneProperties.backgroundBitmapAssetId;
    this.font = zoneProperties.widget.font;
    this.fontSize = zoneProperties.widget.fontSize;
    this.foregroundTextColor = zoneProperties.widget.foregroundTextColor;
    this.safeTextRegion = zoneProperties.widget.safeTextRegion;
    this.stretchBitmapFile = zoneProperties.widget.stretchBitmapFile;

    this.stRSSDataFeedInitialLoad = new HState(this, 'RSSDataFeedInitialLoad');
    this.stRSSDataFeedInitialLoad.HStateEventHandler = this.STRSSDataFeedInitialLoadEventHandler;
    this.stRSSDataFeedInitialLoad.superState = this.stTop;

    this.stRSSDataFeedPlaying = new STRSSDataFeedPlaying(this, "RSSDataFeedPlaying");

    // in autorun classic, this is done in newPlaylist as called from newZoneHSM
    let self = this;
    this.mediaStateIds = dmGetZoneSimplePlaylist(this.bsdm, { id: zoneId });
    this.rssDataFeedItems = [];

    this.mediaStateIds.forEach( (mediaStateId) => {
      const bsdmMediaState = dmGetMediaStateById(this.bsdm, {id: mediaStateId});
      if (bsdmMediaState.contentItem.type === 'DataFeed') {

        // BACONTODO - I think this is sufficient to set 'includesRSSFeeds'
        self.includesRSSFeeds = true;

        const dataFeedsById : DataFeedLUT = getState().dataFeeds.dataFeedsById;
        const dataFeedId = bsdmMediaState.contentItem.dataFeedId;
        const dataFeed = dataFeedsById[dataFeedId];
        self.rssDataFeedItems.push(dataFeed);
      }
    });
  }

  tickerZoneConstructor() {

    // where to create the BSTicker??

    // InitializeZoneCommon(m.bsp.msgPort)
    this.bsdmZone = dmGetZoneById(this.bsdm, { id: this.zoneId });

    this.id = this.bsdmZone.id;
    this.name = this.bsdmZone.name;

    // ticker rectangle parameters
    this.x = this.bsdmZone.absolutePosition.x;
    this.y = this.bsdmZone.absolutePosition.y;
    this.width = this.bsdmZone.absolutePosition.width;
    this.height = this.bsdmZone.absolutePosition.height;
  }

  tickerZoneGetInitialState() {
    if (this.includesRSSFeeds) {
      return this.stRSSDataFeedInitialLoad;
    }
    else {
      return this.stRSSDataFeedPlaying;
    }
  }

  STRSSDataFeedInitialLoadEventHandler(event: Object, stateData: Object): string {

    stateData.nextState = null;

    if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
      console.log(this.id + ": entry signal");
      return "HANDLED";
    }
    else if (event.EventType && event.EventType === 'LIVE_DATA_FEED_UPDATE') {
      this.stateMachine.processLiveDataFeedUpdate(event.EventData);
      stateData.nextState = this.stateMachine.stRSSDataFeedPlaying;
      return "TRANSITION";
    }

    stateData.nextState = this.superState;
    return "SUPER";
  }

  processLiveDataFeedUpdate(dataFeed : DataFeed) {
    this.dispatch(updateDataFeed(dataFeed));
  }
}

export class STRSSDataFeedPlaying extends HState {

  constructor(stateMachine : Object, id : string) {
    super(stateMachine, id);
    this.HStateEventHandler = this.STRSSDataFeedPlayingEventHandler;
    this.superState = stateMachine.stTop;
  }

  STRSSDataFeedPlayingEventHandler(event: Object, stateData: Object): string {

    stateData.nextState = null;

    if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
      console.log(this.id + ": entry signal");
      // this.populateRSSDataFeedWidget();
      return "HANDLED";
    }

    stateData.nextState = this.superState;
    return "SUPER";
  }
}
