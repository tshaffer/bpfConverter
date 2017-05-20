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

import {
    DmState
} from '@brightsign/bsdatamodel';

export interface ArState {
    bsdm : DmState;
    stateMachine : any;
    activeMediaStates : any;
    dataFeeds : any;
}

export interface ArSyncSpec {
    files : any;
}

export interface MediaHState extends HState {
    setNextState : Function;
}