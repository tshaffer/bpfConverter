/* @flow */

import { HSM, HState, STTopEventHandler } from './HSM';

import {
    BsDmId,
    DmMediaStateState,
    DmState,
    DmZone,
    dmGetZoneById,
    dmGetZoneSimplePlaylist,
    dmGetMediaStateById,
} from '@brightsign/bsdatamodel';

import ImageState from './imageState';

import {
    MediaHState
} from '../types';

export class ZoneHSM extends HSM {

    type : string;
    dispatch : Function;
    getState : Function;
    bsdm : DmState;
    zoneId : string;
    stTop : HState;
    bsdmZone : DmZone;
    id : string;
    name : string;
    x : number;
    y : number;
    width : number;
    height : number;
    initialMediaStateId : string;
    mediaStateIds : BsDmId[];
    mediaStates : MediaHState[];

    constructor(dispatch: Function, getState : Function, zoneId : string) {
        super();

        this.type = 'media';

        this.dispatch = dispatch;
        this.getState = getState;
        this.bsdm = getState().bsdm;
        this.zoneId = zoneId;

        this.stTop = new HState(this, "Top");
        this.stTop.HStateEventHandler = STTopEventHandler;
        this.topState = this.stTop;

        this.constructorHandler = this.videoOrImagesZoneConstructor;
        this.initialPseudoStateHandler = this.videoOrImagesZoneGetInitialState;

        // build playlist
        this.bsdmZone = dmGetZoneById(this.bsdm, { id: zoneId });

        this.id = this.bsdmZone.id;
        this.name = this.bsdmZone.name;

        this.x = this.bsdmZone.absolutePosition.x;
        this.y = this.bsdmZone.absolutePosition.y;
        this.width = this.bsdmZone.absolutePosition.width;
        this.height = this.bsdmZone.absolutePosition.height;

        this.initialMediaStateId = this.bsdmZone.initialMediaStateId;
        this.mediaStateIds = dmGetZoneSimplePlaylist(this.bsdm, { id: zoneId });
        this.mediaStates = [];

        let newState : MediaHState = null;

        this.mediaStateIds.forEach( (mediaStateId : BsDmId, index : number) => {
            const bsdmMediaState : DmMediaStateState = dmGetMediaStateById(this.bsdm, { id : mediaStateId});
            if (bsdmMediaState.contentItem.type === 'Image') {
                newState = new ImageState(this, bsdmMediaState);

                // hack to have this code here - eliminate after adding mrss states
                this.mediaStates.push(newState);

                if (index > 0) {
                    this.mediaStates[index - 1].setNextState(newState);
                }
            }
            else {
                // debugger;
            }

            // this.mediaStates.push(newState);
            //
            // if (index > 0) {
            //     this.mediaStates[index - 1].setNextState(newState);
            // }
        });
        // hack
        if (this.mediaStates.length > 0) {
            this.mediaStates[this.mediaStates.length - 1].setNextState(this.mediaStates[0]);
        }
    }

    videoOrImagesZoneConstructor() {
        console.log("VideoOrImagesZoneConstructor invoked");

        // const mediaStateIds = dmGetZoneSimplePlaylist(this.bsdm, { id: this.zoneId });
        // should really look at initialMediaStateId, but the following should work for non interactive playlists
        this.activeState = this.mediaStates[0];
    }

    videoOrImagesZoneGetInitialState() {
        console.log("videoOrImagesZoneGetInitialState invoked");

        return this.activeState;
    }
}

