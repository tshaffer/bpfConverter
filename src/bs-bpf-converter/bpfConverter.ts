import isomorphicPath from 'isomorphic-path';
import thunkMiddleware from 'redux-thunk';

import { cloneDeep } from 'lodash';
import { isObject } from 'lodash';
import { isNil } from 'lodash';

import { AssetLocation, AssetType } from '@brightsign/bscore';
import { BsAssetCollection, getBsAssetCollection } from '@brightsign/bs-content-manager';
import {
  dmOpenSign,
  DmState,
} from '@brightsign/bsdatamodel';

import {
  bpfToJson,
  isXml,
} from './bpfToJson';

import { generateDmStateFromBpf } from './bpfToDmStateConverter';

export function bsBpfCConvertPresentation(buffer: Buffer) : Function {

  return (dispatch : Function, getState : Function) : Promise<void> => {

    return new Promise((resolve, reject) => {

      // determine whether data in buffer represents bpf
      isXml(buffer).then( (bufferIsXml : boolean) => {

        if (bufferIsXml) {

          // buffer contains xml. assume it's a BA classic presentation.
          // TODO - further verification / validation required.

          // if bpf xml, convert to json
          bpfToJson(buffer).then( (bpf : any) => {

            // convert bpf json to dmState.
            dispatch(generateDmStateFromBpf(bpf)).then( (bsdm: any) => {
              console.log(bsdm);
              const bpfxState : any = createProjectFileStateFromDmState(bsdm);
              resolve(bpfxState);
            });
          });
        }
      });
    });
  };
}

// TODO - rework once non bsdm properties are added to bpfxState
const createProjectFileStateFromDmState = (bsDmState: any): Object => {

  // const bsDmState: DmState = state.bsdm;
  if (!isObject(bsDmState)){
    // throw 'TODO error'; // TODO implement error;
    debugger;
  }

  const state: any = {};
  state.bsdm = bsDmState;
  let bpfxState = getBpfxState(state);
  if (isNil(bpfxState)) {
    bpfxState = {};
  }
  bpfxState.bsdm = bsDmState;

  return bpfxState;
};

// TODO - placeholder
export const getBpfxState = (state : any) : any => {
  return null;
};

function getLocalContentCollection(path: string): BsAssetCollection {
  return getBsAssetCollection(AssetLocation.Local, [
      AssetType.Content,
      AssetType.Project,
      AssetType.ProjectBpf,
      AssetType.BrightScript,
      AssetType.HtmlSite,
      AssetType.Font,
      AssetType.Folder
    ],
    path, {folders: false});
}

const createProjectFileState = (bsDmState: DmState): Object => {
  if (!isObject(bsDmState)){
    throw 'TODO error'; // TODO implement error;
  }
  return {
    bsdm: bsDmState
  };
};

