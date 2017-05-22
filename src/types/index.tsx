import {Action} from 'redux';

import {
    DmState
} from '@brightsign/bsdatamodel';

import { HState } from '../HSM/HSM';

import { DataFeed } from '../entities/dataFeed';
import {MRSSDataFeedItem} from "../entities/mrssDataFeedItem";

export interface ActionWithPayload extends Action {
    payload : any
};

export type ArDataFeedLUT = { [ dataFeedId: string ] : DataFeed };
export interface DataFeedShape  {
    dataFeedsById : ArDataFeedLUT
};

export type ArMrssDataFeedItemLUT = { [ dataFeedId: string ] : MRSSDataFeedItem };
export interface MrssDataFeedItemShape  {
    mrssDataFeedItemsByFeedId : ArMrssDataFeedItemLUT
};


export interface ArEventType {
    EventType : string;
    data? : any;
    EventData? : any;
}

export interface HSMStateData {
    nextState : HState;
}

export type ARMediaStateLUT = { [ zoneId : string] : string };
export type ActiveMediaStatesShape = {
    activeMediaStateIdByZone : ARMediaStateLUT
};

export type StateMachineShape = { playbackState : string };

export interface ArState {
    bsdm : DmState;
    stateMachine : StateMachineShape;
    activeMediaStates : ActiveMediaStatesShape;
    dataFeeds : DataFeedShape;
    mrssDataFeedItems : MrssDataFeedItemShape;
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

