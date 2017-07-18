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

function convertRawBPFMetadata(rawMetadata : any) : any {

  debugger;

  const name : string = rawMetadata.name[0];
  const videoMode : string = rawMetadata.videoMode[0];
  const model : string = rawMetadata.model[0];

  const alphabetizeVariableNames : boolean = Converters.stringToBool(rawMetadata.alphabetizeVariableNames[0]);
  const autoCreateMediaCounterVariables : boolean = Converters.stringToBool(rawMetadata.autoCreateMediaCounterVariables[0]);
  const backgroundScreenColor : BsColor = {
    a: Converters.stringToNumber(rawMetadata.backgroundScreenColor[0]['$']['a']),
    r: Converters.stringToNumber(rawMetadata.backgroundScreenColor[0]['$']['r']),
    g: Converters.stringToNumber(rawMetadata.backgroundScreenColor[0]['$']['g']),
    b: Converters.stringToNumber(rawMetadata.backgroundScreenColor[0]['$']['b']),
  };
  const delayScheduleChangeUntilMediaEndEvent : boolean = Converters.stringToBool(rawMetadata.delayScheduleChangeUntilMediaEndEvent[0].toLowerCase());
  const deviceWebPageDisplay : DeviceWebPageDisplay = rawMetadata.deviceWebPageDisplay[0];
  const flipCoordinates : boolean =  Converters.stringToBool(rawMetadata.flipCoordinates[0]);
  const forceResolution : boolean = Converters.stringToBool(rawMetadata.forceResolution[0]);
  const graphicsZOrder : GraphicsZOrderType = rawMetadata.graphicsZOrder[0];
  const htmlEnableJavascriptConsole : boolean = Converters.stringToBool(rawMetadata.htmlEnableJavascriptConsole[0]);
  const inactivityTime : number = Converters.stringToNumber(rawMetadata.inactivityTime[0]);
  const inactivityTimeout : boolean = Converters.stringToBool(rawMetadata.inactivityTimeout[0]);
  const isMosaic : boolean = Converters.stringToBool(rawMetadata.isMosaic[0]);
  const language : LanguageType = rawMetadata.language[0];
  const languageKey : LanguageKeyType = rawMetadata.languageKey[0];
  const monitorOrientation : MonitorOrientationType = rawMetadata.monitorOrientation[0];
  const monitorOverscan : MonitorOverscanType = rawMetadata.monitorOverscan[0];
  const resetVariablesOnPresentationStart : boolean = Converters.stringToBool(rawMetadata.resetVariablesOnPresentationStart[0]);
  const tenBitColorEnabled : boolean = Converters.stringToBool(rawMetadata.tenBitColorEnabled[0]);
  const touchCursorDisplayMode : TouchCursorDisplayModeType = rawMetadata.touchCursorDisplayMode[0];
  const udpDestinationAddress : string = rawMetadata.udpDestinationAddress[0];
  const udpDestinationAddressType : UdpAddressType = rawMetadata.udpDestinationAddressType[0];
  const udpDestinationPort : number = Converters.stringToNumber(rawMetadata.udpDestinationPort[0]);
  const udpReceiverPort : number = Converters.stringToNumber(rawMetadata.udpReceiverPort[0]);
  const videoConnector : VideoConnectorType = rawMetadata.videoConnector[0];

  const metadata : any = {
    name,
    videoMode,
    model,
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
    videoConnector
  };

  return metadata;
}

function convertRawBPF(rawBPF : any) : any {

  const bpf : any = {};

  const brightAuthor : any = rawBPF.BrightAuthor;
  const metaData : any = brightAuthor.meta[0];
  const zones : any = brightAuthor.zones;

  bpf.meta = convertRawBPFMetadata(metaData);

  return bpf;
}


