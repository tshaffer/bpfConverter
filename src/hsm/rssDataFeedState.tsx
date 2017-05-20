import {
  DmMediaStateState,
  DmState
} from '@brightsign/bsdatamodel';

import { HSM, HState } from './HSM';

import { ZoneHSM } from './zoneHSM';
import {HSMStateData, ArEventType} from "../types/index";

export default class RSSDataFeedState extends HState {

  bsdmState: any;
  state: any;
  bsdm : any;
  nextState : any;

  constructor(zoneHSM: any, bsdmState: any) {

    super(zoneHSM, bsdmState.id);
    this.bsdm = zoneHSM.bsdm;
    this.bsdmState = bsdmState;

    this.superState = zoneHSM.stTop;

    this.HStateEventHandler = this.STDisplayingRSSDataFeedEventHandler;

  }

  setNextState( nextState : any ) {
    this.nextState = nextState;
  }

  STDisplayingRSSDataFeedEventHandler(event : ArEventType, stateData : HSMStateData) : string {
    stateData.nextState = null;

    if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
      console.log('entry signal');
      return 'HANDLED';
    }
    else if (event.EventType && event.EventType === 'EXIT_SIGNAL') {
      console.log('exit signal');
    }
    stateData.nextState = this.superState;
    return 'SUPER';
  }
}
