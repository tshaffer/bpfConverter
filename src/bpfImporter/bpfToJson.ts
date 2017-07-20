const xml2js = require('xml2js');

import * as Converters from './converters';

export function bpfToJson(xmlBPF : any) : any {

  return new Promise( (resolve, reject) => {
    stringToJson(xmlBPF).then( (jsonBPF: any) => {
      const bpf : any = fixJsonBPF(jsonBPF);
      console.log(bpf);
      resolve(bpf);
    });
  });
}

function fixJsonBPF(rawBPF : any) : any {

  let bpf : any = {};

  const rawBrightAuthor : any = rawBPF.BrightAuthor;
  const rawPresentationParameters : any = rawBrightAuthor.$;
  const rawMetadata = rawBrightAuthor.meta;

  // check for array vs. non array for zones
  const rawZones = rawBrightAuthor.zones;
  const rawZone = rawZones.zone;

  bpf.presentationParameters = fixPresentationParameters(rawPresentationParameters);
  bpf.metadata = fixMetadata(rawMetadata);
  bpf.zones = fixZones(rawZones);

  console.log(bpf);
  debugger;

  return bpf;

  // const metaData : any = brightAuthor.meta[0];
  // const zones : any = brightAuthor.zones;
  //
  // bpf.meta = convertRawBPFMetadata(metaData);
  // bpf.zones = convertRawBPFZones(zones);
  // return bpf;
}

function fixPresentationParameters(rawPresentationParameters: any) : any {

  const presentationParametersSpec: any[] = [
    { name: 'BrightAuthorVersion', type: 'string'},
    { name: 'type', type: 'string'},
    { name: 'version', type: 'number'}
  ];

  return fixJson(presentationParametersSpec, rawPresentationParameters);
}

function fixMetadata(rawMetadata: any) : any {

  let {
    DirectoryLocations, SerialPortConfiguration, backgroundScreenColor, beacons, htmlSites, liveDataFeeds,
    parserPlugins, presentationIdentifiers, scriptPlugins, userDefinedEvents, userVariables
  } = rawMetadata;

  const metadataSpec: any[] = [
    { name:'name', type: 'string'},
    { name:'videoMode', type: 'string'},
    { name:'model', type: 'string'},
    { name:'alphabetizeVariableNames', type: 'boolean'},
    { name:'autoCreateMediaCounterVariables', type: 'boolean'},
    { name:'delayScheduleChangeUntilMediaEndEvent', type: 'boolean'},
    { name:'deviceWebPageDisplay', type: 'string'},
    { name:'flipCoordinates', type: 'boolean'},
    { name:'forceResolution', type: 'boolean'},
    { name:'graphicsZOrder', type: 'string'},
    { name:'htmlEnableJavascriptConsole', type: 'boolean'},
    { name:'inactivityTime', type: 'number'},
    { name:'inactivityTimeout', type: 'boolean'},
    { name:'isMosaic', type: 'boolean'},
    { name:'language', type: 'string'},
    { name:'languageKey', type: 'string'},
    { name:'monitorOrientation', type: 'string'},
    { name:'monitorOverscan', type: 'string'},
    { name:'resetVariablesOnPresentationStart', type: 'boolean'},
    { name:'tenBitColorEnabled', type: 'boolean'},
    { name:'touchCursorDisplayMode', type: 'string'},
    { name:'udpDestinationAddress', type: 'string'},
    { name:'udpDestinationAddressType', type: 'string'},
    { name:'udpDestinationPort', type: 'number'},
    { name:'udpReceiverPort', type: 'number'},
    { name:'videoConnector', type: 'string'},
    { name:'BP200AConfiguration', type: 'number'},
    { name:'BP200AConfigureAutomatically', type: 'boolean'},
    { name:'BP200BConfiguration', type: 'number'},
    { name:'BP200BConfigureAutomatically', type: 'boolean'},
    { name:'BP200CConfiguration', type: 'number'},
    { name:'BP200CConfigureAutomatically', type: 'boolean'},
    { name:'BP200DConfiguration', type: 'number'},
    { name:'BP200DConfigureAutomatically', type: 'boolean'},
    { name:'BP900AConfiguration', type: 'number'},
    { name:'BP900AConfigureAutomatically', type: 'boolean'},
    { name:'BP900BConfiguration', type: 'number'},
    { name:'BP900BConfigureAutomatically', type: 'boolean'},
    { name:'BP900CConfiguration', type: 'number'},
    { name:'BP900CConfigureAutomatically', type: 'boolean'},
    { name:'BP900DConfiguration', type: 'number'},
    { name:'BP900DConfigureAutomatically', type: 'boolean'},
    { name:'audio1MaxVolume', type: 'number'},
    { name:'audio1MinVolume', type: 'number'},
    { name:'audio2MaxVolume', type: 'number'},
    { name:'audio2MinVolume', type: 'number'},
    { name:'audio3MaxVolume', type: 'number'},
    { name:'audio3MinVolume', type: 'number'},
    { name:'audioConfiguration', type: 'string'},
    { name:'fullResGraphicsEnabled', type: 'boolean'},
    { name:'gpio0', type: 'string'},
    { name:'gpio1', type: 'string'},
    { name:'gpio2', type: 'string'},
    { name:'gpio3', type: 'string'},
    { name:'gpio4', type: 'string'},
    { name:'gpio5', type: 'string'},
    { name:'gpio6', type: 'string'},
    { name:'gpio7', type: 'string'},
    { name:'hdmiMaxVolume', type: 'number'},
    { name:'hdmiMinVolume', type: 'number'},
    { name:'isBackup', type: 'boolean'},
    { name:'networkedVariablesUpdateInterval', type: 'number'},
    { name:'spdifMaxVolume', type: 'number'},
    { name:'spdifMinVolume', type: 'number'},
    { name:'usbAMaxVolume', type: 'number'},
    { name:'usbAMinVolume', type: 'number'},
    { name:'usbBMaxVolume', type: 'number'},
    { name:'usbBMinVolume', type: 'number'},
    { name:'usbCMaxVolume', type: 'number'},
    { name:'usbCMinVolume', type: 'number'},
    { name:'usbDMaxVolume', type: 'number'},
    { name:'usbDMinVolume', type: 'number'},
  ];

  let metadata : any = fixJson(metadataSpec, rawMetadata);
  metadata.backgroundScreenColor = fixBackgroundScreenColor(backgroundScreenColor);
  metadata.SerialPortConfigurations = fixSerialPortConfiguration(SerialPortConfiguration);

  return metadata;
}

