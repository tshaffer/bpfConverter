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
    EventData? : any;
}

export interface HSMStateData {
    nextState : HState;
}

import {
    DmState
} from '@brightsign/bsdatamodel';

export type ARMediaStateLUT = { [ zoneId : string] : HState };
export type ActiveMediaStatesShape = {
    activeMediaStateByZone : ARMediaStateLUT
};
export type StateMachineShape = { playbackState : string };

export interface ArState {
    bsdm : DmState;
    stateMachine : StateMachineShape;
    activeMediaStates : ActiveMediaStatesShape;
    dataFeeds : any;
}

export interface ArSyncSpecHash {
    method : string;
    hex : string;
}

export interface ArSyncSpecDownload {
    name : string;
    hash : ArSyncSpecHash;
    size : number;
    link : string;
}

export interface ArSyncSpecFiles {
    download : ArSyncSpecDownload[];
    ignore : any;
    delete : any;
}

export interface ArSyncSpec {
    meta : any;
    files : any;
}

export interface MediaHState extends HState {
    setNextState : Function;
}

// export type DataFeedLUT = { [dataFeedId:string]: DataFeed };
export type ArFileLUT = { [fileName:string]: string };

// export interface ArFileLUT {
//     [fileName : string] : string;
// };

