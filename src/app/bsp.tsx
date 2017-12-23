import fs = require('fs');
import path = require('path');

import {Store} from 'redux';

import { ArState } from '../types';

import {
  biDeleteOpenPresentationSession,
  biCreateOpenPresentationFromBufferSession,
  biFixBrokenLinks,
  biLaunchPresentationOpener,
  biGetPresentationOpenerStatus,
  biGetNumberOfBrokenLinks,
  biGetBrokenLinksExist,
  biGetBrokenLinkFilePath,
  biGetProjectFileState,
  BiPresentationOpenState,
} from '@brightsign/bpfimporter';

import {
  generatePublishData,
  executePublish,
  PresentationToSchedule,
  PublishParams,
  ScheduledPresentationToPublish,
} from '@brightsign/bspublisher';

let _singleton: BSP = null;

export class BSP {

  store: Store<ArState>;
  dispatch: Function;
  getState: Function;
  contentDirectory : string;

  constructor() {
    if (!_singleton) {
      console.log('bsp constructor invoked');
      _singleton = this;
      this.contentDirectory = '/Users/tedshaffer/Desktop/bacInteractive';
    }
  }

  readFileAsBuffer = (filePath = '') => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf);
        }
      });
    });
  };
  
  savePresentationFile(filePath : string, presentation : any) : Promise<any> {
    return new Promise((resolve, reject) => {
      const bpfStr = JSON.stringify(presentation, null, '\t');
      fs.writeFile(filePath, bpfStr, (err) => {
        if(err)
          reject(err);
        else
          resolve();
      });
    });  
  }

  publishPresentation(presentationName: string, presentationPath: string, bsdm : any) {

    const presentationToSchedule = new PresentationToSchedule(
      presentationName, presentationName + '.bpfx', presentationPath, bsdm);

    const scheduledPresentationToPublish : ScheduledPresentationToPublish = new ScheduledPresentationToPublish(
      presentationToSchedule,
      new Date(),
      1440,
      true,
      false,
      'daily',
      'EveryDay',
      127,
      new Date(),
      true,
      new Date(),
      false
    );

    let publishParams = new PublishParams();
    publishParams.scheduledPresentations = [scheduledPresentationToPublish];
    publishParams.fwUpdateType = 'Standard'; // FirmwareUpdateType.Standard;
    publishParams.type = 'standalone';
    publishParams.targetFolder = path.join(this.contentDirectory, 'publish');
    publishParams.fwPublishData = null;
    publishParams.lfnDeviceIPAddresses = [];
    // TODO
    publishParams.syncSpecClientParams = this.generateSyncSpecClientParams();
    publishParams.syncSpecServerParams = this.generateSyncSpecServerParams();
  
    // TODO
    publishParams.syncSpecServerParams = {};
    publishParams.usbUpdatePassword = '';
    publishParams.simpleNetworkingUrl = '';

    generatePublishData(publishParams).then( (publishAllFilesToCopy : any) => {
      executePublish(publishParams, publishAllFilesToCopy)
      .then( () => {
        console.log('publish complete');
      })
      .catch((err) => {
        console.log(err);
      });
    });
  }

  generateSyncSpecClientParams() : any {

    let syncSpecClientParams : any = {};

    syncSpecClientParams.enableSerialDebugging = true;
    syncSpecClientParams.enableSystemLogDebugging = true;
  
    syncSpecClientParams.limitStorageSpace = false;
    syncSpecClientParams.spaceLimitedByAbsoluteSize = false;
    syncSpecClientParams.publishedDataSizeLimitMB = 0;
    syncSpecClientParams.dynamicDataSizeLimitMB = 0;
    syncSpecClientParams.htmlDataSizeLimitMB = 0;
    syncSpecClientParams.htmlLocalStorageSizeLimitMB = 0;
    syncSpecClientParams.htmlIndexedDBSizeLimitMB = 0;
  
    syncSpecClientParams.playbackLoggingEnabled = true;
    syncSpecClientParams.eventLoggingEnabled = true;
    syncSpecClientParams.diagnosticLoggingEnabled = true;
    syncSpecClientParams.stateLoggingEnabled = true;
    syncSpecClientParams.variableLoggingEnabled = true;
  
    syncSpecClientParams.uploadLogFilesAtBoot = false;
    syncSpecClientParams.uploadLogFilesAtSpecificTime = false;
    syncSpecClientParams.uploadLogFilesTime = 0;
  
    return syncSpecClientParams;
  }


  generateSyncSpecServerParams() : any {
    let syncSpecServerParams = {};
    return syncSpecServerParams;
  }


  initialize(reduxStore: Store<ArState>) {

    debugger;

    console.log('bsp initialization');

    this.store = reduxStore;
    this.dispatch = this.store.dispatch;
    this.getState = this.store.getState;

    const bpfPath = path.join(this.contentDirectory, 'test.bpf');
    const bpfxPath = path.join(this.contentDirectory, 'test.bpfx');

    this.readFileAsBuffer(bpfPath)
    .then((buf : Buffer) => {
      const token : string = biCreateOpenPresentationFromBufferSession(buf);
      biLaunchPresentationOpener(token).then(() => {
        let presentationOpenState: BiPresentationOpenState = biGetPresentationOpenerStatus(token);
        if (presentationOpenState === BiPresentationOpenState.Complete) {
          // it would be a surprise if initial import was complete - won't happen unless bpfImporter is changed
          debugger;
        }
        else if (presentationOpenState === BiPresentationOpenState.BrokenLinksPending) {
          biFixBrokenLinks(token, this.contentDirectory).then( (token) => {
            presentationOpenState = biGetPresentationOpenerStatus(token);
            if (presentationOpenState !== BiPresentationOpenState.Complete) {
              debugger; // should resolve links if all assets are in the contentDirectory
              
            }
            else {
              debugger;
              // save to disk and publish
              const bpfxState = biGetProjectFileState(token);
              // const bsdm : any = bpfxState.bsdm;
              this.savePresentationFile(bpfxPath, bpfxState).then( () => {
                console.log('presentation save complete');
                this.publishPresentation('test', bpfxPath, bpfxState.bsdm);
              })
            }
          });
        }          
      }).catch((err : any) => {
        console.log(err);
        debugger;
      });
    }).catch((err) => {
      console.log(err);
      debugger;
    });
  }

  readDir(dirname: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(dirname, function (err, files) {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    })
  }

}

export const bsp = new BSP();
