/* @flow */

import { HState } from './HSM';

export default class RSSDataFeedState extends HState {

  bsdmState: Object;
  state: Object;

  constructor(zoneHSM: Object, bsdmState: Object) {

    super(zoneHSM, bsdmState.id);
    this.bsdm = zoneHSM.bsdm;
    this.bsdmState = bsdmState;

    this.superState = zoneHSM.stTop;

    this.HStateEventHandler = this.STDisplayingRSSDataFeedEventHandler;

  }

  setNextState( nextState : Object ) {
    this.nextState = nextState;
  }

  STDisplayingRSSDataFeedEventHandler(event : Object, stateData : Object) : string {
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
