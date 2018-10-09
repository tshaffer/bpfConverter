import path from 'isomorphic-path';

import { isNil } from 'lodash';

import {
  EventIntrinsicAction,
  BpType,
  BpIndex,
  ButtonDirection,
  RegionDirection,
  DistanceUnits,

  bscAssetItemFromBasicAssetInfo,
  getEnumKeyOfValue,
  AccessType,
  AssetLocation,
  AssetType,
  AudioMixModeType,
  BsAssetId,
  BsAssetIdNone,
  BsAssetItem,
  BsColor,
  BsnFeedProperties,
  BsRect,
  DataFeedUsageType,
  DeviceWebPageDisplay,
  GraphicsZOrderType,
  EventType,
  HtmlSiteType,
  ImageModeType,
  LanguageType,
  LanguageKeyType,
  LiveVideoInputType,
  LiveVideoStandardType,
  MediaType,
  MonitorOrientationType,
  RotationType,
  SystemVariableType,
  TextHAlignmentType,
  TextScrollingMethodType,
  TransitionType,
  UdpAddressType,
  VideoConnectorType,
  ZoneType,
} from '@brightsign/bscore';

import { fsGetAssetItemFromFile } from '@brightsign/fsconnector';

import {
  dmCreateEventDataForEventType,
  DmEventSpecification,
  dmCreateDefaultEventSpecificationForEventType,
  dmInteractiveAddTransitionForEventSpecification,
  InteractiveAddEventTransitionAction,
  InteractiveAddEventTransitionParams,
  dmGetMediaStateById,
  dmGetMediaStateByName,
  DmBpEventData,
  DmGpioEventData,
  DmGpsEventData,
  DmPluginMessageEventData,
  DmRectangularTouchEventData,
  DmTimer,

  DmTimeClockEventData,
  DmTimeClockEventType,
  DmTimeClockDateTimeEventData,
  DmTimeClockByUserVariableEventData,
  DmTimeClockDailyOnceEventData,
  DmTimeClockDailyPeriodicEventData,

  AudioSignPropertyMapParams,
  BrightScriptPluginParams,
  BsDmAction,
  BsDmId,
  BsDmThunkAction,
  BsnDataFeedAction,
  DataFeedAction,
  DmEventData,
  DmcHtmlSite,
  DmcParserBrightScriptPlugin,
  DmcUserVariable,
  DmAudioOutputAssignmentMap,
  DmAudioSignProperties,
  DmAudioSignPropertyMap,
  DmAudioZonePropertyData,
  DmBrightScriptPlugin,
  DmDataFeedContentItem,
  DmHtmlContentItem,
  DmImageZoneProperties,
  DmImageZonePropertyData,
  DmLiveVideoContentItem,
  DmMediaStateContainer,
  DmMrssDataFeedContentItem,
  DmParameterizedString,
  DmSerialPortConfiguration,
  DmSerialPortList,
  DmSignMetadata,
  DmSignProperties,
  DmSignState,
  DmState,
  DmTextWidget,
  DmTickerZoneProperties,
  DmVideoStreamContentItem,
  DmVideoZoneProperties,
  DmVideoZonePropertyData,
  DmWidget,
  DmcDataFeed,
  EventParams,
  HtmlSiteHostedAction,
  HtmlSiteRemoteAction,
  MediaStateAction,
  MediaStateParams,
  ParserBrightScriptPluginParams,
  SignAction,
  TickerZonePropertyParams,
  TransitionAction,
  UserVariableAction,
  VideoOrImagesZonePropertyParams,
  VideoZonePropertyParams,
  ZoneAction,
  ZoneAddAction,
  ZoneAddParams,
  ZonePropertyUpdateAction,
  ZonePropertyUpdateParams,
  dmAddBrightScriptPlugin,
  dmAddBsnDataFeed,
  dmAddEvent,
  dmAddHostedHtmlSite,
  dmAddMediaState,
  dmAddParserBrightScriptPlugin,
  dmAddRemoteHtmlSite,
  dmAddDataFeed,
  // dmAddTransition,
  dmAddUserVariable,
  dmAddZone,
  dmAppendStringToParameterizedString,
  dmAppendUserVariableToParameterizedString,
  dmCreateDataFeedContentItem,
  dmCreateHtmlContentItem,
  dmCreateLiveVideoContentItem,
  dmCreateMrssDataFeedContentItem,
  dmCreateVideoStreamContentItem,
  dmGetDataFeedByName,
  dmGetEmptyParameterizedString,
  dmGetHtmlSiteByName,
  dmGetParserPluginByName,
  dmGetScriptPluginIds,
  dmGetScriptPluginStateById,
  dmGetUserVariableById,
  dmGetUserVariableIdForName,
  dmGetZoneMediaStateContainer,
  dmGetZonePropertiesById,
  dmGetSignState,
  dmNewSign,
  dmUpdateSignAudioPropertyMap,
  dmUpdateSignProperties,
  dmUpdateSignSerialPorts,
  dmUpdateZone,
  dmUpdateZoneProperties, DmZoneSpecificProperties, HtmlSiteHostedParams, DmcMediaState, DmEvent, BsDmIdNone,
  DmSimpleEventData, DmUdpEventData, DmSerialEventData,
} from '@brightsign/bsdatamodel';

import {
  BsAsset,
  BsAssetCollection,
  cmGetBsAssetCollection
} from '@brightsign/bs-content-manager';

import * as Converters from './converters';

import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';

// TODO - store this in redux?
const bsnDynamicPlaylistCollection : BsAssetCollection = null;
const bsnTaggedPlaylistCollection : BsAssetCollection = null;
const bsnDataFeedCollection : BsAssetCollection = null;
const bsnMediaFeedCollection : BsAssetCollection = null;

export function generateDmStateFromBpf(bpf : any) : Function {

  return (dispatch : Function, getState : Function) : Promise<void> => {
    return new Promise( (resolve, reject) => {
      dispatch(newSign(bpf));
      dispatch(setSignProperties(bpf));
      dispatch(setSignAudioProperties(bpf));
      dispatch(setSerialPortConfiguration(bpf));
      // need to add data feeds before adding user variables, or need to make two passes through user variables
      dispatch(addUserVariables(bpf.metadata.userVariables));
      dispatch(addHtmlSites(bpf.metadata.htmlSites));
      dispatch(addScriptPlugins(bpf.metadata.scriptPlugins));
      dispatch(addParserPlugins(bpf.metadata.parserPlugins));
      const addLiveDataFeedsPromise : Promise<void> = dispatch(addLiveDataFeeds(bpf.metadata.liveDataFeeds));

      addLiveDataFeedsPromise.then( () => {
        dispatch(addZones(bpf));
        resolve(getState().bsdm);
      }).catch( (err) => {
        return reject(new BpfConverterError(BpfConverterErrorType.unexpectedError, 'generateDmStateFromBpf: ' + err));
      });
    });
  };
}

function newSign(bpf : any) : Function {
  return (dispatch : Function) : any => {
    const {name, videoMode, model} = bpf.metadata;
    dispatch(dmNewSign(name, videoMode, model));
  };
}

