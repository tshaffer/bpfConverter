import {
  ZoneHSM,
} from './zoneHSM';

import {
  BsDmId,
  DmEvent,
  DmMediaState,
  dmGetEventIdsForMediaState,
  dmGetEventStateById,
  dmGetZoneById,
  dmGetZoneSimplePlaylist,
  dmGetMediaStateById,
  dmGetMediaStateIdsForZone,
} from '@brightsign/bsdatamodel';

import {
  LUT,
} from '../types';

import MediaHState from './mediaHState';
import ImageState from './imageState';
import VideoState from './videoState';
import MRSSDataFeedState from './mrssDataFeedState';

export class MediaZoneHSM extends ZoneHSM {

  mediaStateIdToHState : LUT = {};

  constructor(dispatch: Function, getState: Function, zoneId: string) {

    super(dispatch, getState, zoneId);

    this.type = 'media';

    this.constructorHandler = this.videoOrImagesZoneConstructor;
    this.initialPseudoStateHandler = this.videoOrImagesZoneGetInitialState;

    // build playlist
    this.bsdmZone = dmGetZoneById(this.bsdm, { id: zoneId });

    this.id = this.bsdmZone.id;
    this.name = this.bsdmZone.name;

    this.x = this.bsdmZone.position.x;
    this.y = this.bsdmZone.position.y;
    this.width = this.bsdmZone.position.width;
    this.height = this.bsdmZone.position.height;

    this.initialMediaStateId = this.bsdmZone.initialMediaStateId;
    this.mediaStateIds = dmGetMediaStateIdsForZone(this.bsdm, { id: zoneId });
    this.mediaStates = [];

    // states
    let newState : MediaHState = null;
    this.mediaStateIds.forEach( (mediaStateId : BsDmId, index : number) => {
      const bsdmMediaState : DmMediaState = dmGetMediaStateById(this.bsdm, { id : mediaStateId});
      if (bsdmMediaState.contentItem.type === 'Image') {
        newState = new ImageState(this, bsdmMediaState);
      } else if (bsdmMediaState.contentItem.type === 'Video') {
        newState = new VideoState(this, bsdmMediaState);
      } else if (bsdmMediaState.contentItem.type === 'MrssFeed') {
        newState = new MRSSDataFeedState(this, bsdmMediaState);
      }      
      this.mediaStates.push(newState);

      this.mediaStateIdToHState[mediaStateId] = newState;
    });

    // events / transitions
    this.mediaStateIds.forEach( (mediaStateId : BsDmId, index : number) => {

      const targetHState : MediaHState = this.mediaStateIdToHState[mediaStateId];

      const eventIds : BsDmId[] = dmGetEventIdsForMediaState(this.bsdm, { id : mediaStateId });
      targetHState.addEvents(this, eventIds);
    });
  }

  videoOrImagesZoneConstructor() {
    console.log('VideoOrImagesZoneConstructor invoked');

    // const mediaStateIds = dmGetZoneSimplePlaylist(this.bsdm, { id: this.zoneId });
    // should really look at initialMediaStateId, but the following should work for non interactive playlists
    this.activeState = this.mediaStates[0];
  }

  videoOrImagesZoneGetInitialState() {
    console.log('videoOrImagesZoneGetInitialState invoked');

    return this.activeState;
  }
}
