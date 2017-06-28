import {
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
  AudioOutputType,
  ZoneType,
  BsRect,
  LiveVideoInputType,
  ViewModeType,
  MosaicMaxContentResolutionType,
  AudioOutputSelectionType,
  AudioModeType,
  AudioMappingType,
  AudioMixModeType,
  ImageModeType,
  EventType,
  MediaType,
  TransitionType,
  BsAssetId,
} from '@brightsign/bscore';

import {
  dmAddZone
} from '@brightsign/bsdatamodel';

import {
  DmcMediaState,
  EventParams,
  dmGetMediaStateByName,
  DmCondition,
  TransitionAction,
  dmAddTransition,
  DmTimer,
  dmAddEvent,
  BsDmId,
  DmEventData,
  EventAction,
  MediaStateParams,
  dmGetZoneMediaStateContainer,
  BsDmAction,
  ZoneParams,
  dmAddMediaState,
  // dmCreateAssetItemFromLocalFile,
  DmAudioOutputAssignmentMap,
  DmSignState,
  dmGetSignState,
  dmNewSign, DmSignMetadata, DmSignProperties,
  dmUpdateSignProperties,
  SignAction,
  DmSerialPortConfiguration,
  DmSerialPortList,
  SerialPortListParams,
  dmUpdateSignSerialPorts,
  GpioListParams,
  DmGpioList,
  dmUpdateSignGpio,
  DmButtonPanelMap,
  ButtonPanelMapParams,
  dmUpdateSignButtonPanelMap,
  DmBpConfiguration,
  DmAudioSignProperties,
  DmAudioSignPropertyMap,
  dmUpdateSignAudioPropertyMap,
  AudioSignPropertyMapParams,
  dmUpdateZoneProperties,
  ZonePropertyUpdateParams,
  BsDmThunkAction,
  VideoOrImagesZonePropertyParams,
  DmVideoOrImagesZoneProperties,
  DmVideoZoneProperties,
  DmImageZoneProperties,
  DmAudioZoneProperties,
  DmVideoZonePropertyData,
  DmImageZonePropertyData,
  DmAudioZonePropertyData,
} from '@brightsign/bsdatamodel';

import {
  ArEventType,
  ArSyncSpec,
  ArSyncSpecDownload,
  ArState,
  ArFileLUT,
} from '../types';

import * as Converters from './converters';
import * as Utilities from '../utilities/utilities';

export function dmCreateAssetItemFromLocalFile(
  fullPath: string,
  id: BsAssetId = '',
  mediaType: MediaType = null,
): BsAssetItem {
  const name = fullPath.replace(/^.*[\\\/]/, '');
  const path = fullPath.substr(0, fullPath.length - name.length);
  return {
    id,
    name,
    path,
    networkId: 0,
    location: AssetLocation.Local,
    locator: bscGetLocalAssetLocator(fullPath),
    assetType: AssetType.Content,
    mediaType: mediaType ? mediaType : bscGetFileMediaType(name),
  };
}
export function convertAutoschedule(autoScheduleBac : any) : any {

  // only works now for a single scheduledPresentation
  let scheduledPresentation : any = {};
  let rawScheduledPresentation : any = autoScheduleBac.autoschedule.scheduledPresentation;
  scheduledPresentation.allDayEveryDay = (rawScheduledPresentation.allDayEveryDay.toLowerCase() === 'true');
  scheduledPresentation.dateTime = rawScheduledPresentation.dateTime;
  scheduledPresentation.duration = Number(rawScheduledPresentation.duration);
  scheduledPresentation.interruption = (rawScheduledPresentation.interruption.toLowerCase() === 'true');
  scheduledPresentation.presentationToSchedule = {
    fileName: rawScheduledPresentation.presentationToSchedule.fileName,
    filePath: rawScheduledPresentation.presentationToSchedule.filePath,
    name: rawScheduledPresentation.presentationToSchedule.name,
  };
  scheduledPresentation.recurrence = (rawScheduledPresentation.recurrence.toLowerCase() === 'true');
  scheduledPresentation.recurrenceEndDate = rawScheduledPresentation.recurrenceEndDate;
  scheduledPresentation.recurrenceGoesForever = (rawScheduledPresentation.recurrenceGoesForever.toLowerCase() === 'true');
  scheduledPresentation.recurrencePattern = rawScheduledPresentation.recurrencePattern;
  scheduledPresentation.recurrencePatternDaily = rawScheduledPresentation.recurrencePatternDaily;
  scheduledPresentation.recurrencePatternDaysOfWeek = Number(rawScheduledPresentation.recurrencePatternDaysOfWeek);
  scheduledPresentation.recurrenceStartDate = rawScheduledPresentation.recurrenceStartDate;

  let autoSchedule : any = {};
  autoSchedule.scheduledPresentations = [scheduledPresentation];
  return autoSchedule;
}

