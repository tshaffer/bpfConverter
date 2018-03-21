import { Parser } from 'xml2js';
import { isNil, isString, isNumber } from 'lodash';

import {
  HtmlSiteType,
} from '@brightsign/bscore';

import * as Converters from './converters';

import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';

export function isXml(buf : Buffer) : Promise<boolean> {
  return new Promise( (resolve) => {
    stringToJson(buf).then( () => {
      resolve(true);
      return;
    }).catch(() => {
      resolve(false);
      return;
    });
  });
}

export function bpfToJson(xmlBPF : any) : any {

  return new Promise( (resolve) => {
    stringToJson(xmlBPF).then( (jsonBPF: any) => {
      const bpf : any = fixJsonBPF(jsonBPF);
      resolve(bpf);
    });
  });
}

function validateFileIsSupportedBpf(presentationParameters: any) {
  
  // validate that this is a bpf and that this conversion utility supports it.
  // TODO - for now, minimum supported version is 6. This requires further investigation
  if (isNil(presentationParameters)
    || !isString(presentationParameters.BrightAuthorVersion)
    || !isString(presentationParameters.type)
    || (presentationParameters.type !== 'project')
    || !isNumber(presentationParameters.version)) {
    throw new BpfConverterError(BpfConverterErrorType.errorNotAValidBpf,
      'fixJsonBPF: not a valid bpf file');
  }
  if (presentationParameters.version < 6) {
    throw new BpfConverterError(BpfConverterErrorType.errorUnsupportedBpf,
      'fixJsonBPF: convert does not support this bpf version');
  }
}

function fixJsonBPF(rawBPF : any) : any {

  const bpf : any = {};

  const rawBrightAuthor : any = rawBPF.BrightAuthor;
  if (isNil(rawBrightAuthor) || isNil(rawBrightAuthor.$) || isNil(rawBrightAuthor.meta)) {
    throw new BpfConverterError(BpfConverterErrorType.errorNotAValidBpf,
      'fixJsonBPF: not a valid bpf file');
  }
  const rawPresentationParameters : any = rawBrightAuthor.$;
  const rawMetadata = rawBrightAuthor.meta;

  const rawZones = getParameterArray(rawBrightAuthor.zones);

  bpf.presentationParameters = fixPresentationParameters(rawPresentationParameters);
  validateFileIsSupportedBpf(bpf.presentationParameters);
  
  bpf.metadata = fixMetadata(rawMetadata);
  bpf.zones = fixZones(rawZones);

  console.log(bpf);

  return bpf;
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

  const {
    DirectoryLocations, SerialPortConfiguration, backgroundScreenColor, beacons, htmlSites, liveDataFeeds,
    parserPlugins, presentationIdentifiers, scriptPlugins, userDefinedEvents, userVariables
  } = rawMetadata;

  const metadataSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'videoMode', type: 'string'},
    { name: 'model', type: 'string'},
    { name: 'alphabetizeVariableNames', type: 'boolean'},
    { name: 'autoCreateMediaCounterVariables', type: 'boolean'},
    { name: 'delayScheduleChangeUntilMediaEndEvent', type: 'boolean'},
    { name: 'deviceWebPageDisplay', type: 'string'},
    { name: 'flipCoordinates', type: 'boolean'},
    { name: 'forceResolution', type: 'boolean'},
    { name: 'graphicsZOrder', type: 'string'},
    { name: 'htmlEnableJavascriptConsole', type: 'boolean'},
    { name: 'inactivityTime', type: 'number'},
    { name: 'inactivityTimeout', type: 'boolean'},
    { name: 'isMosaic', type: 'boolean'},
    { name: 'language', type: 'string'},
    { name: 'languageKey', type: 'string'},
    { name: 'monitorOrientation', type: 'string'},
    { name: 'monitorOverscan', type: 'string'},
    { name: 'resetVariablesOnPresentationStart', type: 'boolean'},
    { name: 'tenBitColorEnabled', type: 'boolean'},
    { name: 'touchCursorDisplayMode', type: 'string'},
    { name: 'udpDestinationAddress', type: 'string'},
    { name: 'udpDestinationAddressType', type: 'string'},
    { name: 'udpDestinationPort', type: 'number'},
    { name: 'udpReceiverPort', type: 'number'},
    { name: 'videoConnector', type: 'string'},
    { name: 'BP200AConfiguration', type: 'number'},
    { name: 'BP200AConfigureAutomatically', type: 'boolean'},
    { name: 'BP200BConfiguration', type: 'number'},
    { name: 'BP200BConfigureAutomatically', type: 'boolean'},
    { name: 'BP200CConfiguration', type: 'number'},
    { name: 'BP200CConfigureAutomatically', type: 'boolean'},
    { name: 'BP200DConfiguration', type: 'number'},
    { name: 'BP200DConfigureAutomatically', type: 'boolean'},
    { name: 'BP900AConfiguration', type: 'number'},
    { name: 'BP900AConfigureAutomatically', type: 'boolean'},
    { name: 'BP900BConfiguration', type: 'number'},
    { name: 'BP900BConfigureAutomatically', type: 'boolean'},
    { name: 'BP900CConfiguration', type: 'number'},
    { name: 'BP900CConfigureAutomatically', type: 'boolean'},
    { name: 'BP900DConfiguration', type: 'number'},
    { name: 'BP900DConfigureAutomatically', type: 'boolean'},
    { name: 'audio1MaxVolume', type: 'number'},
    { name: 'audio1MinVolume', type: 'number'},
    { name: 'audio2MaxVolume', type: 'number'},
    { name: 'audio2MinVolume', type: 'number'},
    { name: 'audio3MaxVolume', type: 'number'},
    { name: 'audio3MinVolume', type: 'number'},
    { name: 'audioConfiguration', type: 'string'},
    { name: 'fullResGraphicsEnabled', type: 'boolean'},
    { name: 'gpio0', type: 'string'},
    { name: 'gpio1', type: 'string'},
    { name: 'gpio2', type: 'string'},
    { name: 'gpio3', type: 'string'},
    { name: 'gpio4', type: 'string'},
    { name: 'gpio5', type: 'string'},
    { name: 'gpio6', type: 'string'},
    { name: 'gpio7', type: 'string'},
    { name: 'hdmiMaxVolume', type: 'number'},
    { name: 'hdmiMinVolume', type: 'number'},
    { name: 'isBackup', type: 'boolean'},
    { name: 'networkedVariablesUpdateInterval', type: 'number'},
    { name: 'spdifMaxVolume', type: 'number'},
    { name: 'spdifMinVolume', type: 'number'},
    { name: 'usbAMaxVolume', type: 'number'},
    { name: 'usbAMinVolume', type: 'number'},
    { name: 'usbBMaxVolume', type: 'number'},
    { name: 'usbBMinVolume', type: 'number'},
    { name: 'usbCMaxVolume', type: 'number'},
    { name: 'usbCMinVolume', type: 'number'},
    { name: 'usbDMaxVolume', type: 'number'},
    { name: 'usbDMinVolume', type: 'number'},
  ];

  const metadata : any = fixJson(metadataSpec, rawMetadata);
  metadata.backgroundScreenColor = fixBackgroundScreenColor(backgroundScreenColor);
  metadata.SerialPortConfigurations = fixSerialPortConfiguration(SerialPortConfiguration);
  metadata.liveDataFeeds = fixLiveDataFeeds(liveDataFeeds);
  metadata.userVariables = fixUserVariables(userVariables);
  metadata.htmlSites = fixHtmlSites(htmlSites);
  metadata.scriptPlugins = fixScriptPlugins(scriptPlugins);
  metadata.parserPlugins = fixParserPlugins(parserPlugins);
  
  return metadata;
}