function setSignProperties(bpf : any) : Function {

  return (dispatch : Function, getState : Function) : any => {

    const state = getState();

    let signAction: SignAction;
    let signState: DmSignState;
    let signMetadata: DmSignMetadata;
    let signProperties: DmSignProperties;

    signState = dmGetSignState(state.bsdm);
    signMetadata = signState.sign;
    signProperties = signMetadata.properties;

    const {
      alphabetizeVariableNames,
      autoCreateMediaCounterVariables,
      delayScheduleChangeUntilMediaEndEvent,
      deviceWebPageDisplay,
      flipCoordinates,
      forceResolution,
      graphicsZOrder,
      htmlEnableJavascriptConsole,
      inactivityTime,
      inactivityTimeout,
      isMosaic,
      language,
      languageKey,
      monitorOrientation,
      monitorOverscan,
      resetVariablesOnPresentationStart,
      tenBitColorEnabled,
      touchCursorDisplayMode,
      udpDestinationAddress,
      udpDestinationAddressType,
      udpDestinationPort,
      udpReceiverPort,
      videoConnector,
    } = bpf.metadata;

    if (!getEnumKeyOfValue(DeviceWebPageDisplay, deviceWebPageDisplay)) {
      throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'DeviceWebPageDisplay: ' + deviceWebPageDisplay);
    }
    if (!getEnumKeyOfValue(GraphicsZOrderType, graphicsZOrder))  {
      throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'GraphicsZOrderType: ' + graphicsZOrder);
    }
    if (!getEnumKeyOfValue(LanguageType, language))  {
      throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'LanguageType: ' + language);
    }
    if (!getEnumKeyOfValue(LanguageKeyType, languageKey))  {
      throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'LanguageKeyType: ' + languageKey);
    }

    // convert monitorOrientation from ba to bacon
    let baconMonitorOrientation: MonitorOrientationType = MonitorOrientationType.Landscape;
    switch (monitorOrientation.toLowerCase()) {
      case 'portraitbottomonright': {
        baconMonitorOrientation = MonitorOrientationType.PortraitBottomRight;
      }
      case 'portraitbottomleft': {
        baconMonitorOrientation = MonitorOrientationType.PortraitBottomLeft;
      }
    }

    // TODO NoOverscan vs. noOverscan
    // if (!getEnumKeyOfValue(MonitorOverscanType, monitorOverscan)) debugger;
    // if (!getEnumKeyOfValue(TouchCursorDisplayModeType, touchCursorDisplayMode)) debugger;
    if (!getEnumKeyOfValue(UdpAddressType, udpDestinationAddressType))  {
      throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
        'UdpAddressType: ' + udpDestinationAddressType);
    }
    if (!getEnumKeyOfValue(VideoConnectorType, videoConnector))  {
      throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError, 'VideoConnectorType: ' + videoConnector);
    }

    const {a, r, g, b} = bpf.metadata.backgroundScreenColor;
    const backgroundScreenColor: BsColor = {a, r, g, b};

// TEDDY - the following variable(s) are in the bsdm definition but not yet imported from bpf
//    networkedVariablesUpdateInterval - note that this appears in bpfToJson.ts#metadataSpec
//
    signAction = dispatch(dmUpdateSignProperties(
      {
        id: signProperties.id,
        alphabetizeVariableNames,
        autoCreateMediaCounterVariables,
        backgroundScreenColor,
        delayScheduleChangeUntilMediaEndEvent,
        deviceWebPageDisplay,
        flipCoordinates,
        forceResolution,
        graphicsZOrder,
        htmlEnableJavascriptConsole,
        inactivityTime,
        inactivityTimeout,
        isMosaic,
        language,
        languageKey,
        monitorOrientation: (baconMonitorOrientation as MonitorOrientationType),
        monitorOverscan,
        resetVariablesOnPresentationStart,
        tenBitColorEnabled,
        touchCursorDisplayMode,
        udpDestinationAddress,
        udpDestinationAddressType,
        udpDestinationPort,
        udpReceiverPort,
        videoConnector,
      }
    ));
  };
}

function setSignAudioProperties(bpf : any) : Function {

  return (dispatch : Function) : any => {
    const bpfAudioVolumeNames : string[] = [
      'audio1',
      'audio2',
      'audio3',
      'hdmi',
      'spdif',
      'usbA',
      'usbB',
      'usbC',
      'usbD',
    ];

    const bpfxAudioOutputs: string[] = [
      'analog1',
      'analog2',
      'analog3',
      'hdmi',
      'spdif',
      'usbA',
      'usbB',
      'usbC',
      'usbD',
    ];

    const audioSignPropertyMap : DmAudioSignPropertyMap = {};
    let audioSignProperties : DmAudioSignProperties;

    for (let i = 0; i < bpfAudioVolumeNames.length; i++) {
      audioSignProperties = {
        min: bpf.metadata[bpfAudioVolumeNames[i] + 'MinVolume'],
        max: bpf.metadata[bpfAudioVolumeNames[i] + 'MaxVolume'],
      };
      audioSignPropertyMap[bpfxAudioOutputs[i]] = audioSignProperties;
    }

    const audioSignPropertyMapParams : AudioSignPropertyMapParams = {
      params : audioSignPropertyMap
    };

    dispatch(dmUpdateSignAudioPropertyMap(audioSignPropertyMapParams));
  };
}

function setSerialPortConfiguration(bpf : any) : Function {
  return (dispatch : Function) : any => {
    const serialPortList : DmSerialPortList = bpf.metadata.SerialPortConfigurations.map(
      (serialPortConfiguration : DmSerialPortConfiguration) : DmSerialPortConfiguration => {
        return serialPortConfiguration;
      });
    dispatch(dmUpdateSignSerialPorts({
      params : serialPortList
    }));
  };
}

function buildAudioOutputAssignmentMap(zoneSpecificParameters : any) : DmAudioOutputAssignmentMap {

  const bpfAudioOutputs : string[] = [
    'analogOutput',
    'analog2Output',
    'analog3Output',
    'hdmiOutput',
    'spdifOutput',
    'usbOutputA',
    'usbOutputB',
    'usbOutputC',
    'usbOutputD',
  ];

  const bpfxAudioOutputs: string[] = [
    'analog1',
    'analog2',
    'analog3',
    'hdmi',
    'spdif',
    'usbA',
    'usbB',
    'usbC',
    'usbD',
  ];

  const audioOutputAssignments: DmAudioOutputAssignmentMap = {};

  for (let i = 0; i < bpfAudioOutputs.length; i++) {
    audioOutputAssignments[bpfxAudioOutputs[i]] =
      Converters.getAudioOutputType(zoneSpecificParameters[bpfAudioOutputs[i]]);
  }

  return audioOutputAssignments;
}

