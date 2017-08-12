import APlatformService from '../APlatformService';

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
  static getDeviceInfo() : any {

    const deviceInfo = new BSDeviceInfo();

    return {
      deviceUniqueId: deviceInfo.deviceUniqueId,
      deviceFWVersion: deviceInfo.version,
      deviceFWVersionNumber : 0,
      deviceModel: deviceInfo.model,
      deviceFamily: deviceInfo.family
    };
  }

  // Bug 28248 - Document @brightsign/networkconfiguration Javascript object
  static getNetworkConfiguration(networkInterface : string) : any {
    return new Promise( (resolve, reject) => {
      const NetworkInterface = require("@brightsign/networkconfiguration");
      const nc = new NetworkInterface(networkInterface);
      nc.getConfig().then((networkConfig : any) => {
        console.log('received networkConfig');
        resolve(networkConfig);
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

      })
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
