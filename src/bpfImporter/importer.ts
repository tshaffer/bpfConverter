import fs = require('fs');
import path = require('path');
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

import { bpfToJson } from './bpfToJson';
import { createSign } from './signBuilder';

export function importBPFPoo(bpfFilePath: string, dispatch: Function, getState: Function): Promise<any> {

  return new Promise( (resolve, reject) => {
    readFile(bpfFilePath).then( (bpfBuf : any) => {
      return bpfToJson(bpfBuf);
    }).then((bpf : any) => {
      console.log(bpf);
      createSign(bpf, dispatch, getState);

      // sign in bsdm has been created - write it to a file
      let basename : string = path.basename(bpfFilePath);
      let dirname : string = path.dirname(bpfFilePath);
      let extname : string = path.extname(bpfFilePath);
      let parsedPath : any = path.parse(bpfFilePath);

      const bpfxPath = path.join(dirname, parsedPath.name + ".bpfx");

      let signState: DmSignState = dmGetSignState(getState().bsdm);

      const bpfStr = JSON.stringify(signState, null, '\t');
      fs.writeFile(bpfxPath, bpfStr, (err) => {
        if(err)
          reject(err);
        else
          resolve(bpf);
      });

      resolve(bpf);
    });
  });
}

function readFile(filePath : string) : Promise<Buffer> {

  return new Promise( (resolve, reject) => {
    fs.readFile(filePath, (err, buf) => {
      if (err) {
        reject(err);
      }
      resolve(buf);
    });
  })
}

function readBPF(bpfFilePath: string = '') : Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(bpfFilePath, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        try {
          let parser = new xml2js.Parser({explicitArray: false});
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

function convertRawBPFZones(rawZones: any) : any {

  let bpfZones: any = [];

  rawZones.forEach( (rawZoneA : any) => {
    const rawZone = rawZoneA.zone[0];
    const bpfZone = convertRawBPFZone(rawZone);
    console.log(bpfZone);

    bpfZones.push(bpfZone);
  });

  return bpfZones;
}

function convertRawBPFZone(rawZone: any) : any {

  let bpfZone: any = {};

  bpfZone.height = Converters.stringToNumber(rawZone.height[0]);
  bpfZone.horizontalOffset = Converters.stringToNumber(rawZone.horizontalOffset[0]);
  bpfZone.id = rawZone.id[0];
  bpfZone.name = rawZone.name[0];
  bpfZone.type = rawZone.type[0];
  bpfZone.verticalOffset = Converters.stringToNumber(rawZone.verticalOffset[0]);
  bpfZone.width = Converters.stringToNumber(rawZone.width[0]);
  bpfZone.x = Converters.stringToNumber(rawZone.x[0]);
  bpfZone.y = Converters.stringToNumber(rawZone.y[0]);
  bpfZone.zoomValue = Converters.stringToNumber(rawZone.zoomValue[0]);

  bpfZone.zoneSpecificParameters = convertRawBPFZoneSpecificParameters(rawZone.zoneSpecificParameters[0]);

  // playlist

  console.log(bpfZone);

  return bpfZone;
}

function convertRawBPFZoneSpecificParameters(rawZoneSpecificParameters: any) : any {

  let zoneSpecificParameters : any = {};

  zoneSpecificParameters.liveVideoInput = rawZoneSpecificParameters.liveVideoInput[0];
  zoneSpecificParameters.liveVideoStandard = rawZoneSpecificParameters.liveVideoStandard[0];
  zoneSpecificParameters.videoVolume = Converters.stringToNumber(rawZoneSpecificParameters.videoVolume[0]);
  zoneSpecificParameters.brightness = Converters.stringToNumber(rawZoneSpecificParameters.brightness[0]);
  zoneSpecificParameters.contrast = Converters.stringToNumber(rawZoneSpecificParameters.contrast[0]);
  zoneSpecificParameters.saturation = Converters.stringToNumber(rawZoneSpecificParameters.saturation[0]);
  zoneSpecificParameters.hue = Converters.stringToNumber(rawZoneSpecificParameters.hue[0]);
  zoneSpecificParameters.zOrderFront = Converters.stringToBool(rawZoneSpecificParameters.zOrderFront[0]);
  zoneSpecificParameters.mosaic = Converters.stringToBool(rawZoneSpecificParameters.mosaic[0]);

   zoneSpecificParameters.analog2Output = rawZoneSpecificParameters.analog2Output[0];
   zoneSpecificParameters.analog3Output = rawZoneSpecificParameters.analog3Output[0];
   zoneSpecificParameters.analogOutput = rawZoneSpecificParameters.analogOutput[0];
   zoneSpecificParameters.audioMapping = rawZoneSpecificParameters.audioMapping[0];
   zoneSpecificParameters.audioMixMode = rawZoneSpecificParameters.audioMixMode[0];
   zoneSpecificParameters.audioMode = rawZoneSpecificParameters.audioMode[0];
   zoneSpecificParameters.audioOutput = rawZoneSpecificParameters.audioOutput[0];
   zoneSpecificParameters.audioVolume = Converters.stringToNumber(rawZoneSpecificParameters.audioVolume[0]);
   zoneSpecificParameters.hdmiOutput = rawZoneSpecificParameters.hdmiOutput[0];
   zoneSpecificParameters.imageMode = rawZoneSpecificParameters.imageMode[0];
   zoneSpecificParameters.maxContentResolution = rawZoneSpecificParameters.maxContentResolution[0];
   zoneSpecificParameters.maximumVolume = Converters.stringToNumber(rawZoneSpecificParameters.maximumVolume[0]);
   zoneSpecificParameters.minimumVolume = Converters.stringToNumber(rawZoneSpecificParameters.minimumVolume[0]);
   zoneSpecificParameters.spdifOutput = rawZoneSpecificParameters.spdifOutput[0];
   zoneSpecificParameters.usbOutput = rawZoneSpecificParameters.usbOutput[0];
   zoneSpecificParameters.usbOutputA = rawZoneSpecificParameters.usbOutputA[0];
   zoneSpecificParameters.usbOutputB = rawZoneSpecificParameters.usbOutputB[0];
   zoneSpecificParameters.usbOutputC = rawZoneSpecificParameters.usbOutputC[0];
   zoneSpecificParameters.usbOutputD = rawZoneSpecificParameters.usbOutputD[0];
   zoneSpecificParameters.viewMode = rawZoneSpecificParameters.viewMode[0];

   return zoneSpecificParameters;
}