function fixLiveDataFeeds(rawLiveDataFeedSpec: any) : any {

  const liveDataFeeds: any[] = [];

  const liveDataFeedConfigurationSpec: any [] = [
    { name: 'autoGenerateUserVariables', type: 'boolean'},
    { name: 'dataFeedUse', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'updateInterval', type: 'number'},
    { name: 'useHeadRequest', type: 'boolean'},
    { name: 'parserPluginName', type: 'string'},
    { name: 'userVariableAccess', type: 'string'},
    { name: 'uvParserPluginName', type: 'string'}
  ];

  if (rawLiveDataFeedSpec && rawLiveDataFeedSpec.liveDataFeed) {
    const rawLiveDataFeeds = getParameterArray(rawLiveDataFeedSpec.liveDataFeed);
    rawLiveDataFeeds.forEach((rawLiveDataFeed: any) => {
      console.log(rawLiveDataFeed);

      const liveDataFeed: any = fixJson(liveDataFeedConfigurationSpec, rawLiveDataFeed);

      // liveDataFeed.parserPluginName = fixString(rawLiveDataFeed.parserPluginName);
      // liveDataFeed.uvParserPluginName = fixString(rawLiveDataFeed.uvParserPluginName);

      if (rawLiveDataFeed.liveDynamicPlaylist) {
        liveDataFeed.liveDynamicPlaylist = fixLiveDynamicPlaylist(rawLiveDataFeed.liveDynamicPlaylist);
      }
      else if (rawLiveDataFeed.liveBSNTaggedPlaylist) {
        liveDataFeed.liveTaggedPlaylist = fixLiveTaggedPlaylist(rawLiveDataFeed.liveBSNTaggedPlaylist);
      }
      else if (rawLiveDataFeed.liveBSNDataFeed) {
        liveDataFeed.liveDataFeed = fixLiveDataFeed(rawLiveDataFeed.liveBSNDataFeed);
      }
      else if (rawLiveDataFeed.liveBSNMediaFeed) {
        liveDataFeed.liveMediaFeed = fixLiveMediaFeed(rawLiveDataFeed.liveBSNMediaFeed);
      }
      else {
        liveDataFeed.url = fixParameterValue(rawLiveDataFeed.url.parameterValue);
      }
      liveDataFeeds.push(liveDataFeed);
    });
  }

  return liveDataFeeds;
}

