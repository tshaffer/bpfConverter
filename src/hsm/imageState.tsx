import {
  EventType,
  ButtonPanelName,
} from '@brightsign/bscore';

import {
  DmMediaState,
  DmState,
} from '@brightsign/bsdatamodel';

import {
  ArEventType,
  HSMStateData,
} from '../types';
import MediaHState from './mediaHState';
import { ZoneHSM } from './zoneHSM';
import { MediaZoneHSM } from './mediaZoneHSM';
import { setActiveMediaState } from '../store/activeMediaStates';

export default class ImageState extends MediaHState {

  bsdm : DmState;
  stateMachine : ZoneHSM;

  constructor(zoneHSM : ZoneHSM, mediaState : DmMediaState ) {

      super(zoneHSM, mediaState.id);
      this.bsdm = zoneHSM.bsdm;
      this.mediaState = mediaState;

      this.superState = zoneHSM.stTop;

      this.HStateEventHandler = this.STDisplayingImageEventHandler;
  }

  STDisplayingImageEventHandler(event : ArEventType, stateData : HSMStateData) : string {
    if (event.EventType === 'ENTRY_SIGNAL') {
        console.log(this.id + ': entry signal');
        this.stateMachine.dispatch(setActiveMediaState(this.stateMachine.id, this.id));
        this.launchTimer();
        return 'HANDLED';
    } else if (event.EventType === 'EXIT_SIGNAL') {
      console.log(this.id + ': exit signal');
    } else {
      return this.mediaHStateEventHandler(event, stateData);
    }
    stateData.nextState = this.superState;
    return 'SUPER';
  }
}
