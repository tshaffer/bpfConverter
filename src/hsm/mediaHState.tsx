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
  
import { ZoneHSM } from './zoneHSM';
  
import { HState } from './HSM';

import { EventLUT } from '../types';

import { MediaZoneHSM } from './mediaZoneHSM';

export default class MediaHState extends HState {

  eventLUT : EventLUT = {};

  addEvents(zoneHSM : ZoneHSM, eventIds : BsDmId[]) {
    eventIds.forEach( (eventId : BsDmId) => {
      
      // generate eventKey
      const event : DmEvent = dmGetEventStateById(zoneHSM.bsdm, { id : eventId });
      const eventKey : string = this.getHStateEventKey(event);

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
          }
          case 'BP200': {
            // TODO
            debugger;
          }
        }
      }

    }

    return eventKey;
  }
  
}
    