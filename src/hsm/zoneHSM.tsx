import { HSM, HState, STTopEventHandler } from './HSM';

import {
    BsDmId,
    DmState,
    DmZone,
    dmGetZoneById,
    dmGetZoneSimplePlaylist,
} from '@brightsign/bsdatamodel';

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

    constructor(dispatch: Function, getState : Function, zoneId : string) {
        super();

        this.dispatch = dispatch;
        this.getState = getState;
        this.bsdm = getState().bsdm;
        this.zoneId = zoneId;

        this.stTop = new HState(this, 'Top');
        this.stTop.HStateEventHandler = STTopEventHandler;
        this.topState = this.stTop;

        this.bsdmZone = dmGetZoneById(this.bsdm, { id: zoneId });

        this.id = this.bsdmZone.id;
        this.name = this.bsdmZone.name;

        this.x = this.bsdmZone.absolutePosition.x;
        this.y = this.bsdmZone.absolutePosition.y;
        this.width = this.bsdmZone.absolutePosition.width;
        this.height = this.bsdmZone.absolutePosition.height;

        this.initialMediaStateId = this.bsdmZone.initialMediaStateId;
        this.mediaStateIds = dmGetZoneSimplePlaylist(this.bsdm, { id: zoneId });
    }
}
