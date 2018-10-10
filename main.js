console.log("BPF Converter");
const fse = require('fs-extra');
const path = require('isomorphic-path');

function convertBpf(bpfPath) {
  console.log(bpfPath);
  readFileAsBuffer(bpfPath).then( (buf) => {
    console.log('file read complete');
    console.log(buf.length);
    console.log(buf);
  });
  // return (dispatch: any) => {
  //   readFileAsBuffer(bpfPath)
  //     .then((buf: any) => {
  //       dispatch(bsBpfCConvertPresentation(buf)).then((bpfxState: any) => {
  //         console.log(bpfxState);
  //         const bpfFileName = path.basename(bpfPath, '.bpf');
  //         const bpfxFileName = bpfFileName + '.bpfx';
  //         const bpfDirName = path.dirname(bpfPath);
  //         const bpfxFilePath = path.join(bpfDirName, bpfxFileName);
  //         savePresentationFile(bpfxFilePath, bpfxState).then( () => {
  //           console.log('presentation save complete');
  //         });
  //       });
  //     })
  //     .catch((err) => {
  //       debugger;
  //     });
  // };
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
    fse.readFile(filePath, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
};

convertBpf('/Users/tedshaffer/Documents/BrightAuthor/bacToBacon/sit-0-ImagesBpTo.bpf');

