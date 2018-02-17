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

  initialize(reduxStore: Store<ArState>) {

    var cmdLineArg = process.argv[2];
 
    if (cmdLineArg === undefined)
      console.log("no cmdline argument passed!");
    else
      console.log("cmdline argument passed :: " + cmdLineArg);

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
