import fs = require('fs');
// import path = require('path');
const xml2js = require('xml2js');

import {
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
  TransitionType,
} from '@brightsign/bscore';

import {
  dmAddZone, dmUpdateMediaState
} from '@brightsign/bsdatamodel';

import {
  DmcMediaState,
  dmGetMediaStateByName,
  TransitionAction,
  dmAddTransition,
  dmAddEvent,
  BsDmId,
  EventAction,
  BsDmAction,
  ZoneParams,
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
  VideoOrImagesZonePropertyParams,
} from '@brightsign/bsdatamodel';

import * as Converters from './converters';

export function importBPF(pathToBpf: string, dispatch: Function, getState: Function): Promise<any> {
  return new Promise((resolve) => {
    readBPF(pathToBpf).then((rawBPF : any) => {
      console.log(rawBPF);
      const bpf : any = convertRawBPF(rawBPF);

      let { name, videoMode, model } = bpf.meta;
      let {
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
      } = bpf.meta;

      dispatch(dmNewSign(name, videoMode, model));
      let state = getState();
      console.log(state);

      let signAction : SignAction;
      let signState : DmSignState;
      let signMetadata : DmSignMetadata;
      let signProperties : DmSignProperties;

      signState = dmGetSignState(state.bsdm);
      signMetadata = signState.sign;
      signProperties = signMetadata.properties;

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

      state = getState();
      console.log(state);

      console.log(bpf);
      resolve(bpf);
    });
  });
}

function readBPF(bpfFilePath: string = '') : Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(bpfFilePath, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        try {
          let parser = new xml2js.Parser();
          parser.parseString(buf, (err: any, bpfRaw: any) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(bpfRaw);
          });
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
}

function convertRawBPF(rawBPF : any) : any {

  const bpf : any = {};

  const brightAuthor : any = rawBPF.BrightAuthor;
  const metaData : any = brightAuthor.meta[0];
  const zones : any = brightAuthor.zones;

  bpf.meta = convertRawBPFMetadata(metaData);

  return bpf;
}

function convertRawBPFMetadata(rawMetadata : any) : any {

  let bpfMetadata : any = {};
  convertRawBPFSignProperties(rawMetadata, bpfMetadata);
  convertRawBPFSerial(rawMetadata, bpfMetadata);
  convertRawBPFGpio(rawMetadata, bpfMetadata);
  convertRawBPFButtonPanels(rawMetadata, bpfMetadata);
  convertRawBPFAudio(rawMetadata, bpfMetadata);

  return bpfMetadata;
}

function convertRawBPFSignProperties(rawMetadata : any, bpfMetadata: any) : void {

  bpfMetadata.name = rawMetadata.name[0];
  bpfMetadata.videoMode = rawMetadata.videoMode[0];
  bpfMetadata.model = rawMetadata.model[0];

  bpfMetadata.alphabetizeVariableNames = Converters.stringToBool(rawMetadata.alphabetizeVariableNames[0]);
  bpfMetadata.autoCreateMediaCounterVariables = Converters.stringToBool(rawMetadata.autoCreateMediaCounterVariables[0]);
  bpfMetadata.backgroundScreenColor = {
    a: Converters.stringToNumber(rawMetadata.backgroundScreenColor[0]['$']['a']),
    r: Converters.stringToNumber(rawMetadata.backgroundScreenColor[0]['$']['r']),
    g: Converters.stringToNumber(rawMetadata.backgroundScreenColor[0]['$']['g']),
    b: Converters.stringToNumber(rawMetadata.backgroundScreenColor[0]['$']['b']),
  };
  bpfMetadata.delayScheduleChangeUntilMediaEndEvent = Converters.stringToBool(rawMetadata.delayScheduleChangeUntilMediaEndEvent[0].toLowerCase());
  bpfMetadata.deviceWebPageDisplay = rawMetadata.deviceWebPageDisplay[0];
  bpfMetadata.flipCoordinates =  Converters.stringToBool(rawMetadata.flipCoordinates[0]);
  bpfMetadata.forceResolution = Converters.stringToBool(rawMetadata.forceResolution[0]);
  bpfMetadata.graphicsZOrder = rawMetadata.graphicsZOrder[0];
  bpfMetadata.htmlEnableJavascriptConsole = Converters.stringToBool(rawMetadata.htmlEnableJavascriptConsole[0]);
  bpfMetadata.inactivityTime = Converters.stringToNumber(rawMetadata.inactivityTime[0]);
  bpfMetadata.inactivityTimeout = Converters.stringToBool(rawMetadata.inactivityTimeout[0]);
  bpfMetadata.isMosaic = Converters.stringToBool(rawMetadata.isMosaic[0]);
  bpfMetadata.language = rawMetadata.language[0];
  bpfMetadata.languageKey = rawMetadata.languageKey[0];
  bpfMetadata.monitorOrientation = rawMetadata.monitorOrientation[0];
  bpfMetadata.monitorOverscan = rawMetadata.monitorOverscan[0];
  bpfMetadata.resetVariablesOnPresentationStart = Converters.stringToBool(rawMetadata.resetVariablesOnPresentationStart[0]);
  bpfMetadata.tenBitColorEnabled = Converters.stringToBool(rawMetadata.tenBitColorEnabled[0]);
  bpfMetadata.touchCursorDisplayMode = rawMetadata.touchCursorDisplayMode[0];
  bpfMetadata.udpDestinationAddress = rawMetadata.udpDestinationAddress[0];
  bpfMetadata.udpDestinationAddressType = rawMetadata.udpDestinationAddressType[0];
  bpfMetadata.udpDestinationPort = Converters.stringToNumber(rawMetadata.udpDestinationPort[0]);
  bpfMetadata.udpReceiverPort = Converters.stringToNumber(rawMetadata.udpReceiverPort[0]);
  bpfMetadata.videoConnector = rawMetadata.videoConnector[0];
}

