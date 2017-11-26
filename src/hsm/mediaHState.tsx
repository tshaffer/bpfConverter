import {
  EventType
} from '@brightsign/bscore';

import {
    BsDmId,
    DmBpEventData,
    DmEvent,
    DmcMediaState,
    DmcTransition,
    DmMediaState,
    DmTransition,
    DmState,
    DmTimer,
  } from '@brightsign/bsdatamodel';
  
  import {
    dmGetEventIdsForMediaState,
    dmGetEventStateById,
    dmGetTransitionById,
    dmGetTransitionIdsForEvent,
    dmGetZoneById,
    dmGetZoneSimplePlaylist,
    dmGetMediaStateById,
    dmGetMediaStateIdsForZone,
  } from '@brightsign/bsdatamodel';
  
import { bsp } from '../app/bsp';
  
import { ZoneHSM } from './zoneHSM';
  
import { HState } from './HSM';

import { EventLUT } from '../types';
import {
  ArEventType,
} from '../types/index';


import { MediaZoneHSM } from './mediaZoneHSM';

export default class MediaHState extends HState {

  eventLUT : EventLUT = {};
  timeoutInterval : number = null;

  addEvents(zoneHSM : ZoneHSM, eventIds : BsDmId[]) {
    eventIds.forEach( (eventId : BsDmId) => {
      
      // generate eventKey
      const event : DmEvent = dmGetEventStateById(zoneHSM.bsdm, { id : eventId });
      const eventKey : string = this.getHStateEventKey(event);

      // not sure best way to do this, so do it this way for now
      if (event.type === EventType.Timer) {
        const interval : number = (event.data as DmTimer).interval;
        this.timeoutInterval = interval;
      }
      // get transition
      const transitionIds : BsDmId[] = dmGetTransitionIdsForEvent(zoneHSM.bsdm, {id : event.id} );
      // TODO - only support a single transition per event for now
      if (transitionIds.length !== 1) {
        debugger;
      }
      const transition : DmcTransition = dmGetTransitionById(zoneHSM.bsdm, { id : transitionIds[0]} );

      // TODO - limited functionality at the moment
      const targetMediaStateId = transition.targetMediaStateId;

      // TODO - may be bogus
      const mediaZoneHSM : MediaZoneHSM = zoneHSM as MediaZoneHSM;

      // TODO - use a function - don't use LUT directly
      const targetMediaHState : HState = mediaZoneHSM.mediaStateIdToHState[targetMediaStateId];
      this.eventLUT[eventKey] = targetMediaHState;
    });
  }

  getHStateEventKey(event : DmEvent) :string {

    let eventKey : string = '';

    console.log('getHState, event type is: ' + event.type);

    switch (event.type) {
      case EventType.Bp: {
        // TODO - refine
        const eventData : DmBpEventData = event.data as DmBpEventData;

        switch (eventData.buttonPanelType) {
          case 'BP900': {
            switch (eventData.buttonPanelIndex) {
              case 0: {
                eventKey = 'bp900a' + '-' + eventData.buttonNumber.toString();
                break;                
              }
              case 1: {
                eventKey = 'bp900b' + '-' + eventData.buttonNumber.toString();
                break;                
              }
              default: {
                // TODO
                debugger;
              }
            }
            break;
          }
          case 'BP200': {
            // TODO
            debugger;
          }
        }
        break;
      }
      case EventType.Timer: {
        const eventData : DmTimer = event.data as DmTimer;
        // const interval : number = eventData.interval;
        eventKey = 'timer-' + this.id;
      }
    }

    return eventKey;
  }
  
  launchTimer() : void {
    if (this.timeoutInterval && this.timeoutInterval > 0) {
      setTimeout(this.timeoutHandler, this.timeoutInterval * 1000, this);
    }
  }

  timeoutHandler(arg : any) {
    const mediaHState : MediaHState = arg as MediaHState;
    const eventKey : string = 'timer-' + mediaHState.id;
    if (mediaHState.eventLUT.hasOwnProperty(eventKey)) {
      const targetHState : HState = mediaHState.eventLUT[eventKey];

      const event : ArEventType = {
        EventType: EventType.Timer,
      };

      bsp.dispatchPostMessage(event);
    }
  }
}
    