function fixParameterValue(rawParameterValue : any) : any {
  console.log(rawParameterValue);

  const parameterValue : any = {};
  parameterValue.parameterValueItems = [];

  const rawParameterValueItems : any[] = rawParameterValue.$$;
  rawParameterValueItems.forEach( (rawParameterValueItem : any) => {

    switch (rawParameterValueItem['#name']) {
      case 'parameterValueItemText': {
        const parameterValueItem : any = {
          type : 'textValue',
          textValue : rawParameterValueItem.value
        };
        parameterValue.parameterValueItems.push(parameterValueItem);

        break;
      }
      case 'parameterValueItemUserVariable': {

        const rawUserVariable : any = rawParameterValueItem.userVariable;
        const userVariable : any = fixUserVariable(rawUserVariable);

        const parameterValueItem : any = {
          type : 'userVariable',
          userVariable
        };
        parameterValue.parameterValueItems.push(parameterValueItem);

        break;
      }
      case 'parameterValueItemMediaCounterVariable': {
        throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
          'fixParameterValue: parameterValueItemMediaCounterVariable not supported');
      }
    }
  });

  return parameterValue;
}

function fixHtmlSites(rawHtmlSiteSpecs : any) : any {

  // localHTMLSite
  //    name - string
  //    queryString - parameterValue
  //    filePath - string
  // remoteHTMLSite
  //    name - string
  //    queryString - parameterValue
  //    url - parameterValue
  //  brightPlateHTMLSite
  //    name - string
  //    queryString - parameterValue
  //    brightPlateName - string
  //    displayName - string

  const htmlSites : any[] = [];

  const localHtmlSitesSpec: any [] = [
    { name: 'name', type: 'string'},
    { name: 'filePath', type: 'string'}
  ];

  if (rawHtmlSiteSpecs && rawHtmlSiteSpecs.localHTMLSite) {
    const rawLocalHtmlSites = getParameterArray(rawHtmlSiteSpecs.localHTMLSite);
    rawLocalHtmlSites.forEach((rawLocalHtmlSite) => {
      const localHtmlSite : any = fixJson(localHtmlSitesSpec, rawLocalHtmlSite);
      localHtmlSite.queryString = fixParameterValue(rawLocalHtmlSite.queryString.parameterValue);
      localHtmlSite.type = HtmlSiteType.Hosted;
      htmlSites.push(localHtmlSite);
    });
  }

  const remoteHtmlSitesSpec: any [] = [
    { name: 'name', type: 'string'},
  ];

  if (rawHtmlSiteSpecs && rawHtmlSiteSpecs.remoteHTMLSite) {
    const rawRemoteHtmlSites = getParameterArray(rawHtmlSiteSpecs.remoteHTMLSite);
    rawRemoteHtmlSites.forEach((rawRemoteHtmlSite) => {
      const remoteHtmlSite : any = fixJson(remoteHtmlSitesSpec, rawRemoteHtmlSite);
      remoteHtmlSite.url = fixParameterValue(rawRemoteHtmlSite.url.parameterValue);
      remoteHtmlSite.queryString = fixParameterValue(rawRemoteHtmlSite.queryString.parameterValue);
      remoteHtmlSite.type = HtmlSiteType.Remote;
      htmlSites.push(remoteHtmlSite);
    });
  }

  // TODO until we decide what to do with BrightPlates
  if (rawHtmlSiteSpecs && rawHtmlSiteSpecs.brightPlateHTMLSite) {
    debugger;
  }
  // const brightPlateHtmlSitesSpec: any [] = [
  //   { name: 'name', type: 'string'},
  //   { name: 'brightPlateName', type: 'string'},
  //   { name: 'displayName', type: 'string'},
  // ];
  //
  // if (rawHtmlSiteSpecs && rawHtmlSiteSpecs.brightPlateHTMLSite) {
  //   const rawBrightPlateHtmlSites = getParameterArray(rawHtmlSiteSpecs.brightPlateHTMLSite);
  //   rawBrightPlateHtmlSites.forEach((rawBrightPlateHtmlSite) => {
  //     const brightPlateHtmlSite : any = fixJson(brightPlateHtmlSitesSpec, rawBrightPlateHtmlSite);
  //     brightPlateHtmlSite.queryString = '';    // TODO
  //     brightPlateHtmlSite.type = 'brightPlate'; // TODO - enum
  //     htmlSites.push(brightPlateHtmlSite);
  //   });
  // }

  return htmlSites;
}

function fixScriptPlugins(rawScriptPluginSpecs : any) : any {

  const scriptPlugins : any[] = [];

  const scriptPluginsSpec: any [] = [
    { name: 'name', type: 'string'},
    { name: 'path', type: 'string'},
  ];

  if (rawScriptPluginSpecs && rawScriptPluginSpecs.scriptPlugin) {
    const rawScriptPlugins = getParameterArray(rawScriptPluginSpecs.scriptPlugin);
    rawScriptPlugins.forEach((rawScriptPlugin) => {
      const scriptPlugin : any = fixJson(scriptPluginsSpec, rawScriptPlugin);
      scriptPlugins.push(scriptPlugin);
    });
  }

  return scriptPlugins;
}

