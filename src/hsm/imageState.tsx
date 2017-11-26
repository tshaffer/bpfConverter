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

import MediaHState from './mediaHState';

import { ZoneHSM } from './zoneHSM';

import { MediaZoneHSM } from './mediaZoneHSM';

import {
    setActiveMediaState,
} from '../store/activeMediaStates';

import {
    ArEventType,
    HSMStateData,
} from '../types';

export default class ImageState extends MediaHState {

    bsdm : DmState;
    bsdmImageState : DmMediaState;
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

/*
current code (as of now)

BrightSign event (from Javascript)
  event.EventType = 'Bp'
  event.EventData
    ButtonIndex = 0
    ButtonPanelName = 'bp900a'
HState events [] (based on my bsdm code)
  event.type = 'Bp'
  event.data
    buttonNumber = 0
    buttonPanelIndex = 0
    buttonPanelType = 'BP900'

bac autorun
    state.bpEvents = CreateObject("roArray", 4, true)
    state.bpEvents[0] = CreateObject("roAssociativeArray")
    state.bpEvents[1] = CreateObject("roAssociativeArray")
    state.bpEvents[2] = CreateObject("roAssociativeArray")
    state.bpEvents[3] = CreateObject("roAssociativeArray")

    if event["EventType"] = "BPControlDown" then
      bpIndex$ = event["ButtonPanelIndex"]
      bpIndex% = int(val(bpIndex$))
      bpNum$ = event["ButtonNumber"]
      bpNum% = int(val(bpNum$))
      m.bsp.diagnostics.PrintDebug("BP Press" + bpNum$ + " on button panel" + bpIndex$)
      bpEvents = m.bpEvents
      currentBPEvent = bpEvents[bpIndex%]
      transition = currentBPEvent[bpNum$]
  
Notes:
  bp900B, bp900C, bp900D, bp200A, bp200B, bp200C, bp200D also exist.
*/
          // iterate through the events for which this state has transitions - if any match the supplied event,
          // execute the associated transition
          const eventList : DmcEvent[] = (this.bsdmImageState as DmcMediaState).eventList;

          stateData.nextState = this.superState;
            
          for (let stateEvent of eventList) {
            console.log(stateEvent);

            const bsEventKey : string = this.getBsEventKey(event);
            // TODO - hack to workaround unfinished code
            if (bsEventKey !== '') {
              if (this.eventLUT.hasOwnProperty(bsEventKey)) {
                stateData.nextState = this.eventLUT[bsEventKey];
                console.log('transition');
                return 'TRANSITION';
              }
            }
          }
        }

        stateData.nextState = this.superState;
        console.log('super');
        console.log(stateData.nextState);
        return 'SUPER';
        
      }

// if (event.EventType === stateEvent.type) {
//   const eventData : any = event.EventData;
//   const registeredEventData : any = stateEvent.data;
//   // this next line is unique to button panel events - pay attention
//   if (eventData.ButtonIndex === registeredEventData.buttonNumber) {
//     const transition : DmcTransition = stateEvent.transitionList[0];
//     const targetMediaStateId : BsDmId = transition.targetMediaStateId;
//     const targetMediaState : MediaHState = (this.stateMachine as MediaZoneHSM).mediaStateIdToHState[targetMediaStateId];
//     stateData.nextState = targetMediaState;
//     return 'TRANSITION';
//   }
// }

    getBsEventKey(bsEvent : ArEventType) :string {
      
      let bsEventKey : string = '';

      switch (bsEvent.EventType) {
        case EventType.Bp: {
          bsEventKey = bsEvent.EventData.ButtonPanelName + '-' + bsEvent.EventData.ButtonIndex.toString();
          break;
        }
        default: {
          console.log('bsEvent.EventType: ' + bsEvent.EventType);
          break;
        }
      };

      return bsEventKey;  
    }
      
}
