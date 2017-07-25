import {
  AudioMappingType,
  AudioMixModeType,
  AudioModeType,
  AudioOutputSelectionType,
  AudioOutputType,
  BsAssetItem,
  BsColor,
  BsRect,
  EventType,
  ImageModeType,
  LiveVideoInputType,
  LiveVideoStandardType,
  MediaType,
  MosaicMaxContentResolutionType,
  TransitionType,
  ViewModeType,
  ZoneType,
} from '@brightsign/bscore';

import {
  AudioSignPropertyMapParams,
  BsDmId,
  BsDmThunkAction,
  DmAudioOutputAssignmentMap,
  DmAudioSignProperties,
  DmAudioSignPropertyMap,
  DmAudioZoneProperties,
  DmAudioZonePropertyData,
  DmImageZoneProperties,
  DmImageZonePropertyData,
  DmMediaStateContainer,
  DmSerialPortList,
  DmSignMetadata,
  DmSignProperties,
  DmSignState,
  DmVideoZoneProperties,
  DmVideoZonePropertyData,
  EventParams,
  MediaStateAction,
  MediaStateParams,
  SerialPortListParams,
  SignAction,
  TransitionAction,
  ZoneAction,
  ZoneParams,
  ZoneChangeParams,
  ZonePropertyUpdateAction,
  ZonePropertyUpdateParams,
  VideoOrImagesZonePropertyParams,
  dmAddEvent,
  dmAddMediaState,
  dmAddTransition,
  dmAddZone,
  dmCreateAssetItemFromLocalFile,
  dmGetZoneMediaStateContainer,
  dmGetSignState,
  dmNewSign,
  dmUpdateSignAudioPropertyMap,
  dmUpdateSignProperties,
  dmUpdateSignSerialPorts,
  dmUpdateZone,
  dmUpdateZoneProperties,
} from '@brightsign/bsdatamodel';

import * as Converters from './converters';

export function createSign(bpf : any, dispatch: Function, getState: Function) : void {
  newSign(bpf, dispatch);
  setSignProperties(bpf, dispatch, getState);
  setSignAudioProperties(bpf, dispatch);
  setSerialPortConfiguration(bpf, dispatch);
  addZones(bpf, dispatch);
}

function newSign(bpf : any, dispatch: Function) {
  const { name, videoMode, model } = bpf.metadata;
  dispatch(dmNewSign(name, videoMode, model));
}

