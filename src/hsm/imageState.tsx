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

import { HState } from './HSM';

import { ZoneHSM } from './zoneHSM';

import { MediaZoneHSM } from './mediaZoneHSM';

import {
    setActiveMediaState,
} from '../store/activeMediaStates';

import {
    ArEventType,
    HSMStateData,
} from '../types';

export default class ImageState extends HState {

    bsdm : DmState;
    bsdmImageState : DmMediaState;
    nextState : HState;
    dispatch : Function;
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
            return 'HANDLED';
        } else if (event.EventType === 'EXIT_SIGNAL') {
          console.log(this.id + ': exit signal');
        } else {
          // iterate through the events for which this state has transitions - if any match the supplied event,
          // execute the associated transition
          const eventList : DmcEvent[] = (this.bsdmImageState as DmcMediaState).eventList;

          stateData.nextState = this.superState;
            
          for (let registeredEvent of eventList) {
            console.log(registeredEvent);
            if (event.EventType === registeredEvent.type) {
              const eventData : any = event.EventData;
              const registeredEventData : any = registeredEvent.data;
              // this next line is unique to button panel events - pay attention
              if (eventData.ButtonIndex === registeredEventData.buttonNumber) {
                const transition : DmcTransition = registeredEvent.transitionList[0];
                const targetMediaStateId : BsDmId = transition.targetMediaStateId;
                const targetMediaState : HState = (this.stateMachine as MediaZoneHSM).mediaStateIdToHState[targetMediaStateId];
                stateData.nextState = targetMediaState;
                return 'TRANSITION';
              }
            }
          }
        }

        stateData.nextState = this.superState;
        let retValue : string = 'SUPER';
    }
}
