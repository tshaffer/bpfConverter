import { HSM, HState, STTopEventHandler } from './HSM';

import {
    DmState,
    dmGetDataFeedIdsForSign,
} from '@brightsign/bsdatamodel';

import { bsp, BSP } from '../app/bsp';
import {
    ArEventType,
    HSMStateData
} from "../types/index";

// import {
//     DataFeed
// } from '../entities/dataFeed';
// type DataFeedLUT = { [dataFeedId:string]: DataFeed };

export class PlayerHSM extends HSM {

    type : string;
    bsp : BSP;
    dispatch : Function;
    getState : Function;
    bsdm : DmState;
    stTop : HState;
    stPlayer : HState;
    stPlaying : HState;
    stWaiting : HState;

    constructor(bsp : BSP, dispatch: Function, getState : Function, bsdm: DmState) {

        super();

        this.type = 'player';

        this.bsp = bsp;
        this.dispatch = dispatch;
        this.getState = getState;
        this.bsdm = bsdm;

        this.stTop = new HState(this, "Top");
        this.stTop.HStateEventHandler = STTopEventHandler;

        this.initialPseudoStateHandler = this.initializePlayerStateMachine;

        this.stPlayer = new HState(this, "Player");
        this.stPlayer.HStateEventHandler = this.STPlayerEventHandler;
        this.stPlayer.superState = this.stTop;

        this.stPlaying = new HState(this, "Playing");
        this.stPlaying.HStateEventHandler = this.STPlayingEventHandler;
        this.stPlaying.superState = this.stPlayer;

        this.stWaiting = new HState(this, "Waiting");
        this.stWaiting.HStateEventHandler = this.STWaitingEventHandler;
        this.stWaiting.superState = this.stPlayer;

        this.topState = this.stTop;
    }

    initializePlayerStateMachine() {

        console.log("initializePlayerStateMachine invoked");


        // ISSUE
        // would like restartBSP to return a promise, then transition to the stPlaying state once that is done.
        // however, this function requires an immediate response
        // the problem is that entering stPlaying state invokes startBSPPlayback before the zones are even created
        this.bsp.restartPlayback('').then( () => {
            // send event to cause transition to stPlaying
            let event = {
                'EventType' : 'TRANSITION_TO_PLAYING'
            };
            this.dispatch(this.bsp.postMessage(event));
        });

        // from autorunClassic

        // activeScheduledPresentation = m.bsp.schedule.activeScheduledEvent
        // if type(activeScheduledPresentation) = "roAssociativeArray" then
        //   return m.stPlaying
        // else
        //   return m.stWaiting
        // endif

        // because of issue above
        return this.stWaiting;
    }

    STPlayerEventHandler(event:  ArEventType, stateData: HSMStateData) : string {

        const myThis : any = this;
        
        stateData.nextState = null;

        if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
            console.log(myThis.id + ": entry signal");
            return 'HANDLED';
        }

        stateData.nextState = myThis.superState;
        return "SUPER";
    }

    STPlayingEventHandler(event:  ArEventType, stateData: HSMStateData) : string {

        const myThis : any = this;

        stateData.nextState = null;

        if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {

            console.log(myThis.id + ": entry signal");

            // TODO
            // set a timer for when the current presentation should end

            // TODO
            // assume presentation is active

            // TODO
            //check for live data feeds that include content (either MRSS or content for Media Lists / PlayFiles).
            // for each of them, check to see if the feed and/or content already exists.

            // update bsdm
            myThis.stateMachine.bsdm = myThis.stateMachine.getState().bsdm;

            // load live data feeds and queue for downloading
            myThis.stateMachine.bsp.liveDataFeedsToDownload = [];

            const dataFeedIds = dmGetDataFeedIdsForSign(myThis.stateMachine.bsdm);
            const dataFeedsById : any = myThis.stateMachine.getState().dataFeeds.dataFeedsById;
            dataFeedIds.forEach( (dataFeedId : string) => {
                const dataFeed = dataFeedsById[dataFeedId];
                myThis.stateMachine.bsp.queueRetrieveLiveDataFeed(dataFeed);
            });

            // launch playback
            const state = myThis.stateMachine.getState();
            myThis.stateMachine.bsdm = state.bsdm;
            myThis.stateMachine.bsp.startPlayback();

            return 'HANDLED';
        }

        stateData.nextState = myThis.superState;
        return "SUPER";
    }


    STWaitingEventHandler(event:  ArEventType, stateData: HSMStateData) : string {

        const myThis : any = this;

        stateData.nextState = null;

        if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
            console.log(myThis.id + ": entry signal");
            return "HANDLED";
        }
        else if (event.EventType && event.EventType === 'TRANSITION_TO_PLAYING') {
            console.log(myThis.id + ": TRANSITION_TO_PLAYING event received");
            stateData.nextState = myThis.stateMachine.stPlaying;
            return "TRANSITION";
        }

        stateData.nextState = myThis.superState;
        return "SUPER";
    }
}