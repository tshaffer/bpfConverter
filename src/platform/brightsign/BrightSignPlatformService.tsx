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

}

export default BrightSignPlatformService;