function fixSerialPortConfiguration(rawSerialPortConfigurations : any) : any {

  let serialPortConfigurations : any[] = [];

  const serialPortConfigurationSpec: any [] = [
    { name:'baudRate', type: 'number'},
    { name:'connectedDevice', type: 'string'},
    { name:'dataBits', type: 'number'},
    { name:'invertSignals', type: 'bool'},
    { name:'parity', type: 'string'},
    { name:'port', type: 'number'},
    { name:'protocol', type: 'string'},
    { name:'receiveEol', type: 'string'},
    { name:'sendEol', type: 'string'},
    { name:'stopBits', type: 'number'},
  ];

  rawSerialPortConfigurations.forEach( (rawSerialPortConfiguration : any) => {
    serialPortConfigurations.push(fixJson(serialPortConfigurationSpec, rawSerialPortConfiguration));
  });

  return serialPortConfigurations;
}

function fixBackgroundScreenColor(rawBackgroundScreenColor : any) : any {
  const backgroundScreenColorSpec: any[] = [
    { name:'a', type: 'number'},
    { name:'r', type: 'number'},
    { name:'g', type: 'number'},
    { name:'b', type: 'number'},
  ];

  return fixJson(backgroundScreenColorSpec, rawBackgroundScreenColor.$);
}

function fixZones(rawZones: any) : any {

  // check to see if rawZones is an array - for now it's not
  let zones : any = [];
  zones.push(fixZone(rawZones.zone));

  return zones;
}

function fixZone(rawZone : any) : any {

  let zone : any = fixZoneParameters(rawZone);
  zone.zoneSpecificParameters = fixZoneSpecificParameters(rawZone.zoneSpecificParameters);
  zone.playlist = fixZonePlaylist(rawZone.playlist);

  return zone;
}

function fixZoneParameters(rawZone : any) : any {

  const zoneParametersSpec: any[] = [
    { name: 'height', type: 'number'},
    { name: 'horizontalOffset', type: 'number'},
    { name: 'id', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'type', type: 'string'},
    { name: 'verticalOffset', type: 'number'},
    { name: 'width', type: 'number'},
    { name: 'x', type: 'number'},
    { name: 'y', type: 'number'},
    { name: 'zoomValue', type: 'number'},
  ];

  return fixJson(zoneParametersSpec, rawZone);
}

