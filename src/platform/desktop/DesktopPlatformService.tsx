class DesktopPlatformService {

  // static srcDirectory = '/Users/tedshaffer/Desktop/aaa_bac';            // bac classic files - for import
  // static srcDirectory = '/Users/tedshaffer/Desktop/baconTestCard';   // bacon files - for non import
  // static srcDirectory = '/Users/tedshaffer/Desktop/baconSlick';   // bacon slick files - for import
  // static srcDirectory = '/Users/tedshaffer/Desktop/baconImportFromBac';   // bacon import from bac
  // static srcDirectory = '/Users/tedshaffer/Desktop/ab';   // importable component for now
  static srcDirectory = '/Users/tedshaffer/Desktop/baconPluginPresentation';   // importable component for now

  static getRootDirectory(): string {
    return DesktopPlatformService.srcDirectory;
    // return '/Users/tedshaffer/Desktop/baconImagesPlusVideos';
    // return '/Users/tedshaffer/Desktop/baconTestCard';
    // return '/Users/tedshaffer/Desktop/autorunTSFilesFromBacon';

    // return '/storage/sd';
  }

  static getTmpDirectory(): string {
    return DesktopPlatformService.srcDirectory;
    // return '/Users/tedshaffer/Desktop/baconImagesPlusVideos';
    // return '/Users/tedshaffer/Desktop/baconTestCard';
    // return '/Users/tedshaffer/Desktop/autorunTSFilesFromBacon';
    // return '/storage/sd';
  }

  static getPathToPool(): string {
    return DesktopPlatformService.srcDirectory;
    // return '/Users/tedshaffer/Desktop/baconImagesPlusVideos';
    // return '/Users/tedshaffer/Desktop/baconTestCard';
    //   return '/Users/tedshaffer/Desktop/autorunTSFilesFromBacon';
    //   return '/sd:/';
  }

  static isTickerSupported(): boolean {
    return false;
    // return true;
  }

  static getDeviceInfo() : any {
    return {
      deviceUniqueId: 'SerialNumber69',
      deviceFWVersion: '7.0.0',
      deviceFWVersionNumber : 77000,
      deviceModel: 'XT1143',
      deviceFamily: 'Impala'
    };
  }

  static getNetworkConfiguration() : any {
  }

  static getEdid() : any {

  }

}

export default DesktopPlatformService;