function convertRawBPFSerial(rawMetadata: any, bpfMetadata: any) : void {

  let serialPortConfigurations: any[] = [];
  let serialPortConfiguration : any = {};

  rawMetadata.SerialPortConfiguration.forEach( (serialPortConfigurationBPF : any) => {
    serialPortConfiguration = {
      port : Converters.stringToNumber(serialPortConfigurationBPF.port[0]),
      baudRate : Converters.stringToNumber(serialPortConfigurationBPF.baudRate[0]),
      dataBits: Converters.stringToNumber(serialPortConfigurationBPF.dataBits[0]),
      stopBits: Converters.stringToNumber(serialPortConfigurationBPF.stopBits[0]),
      parity: serialPortConfigurationBPF.parity[0],
      protocol: serialPortConfigurationBPF.protocol[0],
      sendEol : serialPortConfigurationBPF.sendEol[0],
      receiveEol : serialPortConfigurationBPF.receiveEol[0],
      invertSignals : Converters.stringToBool(serialPortConfigurationBPF.invertSignals[0]),
      connectedDevice : serialPortConfigurationBPF.connectedDevice[0],
    };
    serialPortConfigurations.push(serialPortConfiguration);
  });

  bpfMetadata.serialPortConfigurations = serialPortConfigurations;
}

function convertRawBPFGpio(rawMetadata: any, bpfMetadata: any) : void {

  let gpioList : any[] = [];

  for (let i = 0; i < 8; i++) {
    const gpio : GpioType = rawMetadata['gpio' + i.toString()][0];
    gpioList.push(gpio);
  }

  bpfMetadata.gpioList = gpioList;
}

function convertRawBPFButtonPanels(rawMetadata: any, bpfMetadata: any) : void {

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
    let configureAutomatically : boolean = Converters.stringToBool(rawMetadata[buttonPanelName +  'ConfigureAutomatically'][0]);
    let configuration : number = Converters.stringToNumber(rawMetadata[buttonPanelName + 'Configuration'][0]);
    bpConfiguration = {
      configureAutomatically,
      configuration
    };
    buttonPanelMap[buttonPanelName.toLowerCase()] = bpConfiguration;
  }

  bpfMetadata.buttonPanelMap = buttonPanelMap;
}

function convertRawBPFAudio(rawMetadata: any, bpfMetadata: any) : void {

  let audioSignPropertyMap : DmAudioSignPropertyMap = {};
  let audioSignProperties : DmAudioSignProperties;

  let bacAudioNames : Array<string> = [
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

  for (let bacAudioName of bacAudioNames) {
    audioSignProperties = {
      min : Converters.stringToNumber(rawMetadata[bacAudioName + 'MinVolume'][0]),
      max : Converters.stringToNumber(rawMetadata[bacAudioName + 'MaxVolume'][0])
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

  bpfMetadata.audioSignPropertyMap = audioSignPropertyMap;
}