function getVideoZonePropertyData(zoneSpecificParameters: any) : DmVideoZonePropertyData {

  if (!getEnumKeyOfValue(LiveVideoInputType, zoneSpecificParameters.liveVideoInput))  {
    throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
      'LiveVideoInputType: ' + zoneSpecificParameters.liveVideoInput);
  }
  if (!getEnumKeyOfValue(LiveVideoStandardType, zoneSpecificParameters.liveVideoStandard))  {
    throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
      'LiveVideoStandardType: ' + zoneSpecificParameters.liveVideoStandard);
  }
  if (!getEnumKeyOfValue(AudioMixModeType, zoneSpecificParameters.audioMixMode))  {
    throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
      'AudioMixModeType: ' + zoneSpecificParameters.audioMixMode);
  }

  // TODO mosaicDecoderName if mosiac is invoked
  const videoZonePropertyData : DmVideoZonePropertyData = {
    viewMode : Converters.getViewMode(zoneSpecificParameters.viewMode),
    liveVideoInput : zoneSpecificParameters.liveVideoInput,
    liveVideoStandard : zoneSpecificParameters.liveVideoStandard,
    videoVolume : zoneSpecificParameters.videoVolume,
    brightness : zoneSpecificParameters.brightness,
    contrast : zoneSpecificParameters.contrast,
    saturation : zoneSpecificParameters.saturation,
    hue : zoneSpecificParameters.hue,
    zOrderFront : zoneSpecificParameters.zOrderFront,
    mosaic : zoneSpecificParameters.mosaic,
    maxContentResolution : Converters.getMosaicMaxContentResolution(zoneSpecificParameters.maxContentResolution),
    mosaicDecoderName: ''
  };

  return videoZonePropertyData;
}

function getAudioZonePropertyData(zoneSpecificParameters: any) : DmAudioZonePropertyData {

  const audioOutputAssignmentMap : DmAudioOutputAssignmentMap =
    buildAudioOutputAssignmentMap(zoneSpecificParameters);

  if (!getEnumKeyOfValue(AudioMixModeType, zoneSpecificParameters.audioMixMode))  {
    throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
      'AudioMixModeType: ' + zoneSpecificParameters.audioMixMode);
  }

  const audioZonePropertyData : DmAudioZonePropertyData = {
    audioOutput : Converters.getAudioOutput(zoneSpecificParameters.audioOutput),
    audioMode : Converters.getAudioMode(zoneSpecificParameters.audioMode),
    audioMapping : Converters.getAudioMapping(zoneSpecificParameters.audioMapping),
    audioOutputAssignments : audioOutputAssignmentMap,
    audioMixMode : zoneSpecificParameters.audioMixMode,
    audioVolume : zoneSpecificParameters.audioVolume,
    minimumVolume : zoneSpecificParameters.minimumVolume,
    maximumVolume : zoneSpecificParameters.maximumVolume,
  };

  return audioZonePropertyData;
}

function setZoneProperties(bpfZone : any, zoneId : BsDmId, zoneType : ZoneType) : Function {

  return (dispatch : Function, getState: Function) : any => {
    switch (zoneType) {
      case ZoneType.VideoOrImages: {

        const zoneSpecificParameters = bpfZone.zoneSpecificParameters;

        const imageMode : ImageModeType = Converters.getImageMode(zoneSpecificParameters.imageMode);

        const imageZonePropertyData : DmImageZonePropertyData = {
          imageMode,
        };
        const imageZoneProperties : DmImageZoneProperties = imageZonePropertyData;

        const audioZonePropertyData : DmAudioZonePropertyData = getAudioZonePropertyData(zoneSpecificParameters);

        const videoZonePropertyData: DmVideoZonePropertyData = getVideoZonePropertyData(zoneSpecificParameters);

        const videoZoneProperties : DmVideoZoneProperties =
          Object.assign({}, videoZonePropertyData, audioZonePropertyData);

        const zonePropertyParams : VideoOrImagesZonePropertyParams =
          Object.assign({}, videoZoneProperties, imageZoneProperties);

        const zonePropertyUpdateParams : ZonePropertyUpdateParams = {
          id: zoneId,
          type: ZoneType.VideoOrImages,
          properties : zonePropertyParams
        };
        const updateZonePropertyThunkAction : BsDmThunkAction<ZonePropertyUpdateParams> =
          dmUpdateZoneProperties(zonePropertyUpdateParams);
        const updateZonePropertyAction : ZonePropertyUpdateAction = dispatch(updateZonePropertyThunkAction);

        break;
      }
      case ZoneType.VideoOnly: {

        const zoneSpecificParameters = bpfZone.zoneSpecificParameters;

        const audioZonePropertyData : DmAudioZonePropertyData = getAudioZonePropertyData(zoneSpecificParameters);

        const videoZonePropertyData: DmVideoZonePropertyData = getVideoZonePropertyData(zoneSpecificParameters);

        const videoZoneProperties : DmVideoZoneProperties =
          Object.assign({}, videoZonePropertyData, audioZonePropertyData);

        const zonePropertyParams : VideoZonePropertyParams =
          Object.assign({}, videoZoneProperties);

        const zonePropertyUpdateParams : ZonePropertyUpdateParams = {
          id: zoneId,
          type: ZoneType.VideoOnly,
          properties : zonePropertyParams
        };
        const updateZonePropertyThunkAction : BsDmThunkAction<ZonePropertyUpdateParams> =
          dmUpdateZoneProperties(zonePropertyUpdateParams);
        const updateZonePropertyAction : ZonePropertyUpdateAction = dispatch(updateZonePropertyThunkAction);
        break;
      }
      case ZoneType.Images: {
        break;
      }
      case ZoneType.AudioOnly: {
        break;
      }
      case ZoneType.EnhancedAudio: {
        break;
      }
      case ZoneType.Ticker: {

        // const zoneProperties: DmZoneSpecificProperties = dmGetZonePropertiesById(getState().bsdm, { id: zoneId });
        // const tickerZoneProperties: DmTickerZoneProperties = zoneProperties as DmTickerZoneProperties;

        const zoneSpecificParameters = bpfZone.zoneSpecificParameters;
        console.log(zoneSpecificParameters);

        const textWidgetParameters: any = zoneSpecificParameters.textWidget;
        const widgetParameters: any = zoneSpecificParameters.widget;

        let rotation: RotationType = RotationType.rot0;
        if (textWidgetParameters.rotation === 90) {
          rotation = RotationType.rot90;
        }
        else if (textWidgetParameters.rotation === 180) {
          rotation = RotationType.rot180;
        }
        else if (textWidgetParameters.rotation === 270) {
          rotation = RotationType.rot270;
        }

        let alignment: TextHAlignmentType = TextHAlignmentType.Left;
        if (textWidgetParameters.alignment === 'center') {
          alignment = TextHAlignmentType.Center;
        }
        else {
          alignment = TextHAlignmentType.Right;
        }

        let scrollingMethod: TextScrollingMethodType = TextScrollingMethodType.Animated;
        if (textWidgetParameters.scrollingMethod === 1) {
          scrollingMethod = TextScrollingMethodType.StaticText;
        }
        else if (textWidgetParameters.scrollingMethod === 3) {
          scrollingMethod = TextScrollingMethodType.Scrolling;
        }
        // TODO - can scrollingMethod === 2?

        const textWidget: DmTextWidget = {
          numberOfLines: textWidgetParameters.numberOfLines,
          delay: textWidgetParameters.delay,
          rotation,
          alignment,
          scrollingMethod,
        };

        const foregroundTextColor: BsColor = getBsColor(widgetParameters.foregroundTextColor);
        const backgroundTextColor: BsColor = getBsColor(widgetParameters.backgroundTextColor);

// font: tickerZoneProperties.widget.font,
// fontSize: tickerZoneProperties.widget.fontSize,
// safeTextRegion: widgetParameters.safeTextRegion,
        // TODO
        const safeTextRegion : BsRect = {
          x: 0,
          y: 0,
          width: 1920,
          height: 1080,
          pct: false
        };

        let bsAssetItem: BsAssetItem = null;

        const backgroundBitmapFilePath: string = widgetParameters.backgroundBitmap;
        if (backgroundBitmapFilePath !== '') {
          bsAssetItem = fsGetAssetItemFromFile(backgroundBitmapFilePath);
          if (isNil(bsAssetItem)) {
            bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.Content, path.basename(backgroundBitmapFilePath),
              backgroundBitmapFilePath);
          }
        }
        const widget: DmWidget = {
          foregroundTextColor,
          backgroundTextColor,
          font: widgetParameters.font,
          fontSize: widgetParameters.fontSize,
          stretchBitmapFile: widgetParameters.stretchBitmapFile,
          safeTextRegion,
          backgroundBitmapAssetId: BsAssetIdNone,
        };

        const tickerZonePropertyParams: TickerZonePropertyParams = {
          textWidget,
          widget,
          scrollSpeed: zoneSpecificParameters.scrollSpeed
        };

        // TODO - why not assign unconditionally?
        // if (!isNil(bsAssetItem) && !linkBroken) {
        //   tickerZonePropertyParams.backgroundAsset = bsAssetItem;
        // }
        tickerZonePropertyParams.backgroundAsset = bsAssetItem;

        const zonePropertyUpdateParams : ZonePropertyUpdateParams = {
          id: zoneId,
          type: ZoneType.Ticker,
          properties : tickerZonePropertyParams
        };

        const updateZonePropertyThunkAction : BsDmThunkAction<ZonePropertyUpdateParams> =
          dmUpdateZoneProperties(zonePropertyUpdateParams);
        const updateZonePropertyAction : ZonePropertyUpdateAction = dispatch(updateZonePropertyThunkAction);

        break;
      }
      case ZoneType.Clock: {
        break;
      }
      case ZoneType.BackgroundImage: {
        break;
      }
      default: {
        throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'setZoneProperties: ' + zoneType);
      }
    }
  };
}