function updateAutoplaySignProperties(bacMeta : any, dispatch: Function, getState : Function) {

  let signAction : SignAction;
  let signState : DmSignState;
  let signMetadata : DmSignMetadata;
  let signProperties : DmSignProperties;

  let state = getState();

  signState = dmGetSignState(state.bsdm);
  signMetadata = signState.sign;
  signProperties = signMetadata.properties;

  const alphabetizeVariableNames : boolean = Converters.stringToBool(bacMeta.alphabetizeVariableNames);
  const autoCreateMediaCounterVariables : boolean = Converters.stringToBool(bacMeta.autoCreateMediaCounterVariables);
  const backgroundScreenColor : BsColor = {
    a: Converters.stringToNumber(bacMeta.backgroundScreenColor['@a']),
    r: Converters.stringToNumber(bacMeta.backgroundScreenColor['@a']),
    g: Converters.stringToNumber(bacMeta.backgroundScreenColor['@a']),
    b: Converters.stringToNumber(bacMeta.backgroundScreenColor['@a']),
  };
  const delayScheduleChangeUntilMediaEndEvent : boolean = Converters.stringToBool(bacMeta.delayScheduleChangeUntilMediaEndEvent.toLowerCase());
  const deviceWebPageDisplay : DeviceWebPageDisplay = bacMeta.deviceWebPageDisplay;
  const flipCoordinates : boolean =  Converters.stringToBool(bacMeta.flipCoordinates);
  const forceResolution : boolean = Converters.stringToBool(bacMeta.forceResolution);
  const graphicsZOrder : GraphicsZOrderType = bacMeta.graphicsZOrder;
  const htmlEnableJavascriptConsole : boolean = Converters.stringToBool(bacMeta.htmlEnableJavascriptConsole);
  const inactivityTime : number = Converters.stringToNumber(bacMeta.inactivityTime);
  const inactivityTimeout : boolean = Converters.stringToBool(bacMeta.inactivityTimeout);
  const isMosaic : boolean = Converters.stringToBool(bacMeta.isMosaic);
  const language : LanguageType = bacMeta.language;
  const languageKey : LanguageKeyType = bacMeta.languageKey;
  const monitorOrientation : MonitorOrientationType = bacMeta.monitorOrientation;
  const monitorOverscan : MonitorOverscanType = bacMeta.monitorOverscan;
  const resetVariablesOnPresentationStart : boolean = Converters.stringToBool(bacMeta.resetVariablesOnPresentationStart);
  const tenBitColorEnabled : boolean = Converters.stringToBool(bacMeta.tenBitColorEnabled);
  const touchCursorDisplayMode : TouchCursorDisplayModeType = bacMeta.touchCursorDisplayMode;
  const udpDestinationAddress : string = bacMeta.udpDestinationAddress;
  const udpDestinationAddressType : UdpAddressType = bacMeta.udpDestinationAddressType;
  const udpDestinationPort : number = Converters.stringToNumber(bacMeta.udpDestinationPort);
  const udpReceiverPort : number = Converters.stringToNumber(bacMeta.udpReceiverPort);
  const videoConnector : VideoConnectorType = bacMeta.videoConnector;

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
    })
  );

}

