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
  BsDmId,
  BsDmThunkAction,
  DmAudioOutputAssignmentMap,
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
  VideoOrImagesZonePropertyParams,
  dmAddEvent,
  dmAddMediaState,
  dmAddTransition,
  dmAddZone,
  dmCreateAssetItemFromLocalFile,
  dmGetZoneMediaStateContainer,
  dmGetSignState,
  dmNewSign,
  dmUpdateSignProperties,
  dmUpdateSignSerialPorts,
} from '@brightsign/bsdatamodel';


export function createSign(bpf : any, dispatch: Function, getState: Function) : void {
  newSign(bpf, dispatch);
  setSignProperties(bpf, dispatch, getState);
  setSerialPortConfiguration(bpf, dispatch);
  addZones(bpf, dispatch, getState);
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

function addZones(bpf : any, dispatch : Function, getState: Function) {

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

    let state = getState();
    console.log(state);

    // after adding states, set initialMediaStateId

    switch (zoneType) {
      case ZoneType.VideoOrImages: {

        let imageZonePropertyData : DmImageZonePropertyData = {
          imageMode : ImageModeType.CenterImage,
        };
        let imageZoneProperties : DmImageZoneProperties = imageZonePropertyData;

        let audioOutputAssignmentMap : DmAudioOutputAssignmentMap = {};
        audioOutputAssignmentMap['poo'] = AudioOutputType.Passthrough;

        let audioZonePropertyData : DmAudioZonePropertyData = {
          audioOutput : AudioOutputSelectionType.Analog,
          audioMapping : AudioMappingType.AudioAll,
          audioMixMode : AudioMixModeType.Stereo,
          audioMode : AudioModeType.Stereo,
          audioOutputAssignments : audioOutputAssignmentMap,
          audioVolume : 0,
          minimumVolume : 0,
          maximumVolume : 0
        };

        let videoZonePropertyData : DmVideoZonePropertyData = {
          viewMode : ViewModeType.FillAndCenter,
          liveVideoInput : LiveVideoInputType.Composite,
          liveVideoStandard : LiveVideoStandardType.NtscM,
          videoVolume : 0,
          brightness : 0,
          contrast : 0,
          saturation : 0,
          hue : 0,
          zOrderFront : true,
          mosaic : false,
          maxContentResolution : MosaicMaxContentResolutionType.FK,
          mosaicDecoderName: ''
        };

        let videoZoneProperties : DmVideoZoneProperties =
          Object.assign({}, videoZonePropertyData, audioZonePropertyData);

        let zonePropertyParams : VideoOrImagesZonePropertyParams =
          Object.assign({}, videoZoneProperties, imageZoneProperties);

        // let videoZoneProperties : DmVideoZoneProperties = {
        //   viewMode : ViewModeType.FillAndCenter,
        //   liveVideoInput : LiveVideoInputType.Composite,
        //   liveVideoStandard : LiveVideoStandardType.NtscM,
        //   videoVolume : 0,
        //   brightness : 0,
        //   contrast : 0,
        //   saturation : 0,
        //   hue : 0,
        //   zOrderFront : true,
        //   mosaic : false,
        //   maxContentResolution : MosaicMaxContentResolutionType.FK,
        //   mosaicDecoderName: '',
        //   audioOutput : AudioOutputSelectionType.Analog,
        //   audioMapping : AudioMappingType.AudioAll,
        //   audioMixMode : AudioMixModeType.Stereo,
        //   audioMode : AudioModeType.Stereo,
        //   audioOutputAssignments : audioOutputAssignmentMap,
        //   audioVolume : 0,
        //   minimumVolume : 0,
        //   maximumVolume : 0,
        // };

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
    /*
    export function dmUpdateZone(params: ZoneParams): BsDmThunkAction<ZoneParams | ZoneChangeParams>;
    export interface ZoneParams {
      id: BsDmId;
      name?: string;
      type?: ZoneType;
      tag?: string;
      nonInteractive?: boolean;
      initialMediaStateId?: BsDmId;
      position?: BsRect;
    }

    export function dmUpdateZoneProperties(params: ZonePropertyUpdateParams): BsDmThunkAction<ZonePropertyUpdateParams>;
    export interface ZonePropertyUpdateParams {
      id: BsDmId;
      type: ZoneType;
      properties: ZonePropertyParams;
    }
    export type ZonePropertyParams = AudioZonePropertyParams | EnhancedAudioZonePropertyParams | ImageZonePropertyParams | VideoZonePropertyParams | VideoOrImagesZonePropertyParams | TickerZonePropertyParams | ClockZonePropertyParams;
    export type VideoOrImagesZonePropertyParams = Partial<DmVideoOrImagesZoneProperties>;
    export interface DmVideoOrImagesZoneProperties extends DmVideoZoneProperties, DmImageZoneProperties {
    export interface DmVideoZoneProperties extends DmAudioZoneProperties, Readonly<DmVideoZonePropertyData> {
      export interface DmVideoZonePropertyData {
      viewMode: ViewModeType;
      liveVideoInput: LiveVideoInputType;
      liveVideoStandard: LiveVideoStandardType;
      videoVolume: number;
      brightness: number;
      contrast: number;
      saturation: number;
      hue: number;
      zOrderFront: boolean;
      mosaic: boolean;
      maxContentResolution: MosaicMaxContentResolutionType;
      mosaicDecoderName?: string;
    }
    export interface DmAudioZonePropertyData {
      audioOutput: AudioOutputSelectionType;
      audioMode: AudioModeType;
      audioMapping: AudioMappingType;
      audioOutputAssignments: DmAudioOutputAssignmentMap;
      audioMixMode: AudioMixModeType;
      audioVolume: number;
      minimumVolume: number;
      maximumVolume: number;
    }
    export type DmAudioZoneProperties = Readonly<DmAudioZonePropertyData>;
    export interface DmImageZonePropertyData {
      imageMode: ImageModeType;
    }
    export type DmImageZoneProperties = Readonly<DmImageZonePropertyData>;
    */

    let mediaStateIds: BsDmId[] = [];
    let eventIds: BsDmId[] = [];
    let transitionTypes : TransitionType[] = [];
    let transitionDurations : number[] = [];

    bpfZone.playlist.states.forEach( (state : any) => {
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
    // TODO - best way to do this when some of the transitions don't have transitionTypes / transitionDurations
    const transitionAction : TransitionAction = dispatch(dmAddTransition('', eventIds[mediaStateIds.length - 1],
      mediaStateIds[0], transitionTypes[mediaStateIds.length - 1], transitionDurations[mediaStateIds.length - 1]));
  });


}