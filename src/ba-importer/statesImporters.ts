import {
  BsAssetItem,
  MediaType,
  TransitionType,
  VideoDisplayModeType,
} from '@brightsign/bscore';

import {
  MediaStateAction,
  dmAddMediaStateWithContentItem,
  DmImageContentItemData,
  DmVideoContentItemData,
  dmCreateHtmlContentItem,
  BsDmId,
  MediaStateParams,
  dmGetZoneMediaStateContainer,
  BsDmAction,
  dmAddMediaState,
  dmCreateAssetItemFromLocalFile,
} from '@brightsign/bsdatamodel';

import * as Converters from './converters';
import * as Utilities from '../utilities/utilities';

interface MediaStateProperties {
  name : string;
  transitionType? : TransitionType;
  transitionDuration? : number;
};
type MediaStateNameToMediaStateProperties = { [mediaStateName : string]: MediaStateProperties };

export let mapBacMediaStateNameToMediaStateProps : MediaStateNameToMediaStateProperties = {};

function getBsAssetItem(bacMediaItem : any, mediaType : MediaType) : BsAssetItem {

  const fileName : string = bacMediaItem.file['@name'];
  const filePath : string = Utilities.getPoolFilePath(fileName);
  const bsAssetItem  : BsAssetItem= dmCreateAssetItemFromLocalFile(filePath, '', mediaType);

  return bsAssetItem;
}

function addVideoItem(name : string, bacVideoItem : any, zoneId : BsDmId, dispatch : Function) : void {

  const bsAssetItem : BsAssetItem = getBsAssetItem(bacVideoItem, MediaType.Video);

  const fileName : string = bacVideoItem.file['@name'];
  mapBacMediaStateNameToMediaStateProps[name] = {
    name : fileName
  };

  const volume : number = 100;
  const videoDisplayMode : VideoDisplayModeType = VideoDisplayModeType.m2D;
  const automaticallyLoop : boolean = false;
  const videoContentItemData : DmVideoContentItemData = {
    volume,
    videoDisplayMode,
    automaticallyLoop
  };

  dispatch(dmAddMediaState(name, dmGetZoneMediaStateContainer(zoneId),
    bsAssetItem, videoContentItemData));
}

function addImageItem(name : string, bacImageItem : any, zoneId : BsDmId, dispatch : Function) : void {

  const bsAssetItem : BsAssetItem = getBsAssetItem(bacImageItem, MediaType.Image);

  const fileName : string = bacImageItem.file['@name'];
  const transitionType : TransitionType = Converters.getTransitionType(bacImageItem.slideTransition);
  const transitionDuration : number = Converters.stringToNumber(bacImageItem.transitionDuration);
  mapBacMediaStateNameToMediaStateProps[name] = {
    name : fileName,
    transitionType,
    transitionDuration,
  };

  const videoPlayerRequired : boolean = Converters.stringToBool(bacImageItem.videoPlayerRequired);
  const imageContentItemData : DmImageContentItemData = {
    useImageBuffer : false,
    videoPlayerRequired
  };

  dispatch(dmAddMediaState(name, dmGetZoneMediaStateContainer(zoneId),
    bsAssetItem, imageContentItemData));
}

export function addMediaStates(zoneId : BsDmId, bacZone : any, dispatch : Function, getState : Function) {

  const bacStates = bacZone.playlist.states.state;

  let iterableStates : any = bacStates;
  if (!(bacStates instanceof Array)) {
    iterableStates = [bacStates];
  }

  iterableStates.forEach( (bacMediaState : any) => {
    if (bacMediaState.imageItem) {
      const bacImageItem : any = bacMediaState.imageItem;
      addImageItem(bacMediaState.name, bacImageItem, zoneId, dispatch);
    }
    else if (bacMediaState.videoItem) {
      const bacVideoItem : any = bacMediaState.videoItem;
      addVideoItem(bacMediaState.name, bacVideoItem, zoneId, dispatch);
    }
  });
}

const createHtmlContentItem = (asset : any = {}) => {
  //const currentHtmlSites = dmGetHtmlSiteIdsForSign(getBsdmStore(state));
  //if(currentHtmlSites.length > 0)
  //  return dmGetMediaStateById(state.bsdm, {id: currentHtmlSites[0]});
  //else
  //  return null;
  return dmCreateHtmlContentItem(
    asset.name,
    asset.siteId,
    asset.enableExternalData,
    asset.enableMouseEvents,
    asset.displayCursor,
    asset.hwzOn,
    asset.useUserStylesheet,
    asset.userStylesheetAssetId,
    asset.customFonts
  );
};