function updateAutoplaySerialPorts(bacMeta : any, dispatch: Function) {

  let serialPortConfiguration : DmSerialPortConfiguration;
  let serialPortList : DmSerialPortList = [];

  bacMeta.SerialPortConfiguration.forEach( (serialPortConfigurationBac : any) => {
    serialPortConfiguration = {
      port : Converters.stringToNumber(serialPortConfigurationBac.port),
      baudRate : Converters.stringToNumber(serialPortConfigurationBac.baudRate),
      dataBits: Converters.stringToNumber(serialPortConfigurationBac.dataBits),
      stopBits: Converters.stringToNumber(serialPortConfigurationBac.stopBits),
      parity: serialPortConfigurationBac.parity,
      protocol: serialPortConfigurationBac.protocol,
      sendEol : serialPortConfigurationBac.sendEol,
      receiveEol : serialPortConfigurationBac.receiveEol,
      invertSignals : Converters.stringToBool(serialPortConfigurationBac.invertSignals),
      connectedDevice : serialPortConfigurationBac.connectedDevice,
    };
    serialPortList.push(serialPortConfiguration);
  });

  let serialPortListParams : SerialPortListParams = {
    params : serialPortList
  };

  dispatch(dmUpdateSignSerialPorts(serialPortListParams));
}

function updateAutoplayGpio(bacMeta : any, dispatch: Function) {

  let gpioList : DmGpioList = [];

  for (let i = 0; i < 8; i++) {
    const gpio : GpioType = bacMeta['gpio' + i.toString()];
    gpioList.push(gpio);
  }
  let gpioListParams : GpioListParams = {
    params : gpioList
  };

  dispatch(dmUpdateSignGpio(gpioListParams));
}

function updateAutoplayButtonPanels(bacMeta : any, dispatch: Function) {

  let bpConfiguration : DmBpConfiguration;
  let buttonPanelMap : DmButtonPanelMap = {};

  let buttonPanelNames : Array<string> = [
    'BP200A',
    'BP200B',
    'BP200C',
    'BP200D',
    'BP900A',
    'BP900B',
    'BP900C',
    'BP900D',
  ];
  for (let buttonPanelName of buttonPanelNames) {
    let configureAutomatically : boolean = Converters.stringToBool(bacMeta[buttonPanelName +  'ConfigureAutomatically']);
    let configuration : number = Converters.stringToNumber(bacMeta[buttonPanelName + 'Configuration']);
    bpConfiguration = {
      configureAutomatically,
      configuration
    };
    buttonPanelMap[buttonPanelName.toLowerCase()] = bpConfiguration;
  }

  const buttonPanelMapParams : ButtonPanelMapParams = {
    params : buttonPanelMap
  };

  dispatch(dmUpdateSignButtonPanelMap(buttonPanelMapParams));
}

function updateAutoplayAudio(bacMeta : any, dispatch: Function) {

  let audioSignPropertyMap : DmAudioSignPropertyMap = {};
  let audioSignProperties : DmAudioSignProperties;

  let badAudioNames : Array<string> = [
    'audio1',
    'audio2',
    'audio3',
    'spdif',
    'usbA',
    'usbB',
    'usbC',
    'usbD',
    'hdmi',
  ];

  for (let bacAudioName of badAudioNames) {
    audioSignProperties = {
      min : Converters.stringToNumber(bacMeta[bacAudioName + 'MinVolume']),
      max : Converters.stringToNumber(bacMeta[bacAudioName + 'MaxVolume'])
    };

    let audioName : string = bacAudioName;
    switch (bacAudioName) {
      case 'audio1': {
        audioName = 'analog1';
        break;
      }
      case 'audio2': {
        audioName = 'analog2';
        break;
      }
      case 'audio3': {
        audioName = 'analog3';
        break;
      }
    }
    audioSignPropertyMap[audioName] = audioSignProperties;
  }

  const audioSignPropertyMapParams : AudioSignPropertyMapParams = {
    params : audioSignPropertyMap
  };

  dispatch(dmUpdateSignAudioPropertyMap(audioSignPropertyMapParams));
}