function getBsColor(bpfColorSpec: any): BsColor {
  const {a, r, g, b} = bpfColorSpec;
  const color: BsColor = {a, r, g, b};
  return color;
}

function addImageItem(zoneId: BsDmId, state: any, initialState: boolean): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    // TODO - why are some of these parameters unused?
    const {file, fileIsLocal, slideDelayInterval, slideTransition, transitionDuration, videoPlayerRequired} = state;

    const fileName = file.name;
    const filePath = file.path;
    let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
    const linkBroken: boolean = bsAssetItem === null;
    if (!bsAssetItem) {
      bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.Content, fileName,
        filePath);
    }

    // TEDDY - convert slideTransition to TransitionType and supply here instead of hardcoded value.
    const addMediaStateThunkAction = dmAddMediaState(bsAssetItem.name, zone, bsAssetItem,
      { defaultTransition: TransitionType.NoEffect, transitionDuration} );
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    // TODO - do this for all states?
    if (initialState) {
      dispatch(dmUpdateZone({
        id: zoneId,
        initialMediaStateId: mediaStateParams.id,
      }));
    }

    return mediaStateParams.id;
  };
}

function addVideoItem(zoneId: BsDmId, state: any, initialState: boolean): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    // TODO - why are some of these parameters unused?
    const {automaticallyLoop, file, fileIsLocal, videoDisplayMode, volume} = state;

    const fileName = file.name;
    const filePath = file.path;
    let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
    const linkBroken : boolean = bsAssetItem === null;
    if (!bsAssetItem) {
      bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.Content, fileName,
        filePath);
    }

    const addMediaStateThunkAction = dmAddMediaState(bsAssetItem.name, zone, bsAssetItem);
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    // TODO - do this for all states?
    if (initialState) {
      dispatch(dmUpdateZone({
        id: zoneId,
        initialMediaStateId: mediaStateParams.id,
      }));
    }

    return mediaStateParams.id;
  };
}

function addAudioItem(zoneId: BsDmId, state: any, initialState: boolean): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    // TODO - why are some of these parameters unused?
    const {file, fileIsLocal, volume} = state;

    const fileName = file.name;
    const filePath = file.path;
    let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
    const linkBroken : boolean = bsAssetItem === null;
    if (!bsAssetItem) {
      bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.Content, fileName,
        filePath);
    }

    const addMediaStateThunkAction = dmAddMediaState(bsAssetItem.name, zone, bsAssetItem);
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    // TODO - do this for all states?
    if (initialState) {
      dispatch(dmUpdateZone({
        id: zoneId,
        initialMediaStateId: mediaStateParams.id,
      }));
    }

    return mediaStateParams.id;
  };
}

function addLiveVideoItem(zoneId: BsDmId, state: any, initialState: boolean): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    const {overscan, timeOnScreen, volume} = state;

    // TODO - name?
    const liveVideoContentItem: DmLiveVideoContentItem =
      dmCreateLiveVideoContentItem('liveVideo', volume, overscan);

    const addMediaStateThunkAction = dmAddMediaState('liveVideo', zone, liveVideoContentItem);
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    // TODO - do this for all states?
    if (initialState) {
      dispatch(dmUpdateZone({
        id: zoneId,
        initialMediaStateId: mediaStateParams.id,
      }));
    }

    return mediaStateParams.id;
  };
}

function addRssDataFeedPlaylistItem(zoneId: BsDmId, state: any, initialState: boolean): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    const dmcDataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, {name: state.liveDataFeedName});

    // TODO - HACK!!
    state.stateName = state.liveDataFeedName;
    const rssDataFeedContentItem : DmDataFeedContentItem = dmCreateDataFeedContentItem(
      state.stateName, dmcDataFeed.id
    );

    const addMediaStateThunkAction = dmAddMediaState(state.stateName, zone, rssDataFeedContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;

    // TODO - do this for all states?
    if (initialState) {
      dispatch(dmUpdateZone({
        id: zoneId,
        initialMediaStateId: mediaStateParams.id,
      }));
    }

    return mediaStateParams.id;
  };
}

function addMrssDataFeedPlaylistItem(zoneId: BsDmId, state: any, initialState: boolean): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    const dmcDataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, {name: state.liveDataFeedName});

    const mrssDataFeedContentItem: DmMrssDataFeedContentItem = dmCreateMrssDataFeedContentItem(
      state.stateName, dmcDataFeed.id, state.videoPlayerRequired);

    const addMediaStateThunkAction = dmAddMediaState(state.stateName, zone, mrssDataFeedContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;

    // TODO - do this for all states?
    if (initialState) {
      dispatch(dmUpdateZone({
        id: zoneId,
        initialMediaStateId: mediaStateParams.id,
      }));
    }

    return mediaStateParams.id;

  };
}

