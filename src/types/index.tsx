import {Action} from 'redux';

import { HState } from '../HSM/HSM';

export interface ActionWithPayload extends Action {
    payload : any
};

export interface DataFeedState  {
    dataFeedsById : Object
};

export interface ArEventType {
    EventType : string;
    data? : any;
}

export interface HSMStateData {
    nextState : HState;
}