function updateAutoplayZones(bacZones : any, dispatch: Function, getState : Function) {

  bacZones.forEach( (bacZone : any) => {

    let bsRect : BsRect = {
      x: Converters.stringToNumber(bacZone.x),
      y: Converters.stringToNumber(bacZone.y),
      width: Converters.stringToNumber(bacZone.width),
      height: Converters.stringToNumber(bacZone.height),
      pct: false
    };

    const actionParams : BsDmAction<ZoneParams> = dispatch(dmAddZone(bacZone.name, bacZone.type, bacZone.id, bsRect,
      bacZone.playlist.type === 'non-interactive'));
    console.log(actionParams);
    const zoneId = actionParams.payload.id;
    // need to call dmUpdateZone - to set initialMediaStateId

    let viewMode : ViewModeType;
    switch (bacZone.viewMode) {
      case 'Fill Screen and Centered': {
        viewMode = ViewModeType.FillAndCenter;
        break;
      }
      case '?0': {
        viewMode = ViewModeType.ScaleToFill;
        break;
      }
      default: {
        viewMode = ViewModeType.Letterboxed;
        break;
      }
    }

    let zoneSpecificParameters : any = bacZone.zoneSpecificParameters;

    // TODO - maxContentResolution
    // TODO - mosaic decoder name
    // TODO - audioOutputAssignments : DmAudioOutputAssignmentMap;
    // TODO - enumerate all values output by BAC

    let videoOrImagesZonePropertyParams : VideoOrImagesZonePropertyParams = {
      viewMode : viewMode,
      liveVideoInput : zoneSpecificParameters.liveVideoInput,
      liveVideoStandard : zoneSpecificParameters.liveVideoStandard,
      videoVolume : Converters.stringToNumber(zoneSpecificParameters.videoVolume),
      brightness : Converters.stringToNumber(zoneSpecificParameters.brightness),
      contrast : Converters.stringToNumber(zoneSpecificParameters.contrast),
      saturation : Converters.stringToNumber(zoneSpecificParameters.saturation),
      hue : Converters.stringToNumber(zoneSpecificParameters.hue),
      zOrderFront : Converters.stringToBool(zoneSpecificParameters.zOrderFront),
      mosaic : Converters.stringToBool(zoneSpecificParameters.mosaic),
      maxContentResolution : MosaicMaxContentResolutionType.NotApplicable,
      audioOutput : Converters.getAudioOutput(zoneSpecificParameters.audioOutput),
      audioMode : Converters.getAudioMode(zoneSpecificParameters.audioMode),
      audioMapping : Converters.getAudioMapping(zoneSpecificParameters.audioMapping),
      audioMixMode : Converters.getAudioMixMode(zoneSpecificParameters.audioMixMode),
      minimumVolume : Converters.stringToNumber(zoneSpecificParameters.minimumVolume),
      maximumVolume : Converters.stringToNumber(zoneSpecificParameters.maximumVolume),
      imageMode: ImageModeType.ScaleToFill,
    };

    let zonePropertyUpdateParams : ZonePropertyUpdateParams = {
      id : bacZone.id,
      type: bacZone.type,
      properties : videoOrImagesZonePropertyParams
    };

    dispatch(dmUpdateZoneProperties(zonePropertyUpdateParams));

    let state = getState().bsdm;

    // add media states, etc.
    const initialMediaStateId = bacZone.playlist.states.initialState;
    const bacStates = bacZone.playlist.states.state;
    const transitions = bacZone.playlist.states.transition;

    let addMediaStatePromises : Array<any> = [];
    bacStates.forEach( (bacMediaState : any) => {

      let filePath;
      let bsAssetItem : BsAssetItem;
      if (bacMediaState.imageItem) {
        filePath = Utilities.getPoolFilePath(bacMediaState.imageItem.file['@name']);
        bsAssetItem = dmCreateAssetItemFromLocalFile(filePath, '', MediaType.Image);
      }
      else if (bacMediaState.videoItem) {
        debugger;
      }

      const addMediaStatePromise : Promise<BsDmAction<MediaStateParams>> = dispatch(dmAddMediaState(bacMediaState.name, dmGetZoneMediaStateContainer(zoneId), bsAssetItem));
      addMediaStatePromises.push(addMediaStatePromise);
    });

    Promise.all(addMediaStatePromises).then(() => {

      let state = getState().bsdm;

      transitions.forEach( (bacTransition : any) => {
        console.log(bacTransition);

        // TODO I don't see the following 3 variables used in bsdm - ??
        const assignInputToUserVariable : boolean = Converters.stringToBool(bacTransition.assignInputToUserVariable);
        const assignWildcardToUserVariable : boolean = Converters.stringToBool(bacTransition.assignWildcardToUserVariable);
        const remainOnCurrentStateActions : string = bacTransition.remainOnCurrentStateActions;
        const sourceMediaStateName : string = bacTransition.sourceMediaState;
        const targetMediaStateName : string = bacTransition.targetMediaState;
        const userEvent : any = bacTransition.userEvent;
        const userEventName : string = userEvent.name;
        const parameters : any = userEvent.parameters;
        const parameter : string = parameters.parameter;
        // TODO - need code to properly convert parameters
        const duration : number = Number(parameter);

        const sourceMediaState : DmcMediaState = dmGetMediaStateByName(state, { name : sourceMediaStateName});
        const targetMediaState : DmcMediaState = dmGetMediaStateByName(state, { name : targetMediaStateName});

        // TODO - what is the proper js method to convert from string to enum value, in this case EventType.Timer?
        const eventAction : EventAction = dispatch(dmAddEvent(userEventName, EventType.Timer, sourceMediaState.id, { interval : duration} ));
        console.log(eventAction);

        // TODO - where is the TransitionType specified? where is the TransitionDuration specified?
        const transitionAction : TransitionAction = dispatch(dmAddTransition('myTransition', eventAction.payload.id, targetMediaState.id, TransitionType.Fade, 4));
        console.log(transitionAction);
      });

      state = getState().bsdm;
      console.log(state);
    });
  });
}

