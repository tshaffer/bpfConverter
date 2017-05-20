import { HSM, HState, STTopEventHandler } from './HSM';

import {
  BsDmId,
  DmState,
  DmZone,
  dmGetZoneById,
  dmGetZoneSimplePlaylist,
  dmGetMediaStateById,
  dmGetZonePropertiesById,
} from '@brightsign/bsdatamodel';

import ImageState from './imageState';

import {
  HSMStateData, ArEventType
} from '../types';

import {
  updateDataFeed
} from '../store/dataFeeds';

import {
  MediaHState
} from '../types';

export class TickerZoneHSM extends HSM {

  type : string;
  dispatch : Function;
  getState : Function;
  bsdm : DmState;
  zoneId : string;
  stTop : HState;
  bsdmZone : DmZone;
  id : string;
  name : string;
  x : number;
  y : number;
  width : number;
  height : number;
  mediaStateIds : BsDmId[];
  numberOfLines : number;
  delay : number;
  rotation : any;
  alignment : any;
  scrollingMethod : any;
  scrollSpeed : any;
  backgroundTextColor : any;
  backgroundBitmapAssetId : any;
  font : any;
  fontSize : any;
  foregroundTextColor : any;
  safeTextRegion : any;
  stretchBitmapFile : any;
  rssDataFeedItems : any;
  includesRSSFeeds : boolean;
  stateMachine : any;
  stRSSDataFeedInitialLoad : HState;
  stRSSDataFeedPlaying : HState;
  initialMediaStateId : string;
  mediaStates : MediaHState[];

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

    const zoneProperties : any = dmGetZonePropertiesById(this.bsdm, {id: zoneId});

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

    this.stRSSDataFeedInitialLoad = new STRSSDataFeedInitialLoad(this, "RSSDataFeedInitialLoad", this.stTop);
    this.stRSSDataFeedPlaying = new STRSSDataFeedPlaying(this, "RSSDataFeedPlaying", this.stTop);

    // in autorun classic, this is done in newPlaylist as called from newZoneHSM
    let self = this;
    this.mediaStateIds = dmGetZoneSimplePlaylist(this.bsdm, { id: zoneId });
    this.rssDataFeedItems = [];

    this.mediaStateIds.forEach( (mediaStateId) => {
      const bsdmMediaState : any = dmGetMediaStateById(this.bsdm, {id: mediaStateId});
      if (bsdmMediaState.contentItem.type === 'DataFeed') {

        // BACONTODO - I think this is sufficient to set 'includesRSSFeeds'
        self.includesRSSFeeds = true;

        const dataFeedsById : any = getState().dataFeeds.dataFeedsById;
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

  processLiveDataFeedUpdate(dataFeed : any) {
    this.dispatch(updateDataFeed(dataFeed));
  }
}

export class STRSSDataFeedPlaying extends HState {

  constructor(stateMachine : TickerZoneHSM, id : string, superState : HState) {
    super(stateMachine, id);
    this.HStateEventHandler = this.STRSSDataFeedPlayingEventHandler;
    this.superState = superState;
  }

  STRSSDataFeedPlayingEventHandler(event: ArEventType, stateData: HSMStateData): string {

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

class STRSSDataFeedInitialLoad extends HState {

  constructor(stateMachine : TickerZoneHSM, id : string, superState : HState) {
    super(stateMachine, id);
    this.HStateEventHandler = this.STRSSDataFeedInitialLoadEventHandler;
    this.superState = superState;
  }

  STRSSDataFeedInitialLoadEventHandler(event:  ArEventType, stateData: HSMStateData) : string {
    stateData.nextState = null;

    if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
      console.log(this.id + ": entry signal");
      return "HANDLED";
    }
    else if (event.EventType && event.EventType === 'LIVE_DATA_FEED_UPDATE') {
      (this.stateMachine as TickerZoneHSM).processLiveDataFeedUpdate(event.EventData);
      stateData.nextState = (this.stateMachine as TickerZoneHSM).stRSSDataFeedPlaying;
      return "TRANSITION";
    }

    stateData.nextState = this.superState;
    return "SUPER";
  }
}