function fixParserPlugins(rawParserPluginSpecs : any) : any {

  const parserPlugins : any[] = [];

  const parserPluginsSpec: any [] = [
    { name: 'name', type: 'string'},
    { name: 'path', type: 'string'},
    { name: 'parseFeedFunctionName', type: 'string'},
    { name: 'parseUVFunctionName', type: 'string'},
    { name: 'userAgentFunctionName', type: 'string'},
  ];

  if (rawParserPluginSpecs && rawParserPluginSpecs.parserPlugin) {
    const rawParserPlugins = getParameterArray(rawParserPluginSpecs.parserPlugin);
    rawParserPlugins.forEach((rawParserPlugin) => {
      const parserPlugin : any = fixJson(parserPluginsSpec, rawParserPlugin);
      parserPlugins.push(parserPlugin);
    });
  }

  return parserPlugins;
}

function fixUserVariables(rawUserVariablesSpec: any) : any {

  let userVariables : any[] = [];

  // TODO add LiveDataFeedName

  const userVariableConfigurationSpec: any [] = [
    { name: 'access', type: 'string'},
    { name: 'defaultValue', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'networked', type: 'boolean'},
  ];

  if (rawUserVariablesSpec && rawUserVariablesSpec.userVariable) {
    const rawUserVariables = getParameterArray(rawUserVariablesSpec.userVariable);
    userVariables = rawUserVariables.map( (rawUserVariable : any) : any => {
      // const userVariable : any = fixJson(userVariableConfigurationSpec, rawUserVariable);
      // userVariable.liveDataFeedName = fixString(rawUserVariable.liveDataFeedName);
      // userVariable.systemVariable = fixString(rawUserVariable.systemVariable);
      const userVariable: any = fixUserVariable(rawUserVariable);
      return userVariable;
    });
  }

  return userVariables;
}

function fixUserVariable(rawUserVariable : any) : any {

  const userVariableConfigurationSpec: any [] = [
    { name: 'access', type: 'string'},
    { name: 'defaultValue', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'liveDataFeedName', type: 'string'},
    { name: 'networked', type: 'boolean'},
    { name: 'systemVariable', type: 'boolean'},
  ];

  const userVariable : any = fixJson(userVariableConfigurationSpec, rawUserVariable);
  // userVariable.liveDataFeedName = fixString(rawUserVariable.liveDataFeedName);
  // // TODO - systemVariable - string?
  // userVariable.systemVariable = fixString(rawUserVariable.systemVariable);

  return userVariable;
}

// function fixUserVariable(rawUserVariable : any) : any {
//
//   const userVariableConfigurationSpec: any [] = [
//     { name: 'access', type: 'string'},
//     { name: 'defaultValue', type: 'string'},
//     { name: 'name', type: 'string'},
//     { name: 'networked', type: 'boolean'},
//   ];
//
//   const userVariable : any = fixJson(userVariableConfigurationSpec, rawUserVariable);
//   userVariable.liveDataFeedName = fixString(rawUserVariable.liveDataFeedName);
//   // TODO - systemVariable - string?
//   userVariable.systemVariable = fixString(rawUserVariable.systemVariable);
//
//   return userVariable;
// }

function fixLiveDynamicPlaylist(rawLiveDynamicPlaylist : any) : any {

  const liveDynamicPlaylistSpec : any [] = [
    { name: 'id', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'supportsAudio', type: 'boolean'},
    { name: 'url', type: 'string'},
  ];

  const liveDynamicPlaylist : any = fixJson(liveDynamicPlaylistSpec, rawLiveDynamicPlaylist);
  return liveDynamicPlaylist;
}

function fixLiveTaggedPlaylist(rawLiveTaggedPlaylist : any) : any {

  const liveTaggedPlaylistSpec : any [] = [
    { name: 'id', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'tagMatching', type: 'boolean'},
    { name: 'url', type: 'string'},
  ];

  const liveTaggedPlaylist : any = fixJson(liveTaggedPlaylistSpec, rawLiveTaggedPlaylist);
  return liveTaggedPlaylist;
}

function fixLiveDataFeed(rawLiveDataFeed : any) : any {

  const liveDataFeedSpec : any [] = [
    { name: 'id', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'url', type: 'string'},
  ];

  const liveDataFeed : any = fixJson(liveDataFeedSpec, rawLiveDataFeed);
  return liveDataFeed;
}

function fixLiveMediaFeed(rawLiveMediaFeed : any) : any {

  const liveMediaFeedSpec : any [] = [
    { name: 'id', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'url', type: 'string'},
  ];

  const liveMediaFeed : any = fixJson(liveMediaFeedSpec, rawLiveMediaFeed);
  return liveMediaFeed;
}

function fixSerialPortConfiguration(rawSerialPortConfigurations : any) : any {

  const serialPortConfigurations : any[] = [];

  const serialPortConfigurationSpec: any [] = [
    { name: 'baudRate', type: 'number'},
    { name: 'connectedDevice', type: 'string'},
    { name: 'dataBits', type: 'number'},
    { name: 'invertSignals', type: 'boolean'},
    { name: 'parity', type: 'string'},
    { name: 'port', type: 'number'},
    { name: 'protocol', type: 'string'},
    { name: 'receiveEol', type: 'string'},
    { name: 'sendEol', type: 'string'},
    { name: 'stopBits', type: 'number'},
  ];

  rawSerialPortConfigurations.forEach( (rawSerialPortConfiguration : any) => {
    serialPortConfigurations.push(fixJson(serialPortConfigurationSpec, rawSerialPortConfiguration));
  });

  return serialPortConfigurations;
}