function addHtmlItem(zoneId: BsDmId, state: any, initialState: boolean): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    const {enableExternalData, enableMouseEvents, displayCursor, htmlSiteName, hwzOn, name, timeOnScreen, type,
      useUserStylesheet, userStylesheet} = state;

    const dmcHtmlSite: DmcHtmlSite = dmGetHtmlSiteByName(getState().bsdm, {name: htmlSiteName});

    // userStylesheetAssetId - TODO
    // no customFonts
    const htmlContentItem: DmHtmlContentItem = dmCreateHtmlContentItem(name, dmcHtmlSite.id, enableExternalData,
      enableMouseEvents, displayCursor, hwzOn, useUserStylesheet);

    const addMediaStateThunkAction = dmAddMediaState(state.stateName, zone,
      htmlContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;

    // TODO - do this for all states?
    if (initialState) {
      dispatch(dmUpdateZone({
        id: zoneId,
        initialMediaStateId: mediaStateParams.id,
      }));
    }

    return mediaStateParams.id;

  };
}

function buildZonePlaylist(bpfZone : any, zoneId : BsDmId) : Function {

  return (dispatch: Function, getState: Function): any => {

    let bsdm : DmState = getState().bsdm;

    const mediaStateIds: BsDmId[] = [];
    const eventSpecifications: DmEventSpecification[] = [];

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);
    bpfZone.playlist.states.forEach((state: any, index: number) => {
      switch (state.type) {
        case 'imageItem': {
          bsdm = getState().bsdm;
          const mediaStateId: string = dispatch(addImageItem(zoneId, state, index === 0));
          bsdm = getState().bsdm;

          mediaStateIds.push(mediaStateId);
          eventSpecifications.push({
            type: EventType.Timer,
            data: {
              interval: Number(state.slideDelayInterval),
            } as DmTimer
          } as DmEventSpecification);

          break;
        }
        case 'videoItem': {
          bsdm = getState().bsdm;
          const mediaStateId: string = dispatch(addVideoItem(zoneId, state, index === 0));
          bsdm = getState().bsdm;

          mediaStateIds.push(mediaStateId);
          eventSpecifications.push({
            type: EventType.MediaEnd,
            data: null
          } as DmEventSpecification);

          break;
        }
        case 'audioItem': {
          bsdm = getState().bsdm;
          const mediaStateId: string = dispatch(addAudioItem(zoneId, state, index === 0));
          bsdm = getState().bsdm;

          mediaStateIds.push(mediaStateId);
          eventSpecifications.push({
            type: EventType.MediaEnd,
            data: null
          } as DmEventSpecification);

          break;
        }
        case 'liveVideoItem': {
          const mediaStateId: string = dispatch(addLiveVideoItem(zoneId, state, index === 0));

          mediaStateIds.push(mediaStateId);
          eventSpecifications.push({
            type: EventType.Timer,
            data: {
              interval: Number(state.timeOnScreen),
            } as DmTimer
          } as DmEventSpecification);

          break;
        }
        case 'audioStreamItem':
        case 'mjpegStreamItem':
          break;
        case 'videoStreamItem': {

          const { timeOnScreen } = state;

          const url = convertParameterValue(bsdm, state.url);

          // TODO - volume

          const videoStreamContentItem : DmVideoStreamContentItem =
            dmCreateVideoStreamContentItem('videoStream', url);

          const addMediaStateThunkAction : BsDmThunkAction<MediaStateParams> =
          dmAddMediaState('videoStream', zone, videoStreamContentItem);
          const mediaStateAction : MediaStateAction = dispatch(addMediaStateThunkAction);
          const mediaStateParams : MediaStateParams = mediaStateAction.payload;

          const eventAction : any = dispatch(dmAddEvent('timeout', EventType.Timer, mediaStateParams.id,
            { interval : timeOnScreen } ));
          const eventParams : EventParams = eventAction.payload;

          mediaStateIds.push(mediaStateParams.id);

          if (timeOnScreen === 0) {
            eventSpecifications.push({
              type: EventType.MediaEnd,
              data: null
            } as DmEventSpecification);
          }
          else {
            eventSpecifications.push({
              type: EventType.Timer,
              data: {
                interval: timeOnScreen,
              } as DmTimer
            } as DmEventSpecification);
          }

          break;
        }
        // ?? time interval?
        case 'rssDataFeedPlaylistItem':
          dispatch(addRssDataFeedPlaylistItem(zoneId, state, index === 0));
          break;

        // ?? time interval?
        case 'mrssDataFeedItem': {
          const mediaStateId: string = dispatch(addMrssDataFeedPlaylistItem(zoneId, state, index === 0));

          mediaStateIds.push(mediaStateId);
          eventSpecifications.push({
            type: EventType.MediaEnd,
            data: null
          } as DmEventSpecification);

          break;
        }
        case 'html5Item': {
          const mediaStateId: string = dispatch(addHtmlItem(zoneId, state, index === 0));

          mediaStateIds.push(mediaStateId);
          eventSpecifications.push({
            type: EventType.Timer,
            data: {
              interval: Number(state.timeOnScreen),
            } as DmTimer
          } as DmEventSpecification);

          break;
        }
        case 'mediaListItem':
        case 'eventHandler2Item':
        case 'superStateItem':
        default:
          console.log('buildZonePlaylist: ', state.type);
          break;
      }
    });

    bsdm = getState().bsdm;

    if (bpfZone.playlist.states.length > 0) {
      if (bpfZone.playlist.type === 'interactive') {
        dispatch(buildInteractiveTransitions(bpfZone));
      }
      else {
        buildNonInteractiveTransitions(dispatch, bsdm, mediaStateIds, eventSpecifications);
      }
    }
  };
}

function getBpTypeFromButtonPanelType(buttonPanelType: string): BpType {
  switch (buttonPanelType) {
    case 'BP200':
      return BpType.Bp200;
    case 'BP900':
    default:
      return BpType.Bp900;
  }
}

function getBpIndexFromButtonPanelIndex(buttonPanelIndex: number): BpIndex {
  switch (buttonPanelIndex) {
    case 3:
      return BpIndex.D;
    case 2:
      return BpIndex.C;
    case 1:
      return BpIndex.B;
    case 0:
    default:
      return BpIndex.A;
  }
}

function getPressContinuous(userEvent: any) {
  let pressContinuous: any = null;
  if (!isNil(userEvent.parameters.pressContinuous)) {
    pressContinuous = {
      repeatInterval: userEvent.parameters.pressContinuous.repeatInterval,
      initialHoldOff: userEvent.parameters.pressContinuous.initialHoldoff,
    };
  }
  return pressContinuous;
}

// TODO - investigate refactoring some of the transition code.
function buildInteractiveTransitions(bpfZone: any) {

  return (dispatch: Function, getState: Function) => {

    bpfZone.playlist.transitions.forEach( (transition: any) => {
      console.log(transition);

      const {
        assignInputToUserVariable,
        assignWildcardToUserVariable,
        displayMode,
        labelLocation,
        remainOnCurrentStateActions,
        sourceMediaState,
        targetMediaState,
        userEvent,
      } = transition;

      dispatch(buildInteractiveTransition(assignInputToUserVariable, assignWildcardToUserVariable, displayMode,
        labelLocation, remainOnCurrentStateActions, sourceMediaState, targetMediaState, userEvent));

    });
  };
}