function setSignProperties(bpf : any, dispatch: Function, getState: Function) {

  let state = getState();

  let signAction : SignAction;
  let signState : DmSignState;
  let signMetadata : DmSignMetadata;
  let signProperties : DmSignProperties;

  signState = dmGetSignState(state.bsdm);
  signMetadata = signState.sign;
  signProperties = signMetadata.properties;

  let {
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

  const { a, r, g, b } = bpf.metadata.backgroundScreenColor;
  const backgroundScreenColor : BsColor = { a, r, g, b };

  signAction = dispatch(dmUpdateSignProperties(
    {
      id : signProperties.id,
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
    }
  ));
}

function setSignAudioProperties(bpf : any, dispatch : Function) {

  const bpfAudioVolumeNames : Array<string> = [
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

  const bpfxAudioOutputs: Array<string> = [
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

  let audioSignPropertyMap : DmAudioSignPropertyMap = {};
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
}

function setSerialPortConfiguration(bpf : any, dispatch: Function) {

  let serialPortList : DmSerialPortList = [];

  bpf.metadata.SerialPortConfigurations.forEach( (serialPortConfiguration : any) => {
    serialPortList.push(serialPortConfiguration);
  });

  let serialPortListParams : SerialPortListParams = {
    params : serialPortList
  };

  dispatch(dmUpdateSignSerialPorts(serialPortListParams));
}

function buildAudioOutputAssignmentMap(zoneSpecificParameters : any) : DmAudioOutputAssignmentMap {

  const bpfAudioOutputs : Array<string> = [
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

  const bpfxAudioOutputs: Array<string> = [
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

  let audioOutputAssignments: DmAudioOutputAssignmentMap = {};

  for (let i = 0; i < bpfAudioOutputs.length; i++) {
    audioOutputAssignments[bpfxAudioOutputs[i]] = zoneSpecificParameters[bpfAudioOutputs[i]];
  }

  return audioOutputAssignments;
}

function setZoneProperties(bpfZone : any, zoneId : BsDmId, zoneType : ZoneType, dispatch : Function) {
  switch (zoneType) {
    case ZoneType.VideoOrImages: {

      const zoneSpecificParameters = bpfZone.zoneSpecificParameters;

      let imageZonePropertyData : DmImageZonePropertyData = {
        imageMode : ImageModeType.CenterImage,
      };
      let imageZoneProperties : DmImageZoneProperties = imageZonePropertyData;

      let audioOutputAssignmentMap : DmAudioOutputAssignmentMap = buildAudioOutputAssignmentMap(zoneSpecificParameters);

      let audioZonePropertyData : DmAudioZonePropertyData = {
        audioOutput : Converters.getAudioOutput(zoneSpecificParameters.audioOutput),
        audioMode : Converters.getAudioMode(zoneSpecificParameters.audioMode),
        audioMapping : Converters.getAudioMapping(zoneSpecificParameters.audioMapping),
        audioOutputAssignments : audioOutputAssignmentMap,
        audioMixMode : zoneSpecificParameters.audioMixMode,
        audioVolume : zoneSpecificParameters.audioVolume,
        minimumVolume : zoneSpecificParameters.minimumVolume,
        maximumVolume : zoneSpecificParameters.maximumVolume,
      };

      let videoZonePropertyData : DmVideoZonePropertyData = {
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
        maxContentResolution : MosaicMaxContentResolutionType.NotApplicable,
        mosaicDecoderName: ''
      };

      let videoZoneProperties : DmVideoZoneProperties =
        Object.assign({}, videoZonePropertyData, audioZonePropertyData);

      let zonePropertyParams : VideoOrImagesZonePropertyParams =
        Object.assign({}, videoZoneProperties, imageZoneProperties);

      let zonePropertyUpdateParams : ZonePropertyUpdateParams = {
        id: zoneId,
        type: ZoneType.VideoOrImages,
        properties : zonePropertyParams
      }
      let updateZonePropertyThunkAction : BsDmThunkAction<ZonePropertyUpdateParams> = dmUpdateZoneProperties(zonePropertyUpdateParams);
      let updateZonePropertyAction : ZonePropertyUpdateAction = dispatch(updateZonePropertyThunkAction);

      break;
    }
    case ZoneType.VideoOnly: {
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
      break;
    }
    case ZoneType.Clock: {
      break;
    }
    case ZoneType.BackgroundImage: {
      break;
    }
    default: {
      debugger;
      break;
    }
  }
}

function buildZonePlaylist(bpfZone : any, zoneId : BsDmId, dispatch : Function) {
  let mediaStateIds: BsDmId[] = [];
  let eventIds: BsDmId[] = [];
  let transitionTypes : TransitionType[] = [];
  let transitionDurations : number[] = [];

  bpfZone.playlist.states.forEach( (state : any, index : number) => {
    let zone : DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);
    switch (state.type) {
      case 'imageItem': {
        const { file, fileIsLocal, slideDelayInterval, transitionDuration, videoPlayerRequired } = state;
        // TODO - specify additional parameters
        const bsAssetItem  : BsAssetItem = dmCreateAssetItemFromLocalFile(file.path, '', MediaType.Image);
        let addMediaStateThunkAction : BsDmThunkAction<MediaStateParams> = dmAddMediaState(bsAssetItem.name, zone, bsAssetItem);
        let mediaStateAction : MediaStateAction = dispatch(addMediaStateThunkAction);
        let mediaStateParams : MediaStateParams = mediaStateAction.payload;

        let eventAction : any = dispatch(dmAddEvent('timeout', EventType.Timer, mediaStateParams.id,
          { interval : slideDelayInterval } ));
        let eventParams : EventParams = eventAction.payload;

        mediaStateIds.push(mediaStateParams.id);
        eventIds.push(eventParams.id);
        transitionTypes.push(TransitionType.NoEffect);
        transitionDurations.push(transitionDuration);


        break;
      }
      case 'videoItem': {
        const { automaticallyLoop, file, fileIsLocal, videoDisplayMode, volume } = state;
        const bsAssetItem  : BsAssetItem = dmCreateAssetItemFromLocalFile(file.path, '', MediaType.Video);
        let addMediaStateThunkAction : BsDmThunkAction<MediaStateParams> = dmAddMediaState(bsAssetItem.name, zone, bsAssetItem);
        let mediaStateAction : MediaStateAction = dispatch(addMediaStateThunkAction);
        let mediaStateParams : MediaStateParams = mediaStateAction.payload;

        let eventAction : any = dispatch(dmAddEvent('mediaEnd', EventType.MediaEnd, mediaStateParams.id));
        let eventParams : EventParams = eventAction.payload;

        mediaStateIds.push(mediaStateParams.id);
        eventIds.push(eventParams.id);
        transitionTypes.push(null);
        transitionDurations.push(0);

        if (index === 0) {
          dispatch(dmUpdateZone({
            id: zoneId,
            initialMediaStateId : mediaStateParams.id,
          }));
        }

        break;
      }
      default:
        break;
    }
  });

  // add transitions to all media states
  for (let i = 0; i < (mediaStateIds.length - 1); i++) {
    const transitionAction : TransitionAction = dispatch(dmAddTransition('', eventIds[i],
      mediaStateIds[i + 1], transitionTypes[i], transitionDurations[i]));
  }
  // TODO - best way to do this when some of the transitions don't have transitionTypes / transitionDurations?
  const transitionAction : TransitionAction = dispatch(dmAddTransition('', eventIds[mediaStateIds.length - 1],
    mediaStateIds[0], transitionTypes[mediaStateIds.length - 1], transitionDurations[mediaStateIds.length - 1]));

}

function addZones(bpf : any, dispatch : Function) {

  bpf.zones.forEach( (bpfZone : any) => {

    let { x, y, width, height } = bpfZone;

    const zoneRect : BsRect = {
      x,
      y,
      width,
      height,
      pct: false
    };
    const zoneAction : ZoneAction = dispatch(dmAddZone(bpfZone.name, bpfZone.type, bpfZone.id, zoneRect, true));

    const zoneId : BsDmId = zoneAction.payload.id;
    const zoneType : ZoneType = zoneAction.payload.type;

    setZoneProperties(bpfZone, zoneId, zoneType, dispatch);

    buildZonePlaylist(bpfZone, zoneId, dispatch);
  });


}