function fixBackgroundScreenColor(rawBackgroundScreenColor : any) : any {
  const backgroundScreenColorSpec: any[] = [
    { name: 'a', type: 'number'},
    { name: 'r', type: 'number'},
    { name: 'g', type: 'number'},
    { name: 'b', type: 'number'},
  ];

  return fixJson(backgroundScreenColorSpec, rawBackgroundScreenColor.$);
}

function fixZones(rawZoneSpecs: any) : any {

  const zones : any = [];

  // const rawZones = getParameterArray(rawZoneSpecs.zone);
  // const rawZones = getParameterArray(rawZoneSpecs);
  // rawZones.forEach( (rawZone) => {
  rawZoneSpecs.forEach( (rawZoneSpec: any) => {
    zones.push(fixZone(rawZoneSpec.zone));
  });

  return zones;
}

function fixZone(rawZone : any) : any {

  const zone: any = fixZoneParametersCommon(rawZone);
  switch (zone.type) {
    case 'VideoOrImages': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersVideoOrImages(rawZone.zoneSpecificParameters);
      break;
    }
    case 'VideoOnly': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersVideoOnly(rawZone.zoneSpecificParameters);
      break;
    }
    case 'Images': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersImages(rawZone.zoneSpecificParameters);
      break;
    }
    case 'AudioOnly': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersAudioOnly(rawZone.zoneSpecificParameters);
      break;
    }
    case 'EnhancedAudio': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersEnhancedAudio(rawZone.zoneSpecificParameters);
      break;
    }
    case 'Clock': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersClock(rawZone.zoneSpecificParameters);
      break;
    }
    case 'BackgroundImage': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersBackgroundImage(rawZone.zoneSpecificParameters);
      break;
    }
    case 'Ticker': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersTicker(rawZone.zoneSpecificParameters);
      break;
    }
    default: {
      debugger;
      break;
    }
  }
  zone.playlist = fixZonePlaylist(zone.type, rawZone.playlist);
  return zone;
}