function buildInteractiveTransition(assignInputToUserVariable: boolean,
                                    assignWildcardToUserVariable: boolean,
                                    displayMode: string,
                                    labelLocation: string,
                                    remainOnCurrentStateActions: any,
                                    sourceMediaStateId: BsDmId,
                                    targetMediaStateId: BsDmId,
                                    userEvent: any) {

  return (dispatch: Function, getState: Function) => {

    let eventType: EventType;
    let eventData: DmEventData;

    const bsdm: DmState = getState().bsdm;
    const sourceMediaState: DmcMediaState = dmGetMediaStateByName(bsdm, { name: sourceMediaStateId });
    const targetMediaState: DmcMediaState = dmGetMediaStateByName(bsdm, { name: targetMediaStateId });

    switch (userEvent.name) {
      case 'bp900AUserEvent': {
        eventType = EventType.Bp;

        eventData = {
          bpType: getBpTypeFromButtonPanelType(userEvent.parameters.buttonPanelType),
          bpIndex: getBpIndexFromButtonPanelIndex(userEvent.parameters.buttonPanelIndex),
          buttonNumber: userEvent.parameters.buttonNumber,
          pressContinuous: getPressContinuous(userEvent),
        } as DmBpEventData;

        break;
      }
      case 'timeout': {
        eventType = EventType.Timer;
        eventData = {
          interval: userEvent.parameters.parameter,
        } as DmTimer;
        break;
      }
      case 'gpioUserEvent': {
        eventType = EventType.Gpio;
        const buttonDirection: ButtonDirection = userEvent.parameters.buttonDirection.toLowerCase() === 'down' ?
          ButtonDirection.Down : ButtonDirection.Up;
        eventData = {
          buttonNumber: userEvent.parameters.buttonNumber,
          buttonDirection,
          pressContinuous: getPressContinuous(userEvent),
        } as DmGpioEventData;
        break;
      }
      case 'rectangularTouchEvent': {
        eventType = EventType.RectangularTouch;
        eventData = {
          regions: [
            {
              x: userEvent.parameters.x,
              y: userEvent.parameters.y,
              width: userEvent.parameters.width,
              height: userEvent.parameters.height,
              pct: false,
            }
          ]
        } as DmRectangularTouchEventData;
        break;
      }
      case 'mediaEnd': {
        eventType = EventType.MediaEnd;
        eventData = null;
        break;
      }
      case 'synchronize': {
        eventType = EventType.Synchronize;
        eventData = {
          data: userEvent.parameters.parameter
        } as DmSimpleEventData;
        break;
      }
      case 'udp': {
        // TODO - other members of EventType.Udp
        eventType = EventType.Udp;
        eventData = {
          data: userEvent.parameters.parameter,
          label: userEvent.parameters.label,
          export: userEvent.parameters.export,
        } as DmUdpEventData;
        break;
      }
      case 'serial':
        eventType = EventType.Serial;
        eventData = {
          port: userEvent.parameters.parameter,
          data: userEvent.parameters.parameter2,
        } as DmSerialEventData;
        break;
      case 'keyboard': {
        eventType = EventType.Keyboard;
        eventData = {
          data: userEvent.parameters.parameter
        } as DmSimpleEventData;
        break;
      }
      case 'usb': {
        eventType = EventType.Usb;
        eventData = {
          data: userEvent.parameters.parameter
        } as DmSimpleEventData;
        break;
      }
      case 'timeClockEvent':
        eventType = EventType.TimeClock;
        switch (userEvent.parameters.type) {
          case 'timeClockDateTime':
            eventData = {
              type: DmTimeClockEventType.DailyOnce,
              data: {
                dateTime: new Date(userEvent.parameters.dateTime),
              },
            } as DmTimeClockEventData;
            break;
        }
        break;
      case 'zoneMessage': {
        eventType = EventType.ZoneMessage;
        eventData = {
          data: userEvent.parameters.parameter
        } as DmSimpleEventData;
        break;
      }
      case 'remote': {
        eventType = EventType.Remote;
        eventData = {
          data: userEvent.parameters.parameter
        } as DmSimpleEventData;
        break;
      }
      // TODO - other members of EventType.PluginMessage
      case 'pluginMessageEvent': {
        eventType = EventType.PluginMessage;
        eventData = {
          name: userEvent.parameters.name,
          message: userEvent.parameters.message,
        } as DmPluginMessageEventData;
        break;
      }
      // TODO - as of 10/8/208, there's a bug in bscore for DistanceUnits
      case 'gpsEvent': {
        eventType = EventType.Gps;
        eventData = {
          direction: userEvent.parameters.enterRegion ? RegionDirection.Enter : RegionDirection.Exit,
          radius: userEvent.parameters.gpsRegion.radius,
          distanceUnits:
            userEvent.parameters.gpsRegion.radiusUnitsInMiles ? DistanceUnits.Miles : DistanceUnits.Kilometers,
          latitude: userEvent.parameters.gpsRegion.latitude,
          longitude: userEvent.parameters.gpsRegion.longitude,
        } as DmGpsEventData;
        break;
      }
      case 'audioTimeCodeEvent': {
        break;
      }
      case 'videoTimeCodeEvent': {
        break;
      }
      case 'mediaListEnd': {
        eventType = EventType.MediaListEnd;
        eventData = null;
        break;
      }
      default:
        console.log('buildInteractiveTransition - userEvent name: ', userEvent.name);
        userEvent.parameters = null;
        return;
    }

    const eventSpecification: DmEventSpecification =
      dmCreateDefaultEventSpecificationForEventType(eventType, eventData, sourceMediaState.contentItem.type,
        EventIntrinsicAction.None);

    const thunkAction: BsDmThunkAction<InteractiveAddEventTransitionParams> =
      dmInteractiveAddTransitionForEventSpecification(sourceMediaState.name + '_ev',
        sourceMediaState.id,
        targetMediaStateId,
        eventSpecification);
    dispatch(thunkAction as any);
  };
}

function buildNonInteractiveTransitions(dispatch: Function, bsdm: DmState, mediaStateIds: BsDmId[],
                                        eventSpecifications: DmEventSpecification[]) {
  for (let i = 0; i < (mediaStateIds.length - 1); i++) {
    buildTransition(dispatch, bsdm, mediaStateIds[i], mediaStateIds[i + 1], eventSpecifications[i]);
  }
  buildTransition(dispatch, bsdm, mediaStateIds[mediaStateIds.length - 1], mediaStateIds[0],
    eventSpecifications[mediaStateIds.length - 1]);
}

function buildTransition(dispatch: Function, bsdm: DmState, sourceIndex: string, targetIndex: string,
                         eventSpecification: DmEventSpecification) {

  const sourceMediaState: DmcMediaState = dmGetMediaStateById(bsdm, { id: sourceIndex}) as DmcMediaState;
  const targetMediaState: DmcMediaState = dmGetMediaStateById(bsdm, { id: targetIndex}) as DmcMediaState;

  const thunkAction: BsDmThunkAction<InteractiveAddEventTransitionParams> =
    dmInteractiveAddTransitionForEventSpecification(sourceMediaState.name + '_ev',
      sourceMediaState.id,
      targetMediaState.id,
      eventSpecification);
  dispatch(thunkAction as any);
}