function fixZoneSpecificParameters(rawZoneSpecificParameters : any) : any {

  const zoneSpecificParametersSpec: any[] = [
    { name: 'analogOutput', type: 'string'},
    { name: 'analog2Output', type: 'string'},
    { name: 'analog3Output', type: 'string'},
    { name: 'audioMapping', type: 'string'},
    { name: 'audioMixMode', type: 'string'},
    { name: 'audioMode', type: 'string'},
    { name: 'audioOutput', type: 'string'},
    { name: 'audioVolume', type: 'number'},
    { name: 'brightness', type: 'number'},
    { name: 'contrast', type: 'number'},
    { name: 'hdmiOutput', type: 'string'},
    { name: 'hue', type: 'number'},
    { name: 'imageMode', type: 'string'},
    { name: 'liveVideoInput', type: 'string'},
    { name: 'liveVideoStandard', type: 'string'},
    { name: 'maxContentResolution', type: 'string'},
    { name: 'maximumVolume', type: 'number'},
    { name: 'minimumVolume', type: 'number'},
    { name: 'mosaic', type: 'boolean'},
    { name: 'saturation', type: 'number'},
    { name: 'spdifOutput', type: 'string'},
    { name: 'usbOutput', type: 'string'},
    { name: 'usbOutputA', type: 'string'},
    { name: 'usbOutputB', type: 'string'},
    { name: 'usbOutputC', type: 'string'},
    { name: 'usbOutputD', type: 'string'},
    { name: 'videoVolume', type: 'number'},
    { name: 'viewMode', type: 'string'},
    { name: 'zOrderFront', type: 'boolean'},
  ];

  return fixJson(zoneSpecificParametersSpec, rawZoneSpecificParameters);
}

function fixZonePlaylist(rawZonePlaylist : any) : any {

  const playlistParametersSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'type', type: 'string'},
  ];

  let playlist : any = fixJson(playlistParametersSpec, rawZonePlaylist);

  if (playlist.type === 'non-interactive') {
    playlist.states = fixZonePlaylistStates(rawZonePlaylist.$$);
  }
  else {
    debugger;
  }

  return playlist;
}

function fixZonePlaylistStates(rawPlaylistItems: any) : any {

  let playlistStates : any[] = [];

  rawPlaylistItems.forEach( (rawPlaylistItem : any) => {
    switch (rawPlaylistItem["#name"]) {
      case 'imageItem': {
        playlistStates.push(fixImageItem(rawPlaylistItem));
        break;

      }
      case 'videoItem': {
        playlistStates.push(fixVideoItem(rawPlaylistItem));
        break;
      }
    }
  });
  return playlistStates;
}

function fixImageItem(rawImageItem : any) : any {

  const imageItemParametersSpec: any[] = [
    { name: 'fileIsLocal', type: 'boolean'},
    { name: 'slideDelayInterval', type: 'number'},
    { name: 'slideTransition', type: 'string'},
    { name: 'transitionDuration', type: 'number'},
    { name: 'videoPlayerRequired', type: 'boolean'},
  ];

  let imageItem : any = fixJson(imageItemParametersSpec, rawImageItem);
  imageItem.file = fixRawFileItem(rawImageItem.file.$);
  imageItem.type = 'imageItem';

  return imageItem;
}

function fixVideoItem(rawVideoItem : any) : any {
  
  const videoItemParametersSpec: any[] = [
    { name: 'automaticallyLoop', type: 'boolean'},
    { name: 'fileIsLocal', type: 'boolean'},
    { name: 'videoDisplayMode', type: 'string'},
    { name: 'volume', type: 'number'},
  ];

  let videoItem : any = fixJson(videoItemParametersSpec, rawVideoItem);
  videoItem.file = fixRawFileItem(rawVideoItem.file.$);
  videoItem.type = 'videoItem';

  return videoItem;
}

function fixRawFileItem(rawFileItem : any) : any {
  const imageItemParametersSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'path', type: 'string'},
  ];

  return fixJson(imageItemParametersSpec, rawFileItem);
}

function fixJson(parametersSpec: any[], parameters: any) : any {

  let convertedParameters: any = {};

  parametersSpec.forEach( (parameterSpec : any) => {
    if (parameters.hasOwnProperty(parameterSpec.name)) {
      let parameterValue = parameters[parameterSpec.name];
      switch(parameterSpec.type) {
        case 'string':
          convertedParameters[parameterSpec.name] = parameterValue;
          break;
        case 'boolean':
          convertedParameters[parameterSpec.name] = Converters.stringToBool(parameterValue);
          break;
        case 'number':
          convertedParameters[parameterSpec.name] = Converters.stringToNumber(parameterValue);
          break;
      }
    }
  });

  return convertedParameters;
}

function stringToJson(buf : Buffer) : any {

  return new Promise( (resolve, reject) => {
    try {
      let parser = new xml2js.Parser({
        explicitArray: false,
        explicitChildren: true,
        preserveChildrenOrder: true
      });
      parser.parseString(buf, (err: any, json: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(json);
      });
    } catch (parseErr) {
      reject(parseErr);
    }
  });
}