export function convertAutoplay(autoplayBac : any, dispatch: Function, getState : Function) : DmSignState {

  let state : any;
  let signAction : SignAction;

  const bacMeta = autoplayBac.BrightAuthor.meta;
  signAction = dispatch(dmNewSign(bacMeta.name, bacMeta.videoMode, bacMeta.model));

  updateAutoplaySignProperties(bacMeta, dispatch, getState);
  updateAutoplaySerialPorts(bacMeta, dispatch);
  updateAutoplayGpio(bacMeta, dispatch);
  updateAutoplayButtonPanels(bacMeta, dispatch);
  updateAutoplayAudio(bacMeta, dispatch);

  let bacZones : any = [];
  const bacZone = autoplayBac.BrightAuthor.zones;
  if (bacZone instanceof Array) {
    bacZones = autoplayBac.BrightAuthor.zones;
  }
  else {
    bacZones = [autoplayBac.BrightAuthor.zones.zone];
  }

  updateAutoplayZones(bacZones, dispatch, getState);

  return dmGetSignState(getState().bsdm);
}

export function convertSyncSpec(syncSpecRaw : any) : ArSyncSpec {

  let syncSpec : ArSyncSpec = {
    meta : {},
    files : {}
  };

  syncSpec.meta = {};
  syncSpec.meta.server = {};

  let client : any = {};
  let clientKeys : Array<string> = [
    'diagnosticLoggingEnabled',
    'enableSerialDebugging',
    'enableSystemLogDebugging',
    'eventLoggingEnabled',
    'limitStorageSpace',
    'playbackLoggingEnabled',
    'stateLoggingEnabled',
    'uploadLogFilesAtBoot',
    'uploadLogFilesAtSpecificTime',
    'uploadLogFilesTime',
    'variableLoggingEnabled'
  ]
  for (let clientKey of clientKeys) {
    client[clientKey] = syncSpecRaw.sync.meta.client[clientKey];
  }
  // TODO - some of these types are WRONG
  syncSpec.meta.client = client;

  syncSpec.files = {};

  syncSpec.files.delete = syncSpecRaw.sync.files.delete;

  syncSpec.files.ignore = syncSpecRaw.sync.files.ignore;

  syncSpec.files.download = [];

  syncSpecRaw.sync.files.download.forEach( (downloadRaw : any) => {
    let download : any = {};
    download.link = downloadRaw.link;
    download.name = downloadRaw.name;
    download.size = Number(downloadRaw.size);
    download.hash = {};
    download.hash.hex = downloadRaw.hash['#text'];
    download.hash.method = downloadRaw.hash['@method'];

    syncSpec.files.download.push(download);
  });

  return syncSpec;
}

