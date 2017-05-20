
import { HState } from './HSM';

import {
    setActiveMediaState
} from '../store/activeMediaStates';

import {
    ArEventType,
    HSMStateData,
} from '../types';


export default class ImageState extends HState {

    bsdm : any
    bsdmImageState : any;
    state : any;
    nextState : any;
    dispatch : Function;
    stateMachine : any;

    constructor(zoneHSM : any, bsdmImageState : any) {

        super(zoneHSM, bsdmImageState.id);
        this.bsdm = zoneHSM.bsdm;
        this.bsdmImageState = bsdmImageState;

        this.superState = zoneHSM.stTop;

        this.HStateEventHandler = this.STDisplayingImageEventHandler;
    }

    setNextState( nextState : Object ) {
        this.nextState = nextState;
    }

    STDisplayingImageEventHandler(event : ArEventType, stateData : HSMStateData) : string {

        stateData.nextState = null;

        if (event.EventType === 'ENTRY_SIGNAL') {
            console.log(this.id + ": entry signal");
            this.stateMachine.dispatch(setActiveMediaState(this.stateMachine.id, this.id));
            return 'HANDLED';
        }
        else if (event.EventType === 'EXIT_SIGNAL') {
            console.log(this.id + ": exit signal");
        }

        else if (event.EventType === 'timeoutEvent') {
            console.log(this.id + ": timeoutEvent");

            if (event.EventType === 'timeoutEvent') {
                stateData.nextState = this.nextState;
                return "TRANSITION";
            }
        }

        stateData.nextState = this.superState;
        return 'SUPER';
    }
}
