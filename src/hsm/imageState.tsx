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

    setNextState( nextState : HState ) {
        this.nextState = nextState;
    }

    STDisplayingImageEventHandler(event : ArEventType, stateData : HSMStateData) : string {

        stateData.nextState = null;

        // javascript hackery
        let transitionFound : boolean = false;

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
          eventList.forEach ((registeredEvent : DmcEvent) => {
            if (event.EventType === registeredEvent.type) {
              const eventData : any = event.EventData;
              const registeredEventData : any = registeredEvent.data;
              // this is not real - don't be fooled
              if (eventData.ButtonIndex === registeredEventData.buttonNumber) {
                // get transition associated with this event
                // not sure about this
                const transition : DmcTransition = registeredEvent.transitionList[0];
                const targetMediaStateId : BsDmId = transition.targetMediaStateId;

                console.log(this.stateMachine);
                // next, find the targetMediaState in the HSM - how the hell do I find this?
                // each imageState in the hsm has a bsdmImageState, which means that it has an id.
                // X iterate through all the imageState objects in this zone and find the one whose id matches
                // X targetMediaStateId
                // iterate through all the HSM imageState objects in this HSM and find the one whose bsdmImageState.id
                // matches targetMediaStateId


                const targetMediaState : HState = (this.stateMachine as MediaZoneHSM).mediaStateIdToHState[targetMediaStateId];
                stateData.nextState = targetMediaState;
                transitionFound = true;
                return 'TRANSITION';
              }
              if (transitionFound) {
                return 'TRANSITION';
              }
            }
            if (transitionFound) {
              return 'TRANSITION';
            }
          });
          if (transitionFound) {
            return 'TRANSITION';
          }
        }

      if (transitionFound) {
        return 'TRANSITION';
      }

      // } else if (event.EventType === 'timeoutEvent') {
        //     console.log(this.id + ': timeoutEvent');
        //     stateData.nextState = this.nextState;
        //     return 'TRANSITION';
        // } else if (event.EventType === EventType.Bp) {
        //     debugger;
        // }

        stateData.nextState = this.superState;
        return 'SUPER';
    }
}
