import * as fse from 'fs-extra';
import path from 'isomorphic-path';

// import {
//   bsBpfCConvertPresentation
// } from '@brightsign/bs-bpf-converter';

import {
  bsBpfCConvertPresentation
} from '../bs-bpf-converter/bpfConverter';

export const convertBpf = (bpfPath: string) => {
  return (dispatch: any) => {
    readFileAsBuffer(bpfPath)
      .then((buf: any) => {
        dispatch(bsBpfCConvertPresentation(buf)).then((bpfxState: any) => {
          console.log(bpfxState);
          const bpfFileName = path.basename(bpfPath, '.bpf');
          const bpfxFileName = bpfFileName + '.bpfx';
          const bpfDirName = path.dirname(bpfPath);
          const bpfxFilePath = path.join(bpfDirName, bpfxFileName);
          savePresentationFile(bpfxFilePath, bpfxState).then( () => {
            console.log('presentation save complete');
          });
        });
      })
      .catch((err) => {
        debugger;
      });
  };
}

function readFileAsBuffer(filePath = '') {
  return new Promise((resolve) => {
    readFsFileAsBuffer(filePath).then((buf) => {
      resolve(buf);
    });
  });
}

const readFsFileAsBuffer = (filePath = '') => {
  return new Promise((resolve, reject) => {
    fse.readFile(filePath, (err: any, buf: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
};

const savePresentationFile = (filePath : string, presentation : any): Promise<any> =>  {
  return new Promise((resolve, reject) => {
    const bpfStr = JSON.stringify(presentation, null, '\t');
    fse.writeFile(filePath, bpfStr, (err: any) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

/*
// save to disk and publish
const bpfxState = biGetProjectFileState(token);
// const bsdm : any = bpfxState.bsdm;
this.savePresentationFile(bpfxPath, bpfxState).then( () => {
  console.log('presentation save complete');
})

*/

