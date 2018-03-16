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

/*
export const getBpfxState = (state : any, token : string) : any => {
  const store : DictTokenToOpenStatus = getStore(state);
  if (store.hasOwnProperty(token)) {
    return store[token].bpfxState;
  }
  else {
    return null;
  }
};
*/

/*
export function biGetProjectFileState(token: string) : any {
  // TODO - store bsdm by token
  return createProjectFileState(store.getState(), token);
}

const createProjectFileState = (state: any, token: string): Object => {

  const bsDmState: DmState = state.bsdm;
  if (!isObject(bsDmState)){
    throw 'TODO error'; // TODO implement error;
  }

  let bpfxState: any = getBpfxState(state, token);
  if (isNil(bpfxState)) {
    bpfxState = {};
  }
  bpfxState.bsdm = bsDmState;

  return bpfxState;
};
*/

/*
// save to disk and publish
const bpfxState = biGetProjectFileState(token);
// const bsdm : any = bpfxState.bsdm;
this.savePresentationFile(bpfxPath, bpfxState).then( () => {
  console.log('presentation save complete');
})

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
*/

