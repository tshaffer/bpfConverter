import {
  BsAssetItem,
  BsColor,
  BsRect,
  EventType,
  MediaType,
  TransitionType,
} from '@brightsign/bscore';

import {
  BsDmId,
  BsDmThunkAction,
  DmMediaStateContainer,
  DmSerialPortList,
  DmSignMetadata,
  DmSignProperties,
  DmSignState,
  EventParams,
  MediaStateAction,
  MediaStateParams,
  SerialPortListParams,
  SignAction,
  TransitionAction,
  ZoneAction,
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

  let state = getState();
  console.log(state);
  debugger;
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
    const zoneAction : ZoneAction = dispatch(dmAddZone(bpfZone.name, bpfZone.type, bpfZone.id, zoneRect));

    const zoneId : BsDmId = zoneAction.payload.id;

    let state = getState();
    console.log(state);

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
          // TODO - use other parameters
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
    const transitionAction : TransitionAction = dispatch(dmAddTransition('', eventIds[mediaStateIds.length - 1],
      mediaStateIds[0], transitionTypes[mediaStateIds.length - 1], transitionDurations[mediaStateIds.length - 1]));

    // save bsdm to file?

    state = getState();
    console.log(state);
    debugger;

  });


}