function fixZoneParametersCommon(rawZone : any) : any {

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

function fixZoneSpecificParametersImages(rawZoneSpecificParameters : any) : any {
  return null;
}

function fixZoneSpecificParametersAudioOnly(rawZoneSpecificParameters : any) : any {
  return null;
}

function fixZoneSpecificParametersEnhancedAudio(rawZoneSpecificParameters : any) : any {
  return null;
}

function fixZoneSpecificParametersClock(rawZoneSpecificParameters : any) : any {
  return null;
}

function fixZoneSpecificParametersBackgroundImage(rawZoneSpecificParameters : any) : any {
  return null;
}

function fixZoneSpecificParametersTicker(rawZoneSpecificParameters : any) : any {

  const zoneSpecificParametersSpec: any[] = [
    { name: 'scrollSpeed', type: 'number'}
  ];

  const zoneSpecificParameters : any = fixJson(zoneSpecificParametersSpec, rawZoneSpecificParameters);

  zoneSpecificParameters.textWidget = fixTextWidget(rawZoneSpecificParameters.textWidget);
  zoneSpecificParameters.widget = fixWidget(rawZoneSpecificParameters.widget);

  return zoneSpecificParameters;
}

function fixTextWidget(rawTextWidgetParams : any) : any {

  const textWidgetParametersSpec: any[] = [
    { name: 'numberOfLines', type: 'number'},
    { name: 'delay', type: 'number'},
    { name: 'rotation', type: 'number'},
    { name: 'alignment', type: 'string'},
    { name: 'scrollingMethod', type: 'number'},
  ];

  return fixJson(textWidgetParametersSpec, rawTextWidgetParams);
}

function fixWidget(rawWidgetParams : any) : any {

  const widgetParametersSpec: any[] = [
    { name: 'font', type: 'string'},
    { name: 'fontSize', type: 'number'},
  ];

  const widgetParams : any = fixJson(widgetParametersSpec, rawWidgetParams);
  const backgroundBitmap: any = fixRawBackgroundBitmap(rawWidgetParams.backgroundBitmap.$);

  widgetParams.foregroundTextColor = fixBackgroundScreenColor(rawWidgetParams.foregroundTextColor);
  widgetParams.backgroundTextColor = fixBackgroundScreenColor(rawWidgetParams.backgroundTextColor);
  widgetParams.backgroundBitmap = backgroundBitmap.file;
  widgetParams.stretchBitmapFile = backgroundBitmap.stretch;
  widgetParams.safeTextRegion = null;

  return widgetParams;
}

function getAudioZoneSpecificParametersSpec() : any {
  const audioZoneSpecificParametersSpec: any[] = [
    { name: 'analogOutput', type: 'string'},
    {name: 'analog2Output', type: 'string'},
    {name: 'analog3Output', type: 'string'},
    {name: 'audioMapping', type: 'string'},
    {name: 'audioMixMode', type: 'string'},
    {name: 'audioMode', type: 'string'},
    {name: 'audioOutput', type: 'string'},
    {name: 'audioVolume', type: 'number'},
    { name: 'hdmiOutput', type: 'string'},
    { name: 'spdifOutput', type: 'string'},
    { name: 'usbOutput', type: 'string'},
    { name: 'usbOutputA', type: 'string'},
    { name: 'usbOutputB', type: 'string'},
    { name: 'usbOutputC', type: 'string'},
    { name: 'usbOutputD', type: 'string'},
  ];

  return audioZoneSpecificParametersSpec;
}

function getVideoZoneSpecificParametersSpec() : any {

  // const audioZoneSpecificParametersSpec = Object.assign({}, getAudioZoneSpecificParametersSpec());
  const audioZoneSpecificParametersSpec = getAudioZoneSpecificParametersSpec();

  let videoZoneSpecificParametersSpec: any[] = [
    { name: 'brightness', type: 'number'},
    { name: 'contrast', type: 'number'},
    { name: 'hue', type: 'number'},
    { name: 'liveVideoInput', type: 'string'},
    { name: 'liveVideoStandard', type: 'string'},
    { name: 'maxContentResolution', type: 'string'},
    { name: 'maximumVolume', type: 'number'},
    { name: 'minimumVolume', type: 'number'},
    { name: 'mosaic', type: 'boolean'},
    { name: 'mosaicDecoderName', type: 'string'},
    { name: 'saturation', type: 'number'},
    { name: 'videoVolume', type: 'number'},
    { name: 'viewMode', type: 'string'},
    { name: 'zOrderFront', type: 'boolean'},
  ];

  // TODO - Array.concat?
  // videoZoneSpecificParametersSpec = Object.assign(videoZoneSpecificParametersSpec, audioZoneSpecificParametersSpec);
  videoZoneSpecificParametersSpec = videoZoneSpecificParametersSpec.concat(audioZoneSpecificParametersSpec);

  return videoZoneSpecificParametersSpec;
}

function getImageZoneSpecificParametersSpec() : any {
  const imageZoneSpecificParametersSpec: any[] = [
    { name: 'imageMode', type: 'string'},
  ];

  return imageZoneSpecificParametersSpec;
}

function getVideoOrImageZoneSpecificParametersSpec(): any[] {

  const imageZoneSpecificParametersSpec: any = getImageZoneSpecificParametersSpec();
  const videoZoneSpecificParametersSpec: any = getVideoZoneSpecificParametersSpec();
  // const videoOrImageZoneSpecificParametersSpec: any[] = Object.assign({}, imageZoneSpecificParametersSpec,
  //   videoZoneSpecificParametersSpec);
  const videoOrImageZoneSpecificParametersSpec : any[] =
    imageZoneSpecificParametersSpec.concat(videoZoneSpecificParametersSpec);
  return videoOrImageZoneSpecificParametersSpec;
}

function fixZoneSpecificParametersVideoOnly(rawZoneSpecificParameters : any) : any {
  const zoneSpecificParametersSpec: any[] = getVideoZoneSpecificParametersSpec();
  return fixJson(zoneSpecificParametersSpec, rawZoneSpecificParameters);
}

function fixZoneSpecificParametersVideoOrImages(rawZoneSpecificParameters : any) : any {
  const zoneSpecificParametersSpec: any[] = getVideoOrImageZoneSpecificParametersSpec();
  return fixJson(zoneSpecificParametersSpec, rawZoneSpecificParameters);
}

function fixZonePlaylist(zoneType : string, rawZonePlaylist : any) : any {

  const playlistParametersSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'type', type: 'string'},
  ];

  const zonePlaylist : any = fixJson(playlistParametersSpec, rawZonePlaylist);

  switch (zoneType) {
    case 'VideoOrImages': {
      zonePlaylist.states = fixVideoOrImagesZonePlaylist(rawZonePlaylist);
      break;
    }
    case 'VideoOnly': {
      zonePlaylist.states = fixVideoOnlyZonePlaylist(rawZonePlaylist);
      break;
    }
    case 'Images': {
      zonePlaylist.states = fixImagesZonePlaylist(rawZonePlaylist);
      break;
    }
    case 'AudioOnly': {
      zonePlaylist.states = fixAudioOnlyZonePlaylist(rawZonePlaylist);
      break;
    }
    case 'EnhancedAudio': {
      zonePlaylist.states = fixEnhancedAudioZonePlaylist(rawZonePlaylist);
      break;
    }
    case 'Clock': {
      zonePlaylist.states = fixClockZonePlaylist(rawZonePlaylist);
      break;
    }
    case 'BackgroundImage': {
      zonePlaylist.states = fixBackgroundImageZonePlaylist(rawZonePlaylist);
      break;
    }
    case 'Ticker': {
      zonePlaylist.states = fixTickerZonePlaylist(rawZonePlaylist);
      break;
    }
    default: {
      // throw error
      debugger;
    }
  }

  return zonePlaylist;
}

