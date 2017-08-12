import APlatformService from '../APlatformService';

import {
  BsDeviceInfo,
  BSNetworkInterfaceConfig,
  BsRegistry,
} from '../../brightSignInterfaces';

class BrightSignPlatformService extends APlatformService {

  static getRootDirectory() {
    return '/storage/sd';
  }

  static getPathToPool() {
    return '/sd:/';
  }

  static isTickerSupported() {
    return true;
  }

  // TODO - FIXME
  getHtmlSiteUrl(site : any) {
    console.log(site);
    return 'pool/test.html';
  }

  // http://docs.brightsign.biz/display/DOC/BSDeviceInfo
  static getDeviceInfo() : BsDeviceInfo {
    return new BSDeviceInfo();
  }

  // Bug 28331 - Document @brightsign/registry Javascript object
  static getRegistry() : BsRegistry {
    const RegistryClass = require("@brightsign/registry");
    return new RegistryClass();
  }

  // Bug 28253 - Document @brightsign/systemtime Javascript object roSystemTime
  static getSystemTime() : any {
    const SystemTimeClass = require("@brightsign/systemtime");
    return new SystemTimeClass();
  }

  // Bug 28248 - Document @brightsign/networkconfiguration Javascript object
  static getNetworkConfiguration(networkInterface : string) : Promise<BSNetworkInterfaceConfig> {
    return new Promise( (resolve, reject) => {
      const NetworkInterface = require("@brightsign/networkconfiguration");
      const nc = new NetworkInterface(networkInterface);
      nc.getConfig().then((networkConfig : BSNetworkInterfaceConfig) => {
        if (networkConfig && networkConfig.domain === 'brightsign') {
          console.log('received networkConfig');
          resolve(networkConfig);
        }
        else {
          reject();
        }
      });
    });
  }

  // Bug 28332 - Document @brightsign/videooutput Javascript object
  static getEdid() : any {
    return new Promise( (resolve, reject) => {
      const VideoOutput = require('@brightsign/videooutput');
      const voc = new VideoOutput('hdmi'); // TODO - vga?
      voc.getEdidIdentity().then( (edidIdentity: any) => {
        console.log(edidIdentity);
        resolve(edidIdentity);

      }).catch( (err : any) => {
        reject(err);
      });
      // voc.getEdid().then((monitorEdid: any) => {
      //   console.log('received edid');
      //   resolve(monitorEdid);
      // });
    });
  }

  // bug 27980 - Javascript store object
  //   du = CreateObject("roStorageInfo", "./")
  //   if du.IsReadOnly() then
  //   sysInfo.storageIsWriteProtected = true
  // else
  //   sysInfo.storageIsWriteProtected = false
  //   endif
  //

}

export default BrightSignPlatformService;
