import {
  DmMediaState,
  DmState,
} from '@brightsign/bsdatamodel';

import { HState } from './HSM';

import { ZoneHSM } from './zoneHSM';

import {
  setActiveMediaState,
} from '../store/activeMediaStates';

import {
  ArEventType,
  HSMStateData,
} from '../types';

export default class VideoState extends HState {

  bsdm : DmState;
  bsdmVideoState : DmMediaState;
  // state : object;
  nextState : HState;
  dispatch : Function;
  stateMachine : ZoneHSM;

  constructor(zoneHSM : ZoneHSM, bsdmVideoState : DmMediaState) {

    super(zoneHSM, bsdmVideoState.id);
    this.bsdmVideoState = bsdmVideoState;

    this.superState = zoneHSM.stTop;

    this.HStateEventHandler = this.STDisplayingVideoEventHandler;
  }

  STDisplayingVideoEventHandler(event : ArEventType, stateData : HSMStateData) : string {

    stateData.nextState = null;

    if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
      console.log('entry signal');
      this.stateMachine.dispatch(setActiveMediaState(this.stateMachine.id, this.id));
      return 'HANDLED';
    } else if (event.EventType && event.EventType === 'EXIT_SIGNAL') {
      console.log('exit signal');
    } else if (event.EventType === 'mediaEndEvent') {
      stateData.nextState = this.nextState;
      return 'TRANSITION';
    }

    stateData.nextState = this.superState;
    return 'SUPER';
  }
}