function fixClockZonePlaylist(rawClockZonePlaylist : any) : any {
  return null;
}

function fixBackgroundImageZonePlaylist(rawBackgroundImageZonePlaylist : any) : any {
  return null;
}

function fixTickerZonePlaylist(rawTickerZonePlaylist : any) : any {

  let playlistStates : any[] = [];

  if (rawTickerZonePlaylist && rawTickerZonePlaylist.rssDataFeedPlaylistItem) {
    const rssDataFeedPlaylistItems = getParameterArray(rawTickerZonePlaylist.rssDataFeedPlaylistItem);
    playlistStates = fixTickerZonePlaylistStates(rssDataFeedPlaylistItems);
  }

  return playlistStates;
}

function fixTickerZonePlaylistStates(rssDataFeedPlaylistItems: any[]) : any {

  const rssDataFeedItems : any[] = [];

  rssDataFeedPlaylistItems.forEach( (rssDataFeedPlaylistItem : any) => {
    const item : any = {};
    item.type = 'rssDataFeedPlaylistItem';
    item.liveDataFeedName = rssDataFeedPlaylistItem.liveDataFeedName;
    item.isRSSFeed = true;
    item.isUserVariable = false;

    rssDataFeedItems.push(item);
  });

  return rssDataFeedItems;
}

function fixVideoOrImagesZonePlaylist(rawZonePlaylist : any) : any {
  if (rawZonePlaylist.type === 'non-interactive') {
    return fixZonePlaylistStates(rawZonePlaylist.$$);
  }
  else {
    throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
      'fixVideoOrImagesZonePlaylist: interactive playlist not supported');
  }
}

function fixVideoOnlyZonePlaylist(rawVideoOnlyZonePlaylist : any) : any {
  if (rawVideoOnlyZonePlaylist.type === 'non-interactive') {
    return fixZonePlaylistStates(rawVideoOnlyZonePlaylist.$$);
  }
  else {
    throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
      'fixVideoOnlyZonePlaylist: interactive playlist not supported');
  }
}

function fixImagesZonePlaylist(rawImagesZonePlaylist : any) : any {
  if (rawImagesZonePlaylist.type === 'non-interactive') {
    return fixZonePlaylistStates(rawImagesZonePlaylist.$$);
  }
  else {
    throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
      'fixImagesZonePlaylist: interactive playlist not supported');
  }
}

function fixAudioOnlyZonePlaylist(rawAudioOnlyZonePlaylist : any) : any {
  if (rawAudioOnlyZonePlaylist.type === 'non-interactive') {
    return fixZonePlaylistStates(rawAudioOnlyZonePlaylist.$$);
  }
  else {
    throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
      'fixAudioOnlyZonePlaylist: interactive playlist not supported');
  }
}

function fixEnhancedAudioZonePlaylist(rawEnhancedAudioZonePlaylist : any) : any {
  if (rawEnhancedAudioZonePlaylist.type === 'non-interactive') {
    return fixZonePlaylistStates(rawEnhancedAudioZonePlaylist.$$);
  }
  else {
    throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
      'fixEnhancedAudioZonePlaylist: interactive playlist not supported');
  }
}

