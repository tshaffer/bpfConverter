import {
  BsColor,
} from '@brightsign/bscore';

import {
  DmSerialPortConfiguration,
  DmSerialPortList,
  DmSignMetadata,
  DmSignProperties,
  DmSignState,
  SerialPortListParams,
  SignAction,
  dmGetSignState,
  dmNewSign,
  dmUpdateSignProperties,
  dmUpdateSignSerialPorts,
} from '@brightsign/bsdatamodel';


export function createSign(bpf : any, dispatch: Function, getState: Function) : void {

  debugger;

  newSign(bpf, dispatch);
  setSignProperties(bpf, dispatch, getState);
  setSerialPortConfiguration(bpf, dispatch);

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