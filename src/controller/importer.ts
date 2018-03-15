import * as fse from 'fs-extra';

// import {
//   bsBpfCConvertPresentation
// } from '@brightsign/bs-bpf-converter';

import {
  bsBpfCConvertPresentation
} from '../bs-bpf-converter/bpfConverter';

export const convertBpf = (path: string) => {
  return (dispatch: any) => {
    debugger;
    readFileAsBuffer(path)
      .then((buf: any) => {
        dispatch(bsBpfCConvertPresentation(buf)).then(() => {
          debugger;
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

