import {
  DmMediaStateState,
  DmState,
} from '@brightsign/bsdatamodel';

import { HState } from './HSM';

import { ZoneHSM } from './zoneHSM';

import {
  ArEventType,
  HSMStateData,
} from '../types';

export default class VideoState extends HState {

  bsdm : DmState;
  bsdmVideoState : DmMediaStateState;
  state : object;
  nextState : HState;
  dispatch : Function;

  constructor(zoneHSM : ZoneHSM, bsdmVideoState : DmMediaStateState) {

    super(zoneHSM, bsdmVideoState.id);
    this.bsdmVideoState = bsdmVideoState;

    this.superState = zoneHSM.stTop;

    this.HStateEventHandler = this.STDisplayingVideoEventHandler;
  }

  setNextState( nextState : HState ) {
    this.nextState = nextState;
  }

  STDisplayingVideoEventHandler(event : ArEventType, stateData : HSMStateData) : string {

    debugger;

    stateData.nextState = null;

    if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
      console.log('entry signal');
      return 'HANDLED';
    } else if (event.EventType && event.EventType === 'EXIT_SIGNAL') {
      console.log('exit signal');
    }

    stateData.nextState = this.superState;
    return 'SUPER';
  }
}