function convertParameterValue(bsdm: DmState, bpfParameterValue : any) : DmParameterizedString {

  let parameterValue : DmParameterizedString = dmGetEmptyParameterizedString();

  bpfParameterValue.parameterValueItems.forEach( (parameterValueItem : any) => {
    switch (parameterValueItem.type) {
      case 'textValue': {
        parameterValue = dmAppendStringToParameterizedString(parameterValue, parameterValueItem.textValue);
        break;
      }
      case 'userVariable': {
        const userVariableId: BsDmId = dmGetUserVariableIdForName(bsdm,
          { name: parameterValueItem.userVariable.name });
        const userVariable: DmcUserVariable = dmGetUserVariableById(bsdm, { id: userVariableId} );
        parameterValue = dmAppendUserVariableToParameterizedString(parameterValue,
          userVariable.id);
        break;
      }
      default: {
        throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
          'unimplemented parameter value type: ' + parameterValueItem.type);
      }
    }
  });

  return parameterValue;
}

function addBsnFeed(bsnFeedName : string, baFeedName : string, assetType : AssetType,
                    usageType : DataFeedUsageType) : Function {
  return (dispatch : Function) : any => {
    return new Promise((resolve : Function, reject : Function) => {
      fetchBsnFeeds(assetType).then((bsnFeedCollection) => {
        const bsDataFeedAsset : BsAsset = fetchBsDataFeedAsset(bsnFeedCollection, bsnFeedName);
        const bsnDataFeedAction : BsnDataFeedAction = dmAddBsnDataFeed(bsDataFeedAsset.assetItem, usageType,
          baFeedName);
        dispatch(bsnDataFeedAction);
        resolve();
      }).catch( (err) => {
        return reject(new BpfConverterError(BpfConverterErrorType.unexpectedError, 'addBsnFeed: ' + err));
      });
    });
  };
}

function addLiveDataFeeds(liveDataFeeds: any[]) : Function {

  return (dispatch : Function, getState : Function) : Promise<void> => {

    const bsdm : DmState = getState().bsdm;

    return new Promise((resolve, reject) => {

      const promises: any[] = [];

      liveDataFeeds.forEach((liveDataFeed: any) => {

        const {autoGenerateUserVariables, dataFeedUse, name, parserPluginName, updateInterval, useHeadRequest,
          userVariableAccess, uvParserPluginName} = liveDataFeed;

        if (!getEnumKeyOfValue(DataFeedUsageType, dataFeedUse))  {
          throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError, 'DataFeedUsageType: ' + dataFeedUse);
        }

        // TODO - this code is not complete and not all parameters are correct
        // convert parserPluginName to BsDmId and use
        // convert userVariableAccess to AccessType and use
        // etc.

        // find parserPlugin with the name parserPluginName
        let parserBrightScriptPluginId : BsDmId = '';
        if (parserPluginName && typeof parserPluginName === 'string' && parserPluginName !== '') {
          const parserBrightScriptPlugin : DmcParserBrightScriptPlugin =
            dmGetParserPluginByName(bsdm, { name : parserPluginName });
          if (parserBrightScriptPlugin) {
            console.log(parserBrightScriptPlugin);
            parserBrightScriptPluginId = parserBrightScriptPlugin.id;
          }
          // TODO
          // If parserPluginScript not found, that means it was a broken link. the liveDataFeed will need to get
          // updated later
        }

        if (liveDataFeed.liveDataFeed) {
          if (!bsnDataFeedCollection) {
            promises.push(dispatch(addBsnFeed(liveDataFeed.liveDataFeed.name, liveDataFeed.name,
              AssetType.BSNDataFeed, dataFeedUse)));
          }
          else {
            // TODO - case where it's already been loaded - FIX ME
            promises.push(dispatch(addBsnFeed(liveDataFeed.liveDataFeed.name, liveDataFeed.name,
              AssetType.BSNDataFeed, dataFeedUse)));
          }
        }
        else if (liveDataFeed.liveMediaFeed) {
          if (!bsnMediaFeedCollection) {
            promises.push(dispatch(addBsnFeed(liveDataFeed.liveMediaFeed.name, liveDataFeed.name,
              AssetType.BSNMediaFeed, dataFeedUse)));
          }
          else {
            // TODO - case where it's already been loaded
            promises.push(dispatch(addBsnFeed(liveDataFeed.liveMediaFeed.name, liveDataFeed.name,
              AssetType.BSNMediaFeed, dataFeedUse)));
          }
        }
        else if (liveDataFeed.liveTaggedPlaylist) {
          if (!bsnTaggedPlaylistCollection) {
            promises.push(dispatch(addBsnFeed(liveDataFeed.liveTaggedPlaylist.name, liveDataFeed.name,
              AssetType.BSNTaggedPlaylist, dataFeedUse)));
          }
          else {
            // TODO - case where it's already been loaded
            promises.push(dispatch(addBsnFeed(liveDataFeed.liveTaggedPlaylist.name, liveDataFeed.name,
              AssetType.BSNTaggedPlaylist, dataFeedUse)));
          }
        }
        else if (liveDataFeed.liveDynamicPlaylist) {
          if (!bsnDynamicPlaylistCollection) {
            promises.push(dispatch(addBsnFeed(liveDataFeed.liveDynamicPlaylist.name, liveDataFeed.name,
              AssetType.BSNDynamicPlaylist, dataFeedUse)));
          }
          else {
            // TODO - case where it's already been loaded
            promises.push(dispatch(addBsnFeed(liveDataFeed.liveDynamicPlaylist.name, liveDataFeed.name,
              AssetType.BSNDynamicPlaylist, dataFeedUse)));
          }
        }
        else {
          const url: DmParameterizedString = convertParameterValue(bsdm, liveDataFeed.url);
          const dataFeedAction: DataFeedAction = dmAddDataFeed(name, url, dataFeedUse, updateInterval, useHeadRequest,
            parserBrightScriptPluginId, autoGenerateUserVariables, AccessType.Private);
          dispatch(dataFeedAction);
        }
      });

      Promise.all(promises).then(() => {
        console.log(getState());
        resolve();
      }).catch( (err) => {
        return reject(new BpfConverterError(BpfConverterErrorType.unexpectedError, 'addLiveDataFeeds: ' + err));
      });
    });
  };
}

function fetchBsnFeeds(feedType : AssetType) : Promise<BsAssetCollection> {
  return new Promise( (resolve, reject) => {
    const assetCollection : BsAssetCollection = cmGetBsAssetCollection(AssetLocation.Bsn, feedType);
    assetCollection
      .update()
      .then(() => {
        resolve(assetCollection);
      })
      .catch( (err : any) => {
        return reject(new BpfConverterError(BpfConverterErrorType.errorUpdatingAssetCollection, err));
      });
  });
}

