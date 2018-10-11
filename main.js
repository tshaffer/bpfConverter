console.log("BPF Converter");
const fse = require('fs-extra');
const path = require('isomorphic-path').default;
console.log(path);
const redux = require("redux");

var ReduxThunk = require('redux-thunk').default
const bsdm = require('@brightsign/bsdatamodel');
const bsBpfConverter = require('@brightsign/bs-bpf-converter');

function convertBpf(bpfPath) {
  return function(dispatch)  {
    console.log(bpfPath);
    readFileAsBuffer(bpfPath).then( (buf) => {
      console.log('file read complete');
      console.log(buf.length);
      console.log(buf);
      console.log(bsBpfConverter);
      dispatch(bsBpfConverter.bsBpfCConvertPresentation(buf))
        .then((bpfxState) => {
          console.log(bpfxState);
          const bpfFileName = path.basename(bpfPath, '.bpf');
          const bpfxFileName = bpfFileName + '.bpfx';
          const bpfDirName = path.dirname(bpfPath);
          const bpfxFilePath = path.join(bpfDirName, bpfxFileName);
          savePresentationFile(bpfxFilePath, bpfxState).then( () => {
            console.log('presentation save complete');
          });
        })
        .catch( (err) => {
          debugger;
        })
    });
  }
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

const savePresentationFile = (filePath, presentation) =>  {
  return new Promise((resolve, reject) => {
    const bpfStr = JSON.stringify(presentation, null, '\t');
    fse.writeFile(filePath, bpfStr, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

const rootReducer = redux.combineReducers({
  bsdm : bsdm.bsDmReducer,
});

const store = redux.createStore(rootReducer, redux.applyMiddleware(ReduxThunk));

store.dispatch(convertBpf('/Users/tedshaffer/Documents/BrightAuthor/bacToBacon/sit-0-ImagesBpTo.bpf'));

