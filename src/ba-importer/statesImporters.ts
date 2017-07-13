import {
  DataFeedUsageType,
  AssetLocation,
  bscGetLocalAssetLocator,
  bscGetFileMediaType,
  AssetType,
  BsAssetItem,
  GraphicsZOrderType,
  DeviceWebPageDisplay,
  LanguageKeyType,
  LanguageType,
  MonitorOrientationType,
  MonitorOverscanType,
  TouchCursorDisplayModeType,
  UdpAddressType,
  VideoConnectorType,
  BsColor,
  GpioType,
  BsRect,
  ViewModeType,
  MosaicMaxContentResolutionType,
  ImageModeType,
  EventType,
  MediaType,
  TransitionType,
  BsAssetId,
} from '@brightsign/bscore';

import {
  MediaStateAction,
  dmAddMediaStateWithContentItem,
  dmCreateSlickCarouselContentItem,
  DmSlickCarouselContentItem,
  DmImageContentItemData,
  dmCreateHtmlContentItem,
  BsDmId,
  MediaStateParams,
  dmGetZoneMediaStateContainer,
  BsDmAction,
  dmAddMediaState,
  dmCreateAssetItemFromLocalFile,
  DmDerivedNonMediaContentItem,
} from '@brightsign/bsdatamodel';

import * as Converters from './converters';
import * as Utilities from '../utilities/utilities';

interface MediaStateProperties {
  name : string;
  transitionType : TransitionType;
  transitionDuration : number;
};
type MediaStateNameToMediaStateProperties = { [mediaStateName : string]: MediaStateProperties };

export let mapBacMediaStateNameToMediaStateProps : MediaStateNameToMediaStateProperties = {};

function addImageItem(name : string, bacImageItem : any, zoneId : BsDmId, dispatch : Function) : Promise<BsDmAction<MediaStateParams>> {

  const fileName : string = bacImageItem.file['@name'];
  const filePath : string = Utilities.getPoolFilePath(fileName);
  const bsAssetItem  : BsAssetItem= dmCreateAssetItemFromLocalFile(filePath, '', MediaType.Image);

  const mediaStateDuration : number = Converters.stringToNumber(bacImageItem.slideDelayInterval);
  const transitionType : TransitionType = Converters.getTransitionType(bacImageItem.slideTransition);
  const transitionDuration : number = Converters.stringToNumber(bacImageItem.transitionDuration);
  const videoPlayerRequired : boolean = Converters.stringToBool(bacImageItem.videoPlayerRequired);

  mapBacMediaStateNameToMediaStateProps[name] = {
    name : fileName,
    transitionType,
    transitionDuration,
  }

  const imageContentItemData : DmImageContentItemData = {
    useImageBuffer : false,
    videoPlayerRequired
  };

  const contentItem  : BsAssetItem | DmDerivedNonMediaContentItem= bsAssetItem;

  const addMediaStatePromise  : Promise<BsDmAction<MediaStateParams>> = dispatch(dmAddMediaState(name, dmGetZoneMediaStateContainer(zoneId),
    contentItem, imageContentItemData));
  return addMediaStatePromise;

}

function addSlickCarouselItem(name : string, bacSlickItem : any, zoneId : BsDmId, dispatch : Function) {

  // create an array of file names
  let files : string[] = [];
  let contentItems : BsAssetItem[] = [];

  bacSlickItem.files.imageItem.forEach( (fileItem : any) => {
    files.push(fileItem.file['@name']);

    const fileName : string = fileItem.file['@name'];
    const filePath : string = Utilities.getPoolFilePath(fileName);
    const bsAssetItem  : BsAssetItem= dmCreateAssetItemFromLocalFile(filePath, '', MediaType.Image);
    contentItems.push(bsAssetItem);
  });

  const liveDataFeedName : string = bacSlickItem.liveDataFeedName || '';

  const slickCarouselContentItem : DmSlickCarouselContentItem = dmCreateSlickCarouselContentItem(
    bacSlickItem.name,
    contentItems,
    bacSlickItem.populateFromMediaLibrary,
    // optional parameters
  );
  const mediaStateAction: MediaStateAction = dmAddMediaStateWithContentItem(bacSlickItem.name, dmGetZoneMediaStateContainer(zoneId),
    slickCarouselContentItem);
  const mediaStateParamsAction : BsDmAction<MediaStateParams> = dispatch(mediaStateAction);
}

export function addMediaStates(zoneId : BsDmId, bacZone : any, dispatch : Function, getState : Function) {

  const bacStates = bacZone.playlist.states.state;

  let iterableStates : any = bacStates;
  if (!(bacStates instanceof Array)) {
    iterableStates = [bacStates];
  }

  let addMediaStatePromises : Array<any> = [];
  // let addMediaStatePromises : Array<Promise<BsDmAction<MediaStateParams>>> = [];
  iterableStates.forEach( (bacMediaState : any) => {

    let contentItem : BsAssetItem | DmDerivedNonMediaContentItem;
    let addMediaStatePromise : Promise<BsDmAction<MediaStateParams>>;

    if (bacMediaState.imageItem) {

      const bacImageItem : any = bacMediaState.imageItem;
      addMediaStatePromise = addImageItem(bacMediaState.name, bacImageItem, zoneId, dispatch);
    }
    else if (bacMediaState.slickItem) {
      const bacSlickItem : any = bacMediaState.slickItem;
      addSlickCarouselItem(bacMediaState.name, bacSlickItem, zoneId, dispatch);
      // export function dmCreateSlickCarouselContentItem(
      //   name: string,
      //   files: string[],
      //   populateFromMediaLibrary: boolean,
      //   dataFeedId?: BsDmId,
      //   dots?: boolean,
      //   infinite?: boolean,
      //   speed?: number,
      //   slidesToShow?: number,
      //   slidesToScroll?: number,
      //   autoplay?: boolean,
      //   autoplaySpeed?: number,
      //   fade?: boolean,
      // ): DmSlickCarouselContentItem {

    }
    else if (bacMediaState.videoItem) {
      debugger;
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
