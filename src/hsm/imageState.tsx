import {
    DataFeedUsageType,
    EventType,
    GraphicsZOrderType,
    ButtonPanelName,
} from '@brightsign/bscore';

import {
  BsDmId,
  DmcEvent,
  DmcMediaState,
  DmcTransition,
  DmMediaState,
  DmState,
} from '@brightsign/bsdatamodel';

import BsHState from './bsHState';

import { ZoneHSM } from './zoneHSM';

import { MediaZoneHSM } from './mediaZoneHSM';

import { setActiveMediaState } from '../store/activeMediaStates';

import {
    ArEventType,
    HSMStateData,
} from '../types';

export default class ImageState extends BsHState {

    bsdm : DmState;
    bsdmImageState : DmMediaState;
    stateMachine : ZoneHSM;

    constructor(zoneHSM : ZoneHSM, bsdmImageState : DmMediaState ) {

        super(zoneHSM, bsdmImageState.id);
        this.bsdm = zoneHSM.bsdm;
        this.bsdmImageState = bsdmImageState;

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

        // iterate through the events for which this state has transitions - if any match the supplied event,
        // execute the associated transition
        const eventList : DmcEvent[] = (this.bsdmImageState as DmcMediaState).eventList;

        stateData.nextState = this.superState;
          
        for (let stateEvent of eventList) {

          const bsEventKey : string = this.getBsEventKey(event);
          // TODO - hack to workaround unfinished code
          if (bsEventKey !== '') {
            if (this.eventLUT.hasOwnProperty(bsEventKey)) {
              stateData.nextState = this.eventLUT[bsEventKey];
              return 'TRANSITION';
            }
          }
        }
      }
      stateData.nextState = this.superState;
      return 'SUPER';
    }
    
    getBsEventKey(bsEvent : ArEventType) :string {

      let bsEventKey : string = '';

      switch (bsEvent.EventType) {
        case EventType.Bp: {
          bsEventKey = bsEvent.EventData.ButtonPanelName + '-' + bsEvent.EventData.ButtonIndex.toString();
          break;
        }
        case EventType.Timer: {
          bsEventKey = 'timer-' + this.id;
          break;
        }
        default: {
          break;
        }
      };

      return bsEventKey;  
    }
      
}
