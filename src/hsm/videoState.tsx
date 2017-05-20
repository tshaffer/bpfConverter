/* @flow */

import { HState } from './HSM';

export default class VideoState extends HState {

  bsdmVideoState : Object;
  state : Object;

  constructor(zoneHSM : Object, bsdmVideoState : Object) {

    super(zoneHSM, bsdmVideoState.id);
    this.bsdmVideoState = bsdmVideoState;

    this.superState = zoneHSM.stTop;

    this.HStateEventHandler = this.STDisplayingVideoEventHandler;
  }

  STDisplayingVideoEventHandler(event : Object, stateData : Object) : string {

    debugger;

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