function fixZonePlaylistStates(rawPlaylistItems: any) : any {

  const playlistStates : any[] = [];

  rawPlaylistItems.forEach( (rawPlaylistItem : any) => {
    switch (rawPlaylistItem['#name']) {
      case 'imageItem': {
        playlistStates.push(fixImageItem(rawPlaylistItem));
        break;
      }
      case 'videoItem': {
        playlistStates.push(fixVideoItem(rawPlaylistItem));
        break;
      }
      case 'html5Item': {
        const html5Item = fixHtml5Item(rawPlaylistItem);
        // html5Item.id = id;
        playlistStates.push(html5Item);
        break;
      }
      // case 'html5Item': {
      //   playlistStates.push(fixHtml5Item(rawPlaylistItem));
      //   break;
      // }
      case 'liveVideoItem': {
        playlistStates.push(fixLiveVideoItem(rawPlaylistItem));
        break;
      }
      case 'videoStreamItem': {
        playlistStates.push(fixVideoStreamItem(rawPlaylistItem));
        break;
      }
      case 'mrssDataFeedPlaylistItem': {
        playlistStates.push(fixMrssDataFeedItem(rawPlaylistItem));
        break;
      }
      case 'htmlWidgetItem': {
        playlistStates.push(fixHtmlWidgetItem(rawPlaylistItem));
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

  const imageItem : any = fixJson(imageItemParametersSpec, rawImageItem);
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

  const videoItem : any = fixJson(videoItemParametersSpec, rawVideoItem);
  videoItem.file = fixRawFileItem(rawVideoItem.file.$);
  videoItem.type = 'videoItem';

  return videoItem;
}

function fixLiveVideoItem(rawLiveVideoItem: any) : any {

  const liveVideoParametersSpec: any[] = [

    { name: 'volume', type: 'number'},
    { name: 'timeOnScreen', type: 'number'},
    { name: 'overscan', type: 'boolean'}
  ];

  const liveVideoItem: any = fixJson(liveVideoParametersSpec, rawLiveVideoItem);
  liveVideoItem.type = 'liveVideoItem';

  return liveVideoItem;
}

function fixVideoStreamItem(rawVideoStreamItem: any) : any {

  // TODO
  const name: string = rawVideoStreamItem.streamSpec.$.name;
  const timeOnScreen: number = Number(rawVideoStreamItem.streamSpec.$.timeOnScreen);

  const url : any = fixParameterValue(rawVideoStreamItem.url.parameterValue);

  const videoStreamItem: any = {
    name,
    timeOnScreen,
    url
  };
  videoStreamItem.type = 'videoStreamItem';

  return videoStreamItem;
}

function fixMrssDataFeedItem(rawMrssDataFeedItem : any) : any {

  const mrssDataFeedItemParametersSpec: any[] = [
    { name: 'stateName', type: 'string'},
    { name: 'liveDataFeedName', type: 'string'},
    { name: 'usesBSNDynamicPlaylist', type: 'boolean'},
    { name: 'videoPlayerRequired', type: 'boolean'},
  ];

  const mrssDataFeedItem: any = fixJson(mrssDataFeedItemParametersSpec, rawMrssDataFeedItem);
  mrssDataFeedItem.type = 'mrssDataFeedItem';

  return mrssDataFeedItem;
}

function fixHtml5Item(rawHtml5Item : any) : any {

  const html5ItemSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'htmlSiteName', type: 'string'},
    { name: 'enableExternalData', type: 'boolean'},
    { name: 'enableMouseEvents', type: 'boolean'},
    { name: 'displayCursor', type: 'boolean'},
    { name: 'hwzOn', type: 'boolean'},
    { name: 'useUserStylesheet', type: 'boolean'},
    { name: 'timeOnScreen', type: 'number'},
  ];

  const html5Item: any = fixJson(html5ItemSpec, rawHtml5Item);
  html5Item.type = 'html5Item';
  html5Item.userStyleSheet = ''; // TODO

  return html5Item;
}

function fixHtmlWidgetItem(rawHtmlWidgetItem : any) : any {

  const htmlWidgetItemSpec : any[] = [
    { name: 'name', type: 'string' },
    { name: 'componentPath', type: 'string' },
  ];

  const htmlWidgetItem : any = fixJson(htmlWidgetItemSpec, rawHtmlWidgetItem);

  const htmlWidgetItemProperties : any[] = [];
  // TODO do array thing here
  rawHtmlWidgetItem.properties.property.forEach( (property : any) => {
    const htmlWidgetItemProperty : any = fixHtmlWidgetItemProperty(property);
    if (htmlWidgetItemProperty) {
      htmlWidgetItemProperties.push(htmlWidgetItemProperty);
    }
  });

  htmlWidgetItem.properties = htmlWidgetItemProperties;
  htmlWidgetItem.reactComponent = htmlWidgetItem.componentPath;
  htmlWidgetItem.type = 'htmlWidgetItem';
  return htmlWidgetItem;
}

function fixHtmlWidgetItemProperty(rawHtmlWidgetItemProperty : any) : any {

  let htmlWidgetItemProperty : any = null;

  if (rawHtmlWidgetItemProperty.value && typeof rawHtmlWidgetItemProperty.value === 'string' &&
    rawHtmlWidgetItemProperty.value.length > 0) {
    const htmlWidgetItemSpecProperty : any[] = [
      { name: 'name', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'value', type: 'string' },
    ];

    htmlWidgetItemProperty = fixJson(htmlWidgetItemSpecProperty, rawHtmlWidgetItemProperty);
  }

  return htmlWidgetItemProperty;
}

function fixRawFileItem(rawFileItem : any) : any {
  const imageItemParametersSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'path', type: 'string'},
  ];

  return fixJson(imageItemParametersSpec, rawFileItem);
}

function fixRawBackgroundBitmap(rawBackgroundBitmap: any): any {
  const backgroundBitmapParametersSpec: any[] = [
    { name: 'file', type: 'string'},
    { name: 'stretch', type: 'boolean'},
  ];

  return fixJson(backgroundBitmapParametersSpec, rawBackgroundBitmap);
}

function fixJson(parametersSpec: any[], parameters: any) : any {

  const convertedParameters: any = {};

  parametersSpec.forEach( (parameterSpec : any) => {
    if (parameters.hasOwnProperty(parameterSpec.name)) {
      const parameterValue = parameters[parameterSpec.name];
      switch (parameterSpec.type) {
        case 'string':
          if (typeof parameterValue === 'string') {
            convertedParameters[parameterSpec.name] = parameterValue;
          }
          else {
            // TODO - or should it be null?
            convertedParameters[parameterSpec.name] = '';
          }
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
      const parser = new Parser({
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
        return;
      });
    } catch (parseErr) {
      reject(parseErr);
      return;
    }
  });
}

function fixString(rawValue : any) : string {
  if (typeof rawValue === 'string') {
    return rawValue;
  }
  return '';
}

function getParameterArray(rawParameters: any) : any[] {
  if (Array.isArray(rawParameters)) {
    return rawParameters;
  }
  return [rawParameters];
}
