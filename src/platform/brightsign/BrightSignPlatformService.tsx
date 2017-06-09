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
}

export default BrightSignPlatformService;