// function fetchBsDataFeedAsset(assetCollection : BsAssetCollection, feedName : string) : BsDataFeedAsset {
//   const asset: BsAsset = assetCollection.getAsset(feedName);
//   const feedAsset: BsDataFeedAsset = asset as BsDataFeedAsset;
//   if (!feedAsset) {
//     throw new BpfConverterError(BpfConverterErrorType.errorFetchingBsnFeedProperties, 'fetchBsDataFeedAsset, ' +
//       'feedName: ' + feedName);
//   }
//   return feedAsset;
// }
function fetchBsDataFeedAsset(assetCollection : BsAssetCollection, feedName : string) : BsAsset {
  const feedAsset: BsAsset = assetCollection.getAsset(feedName);
  // const feedAsset: BsDataFeedAsset = asset as BsDataFeedAsset;
  if (!feedAsset) {
    throw new BpfConverterError(BpfConverterErrorType.errorFetchingBsnFeedProperties, 'fetchBsDataFeedAsset, ' +
      'feedName: ' + feedName);
  }
  return feedAsset;
}

function addUserVariables(userVariables : any) : Function {

  return (dispatch : Function, getState : Function) : any => {

    userVariables.forEach( (userVariable : any) => {

      console.log(userVariable);

      const { access, defaultValue, liveDataFeedName, name, networked, systemVariable } = userVariable;

      let dataFeedId : string = '';
      if (liveDataFeedName !== '') {
        const dmcDataFeed : DmcDataFeed = dmGetDataFeedByName(getState().bsdm, { name : liveDataFeedName });
        dataFeedId = dmcDataFeed.id;
      }

      // dmAddUserVariable(name: string, defaultValue: string, access?: AccessType, isNetworked?: boolean,
      // dataFeedId?: BsDmId, systemVariable?: SystemVariableType | null): UserVariableAction;

      let systemVariableType: SystemVariableType;
      switch (systemVariable.toLowerCase()) {
        case 'serialnumber':
        default: {
          systemVariableType = SystemVariableType.SerialNumber;
          break;
        }
      }

      const userVariableAction : UserVariableAction = dmAddUserVariable(name, defaultValue, access, networked,
        dataFeedId, systemVariable);
      dispatch(userVariableAction);
    });
  };
}

function addHtmlSites(htmlSites : any[]) : Function {

  // TODO - combine code from different site types as appropriate
  return (dispatch : Function, getState : Function) : any => {

    const bsdm: DmState = getState().bsdm;

    htmlSites.forEach( (htmlSite : any) => {
      if (htmlSite.type === HtmlSiteType.Hosted) {
        const { name, filePath, queryString } = htmlSite;

        let bsAssetItem : BsAssetItem = fsGetAssetItemFromFile(filePath);
        const brokenLink : boolean = isNil(bsAssetItem);
        if (isNil(bsAssetItem)) {
          bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.HtmlSite, name, filePath);
        }

        const htmlSiteLocalThunkAction : BsDmThunkAction<HtmlSiteHostedParams> =
          dmAddHostedHtmlSite(name, bsAssetItem, queryString);
        const actionParams : BsDmAction<HtmlSiteHostedParams> = dispatch(htmlSiteLocalThunkAction);
        const htmlParams: HtmlSiteHostedParams = actionParams.payload;
      }
      else if (htmlSite.type === HtmlSiteType.Remote) {

        const { name, url, queryString } = htmlSite;

        const urlPS: DmParameterizedString = convertParameterValue(bsdm, url);
        const queryStringPS: DmParameterizedString = convertParameterValue(bsdm, queryString);
        const htmlSiteRemoteAction : HtmlSiteRemoteAction = dmAddRemoteHtmlSite(name, urlPS, queryStringPS);
        dispatch(htmlSiteRemoteAction);
      }
    });
  };
}

function findScriptPluginBrokenLinks(dmState : DmState, brokenFilePaths:  any[]) {

  // TODO - not done yet
  return (dispatch: Function): any => {
    const scriptPluginIds : BsDmId[] = dmGetScriptPluginIds(dmState);
    scriptPluginIds.forEach( (scriptPluginId : BsDmId) => {
      const scriptPlugin: DmBrightScriptPlugin = dmGetScriptPluginStateById(dmState, { id: scriptPluginId });
      const assetId: BsDmId = scriptPlugin.assetId;
    });
  };
}

function addScriptPlugins(scriptPlugins : any) : Function {

  return (dispatch : Function) : any => {
    scriptPlugins.forEach( (scriptPlugin : any) => {
      console.log(scriptPlugin);

      const name = scriptPlugin.name;
      const filePath = scriptPlugin.path;

      let bsAssetItem : BsAssetItem = fsGetAssetItemFromFile(filePath);
      const linkBroken : boolean = bsAssetItem === null;
      if (!bsAssetItem) {
        bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.BrightScript, path.basename(filePath),
          filePath);
      }

      const addScriptPluginThunkAction: BsDmThunkAction<BrightScriptPluginParams> =
        dmAddBrightScriptPlugin(name, bsAssetItem, false);
      const actionParams : BsDmAction<BrightScriptPluginParams> = dispatch(addScriptPluginThunkAction);
      const brightScriptPluginParams: BrightScriptPluginParams = actionParams.payload;
    });
  };
}

function addParserPlugins(parserPlugins : any) : Function {

  return (dispatch : Function, getState : Function) : any => {
    parserPlugins.forEach( (parserPlugin : any) => {

      const { name, parseFeedFunctionName, parseUVFunctionName, userAgentFunctionName } = parserPlugin;
      const filePath = parserPlugin.path;

      let bsAssetItem : BsAssetItem = fsGetAssetItemFromFile(filePath);
      if (!bsAssetItem) {
        bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.BrightScript, path.basename(filePath),
          filePath);
      }

      const parserPluginThunkAction: BsDmThunkAction<ParserBrightScriptPluginParams> =
        dmAddParserBrightScriptPlugin(name, bsAssetItem, parseFeedFunctionName, parseUVFunctionName,
          userAgentFunctionName, false);
      const actionParams : BsDmAction<ParserBrightScriptPluginParams> = dispatch(parserPluginThunkAction);
      const parserBrightScriptPluginParams: ParserBrightScriptPluginParams = actionParams.payload;
    });
  };
}

function addZones(bpf: any) : Function {
  return (dispatch : Function, getState : Function) : any => {
    bpf.zones.forEach( (bpfZone : any) => {

      const { x, y, width, height } = bpfZone;

      const zoneRect : BsRect = {
        x,
        y,
        width,
        height,
        pct: false
      };
      // const zoneAddAction : BsDmThunkAction<ZoneAddParams> = dispatch(dmAddZone(bpfZone.name, bpfZone.type,
      // bpfZone.id,
      //   zoneRect, true));
      const zoneAddAction : ZoneAddAction = dispatch(dmAddZone(bpfZone.name, bpfZone.type, bpfZone.id,
        zoneRect, bpfZone.playlist.type !== 'interactive'));
      const zoneAddParams: ZoneAddParams = zoneAddAction.payload;

      const zoneId : BsDmId = zoneAddParams.zone.id;
      const zoneType : ZoneType = zoneAddParams.zone.type;

      dispatch(setZoneProperties(bpfZone, zoneId, zoneType));

      dispatch(buildZonePlaylist(bpfZone, zoneId));
    });
  };
}

function getFileNameFromFilePath(filePath : string) : string {
  const lastSlash = filePath.lastIndexOf('\\');
  const brokenLinkFileName = filePath.substr(lastSlash + 1);
  return brokenLinkFileName;
}
